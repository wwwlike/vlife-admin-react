import {
  Button,
  Layout,
  Nav,
  Select,
  Space,
  Table,
  TabPane,
  Tabs,
  Tag,
} from "@douyinfe/semi-ui";
import Sider from "@douyinfe/semi-ui/lib/es/layout/Sider";
import { ReportItem, listAll, save } from "@src/mvc/model/ReportItem";
import {
  ReportKpi,
  listAll as kpiListAll,
  save as saveKpi,
} from "@src/mvc/model/ReportKpi";
import {
  ReportTableSaveDto,
  listAll as reportListAll,
  saveReportTableSaveDto,
  remove,
  ReportTableDto,
} from "@src/mvc/model/ReportTable";
import {
  IconMaximize,
  IconEyeOpened,
  IconEyeClosedSolid,
  IconTick,
  IconArrowUp,
  IconArrowDown,
  IconReply,
  IconSave,
  IconOrderedList,
  IconKanban,
} from "@douyinfe/semi-icons";
import { ReportTableItem } from "@src/mvc/model/ReportTableItem";
import { useNiceModal } from "@src/store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FormPage from "../common/formPage";
import { useUpdateEffect } from "ahooks";
import ReportTable from "@src/components/report";

/**
 * vlife报表设计器
 * 1. form传输和保存是2种dto结构对象，本模块需要对他们进行转换
 */
