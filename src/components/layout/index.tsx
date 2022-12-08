import React, {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  IconHome,
  IconCalendar,
  IconUserGroup,
  IconSearch,
  IconUserAdd,
  IconSave,
  IconPhone,
  IconAlertCircle,
} from "@douyinfe/semi-icons";
import Draggable from "react-draggable";
import { savePageConfDto, detail, PageConfDto } from "@src/mvc/PageLayout";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import {
  WidthProvider,
  Responsive,
  Layout as LayoutDataType,
} from "react-grid-layout";
import { PageComponentDto } from "@src/mvc/PageComponent";
import ComponentSetting from "@src/pages/design/fieldSetting/ComponentSetting";
import { ViewComponents } from "./ViewComponentsData";
import {
  ComponentInfo,
  PropInfo,
} from "@src/pages/design/fieldSetting/componentData";
import { PageComponentProp } from "@src/mvc/PageComponentProp";
import { ApiInfo } from "@src/pages/design/fieldSetting/apiData";
import PageComponent from "./Views";
import Views from "./Views";
import { Button, Tag } from "@douyinfe/semi-ui";
import VfCard from "../vlifeComponent/views/VfCard";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
/**
 * 引入组件
 */

/**
 * 使用tailwaind进行基础框架布局，主容器使用拖拽组件；
 *
 * 1. 向页面添加容器，可以配置容器大小
 * 2. 为容器指定绑定的组件
 * 3. 保存后将json 存储起来
 */

// /* 视图组件 */
// export const ViewComponents: { [key: string]: Comp } = {
//   Total: {
//     component: Total,
//     title: "汇总组件",
//     icon: IconHome,
//     w: 5,
//     h: 3,
//   },
// };

