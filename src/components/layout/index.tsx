import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IconSave } from "@douyinfe/semi-icons";
import { savePageConfDto, detail, PageConfDto } from "@src/mvc/PageLayout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
  WidthProvider,
  Responsive,
  Layout as LayoutDataType,
} from "react-grid-layout";
import ComponentSetting from "@src/pages/design/fieldSetting/ComponentSetting";
import { ViewComponents } from "./ViewComponentsData";
import { ComponentInfo } from "@src/pages/design/fieldSetting/componentData";
import Views from "./Views";
import { Button } from "@douyinfe/semi-ui";
import VfCard from "../vlifeComponent/views/VfCard";
import Draggable from "react-draggable";
import { PageComponentPropDto } from "@src/mvc/PageComponentProp";

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
const Layout = () => {
  // const [models, setModels] = useState<PageComponent[]>([]);

  const [edit, setEdit] = useState<string>();
  /**
   * 页面整体配置
   */
  const [pageConf, setPageConf] = useState<Partial<PageConfDto>>();

  /**
   * 布局内容
   */
  const [content, setContent] = useState<LayoutDataType[]>();

  /**当前操作的 */
  const curr = useMemo(():
    | {
        componentInfo: ComponentInfo;
        pageComponentPropDtos: Partial<PageComponentPropDto>[];
        pageKey: string;
      }
    | undefined => {
    const currDiv = pageConf?.content?.filter((f) => f.pageKey === edit);
    if (currDiv && currDiv.length > 0) {
      const componentName = currDiv[0].component || "";
      return {
        componentInfo: ViewComponents[componentName], // 组件定义信息
        pageComponentPropDtos: currDiv[0].props || [], //数据库设置信息
        pageKey: currDiv[0].pageKey || "",
      };
    }
    return undefined;
  }, [edit, pageConf?.content]);

  /**
   * 数据请求
   */
  useEffect(() => {
    detail("1").then((data) => {
      setPageConf(data.data);
    });
  }, []);

  const saveData = useMemo((): Partial<PageConfDto> | undefined => {
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
    if (!content || content.length === 0) {
      return { x: 0, y: 0 };
    } else {
      const last: LayoutDataType = content[content.length - 1];
      return {
        x: last.x + last.w,
        y: last.y,
      };
    }
  }, [content]);

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
              name: componentInfo.label || "",
              component: name,
            },
          ],
        });
    },
    [pageConf, point.x, point.y]
  );
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
        <div className="flex-1 relative z-50 flex overflow-hidden">
          <aside className="hidden relative xl:flex xl:flex-col flex-shrink-0 w-96 border-r border-gray-200 overflow-y-auto">
            {/* Start secondary column (hidden on smaller screens) */}
            <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-6">
              <div className="h-full border-2  border-blue-900 border-dashed rounded-lg">
                <section className="px-4 sm:px-6 lg:px-4 xl:px-6 pt-4 pb-4 sm:pb-6 lg:pb-4 xl:pb-6 space-y-4 z-40">
                  <header className="flex items-center justify-between">
                    <h2 className="text-lg leading-6 font-medium text-black">
                      组件选择
                    </h2>

                    {/* {JSON.stringify(
                      pageConf?.content[pageConf.content.length - 1]
                    )} */}
                    <Button
                      icon={<IconSave />}
                      onClick={() => {
                        if (saveData)
                          savePageConfDto(saveData).then((d) => {
                            setPageConf(d.data);
                          });
                      }}
                      className="hover:bg-light-blue-200 hover:text-light-blue-800 group flex items-center rounded-md bg-light-blue-100 text-light-blue-600 text-sm font-medium px-4 py-2"
                    >
                      保存
                    </Button>
                  </header>
                </section>

                {/* grid布局，一行2列，间隔2 */}
                <div className="grid grid-cols-2 gap-2 p-2 z-40">
                  {Object.keys(ViewComponents).map((key) => (
                    <Draggable key={"Draggable" + key}>
                      <VfCard
                        key={key}
                        data={{
                          title: ViewComponents[key].label || "",
                          icon: ViewComponents[key].icon,
                        }}
                        onClick={() => {
                          addModel(key, ViewComponents[key]);
                        }}
                      />
                    </Draggable>
                  ))}
                </div>
              </div>
            </div>
            {/* End secondary column */}
          </aside>
          <main className="flex-1 relative z-40  overflow-y-auto focus:outline-none">
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
                              content: pageConf?.content?.filter(
                                (ff) => ff.pageKey !== pageComponent.pageKey
                              ),
                            });
                          }}
                          className=" z-30 btn bg-slate-200 absolute right-0 hidden group-hover:block"
                        >
                          删除
                        </button>
                        <Views
                          className=" z-10"
                          pageComponentDto={pageComponent}
                        />
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
                {/* <Draggable>
                  <div>111111111111</div>
                </Draggable> */}
                {/* <div>{JSON.stringify(curr?.pageComponentDto)}</div> */}
                {curr ? (
                  <ComponentSetting
                    componentInfo={curr.componentInfo}
                    pageKey={curr.pageKey}
                    pageComponentPropDtos={curr.pageComponentPropDtos}
                    onDataChange={(
                      pageComponentPropDtos: Partial<PageComponentPropDto>[]
                    ) => {
                      //替换指定组件里的指定属性设置值
                      setPageConf({
                        ...pageConf,
                        content: pageConf?.content?.map((pageComponentDto) =>
                          pageComponentDto.pageKey === curr.pageKey
                            ? {
                                ...pageComponentDto,
                                props: pageComponentPropDtos,
                              }
                            : { ...pageComponentDto }
                        ),
                      });
                    }}
                  />
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
