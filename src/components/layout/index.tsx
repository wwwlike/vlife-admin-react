import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IconSave, IconReply, IconDelete } from "@douyinfe/semi-icons";
import {
  savePageConfDto,
  detail,
  PageConfDto,
  listAll,
  PageLayout,
  remove,
} from "@src/mvc/PageLayout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import RGL, {
  WidthProvider,
  Responsive,
  Layout as LayoutDataType,
} from "react-grid-layout";
import ComponentSetting from "@src/pages/design/fieldSetting/ComponentSetting";
import Views from "./Views";
import {
  Button,
  Input,
  Radio,
  RadioGroup,
  SideSheet,
  TabPane,
  Tabs,
  Popconfirm,
  Collapse,
  Switch,
} from "@douyinfe/semi-ui";
import VfCard from "../vlifeComponent/views/VfCard";
import Draggable from "react-draggable";
import { PageComponentPropDto } from "@src/mvc/PageComponentProp";
import { ComponentInfo } from "@src/pages/design/data/componentData";
import { ViewComponents } from "../components_view";
import { useLocation, useNavigate } from "react-router-dom";
import Page from "@src/pages/page";
import VfImage from "../vlifeComponent/VfImage";
import { useSize } from "ahooks";
import { PageComponentDto } from "@src/mvc/PageComponent";
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
  const local = useLocation();
  const navigate = useNavigate();
  const ref = useRef(null);
  const size = useSize(ref);
  /**
   * 当前配置的组件
   */
  const [edit, setEdit] = useState<string>();
  /**
   * 模块类型
   */
  const [modules, setModules] = useState<PageLayout[]>();
  /**
   * 页面整体配置
   */
  const [pageConf, setPageConf] = useState<Partial<PageConfDto>>({});
  /**
   * 布局内容
   */
  const [content, setContent] = useState<LayoutDataType[]>();

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
        y: last.y + last.h,
      };
    }
  }, [content]);

  const saveData = useMemo((): Partial<PageConfDto> | undefined => {
    if (
      // content &&
      pageConf
      // pageConf.content
      // content.length === pageConf.content.length
    ) {
      return {
        ...pageConf,
        h: point.y,
        content: pageConf?.content?.map((c) => {
          if (
            content &&
            // content.length > 0 &&
            content.length == pageConf.content?.length
          ) {
            //布局内容转换成数据库存储内容
            // alert(JSON.stringify(content.map((m) => m.i)));
            const layout = content.filter((cc) => cc.i === c.pageKey)[0];
            return {
              ...c,
              x: layout.x,
              y: layout.y,
              h: layout.h,
              w: layout.w,
              //不在顶点，当前不是页面，则不能是置顶组件
              layoutTop:
                layout.y === 0 &&
                pageConf?.module !== true &&
                c.layoutTop === true
                  ? true
                  : false,
            };
          } else {
            return c;
          }
        }),
      };
    } else {
      return undefined;
    }
  }, [content, pageConf, point]);

  /**当前操作的页面的一个组件 */
  const curr = useMemo((): //附加模型信息
  | (Partial<PageComponentDto> & { componentInfo: ComponentInfo })

    // | {
    //     componentInfo: ComponentInfo;
    //     pageComponentPropDtos: Partial<PageComponentPropDto>[];
    //     pageKey: string;
    //     name: string;
    //     i: number;
    //     y:number;
    //     module: boolean; //是模块
    //   }
    | undefined => {
    const comps = saveData?.content?.filter((f) => f.pageKey === edit);
    if (comps && comps.length > 0) {
      const currComp = comps[0];
      const componentName = currComp.component || "";
      return {
        ...currComp,
        componentInfo: ViewComponents[componentName],
        name: componentName,
        // i: currDiv[0].i || 0,
        // componentInfo: ViewComponents[componentName], // 组件定义信息
        // props: currDiv[0].props || [], //数据库设置信息
        // pageKey: currDiv[0].pageKey || "",
        // module:
        //   currDiv[0].moduleId === null || currDiv[0].moduleId === undefined
        //     ? false
        //     : true,
        // };};
      };
    }
    return undefined;
  }, [edit, JSON.stringify(saveData?.content)]);

  /**
   * 数据请求
   */
  useEffect(() => {
    const length = local.pathname.split("/").length;
    const url = local.pathname.split("/")[length - 1];
    detail(url).then((data) => {
      if (data.data) setPageConf(data.data);
    });
    listAll().then((d) => {
      setModules(
        d.data?.filter((dd) => dd.module === true && dd.id !== pageConf?.id)
      );
    });
  }, [pageConf?.id]);

  const LayoutComponentSetting = useMemo((): any => {
    if (curr) {
      return (
        <div>
          <div className="flex space-x-2 mb-2 p-2">
            <div className=" w-24">组件编码</div>
            <div>
              <Input
                name="name"
                value={curr.name}
                onChange={(v) => {
                  setPageConf({
                    ...saveData,
                    content: saveData?.content?.map((pageComponentDto) =>
                      pageComponentDto.pageKey === curr.pageKey
                        ? {
                            ...pageComponentDto,
                            name: v,
                          }
                        : { ...pageComponentDto }
                    ),
                  });
                }}
              />
            </div>
          </div>
          {saveData?.module != true && curr.y === 0 ? (
            <div className="flex space-x-2 mb-2 p-2">
              <div className=" w-24">组件置顶</div>
              <div>
                <Switch
                  checked={curr.layoutTop}
                  onChange={(v, e) => {
                    setPageConf({
                      ...saveData,
                      content: saveData?.content?.map((pageComponentDto) =>
                        pageComponentDto.pageKey === curr.pageKey
                          ? {
                              ...pageComponentDto,
                              layoutTop: v,
                            }
                          : { ...pageComponentDto }
                      ),
                    });
                  }}
                ></Switch>
              </div>
            </div>
          ) : (
            <></>
          )}
          {saveData?.componentOver === true ? (
            <div className="flex space-x-2 mb-2 p-2">
              <div className=" w-24">z-index({curr.i})</div>
              <div className=" space-x-2">
                <Button
                  disabled={curr.i === 10}
                  onClick={() => {
                    setPageConf({
                      ...saveData,
                      content: saveData?.content?.map((pageComponentDto) =>
                        pageComponentDto.pageKey === curr.pageKey
                          ? {
                              ...pageComponentDto,
                              i:
                                pageComponentDto.i === undefined
                                  ? 0
                                  : pageComponentDto.i + 1,
                            }
                          : { ...pageComponentDto }
                      ),
                    });
                  }}
                >
                  向外
                </Button>
                <Button
                  disabled={curr.i === 0}
                  onClick={() => {
                    setPageConf({
                      ...saveData,
                      content: saveData?.content?.map((pageComponentDto) =>
                        pageComponentDto.pageKey === curr.pageKey
                          ? {
                              ...pageComponentDto,
                              i:
                                pageComponentDto.i === undefined ||
                                pageComponentDto.i - 1 < 0
                                  ? 0
                                  : pageComponentDto.i - 1,
                            }
                          : { ...pageComponentDto }
                      ),
                    });
                  }}
                >
                  向内
                </Button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      );
    }
    return <></>;
  }, [curr, saveData]);

  const addComponent = useCallback(
    (name: string, componentInfo: ComponentInfo) => {
      if (saveData)
        setPageConf({
          ...saveData,
          content: [
            ...(saveData.content ? saveData.content : []),
            {
              pageKey:
                "comp" + (saveData.content ? saveData.content.length : 0),
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
    [saveData, point.x, point.y]
  );

  const addModule = useCallback(
    (pageId: string) => {
      detail(pageId).then((d) => {
        if (saveData)
          setPageConf({
            ...saveData,
            content: [
              ...(saveData.content ? saveData.content : []),
              {
                pageKey:
                  "comp" + (saveData.content ? saveData.content.length : 0),
                x: point.x,
                y: point.y,
                w: 12,
                h: d.data?.h || 0,
                name: d.data?.name || "",
                moduleId: pageId,
              },
            ],
          });
      });
    },
    [saveData, point.x, point.y]
  );

  /**
   * 布局改变
   * 数量，大小，位置
   */
  const onLayoutChange = useCallback(
    (divLayout: LayoutDataType[]) => {
      setContent(divLayout);
    },
    [saveData]
  );

  return (
    <div className="h-full flex">
      {/* Static sidebar for desktop */}
      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
        <div className="flex-1 relative z-50 flex overflow-hidden">
          <aside className="hidden relative xl:flex xl:flex-col flex-shrink-0 w-80 border-r border-gray-200 overflow-y-auto">
            {/* Start secondary column (hidden on smaller screens) */}
            <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-3">
              <div className="h-full border-2  border-blue-900 border-dashed rounded-lg">
                <section className="px-2 pt-4  space-y-2 z-40">
                  <header className="flex items-center justify-end space-x-2">
                    {/* <h2 className="text-lg leading-6 font-medium text-black">
                      组件选择
                    </h2> */}
                    <Button
                      icon={<IconSave />}
                      onClick={() => {
                        if (saveData) {
                          // alert(
                          //   JSON.stringify(
                          //     saveData.content?.map((d) => d.layoutTop)
                          //   )
                          // );
                          savePageConfDto(saveData).then((d) => {
                            if (d.data) setPageConf(d.data);
                            if (local.pathname.endsWith("new")) {
                              navigate(`/conf/layout/${d.data?.id}`, {
                                replace: true,
                              });
                            }
                          });
                        } else {
                          alert("请检查是否填写完配置信息并完成页面组件的设置");
                        }
                      }}
                      className="hover:bg-light-blue-200 hover:text-light-blue-800 group flex items-center rounded-md bg-light-blue-100 text-light-blue-600 text-sm font-medium px-4 py-2"
                    >
                      保存
                      {/* {JSON.stringify(pageConf)} */}
                      {/* {JSON.stringify(saveData)} */}
                    </Button>

                    {saveData?.id ? (
                      <Popconfirm
                        title="确定是否要删除？"
                        content="此操作将不可逆"
                        onConfirm={() => {
                          if (saveData.id)
                            remove(saveData.id).then((d) => {
                              navigate(`/conf/layout`, { replace: true });
                            });
                        }}
                        onCancel={() => {}}
                      >
                        <Button
                          icon={<IconDelete />}
                          onClick={() => {}}
                          className="hover:bg-light-blue-200 hover:text-light-blue-800 group flex items-center rounded-md bg-light-blue-100 text-light-blue-600 text-sm font-medium px-4 py-2"
                        >
                          删除
                        </Button>
                      </Popconfirm>
                    ) : (
                      ""
                    )}
                    <Button
                      icon={<IconReply />}
                      className="hover:bg-light-blue-200 hover:text-light-blue-800 group flex items-center rounded-md bg-light-blue-100 text-light-blue-600 text-sm font-medium px-4 py-2"
                      onClick={() => {
                        navigate(`/conf/layout`, { replace: true });
                      }}
                    >
                      返回
                    </Button>
                  </header>
                </section>

                <Tabs defaultActiveKey={"0"} className=" pl-5">
                  <TabPane tab={"配置信息"} itemKey={"0"}>
                    <div className="space-y-2">
                      <div>
                        <h2 className="text-sm  leading-6 font-semibold	 text-black">
                          组件覆盖
                          {/* {JSON.stringify(saveData)} */}
                        </h2>
                        <RadioGroup
                          onChange={(d) => {
                            setPageConf({
                              ...saveData,
                              componentOver:
                                d.target.value === 1 ? true : false,
                            });
                          }}
                          value={saveData?.componentOver ? 1 : 0}
                          name="pageOver"
                          aria-label="组件覆盖"
                        >
                          <Radio value={1}>可以</Radio>
                          <Radio value={0}>不能</Radio>
                        </RadioGroup>
                      </div>
                      <div>
                        <h2 className="text-sm  leading-6 font-semibold	 text-black">
                          使用分类
                        </h2>
                        <RadioGroup
                          onChange={(d) => {
                            setPageConf({
                              ...saveData,
                              url:
                                d.target.value === 1
                                  ? undefined
                                  : saveData?.url,
                              module: d.target.value === 1 ? true : false,
                            });
                          }}
                          value={saveData?.module ? 1 : 0}
                          name="pagetype"
                          aria-label="使用分类"
                        >
                          <Radio value={0}>页面</Radio>
                          <Radio value={1}>模块</Radio>
                        </RadioGroup>
                      </div>
                      <div>
                        <h2 className="text-sm leading-6 font-semibold	 text-black">
                          {saveData?.module === true ? "模块" : "页面"}名称
                        </h2>
                        <Input
                          value={saveData?.name}
                          style={{ width: "90%" }}
                          onChange={(d) => {
                            setPageConf({ ...saveData, name: d });
                          }}
                        />
                      </div>
                      <div>
                        <h2 className="text-sm leading-6 font-semibold	 text-black">
                          {saveData?.module === true ? "模块" : "页面"}图标
                        </h2>
                        <VfImage
                          value={saveData?.img}
                          onDataChange={(d) => {
                            setPageConf({
                              ...saveData,
                              img: d
                                ? typeof d === "string"
                                  ? d
                                  : (d as Array<string>)[0]
                                : undefined,
                            });
                          }}
                        />
                      </div>
                      {saveData?.module === false ||
                      saveData?.module === null ||
                      saveData?.module === undefined ? (
                        <div>
                          <h2 className="text-sm leading-6 font-semibold	 text-black">
                            路由地址
                          </h2>
                          <Input
                            style={{ width: "90%" }}
                            value={saveData?.url}
                            placeholder="不用/斜线开头"
                            onChange={(d) => {
                              setPageConf({ ...saveData, url: d });
                            }}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </TabPane>
                  {saveData ? (
                    <TabPane tab="+组件" itemKey={"1"}>
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
                                addComponent(key, ViewComponents[key]);
                              }}
                            />
                          </Draggable>
                        ))}
                      </div>
                    </TabPane>
                  ) : (
                    ""
                  )}

                  {saveData ? (
                    <TabPane tab="+模块" itemKey={"2"}>
                      <div className="grid grid-cols-2 gap-2 p-2 z-40">
                        {modules?.map((d: PageLayout) => (
                          <Draggable key={"Draggable" + d.id}>
                            <VfCard
                              key={d.id}
                              data={{
                                title: d.name,
                                icon: d.img,
                              }}
                              onClick={() => {
                                if (d && d.id) {
                                  addModule(d.id);
                                }
                              }}
                            />
                          </Draggable>
                        ))}
                      </div>
                    </TabPane>
                  ) : (
                    <></>
                  )}
                </Tabs>
              </div>
            </div>
            {/* End secondary column */}
          </aside>
          <main className="flex-1 relative z-40  overflow-y-auto focus:outline-none">
            {/* Start main area*/}
            <div className="absolute inset-0 py-6 px-2  ">
              <div
                className="h-full border-2 border-blue-900 border-dashed rounded-lg"
                ref={ref}
              >
                <ResponsiveReactGridLayout
                  // 设计阶段，不需要自适应与划出设置组件会有冲突
                  // key={pageConf?.id + (size?.width + "")}
                  margin={[0, 0]} //div之间的间距
                  allowOverlap={saveData?.componentOver === true ? true : false} //是否可以重叠 false 默认不能重叠
                  onLayoutChange={onLayoutChange} // 布局改变事件
                  className=" layout "
                  // breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                  cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
                  rowHeight={2}
                >
                  {/*  ${pageComponent.i ? " z-" + pageComponent.i : ""} */}
                  {saveData?.content?.map((pageComponent, index) => {
                    return (
                      <div
                        onDoubleClick={() => {
                          setEdit(pageComponent.pageKey);
                        }}
                        key={pageComponent.pageKey}
                        data-grid={{ ...pageComponent }}
                        style={{ zIndex: pageComponent.i }}
                        // ${
                        //   pageComponent.i ? "z-index-" + pageComponent.i : ""
                        // }
                        className={`${
                          pageComponent.pageKey === edit ? "bg-blue-200" : ""
                        } 
                        group border-2 hover:bg-blue-200`}
                      >
                        <div className=" z-30  space-x-2 absolute right-5 hidden group-hover:block">
                          <Button
                            className="bg-slate-200"
                            onClick={() => {
                              setEdit(pageComponent.pageKey);
                            }}
                          >
                            编辑
                          </Button>
                          <Button
                            className="bg-slate-200"
                            onClick={() => {
                              setPageConf({
                                ...saveData,
                                content: saveData?.content?.filter(
                                  (ff) => ff.pageKey !== pageComponent.pageKey
                                ),
                              });
                            }}
                          >
                            删除
                          </Button>
                        </div>
                        {pageComponent.component ? (
                          <Views
                            className="h-full"
                            pageComponentDto={pageComponent}
                          />
                        ) : (
                          <Page moduleId={pageComponent.moduleId} />
                        )}
                      </div>
                    );
                  })}
                </ResponsiveReactGridLayout>
                {/* <div>{JSON.stringify(pageConf)}</div> */}
              </div>
            </div>
            {/* End main area */}
          </main>

          <SideSheet
            title="组件配置"
            visible={curr ? true : false}
            onCancel={() => {
              setEdit(undefined);
            }}
          >
            {/* {JSON.stringify(curr)} */}
            {/* Start secondary column (hidden on smaller screens) */}
            <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:p-6">
              <div className="h-full pt-6">
                {/* <Draggable>
                  <div>111111111111</div>
                </Draggable> */}
                {/* <div>{JSON.stringify(curr?.pageComponentDto)}</div> */}

                {/* if (
                                pageComponent.moduleId === undefined ||
                                pageComponent.moduleId === null
                              ) {
                              } else {
                                Notification.open({
                                  title: "模块级组件",
                                  content: "如果需要编辑请转到该模块",
                                  duration: 3,
                                });
                              } */}
                {curr?.componentInfo ? (
                  <>
                    <ComponentSetting
                      componentInfo={curr.componentInfo}
                      pageKey={curr.pageKey || ""}
                      pageComponentPropDtos={curr.props}
                      onDataChange={(
                        pageComponentPropDtos: Partial<PageComponentPropDto>[]
                      ) => {
                        //替换指定组件里的指定属性设置值
                        setPageConf({
                          ...saveData,
                          content: saveData?.content?.map((pageComponentDto) =>
                            pageComponentDto.pageKey === curr.pageKey
                              ? {
                                  ...pageComponentDto,
                                  props: pageComponentPropDtos,
                                }
                              : { ...pageComponentDto }
                          ),
                        });
                      }}
                    >
                      <Collapse.Panel
                        key={`panelaaa`}
                        header="组件设置"
                        itemKey={"collapse" + 0}
                      >
                        <>{LayoutComponentSetting}</>
                      </Collapse.Panel>
                    </ComponentSetting>
                  </>
                ) : (
                  <>{LayoutComponentSetting}</>
                )}
              </div>
            </div>
            {/* End secondary column */}
          </SideSheet>
        </div>
      </div>
    </div>
  );
};

export default Layout;
