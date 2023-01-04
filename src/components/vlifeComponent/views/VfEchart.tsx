/**
 * 图表组件
 */
import React, { useMemo } from "react";
import ReactECharts, { EChartsOption } from "echarts-for-react";

/**
 * 图表展示组件，
 * 后期需要支持吗，切换数据维度
 */
interface VfEchartProps {
  /**
   * 报表名称
   */
  title: string;
  /**
   * x坐标列名
   */
  xAxis: string[];
  /** 图表类型 */
  type: "bar" | "line";
  /** 图标数据 */
  value: [any[]];
}
const option = {
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
      type: "line",
      data: [1, 4, 5, 10, 10, 20],
    },
  ],
};

const VfEchart = ({ ...props }: VfEchartProps) => {
  const option = useMemo((): EChartsOption => {
    return {
      title: {
        text: props.title,
      },
    };
  }, [props]);
  return <ReactECharts option={option} />;
};

export default VfEchart;