const Layout = () => {
  // const [models, setModels] = useState<PageComponent[]>([]);

  const [edit, setEdit] = useState<string>();

  /**
   * 页面整体配置
   */
  const [pageConf, setPageConf] = useState<PageConfDto>();

  /**
   * 布局内容
   */
  const [content, setContent] = useState<LayoutDataType[]>();

  /**当前操作的 */
  const curr = useMemo((): any => {
    const currDiv = pageConf?.content.filter((f) => f.pageKey === edit);
    if (currDiv && currDiv.length > 0) {
      const componentName = currDiv[0].component || "";
      return {
        componentInfo: ViewComponents[componentName],
        settings: currDiv[0],
      };
    }
    return undefined;
  }, [edit]);

  /**
   * 数据请求
   */
  useEffect(() => {
    detail("1").then((data) => {
      setPageConf(data.data);
    });
  }, []);

  function classNames(...classes: any) {
    alert(classes.filter(Boolean).join(" "));
    return classes.filter(Boolean).join(" ");
  }

  const saveData = useMemo((): PageConfDto | undefined => {
    if (
      content &&
      pageConf &&
      pageConf.content &&
      content.length === pageConf.content.length
    )
      return {
        ...pageConf,
        content: pageConf?.content?.map((c) => {
          if (content && content.length > 0) {
            const layout = content.filter((cc) => cc.i === c.pageKey)[0];
            return { ...c, x: layout.x, y: layout.y, h: layout.h, w: layout.w };
          } else {
            return c;
          }
        }),
      };
    else {
      return undefined;
    }
  }, [content, pageConf]);

  /**
   * 增加div的顶点位置(通过最后一个div的顶点计算)
   */
  const point = useMemo((): { x: number; y: number } => {
    if (!content || content.length === 0) return { x: 0, y: 0 };
    else {
      const last: LayoutDataType = content[content.length - 1];
      return {
        x: last.x + last.w,
        y: last.y,
      };
    }
  }, [content]);

  // const getProps = (): PageComponentProp[] => {
  //   return [];
  // };

  const addModel = useCallback(
    (name: string, componentInfo: ComponentInfo) => {
      if (pageConf)
        setPageConf({
          ...pageConf,
          content: [
            ...(pageConf.content ? pageConf.content : []),
            {
              pageKey:
                "comp" + (pageConf.content ? pageConf.content.length : 0),
              x:
                point.x +
                  (componentInfo && componentInfo.w ? componentInfo.w : 1) >
                12
                  ? 0
                  : point.x,
              y:
                point.x +
                  (componentInfo && componentInfo.w ? componentInfo.w : 1) >
                12
                  ? point.y + 1
                  : point.y,
              w: componentInfo.w || 2,
              h: componentInfo.h || 2,
              name: componentInfo.label,
              // props: undefined,
              component: name,
            },
          ],
        });
    },
    [pageConf, point]
  );
  /**
   * 删除
   */
  const removeModel = useCallback((key: string) => {
    if (pageConf)
      setPageConf({
        ...pageConf,
        content: pageConf.content.filter((ff) => ff.pageKey !== key),
      });
  }, []);
  /**
   * 布局改变
   * 数量，大小，位置
   */
  const onLayoutChange = useCallback((divLayout: LayoutDataType[]) => {
    setContent(divLayout);
  }, []);

  return (
    <div className="h-full flex">
      {/* Static sidebar for desktop */}
      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
        <div className="flex-1 relative z-0 flex overflow-hidden">
          <aside className="hidden relative xl:flex xl:flex-col flex-shrink-0 w-96 border-r border-gray-200 overflow-y-auto">
            {/* Start secondary column (hidden on smaller screens) */}
            <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-6">
              <div className="h-full border-2  border-blue-900 border-dashed rounded-lg">
                <section className="px-4 sm:px-6 lg:px-4 xl:px-6 pt-4 pb-4 sm:pb-6 lg:pb-4 xl:pb-6 space-y-4">
                  <header className="flex items-center justify-between">
                    <h2 className="text-lg leading-6 font-medium text-black">
                      组件选择
                    </h2>
                    <Button
                      icon={<IconSave />}
                      onClick={() => {
                        if (saveData) savePageConfDto(saveData);
                      }}
                      className="hover:bg-light-blue-200 hover:text-light-blue-800 group flex items-center rounded-md bg-light-blue-100 text-light-blue-600 text-sm font-medium px-4 py-2"
                    >
                      保存
                    </Button>
                  </header>
                </section>

                {/* grid布局，一行2列，间隔2 */}
                <div className="grid grid-cols-2 gap-2 p-2">
                  {Object.keys(ViewComponents).map((key) => (
                    <VfCard
                      data={{ title: ViewComponents[key].label || "" }}
                      onClick={() => {
                        addModel(key, ViewComponents[key]);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* End secondary column */}
          </aside>
          <main className="flex-1 relative  overflow-y-auto focus:outline-none">
            {/* Start main area*/}
            <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-6">
              <div className="h-full border-2 border-blue-900 border-dashed rounded-lg">
                <ResponsiveReactGridLayout
                  onLayoutChange={onLayoutChange} // 布局改变事件
                  className="layout"
                  breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                  cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
                  rowHeight={50}
                >
                  {pageConf?.content?.map((pageComponent, index) => {
                    return (
                      <div
                        onClick={() => {
                          setEdit(pageComponent.pageKey);
                        }}
                        key={pageComponent.pageKey}
                        data-grid={{ ...pageComponent }}
                        className={`${
                          pageComponent.pageKey === edit ? "bg-blue-200" : ""
                        } group border-2 hover:bg-blue-200`}
                      >
                        <button
                          onClick={() => {
                            setPageConf({
                              ...pageConf,
                              content: pageConf.content.filter(
                                (ff) => ff.pageKey !== pageComponent.pageKey
                              ),
                            });
                          }}
                          className=" z-100 btn bg-slate-200 absolute right-0 hidden group-hover:block"
                        >
                          删除
                        </button>
                        <Views pageComponentDto={pageComponent} />
                      </div>
                    );
                  })}
                </ResponsiveReactGridLayout>
                {/* <div>{JSON.stringify(pageConf)}</div> */}
              </div>
            </div>
            {/* End main area */}
          </main>
          <aside className="hidden relative xl:flex xl:flex-col flex-shrink-0 w-96 border-l border-gray-200 overflow-y-auto">
            {/* Start secondary column (hidden on smaller screens) */}
            <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-6">
              <div className="h-full border-2  border-blue-900 border-dashed rounded-lg">
                {curr ? (
                  <ComponentSetting
                    {...curr}
                    onDataChange={(d) => {
                      setPageConf({
                        ...pageConf,
                        content: pageConf?.content.map((dd) =>
                          dd.pageKey === d.pageKey ? d : dd
                        ),
                      });
                    }}
                  ></ComponentSetting>
                ) : (
                  ""
                )}
              </div>
            </div>
            {/* End secondary column */}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Layout;
