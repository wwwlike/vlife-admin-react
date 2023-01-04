import { ComponentDef, dataType } from '@src/pages/design/fieldSetting/componentData';
import {
  IconHome,
  IconUserGroup,
  IconLineChartStroked,
} from "@douyinfe/semi-icons";
import Total from '../views/total';
import VfEntry from '../vlifeComponent/views/VfEntry';
import ChartPage from '@src/pages/common/ChartPage';


export const ViewComponents: ComponentDef = {
  Total: {
    label: "汇总数据展示",
    icon:IconUserGroup,
    w: 5,
    h: 4,
    component:Total,
    propInfo: {
      title:{
        label:"标题",
        sourceType:"fixed",
        dataType:dataType.string,
      },  
      // info: {
      //   label: "汇总数据",
      //   dataType:dataType.object,
      //   dataSub:{
      //     title:{label:'标题',dataType:dataType.string, sourceType:"fixed"},
      //     total:{label:'数值',dataType:dataType.number,sourceType:"api"}
      //   },
      //   must: true,
      // },
      infos: {
        label: "汇总数据数组",
        dataType:dataType.list,
        dataSub:{
          title:{label:'标题',dataType:dataType.string},
          total:{label:'数值',dataType:dataType.number,sourceType:"api"},
          icon:{label:'图标',dataType:dataType.icon}
        },
        must: false,
      },
    },
  },

  VfEntry : {
    label: "待办入口",
    icon:IconHome,
    w: 3,
    h: 5,
    component:VfEntry,
  },
  
  Echart : {
    label: "图表组件",
    icon:IconLineChartStroked,
    w: 12,
    h: 4,
    component:ChartPage,
    propInfo: {
      title:{
        label:"图表名称",
        sourceType:"fixed",
        dataType:dataType.string
      },
      codes:{
        label:"统计项",
        dataType:dataType.list,
        sourceType:"fixed",
        table:{
          entityName:"reportItem",
          valField:"code",
          labelField:"name"
        }
      },
      group:{
        label:"统计维度",
        dataType:dataType.string, 
        sourceType:"fixed", //数据是个固定值
        dict:{dictCode:"GROUPS"},//从分类groups取值
      }
    }
  },
}
