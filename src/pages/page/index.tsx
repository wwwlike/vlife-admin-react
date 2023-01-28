import { detail, PageConfDto } from "@src/mvc/PageLayout";
import { useTimeout, useTitle } from "ahooks";
import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

import { WidthProvider, Responsive } from "react-grid-layout";
import Views from "@src/components/layout/Views";
import { useAuth } from "@src/context/auth-context";
import { IconAlertTriangle } from "@douyinfe/semi-icons";
import { Button } from "@douyinfe/semi-ui";
const ResponsiveReactGridLayout = WidthProvider(Responsive);
/**
 * 自定义页面展示
 */
export interface PageProps {
  moduleId?: string;
}

const Page = ({ moduleId }: PageProps) => {
  /**
   * 页面整体配置
   */
  const [pageConf, setPageConf] = useState<PageConfDto>();
  const [dom, setDom] = useState<React.RefObject<HTMLDivElement>>(
    React.createRef<HTMLDivElement>()
  );
  const [refArr, setRefArr] = useState<React.RefObject<HTMLDivElement>[]>([]);

  useEffect(() => {
    if (pageConf && pageConf.content) {
      // 创建一个新的数组来存储ref
      const arr: React.RefObject<HTMLDivElement>[] = [];
      // 动态创建ref
      for (let i = 0; i < pageConf.content.length + 1; i++) {
        arr.push(React.createRef<HTMLDivElement>());
      }
      setRefArr(arr);
    }
  }, [pageConf]);

  // const ref: RefObject<HTMLDivElement> = useRef(null);

  // const refs: any = useRef<RefObject<HTMLDivElement>[]>([]);

  // const getRef = (dom: RefObject<HTMLDivElement>, index: number) => {
  //   refs.current[index] = dom;
  // };
  const { screenSize } = useAuth();
  const local = useLocation();
  const [title, setTitle] = useState<string>();
  const pageUrl = useMemo<string>(() => {
    const length = local.pathname.split("/").length;
    return local.pathname.split("/")[length - 1];
  }, [local]);
  const [time, setTime] = useState(200);
  useEffect(() => {
    detail(moduleId ? moduleId : pageUrl).then((d) => {
      setPageConf(d.data);

      if (
        d.data?.module === undefined ||
        d.data?.module === null ||
        d.data?.module === false
      ) {
        setTitle(d.data?.name);
      }
    });
    setTime(time - 1);
  }, [pageUrl, moduleId]);

  useTitle(title || "vlife");

  const liRefList = useRef<HTMLDivElement[]>([]);
  const getRef = (dom: HTMLDivElement) => {
    liRefList.current.push(dom);
  };
  // useEffect(() => {
  //   alert("1");
  //   init();
  // }, []);
  const init = () => {
    // alert("11");

    let listHtml = liRefList.current;
    if (listHtml && listHtml.length > 0 && listHtml[0].style) {
      listHtml[1].style.top = "0px";
      listHtml[1].style.position = "fixed";
      listHtml[1].style.width = "100%";
    }
    // console.log(listHtml[0].sty);
  };

  useTimeout(() => {
    if (pageConf?.module !== true) {
      pageConf?.content?.forEach((pageComponent, index: number) => {
        const e = document.getElementById(pageComponent.pageKey);
        if (e && e !== null && pageComponent.layoutTop) {
          e.style.position = "fixed"; // document.getElementById("abcd1")?.style.top = "0px";
        }
      });
    }
    // init();
  }, time);
  return (
    <>
      <ResponsiveReactGridLayout
        key={pageConf?.id + (screenSize ? screenSize.sizeKey : "")} //加size 解决组件缩放 无法恢复的问题
        className="layout"
        margin={[0, 0]} //div之间的间距
        rowHeight={2}
        allowOverlap={true}
        isDraggable={false} //不能拖拽
        // allowOverlap={pageConf?.componentOver === true ? true : false}
      >
        {pageConf?.content?.map((pageComponent, index: number) => {
          return (
            <div
              id={pageComponent.pageKey}
              ref={getRef}
              // className="fixed  top-0"
              key={pageComponent.pageKey || "comp" + index}
              style={{
                zIndex: pageComponent.i,
                // backgroundColor: "#F231FF",
                // position: "fixed",
              }}
              data-grid={{
                ...pageComponent,
              }}
            >
              {pageComponent.component ? ( //组件
                <Views pageComponentDto={pageComponent} h={pageComponent.h} />
              ) : (
                //模块  自引用
                <Page moduleId={pageComponent.moduleId} />
              )}
            </div>
          );
        })}
      </ResponsiveReactGridLayout>
    </>
  );
};
export default Page;