export default () => {
  const formModal = useNiceModal("formModal");

  const [reload, setReload] = useState(false);
  /**
   * 页面状态 add 新增/ edit 编辑 /
   */
  const [pageState, setPageState] = useState("edit");
  /**
   * 所有配置的报表
   */
  const [allReportDto, setAllReportDto] = useState<ReportTableSaveDto[]>([]);
  /**
   * 全量统计项
   */
  const [allReportItem, setAllReportItem] = useState<ReportItem[]>([]);
  /**
   * 全量指标项
   */
  const [allReportKpi, setAllReportKpi] = useState<ReportKpi[]>([]);

  /**
   * 当前编辑的报表配置
   */
  const [currReportTable, setCurrReportTable] = useState<
    Partial<ReportTableSaveDto>
  >({ items: [] });

  const [reportTableDto, setReportTableDto] = useState<ReportTableDto>();

  /**
   * 表单数据生成
   * ReportTableSaveDto => 转 ReportTableDto
   */
  const formData = useMemo((): Partial<ReportTableDto> => {
    if (currReportTable) {
      const formData: Partial<ReportTableDto> = {
        ...currReportTable,
        id: currReportTable.id,
        itemIds:
          currReportTable.items && currReportTable.items.length > 0
            ? currReportTable.items
                .filter((f) => f.reportItemId) //是统计项
                .map((ff) => ff.reportItemId)
            : [],
        kpiIds: currReportTable.items
          ? currReportTable.items //是指标项
              .filter((f) => f.reportKpiId)
              .map((ff) => ff.reportKpiId)
          : [],
      };
      return formData;
    } else {
      return {};
    }
  }, [currReportTable.id]);

  /**
   * 查找统计项
   */
  const findItem = useCallback(
    (id: string): ReportItem => {
      return allReportItem.filter((item) => item.id === id)[0];
    },
    [allReportItem]
  );
  /**
   * 查找指标项
   */
  const findKpi = useCallback(
    (id: string): ReportKpi => {
      return allReportKpi.filter((kpi) => kpi.id === id)[0];
    },
    [allReportKpi]
  );

  /**
   * load统计项，指标项
   */
  const initData = useCallback(() => {
    reportListAll().then((data) => {
      setAllReportDto(data.data);
    });
    listAll(null).then((data) => {
      setAllReportItem([...data.data]);
    });
    kpiListAll().then((data) => {
      setAllReportKpi([...data.data]);
    });
  }, []);

  /**
   * 初次加载所有报表和项目
   */
  useEffect(() => {
    initData();
  }, []);

  // const reportTableItems = useCallback(
  //   (
  //     selectedItemIds: string[], //选择的统计项
  //     selectKipIds: string[] //选择的指标项
  //   ): Partial<ReportTableItem>[] => {
  //     //之前选择的
  //     let beforeItems: Partial<ReportTableItem>[] = currReportTable.items;
  //     console.log("begin" + beforeItems.length);

  //     //step1 不在之前选中的里面的，默认添加到最后面
  //     if (selectedItemIds) {
  //       selectedItemIds.forEach((itemId) => {
  //         if (!beforeItems.map((d) => d.reportItemId).includes(itemId)) {
  //           beforeItems.push({
  //             reportItemId: itemId,
  //             sort: beforeItems.length,
  //             title: findItem(itemId).name,
  //           });
  //         }
  //       });
  //     }
  //     if (selectKipIds) {
  //       selectKipIds.forEach((kpiId) => {
  //         if (!beforeItems.map((d) => d.reportKpiId).includes(kpiId)) {
  //           beforeItems.push({
  //             reportKpiId: kpiId,
  //             sort: beforeItems.length,
  //             title: findKpi(kpiId).name,
  //           });
  //         }
  //       });
  //     }

  //     //step2 去掉本次没有选中的/然后sort重新排序后赋值
  //     beforeItems = beforeItems
  //       .filter((d) => {
  //         if (
  //           (d.reportKpiId &&
  //             selectKipIds &&
  //             !selectKipIds.includes(d.reportKpiId)) ||
  //           (d.reportKpiId && !selectKipIds)
  //         ) {
  //           return false;
  //         } else if (
  //           (d.reportItemId &&
  //             selectedItemIds &&
  //             !selectedItemIds.includes(d.reportItemId)) ||
  //           (d.reportItemId && !selectedItemIds)
  //         ) {
  //           return false;
  //         }
  //         return true;
  //       })
  //       .sort((a, b) => a.sort - b.sort)
  //       .map((d, index) => {
  //         return { ...d, sort: index };
  //       });

  //     console.log("end" + beforeItems.length);
  //     return beforeItems;
  //   },
  //   [currReportTable]
  // );

  /**
   * 当前报表项 (统计项指标项的id,索引就是sort)
   */
  const [items, setItems] = useState<string[]>();

  const beforeSelects = useRef<string[]>();

  /**
   * 页面form选择的ids
   */
  const [selects, setSelects] = useState<string[]>([]);

  /**
   * items 与选择项目同步
   */
  useUpdateEffect(() => {
    let curr: string[] = [];
    if (selects.length > beforeSelects.current?.length) {
      selects.forEach((n) => {
        if (!beforeSelects.current?.includes(n)) {
          curr = [...beforeSelects.current, n];
        }
      });
    } else {
      //删除
      curr = beforeSelects.current?.filter((i) => selects.includes(i));
    }

    setItems(curr);
    beforeSelects.current = curr;
  }, [selects]);

  /**
   * 切换报表，更新左侧项目
   */
  useEffect(() => {
    const i = currReportTable.items
      ?.sort((a, b) => a.sort - b.sort)
      .map((f) => f.reportItemId || f.reportKpiId);
    setItems(i);
    beforeSelects.current = i;
  }, [currReportTable.code, JSON.stringify(currReportTable.items)]);

  const saveReport = useCallback(() => {
    let saveItems: Partial<ReportTableItem>[] = [];
    const dbItems: ReportTableItem[] = currReportTable.items || [];
    items?.forEach((id, index) => {
      let exist = false;
      dbItems?.forEach((f) => {
        if (f.reportKpiId === id || f.reportKpiId === id) {
          saveItems.push({ ...f, sort: index });
          exist = true;
        }
      });

      if (exist === false) {
        saveItems.push({
          reportKpiId: findKpi(id) ? id : undefined,
          reportItemId: findItem(id) ? id : undefined,
          sort: index,
          title: findKpi(id) ? findKpi(id).name : findItem(id).name,
        });
      }
    });
    saveReportTableSaveDto({ ...reportTableDto, items: saveItems });
  }, [JSON.stringify(items), currReportTable, reportTableDto]);

  return (
    <div>
      <Layout className="layout-page">
        <Layout.Header
          className="layout-header shadow"
          style={{ height: "50px" }}
        >
          <Nav
            mode="horizontal"
            header={
              <Space>
                {pageState === "edit" ? (
                  <Select
                    insetLabel="选择报表"
                    value={currReportTable.id}
                    onSelect={(d) => {
                      allReportDto.forEach((dto) => {
                        if (dto.id === d) {
                          setCurrReportTable(dto);
                          setReload(!reload);
                        }
                      });
                    }}
                    optionList={allReportDto.map((d) => {
                      return { value: d.id, label: d.name };
                    })}
                  />
                ) : (
                  ""
                )}

                {pageState === "edit" ? (
                  <Button
                    onClick={() => {
                      setPageState("add");
                      setCurrReportTable({ items: [], code: "" });
                      setReload(!reload);
                    }}
                  >
                    +新报表
                  </Button>
                ) : (
                  "请在【报表配置】里选择`统计项目`和`指标`"
                )}

                {/* <Button>+统计项</Button>
                <Button>+指标项</Button> */}
              </Space>
            }
            footer={
              <Space>
                <Button
                  onClick={() => {
                    formModal
                      .show({
                        //这里因为是any,所以show无提示，不优雅,
                        entityName: "reportItem",
                        // modelName,
                        // initData: record,
                        saveFun: save,
                        type: "save",
                        //模型传的是复杂类型(modelProps),则需要数据内容打散透传给modal
                      })
                      .then((saveData) => {
                        setReload(!reload);
                        initData();
                      });
                  }}
                >
                  +统计项
                </Button>
                <Button
                  onClick={() => {
                    formModal
                      .show({
                        //这里因为是any,所以show无提示，不优雅,
                        entityName: "reportKpi",
                        // modelName,
                        // initData: record,
                        saveFun: saveKpi,
                        type: "save",
                        //模型传的是复杂类型(modelProps),则需要数据内容打散透传给modal
                      })
                      .then((saveData) => {
                        setReload(!reload);
                        initData();
                      });
                  }}
                >
                  +指标项
                </Button>
                {/* <Button>创建指标</Button> */}
                {pageState === "add" ? (
                  <>
                    <Button
                      onClick={() => {
                        setCurrReportTable({});
                        setPageState("edit");
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      onClick={() => {
                        if (currReportTable) {
                          //更新currReportTableItem;
                          //saveReportTableSaveDto(currReportTable);
                          saveReport();
                          setPageState("edit");
                          initData();
                        }
                      }}
                    >
                      保存
                    </Button>
                  </>
                ) : (
                  ""
                )}

                {currReportTable && currReportTable.id ? (
                  <>
                    <Button
                      onClick={() => {
                        remove(currReportTable.id).then((data) => {
                          setCurrReportTable({});
                          initData();
                        });
                      }}
                    >
                      删除
                    </Button>
                    <Button
                      onClick={() => {
                        if (currReportTable) {
                          saveReport();
                          setPageState("edit");
                          initData();
                        }
                      }}
                    >
                      保存
                    </Button>
                  </>
                ) : (
                  ""
                )}
              </Space>
            }
          />
        </Layout.Header>
        <Layout>
          <Sider
            style={{
              backgroundColor: "var(--semi-color-bg-1)",
              minWidth: "210px",
            }}
          >
            {items?.map((m, index) => {
              return (
                <div style={{ padding: "8px" }} key={"div_" + m}>
                  <Space key={"Space_" + m}>
                    <Tag key={m}>
                      {findItem(m) ? findItem(m).name : ""}
                      {findKpi(m) ? findKpi(m).name : ""}
                    </Tag>
                  </Space>
                </div>
              );
            })}
          </Sider>
          <Layout.Content className="layout-content">
            <Tabs>
              {currReportTable.id ? (
                <TabPane tab="实时预览" itemKey={"AA"}>
                  <ReportTable
                    allReportItem={allReportItem}
                    allReportKpi={allReportKpi}
                    currReportTable={currReportTable}
                  ></ReportTable>
                </TabPane>
              ) : (
                ""
              )}
              <TabPane tab="报表配置" itemKey="eventTab">
                {JSON.stringify(items)}
                {(currReportTable && currReportTable.id) ||
                pageState === "add" ? (
                  <>
                    <FormPage
                      entityName="reportTable"
                      modelName="reportTableDto"
                      type="save"
                      reload={reload}
                      formData={formData}
                      onDataChange={(data: ReportTableDto) => {
                        let selects: string[];
                        if (data.itemIds && data.kpiIds) {
                          selects = [...data.itemIds, ...data.kpiIds];
                        } else if (data.itemIds) {
                          selects = [...data.itemIds];
                        } else if (data.kpiIds) {
                          selects = [...data.kpiIds];
                        } else {
                          selects = [];
                        }
                        setSelects(selects);
                        setReportTableDto({ ...data });
                      }}
                    ></FormPage>
                  </>
                ) : (
                  "请选择需要编辑的报表或者新增一张报表"
                )}

                {/* <ReportConf></ReportConf> */}
              </TabPane>
            </Tabs>
          </Layout.Content>
          <Sider
            className="shadow-lg"
            style={{
              padding: "10px",
              backgroundColor: "var(--semi-color-bg-1)",
              minWidth: "280px",
              maxWidth: "280px",
            }}
          ></Sider>
        </Layout>
      </Layout>
    </div>
  );
};
