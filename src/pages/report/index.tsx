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
  report,
  ReportTableDto,
} from "@src/mvc/model/ReportTable";
import { ReportTableItem } from "@src/mvc/model/ReportTableItem";
import { useNiceModal } from "@src/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import FormPage from "../common/formPage";

/**
 * vlife报表设计器
 * 1. form传输和保存时2种dto对象
 */
export default () => {
  const formModal = useNiceModal("formModal");

  const [reload, setReload] = useState(false);
  /**
   * 页面状态 add 新增/ edit 编辑 /
   */
  const [pageState, setPageState] = useState("edit");
  /**
   * 全量报表
   */
  const [allReportDto, setAllReportDto] = useState<ReportTableSaveDto[]>([]);
  /**
   * 全量统计项
   */
  const [allReportItem, setAllReportItem] = useState<ReportItem[]>([]);
  /**
   * 存储多组分组方式
   */
  const [group, setGroup] = useState<string[]>([]);

  /**
   * 全量指标项
   */
  const [allReportKpi, setAllReportKpi] = useState<ReportKpi[]>([]);

  const [reportData, setReportData] = useState<any[]>([]);

  /**
   * 当前报表配置(保存的)
   */
  const [currReportTable, setCurrReportTable] = useState<
    Partial<ReportTableSaveDto>
  >({ items: [] });

  const formData = useMemo((): Partial<ReportTableDto> => {
    if (currReportTable) {
      const formData = {
        ...currReportTable,
        id: currReportTable.id,
        itemIds: currReportTable.items
          ? currReportTable.items
              .filter((f) => f.reportItemId)
              .map((ff) => ff.reportItemId)
          : [],
        kpiIds: currReportTable.items
          ? currReportTable.items
              .filter((f) => f.reportKpiId)
              .map((ff) => ff.reportKpiId)
          : [],
      };

      return formData;
    } else {
      return {};
    }
  }, [currReportTable]);

  /**
   * 查找统计项
   */
  const findItem = useCallback(
    (id: string): ReportItem => {
      return allReportItem.filter((item) => item.id === id)[0];
    },
    [allReportItem]
  );

  const findKpi = useCallback(
    (id: string): ReportKpi => {
      return allReportKpi.filter((kpi) => kpi.id === id)[0];
    },
    [allReportKpi]
  );

  const loadData = useCallback(() => {
    const groupStr =
      currReportTable.groupColumn +
      (currReportTable.func ? "_" + currReportTable.func : "");
    setGroup([groupStr]); //影响列表
    report({
      reportCode: currReportTable.code,
      groups: [groupStr],
    }).then((data) => {
      if (data.data) {
        setReportData(data.data);
      }
    });
  }, [currReportTable]);

  const column = useMemo((): { dataIndex: string; title: string }[] => {
    if (currReportTable && currReportTable.items) {
      return [
        ...group.map((m) => {
          return { title: m, dataIndex: m };
        }),
        ...currReportTable.items.map((i) => {
          return {
            title: i.title,
            dataIndex: i.reportItemId
              ? findItem(i.reportItemId).code
              : findKpi(i.reportKpiId).code,
          };
        }),
      ];
    } else {
      return [];
    }
  }, [currReportTable, group]);

  /**
   * 初始化数据
   */
  const initData = useCallback(() => {
    listAll(null).then((data) => {
      setAllReportItem([...data.data]);
    });
    kpiListAll().then((data) => {
      setAllReportKpi([...data.data]);
    });
    reportListAll().then((data) => {
      setAllReportDto(data.data);
    });
  }, []);

  useEffect(() => {
    initData();
  }, []);

  //选中的统计项发生变化，影响currReporbtItem内容
  const reportTableItems = useCallback(
    (
      selectedItemIds: string[], //选择的统计项
      selectKipIds: string[] //选择的指标项
    ): Partial<ReportTableItem>[] => {
      if (currReportTable) {
        let items: Partial<ReportTableItem>[] = currReportTable.items;
        //删除配置表单里移除的items并调整排序号
        if (items.length > 0) {
          items = items
            .filter(
              //不再最新选中selectedItemIds里就过滤掉
              (i) =>
                selectedItemIds.filter((s) => s === i.reportItemId).length >
                  0 ||
                selectKipIds.filter((s) => s === i.reportItemId).length > 0
            )
            .map((m, index) => {
              m.sort = index;
              return m;
            });
        }
        // 从allReportItems找到新的item添加进来，加入title字段
        if (selectKipIds) {
          selectKipIds
            .filter(
              //过滤处新增的kpi
              (s) => items.filter((i) => s === i.reportKpiId).length === 0
            ) //创建reportTableItem
            .forEach((kpiId) => {
              items.push({
                reportKpiId: kpiId,
                sort: items.length,
                title: findKpi(kpiId).name,
              });
            });
        }

        if (selectedItemIds) {
          selectedItemIds
            .filter(
              (s) => items.filter((i) => s === i.reportItemId).length === 0
            )
            .forEach((itemId) => {
              items.push({
                reportItemId: itemId,
                sort: items.length,
                title: findItem(itemId).name,
              });
            });
        }

        return items;
      }
      return [];
    },
    [currReportTable && currReportTable.code, allReportItem, allReportKpi]
  );

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
                        // pageRefresh();
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
                        // pageRefresh();
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
                          saveReportTableSaveDto(currReportTable);
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
                {currReportTable.id !== undefined ? (
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
                          saveReportTableSaveDto(currReportTable);
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
                    <Button onClick={loadData}>提取数据</Button>
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
            {currReportTable && currReportTable.items
              ? currReportTable.items.map((m) => {
                  return (
                    <div style={{ padding: "8px" }} key={m.id}>
                      <Space>
                        <Tag
                          style={{ width: "80px" }}
                          size="large"
                          color="blue"
                          type={"ghost"}
                          //   currField && field.fieldName === currField.fieldName
                          //     ? "solid"
                          //     : "ghost"
                          // }
                        >
                          {m.title}
                        </Tag>
                      </Space>
                    </div>
                  );
                })
              : ""}
          </Sider>
          <Layout.Content className="layout-content">
            <Tabs>
              {currReportTable.id ? (
                <TabPane tab="实时预览" itemKey={"AA"}>
                  {/* {JSON.stringify(currReportTable)} */}
                  <Table columns={column} dataSource={reportData}></Table>
                </TabPane>
              ) : (
                ""
              )}
              <TabPane tab="报表配置" itemKey="eventTab">
                {(currReportTable && currReportTable.id) ||
                pageState === "add" ? (
                  <>
                    <FormPage
                      entityName="ReportTableDto"
                      type="save"
                      reload={reload}
                      formData={formData}
                      onDataChange={(data) => {
                        setCurrReportTable({
                          ...data,
                          items: reportTableItems(data.itemIds, data.kpiIds),
                        });
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
