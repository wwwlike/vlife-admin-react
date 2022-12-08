import { ComponentDef, dataType } from '@src/pages/design/fieldSetting/componentData';
import {
  IconHome,
  IconCalendar,
  IconUserGroup,
  IconSearch,
  IconUserAdd,
  IconPhone,
  IconAlertCircle,
} from "@douyinfe/semi-icons";
import Total from '../views/total';
import { Card, Carousel, Image, Input } from '@douyinfe/semi-ui';
import VfEntry from '../vlifeComponent/views/VfEntry';
import VfEchart from '../vlifeComponent/views/VfEchart';


export const ViewComponents: ComponentDef = {
  Total: {
    label: "汇总数据展示",
    icon:IconHome,
    w: 5,
    h: 4,
    component:Total,
    propInfo: {
      title:{
        label:"标题",
        dataType:String,
      },  
      info: {
        label: "汇总数据",
        dataType:Object,
        dataSub:{title:{label:'标题',dataType:String},total:{label:'数值',dataType:Number}},
        must: false,
      },
      infos: {
        label: "汇总数据数组",
        // dataType:"bbbb",
        dataType:Array,
        dataSub:{
          title:{label:'标题',dataType:String},
          total:{label:'数值',dataType:Number},
          icon:{label:'图标',dataType:"Icon"}
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
    label: "折线图",
    icon:IconHome,
    w: 12,
    h: 4,
    component:VfEchart,
  },
}


// type info = {
//   /**
//    * 标题
//    */
//   title: string;
//   /**
//    * 数量
//    */
//   total: number;
//   /**
//    * 说明
//    */
//   remark?: string;
//   /**
//    * 连接路由
//    */
//   router?: string;
// };


/* 视图组件 */
// export const ViewComponents: { [key: string]: Comp } = {
//   Total: {
//     component: Total,
//     title: "汇总组件",
//     icon: IconHome,
//     w: 5,
//     h: 3,
//   },
// };
