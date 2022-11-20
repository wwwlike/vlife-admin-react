import { Breadcrumb, Card, Nav, Table, TabPane, Tabs } from "@douyinfe/semi-ui";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReportTableSaveDto,
  listAll,
  report,
} from "@src/mvc/model/ReportTable";
import { ReportItem, listAll as listItemAll } from "@src/mvc/model/ReportItem";
import { ReportKpi, listAll as listKpiAll } from "@src/mvc/model/ReportKpi";
import Icon, { IconHistogram } from "@douyinfe/semi-icons";

//报表功能页面
export default () => {
  const [currReportTable, setCurrReportTable] = useState<ReportTableSaveDto>();

  const [allReportDto, setAllReportDto] = useState<ReportTableSaveDto[]>([]);
  /**
   * 全量统计项
   */
  const [allReportItem, setAllReportItem] = useState<ReportItem[]>([]);
  /**
   * 全量指标项
   */
  const [allReportKpi, setAllReportKpi] = useState<ReportKpi[]>([]);

  const [reportData, setReportData] = useState([]);

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

  useEffect(() => {
    listAll().then((data) => {
      setAllReportDto(data.data);
      setSelectedKeys([data.data[0].code]);
      setCurrReportTable(data.data[0]);
    });
    listItemAll(null).then((data) => setAllReportItem(data.data));
    listKpiAll().then((data) => setAllReportKpi(data.data));
  }, []);

  const column = useMemo((): { dataIndex: string; title: string }[] => {
    if (currReportTable && currReportTable.items) {
      const groupStr =
        currReportTable.groupColumn +
        (currReportTable.func ? "_" + currReportTable.func : "");
      return [
        {
          dataIndex: groupStr,
          title: currReportTable.groupColumn,
        },
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
  }, [currReportTable]);

  useEffect(() => {
    if (currReportTable) {
      const groupStr =
        currReportTable.groupColumn +
        (currReportTable.func ? "_" + currReportTable.func : "");
      report({
        reportCode: currReportTable.code,
        groups: [groupStr],
      }).then((data) => {
        if (data.data) {
          setReportData(data.data);
        }
      });
    }
  }, [currReportTable]);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const onSelect = (data: any) => {
    setCurrReportTable(allReportDto.filter((f) => f.code === data.itemKey)[0]);
    setSelectedKeys([...data.selectedKeys]);
  };
  return (
    <div className="h-full overscroll-auto">
      <div className="h-full w-72 float-left ">
        <Card
          title="统计分析"
          bordered={true}
          className="h-full"
          headerLine={false}
          headerStyle={{ fontSize: "small" }}
        >
          <Nav
            bodyStyle={{ height: 320 }}
            selectedKeys={selectedKeys}
            items={allReportDto.map((d) => {
              return {
                itemKey: d.code,
                text: d.name,
                icon: <IconHistogram />,
              };
            })}
            onSelect={onSelect}
            // onClick={(data) => {
            //   console.log(data);
            // }}
          />
        </Card>
      </div>
      <div className="h-full md:min-w-3/4">
        <Card
          title={currReportTable?.name}
          headerLine={false}
          bordered={false}
          className="h-full"
        >
          <Table columns={column} dataSource={reportData}></Table>
        </Card>
      </div>
    </div>
  );
};
