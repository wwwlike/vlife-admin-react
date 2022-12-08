/**
 * 图表组件
 */

import ReactECharts from "echarts-for-react";
import React from "react";
const option = {
  title: {
    text: "报表名称",
  },
  tooltip: {},
  legend: {
    data: ["销量", "产量"],
  },
  xAxis: {
    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
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

const VfEchart = () => {
  return <ReactECharts option={option} />;
};

export default VfEchart;
