import {
  IconHome,
  IconUserGroup,
  IconLineChartStroked,
} from "@douyinfe/semi-icons";
import ChartPage from '@src/pages/common/ChartPage';
import {listAll as reportItemListAll, ReportItem } from '@src/mvc/model/ReportItem';
import { ComponentDef, dataType } from '@src/pages/design/data/componentData';
import VfSum from './vlifeComponent/views/VfSum';
import VfEntry from './vlifeComponent/views/VfEntry';
import CmsHeader from './cms/header';
import { listAll } from '@src/mvc/PageLayout';
import VfCarousel from './cms/carousel';
import VfItem from './cms/item';
import VfImgList from './cms/product/ImgList';
import Price from './cms/price';
import ListPage from './cms/listPage';

import { OaNews } from '@src/mvc/OaNews';
/**
 * 视图展示类组件
 */
export const ViewComponents: ComponentDef = {
  Total: {
    label: "汇总数据展示",
    icon:IconUserGroup,
    w: 12,
    h: 16,
    component:VfSum,
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

  Header : {
    label: "Header菜单",
    w: 12,
    h: 42,
    component:CmsHeader,
    propInfo:{
      logo:{
        label:"网站logo",
        sourceType:'fixed',
        dataType:dataType.image,
      },
      title:{
        label:"网站名称",
        sourceType:'fixed',
        dataType:dataType.string,
      },
      menu:{
        label:"菜单信息",
        sourceType:'fixed',
        dataType:dataType.list,
        dataSub:{
          name:{label:'菜单标题',dataType:dataType.string},
          url:{label:'路由地址',dataType:dataType.string,sourceType:'fixed',
        fixed:{
          promise:()=>{ return listAll().then((d)=>{return d.data?d.data.filter(dd=>dd.module===undefined ||dd.module===null || dd.module===false).map((ddd)=>{return {value:ddd.url,label:`${ddd.name}(${ddd.url})`}}):[]})}
        }
        },
        }
      }
    }
  },

  newPage : {
    label: "新闻页面",
    w: 12,
    h: 477,
    component:ListPage,
    propInfo:{
      data:{
        label:"新闻数据",
        dataType:dataType.page,//需要的数据类型
        dataModel:["OaNews"],
        sourceType:"api",//数据来源
      },
      //这里 设置的api一般是和 propName设置的api是一致的
      onDataChange:{
        dataType:dataType.event,
        label:"翻页事件",
        event:{
          params:{
            "pager.page":dataType.number
          },
          propName:"data"
        }
      }
    }
  },
      // //会修改数据，然后传输数据
      // onDataChange:{
      //   label:"翻页事件"
      //   dataType:dataType.
      // }
  
  VfCarousel:{
    label: "轮播图",
    icon:IconHome,
    w: 12,
    h: 190,
    component:VfCarousel,
    propInfo:{
      imgs: {
        label: "轮播图信息",
        dataType:dataType.list,
        dataSub:{
          title:{label:'标题',dataType:dataType.string,sourceType:'fixed'},
          src:{label:'图片',dataType:dataType.image},
          line1:{label:'介绍',dataType:dataType.string},
          line2:{label:'说明',dataType:dataType.string}
        },
        must: false,
      },
    }
  },
  VfItem:{
    label: "特色能力",
    icon:IconHome,
    w: 12,
    h: 30,
    component:VfItem,
    propInfo:{
      infos: {
        label: "介绍信息",
        dataType:dataType.list,
        dataSub:{
          title:{label:'标题',dataType:dataType.string,sourceType:'fixed'},
          img:{label:'图片',dataType:dataType.image},
          desc:{label:'说明',dataType:dataType.string},
        },
        must: false,
      },
      size:{
        label: "每行数量",
        dataType:dataType.number,
      }
    }
  },

  VfProductList:{
    label: "图片LIST",
    icon:IconHome,
    w: 12,
    h: 30,
    component:VfImgList,
    propInfo:{
      title:{
        label: "标题",
        dataType:dataType.string,
      },
      infos: {
        label: "介绍信息",
        dataType:dataType.list,
        dataSub:{
          title:{label:'标题',dataType:dataType.string,sourceType:'fixed'},
          img:{label:'图片',dataType:dataType.image},
        },
        must: false,
      }
    }
  },
  VfEntry : {
    label: "待办入口",
    icon:IconHome,
    w: 3,
    h: 5,
    component:VfEntry,
  },
  Price:{
    label: "产品价格",
    icon:IconHome,
    w: 12,
    h: 863,
    component:Price,
  },
  Echart : {
    label: "图表组件",
    icon:IconLineChartStroked,
    w: 12,
    h: 130,
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
        fixed:{
          promise:()=>reportItemListAll().then(d=>{return d.data?d.data.map((item:ReportItem)=>
            {return {value:item.code,label:item.name}}):[]}),
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
