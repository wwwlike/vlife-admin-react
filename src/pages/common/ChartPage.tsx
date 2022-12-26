//VF封装的统计图表组件
//调用接口取数据，封装chart组件数据

import { listAll, ReportItem } from "@src/mvc/model/ReportItem";
import { report } from "@src/mvc/model/ReportTable";
import { find } from "@src/provider/baseProvider";
import EChartsReact from "echarts-for-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useStore } from "react-redux";

//数据翻译
export interface ChartPageProps {
  /** 报表名称 */
  title: string;
  /** 报表类型 */
  chartType: "bar" | "line";
  /**
   * 报表类型
   */
  reportCode: "string";
  /** 统计项目编码 */
  codes: string[];
  /** 分组字段 */
  group: string;
}

const ChartPage = ({
  codes,
  group,
  chartType = "bar",
  ...props
}: ChartPageProps) => {
  /**
   * 请求的后端数据 sum,max是codes createId 来源于 groups
   * [{createId:123,sum:222,max:333},{createId:222,sum:111,max:222}]
   */
  const [datas, setDatas] = useState<any[]>();
  const [xName, setXName] = useState<string[]>([]);

  const [reportItems, setReportItems] = useState<ReportItem[] | undefined>([]);

  const groupTitle = (code: string): string => {
    const codes: string[] = code.split("_");
    let title = "";
    codes.forEach((c) => {
      if (c === "sysUserId") {
        title += "用户";
      } else if (c === "sysDeptId") {
        title += "部门";
      } else if (c === "sysAreaId") {
        title += "地区";
      } else if (c === "createDate") {
        title += "日期";
      } else if (c === "sysOrgId") {
        title += "机构";
      } else if (c === "ji") {
        title += "(季)";
      } else if (c === "year") {
        title += "(年)";
      } else if (c === "month") {
        title += "(月)";
      }
    });
    return title;
  };

  useEffect(() => {
    if (codes && group) {
      report({ itemCode: codes, groups: [group] }).then((d) => {
        setDatas(d.data);
        if (d.data)
          findName(group, [...d.data.map((d) => d[group])]).then((d) => {
            setXName(d);
          });
      });
    }
    listAll().then((data) => {
      setReportItems(data.data);
    });
  }, [codes, group]);

  const findName = async (
    groupStr: string,
    val: string[]
  ): Promise<string[]> => {
    let name: string[] = [];
    if (groupStr.endsWith("Id")) {
      let entityName = groupStr.substring(0, groupStr.length - 2);
      if (entityName === "create") {
        entityName = "sysUser";
      }
      await find(entityName, "id", val).then((d) => {
        const t = d.data?.map((d) => d.name);
        if (t) {
          name = t;
        }
      });
    }
    return name;
  };

  const option = useMemo(() => {
    if (datas && datas.length > 0 && codes && codes.length > 0 && chartType) {
      const itemName = codes.map(
        (code) => reportItems?.filter((f) => f.code === code)[0].name
      );
      let opt: any = {
        title: {
          text: props.title,
        },
        legend: {
          data: itemName,
        },
        yAxis: {}, //需要有
        xAxis: {
          // data: [...datas?.map((d) => d[group])],
          data: xName,
        },
        series: codes.map((code) => {
          return {
            name: reportItems?.filter((f) => f.code === code)[0].name,
            type: chartType,
            data: datas?.map((d) => d[code]),
          };
        }),
      };
      return opt;
    } else {
      return {};
    }
  }, [datas, group, codes, props, reportItems, xName]);

  const option2 = {
    title: { text: "2222" },
    legend: {
      data: ["销量", "产量"], //2个统计项
    },
    yAxis: {},
    xAxis: {
      data: [["1", "2"]],
    },
    series: [
      { name: "1", type: "bar", data: [2, 1] },
      { name: "2", type: "bar", data: [5, 1] },
    ],
  };
  const option1 = {
    title: {
      text: "报表名称",
    },
    tooltip: {},
    legend: {
      data: ["销量", "产量"], //2个统计项
    },
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"], // group by type 得到的5个
    },
    yAxis: {},
    series: [
      {
        name: "销量",
        type: "bar",
        data: [5, 20, 36, 10, 10, 20],
      },
      {
        name: "产量",
        type: "bar",
        data: [1, 4, 5, 10, 10, 20],
      },
    ],
  };

  if (option) {
    return (
      <>
        {/* {JSON.stringify(option2)} */}
        <EChartsReact option={option} />
      </>
    );
  } else {
    return <> {codes[1]}请填写完成所有参数</>;
  }
};

export default ChartPage;
