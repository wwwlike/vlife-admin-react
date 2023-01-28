/**
 * 所有组件配置化信息
 */

/**
 * 可以考虑一个组件一个配置信息；或者把配置信息写入到组件内部；
 */
 import {
  DatePicker as SemiDatePicker,
  Input as SemiInput,
  TextArea as SemiTextArea,
  Select as SemiSelect,
} from "@douyinfe/semi-ui";
import { connect, mapReadPretty } from '@formily/react';
import {
  PreviewText,
  InputNumber,
} from '@formily/semi'
import QueryBuilder from '@src/components/queryBuilder';
import FormTable from '@src/components/table/FormTable';
import GroupSelect from '@src/components/vlifeComponent/GroupSelect';
import RelationTagInput from '@src/components/vlifeComponent/RelationTagInput';
import ResourcesSelect from '@src/components/vlifeComponent/ResourcesSelect';
import SearchInput from '@src/components/vlifeComponent/SearchInput';
import SelectIcon from '@src/components/vlifeComponent/SelectIcon';
import SelectTag from '@src/components/vlifeComponent/SelectTag';
import VfEditor from '@src/components/vlifeComponent/VfEditor';
import VfImage from '@src/components/vlifeComponent/VfImage';
import { VfText } from '@src/components/vlifeComponent/VfText';
import VfTreeInput from '@src/components/vlifeComponent/VfTreeInput';
import VfTreeSelect from '@src/components/vlifeComponent/VfTreeSelect';
import { ComponentDef, dataType, useType } from '@src/pages/design/data/componentData';
const Input = connect(SemiInput, mapReadPretty(PreviewText.Input))
const Select = connect(SemiSelect, mapReadPretty(VfText))
const TextArea = connect(SemiTextArea, mapReadPretty(PreviewText.Input));
const DatePicker = connect(SemiDatePicker, mapReadPretty(VfText));


/**
 * 表单搜索类组件信息
 */
export const ComponentInfo: ComponentDef = {
  Input: {
    component:Input,
    dataChangeValueType: dataType.string,
  },
  TextArea:{
    component:TextArea,
    dataChangeValueType: dataType.string,
  },
  SearchInput: {
    component:SearchInput,
    dataChangeValueType: dataType.string,
    label: "搜索组件",
    remark: "用于搜索，防抖动延迟搜索组件",
    useType:[useType.query]
  },
  SelectTag: {
    label:"Tag标签(字典)",
    useType:[useType.query],
    component:SelectTag,
    dataChangeValueType: [dataType.string, dataType.integer, dataType.list], //出参数据类型 3种出参数据类型
    propInfo: {
      datas: { //组件属性名称标识
        label: "字典分类", //组件属性说明会
        sourceType:'dict',//存字典编码，取的时候通过字典编码，取到所有分类数据
        dataType: dataType.dictList, // 属性字段类型(字典类型的集合) //这一行最好能干掉
        must: true,
      },
    },
  },
  InputNumber: {
    component:InputNumber,
    dataChangeValueType: [dataType.integer,dataType.double],
  },
  VfSelect_DICT: {
    component:Select,
    label: "下拉选择(字典)",
    dataChangeValueType: [dataType.string, dataType.number,dataType.boolean,dataType.list,dataType.integer],
    propInfo: {
      optionList:{
        label:"字典分类",
        sourceType:'dict',
        dataType:dataType.dictList,
      },
      valField:"val",
      labelField:"title",
    },
  },

  VfSelect: {
    component:Select,
    label: "vfSelect",
    dataChangeValueType: [dataType.string, dataType.number,dataType.list,dataType.integer],
    propInfo: {
      showClear:"true",
      optionList:{
        label:"数据来源",
        sourceType:'api',
        dataType:dataType.label_value_list, //期望的是这个数据类型
        otherData:{ //支持的其他类型的入参数据，传入之前需要转换成 lableValue类型
          [dataType.id_name_list]:(datas:{id:string,name:string}[])=>{
            return datas.map((data:{id:string,name:string})=>{return {value:data.id,label:data.name}});
          },
          [dataType.code_name_list]:(datas:{code:string,name:string}[])=>{
            return datas.map((data:{code:string,name:string})=>{return {value:data.code,label:data.name}});
          },
          [dataType.resourcesCode_name_list]:(datas:{resourcesCode:string,name:string}[])=>{
            return datas.map((data:{resourcesCode:string,name:string})=>{return {value:data.resourcesCode,label:data.name}});
          },
          [dataType.entityType_name_list]:(datas:{entityType:string,name:string}[])=>{
            return datas.map((data:{entityType:string,name:string})=>{return {value:data.entityType,label:data.name}});
          },
          [dataType.fieldName_title_list]:(datas:{fieldName:string,title:string}[])=>{
            return datas.map((data:{fieldName:string,title:string})=>{return {value:data.fieldName,label:data.title}});
          },
          [dataType.resources_list]:(datas:{resourcesCode:string,name:string}[])=>{
            return datas.map((data:{resourcesCode:string,name:string})=>{return {value:data.resourcesCode,label:data.name}});
          },
        },

      }
    },
  },
  RelationTagInput: {
    component:RelationTagInput,
    label: "关联弹框选择",
    dataChangeValueType: [dataType.string, dataType.list],
  },
  VfTreeSelect: {
    component:VfTreeSelect,
    label: "树型查询组件",
    useType:[useType.query],
    dataChangeValueType: dataType.string,
    propInfo: {
      datas: {
        label: "VfTree结构化数据",
        sourceType:"api",
        dataType: dataType.VfTree_list,
        must: true,
      },
      valField: "code",
    },
  },
  DatePicker: {
    component:DatePicker,
    label: "日期",
    dataChangeValueType:[dataType.date,dataType.dateList],
  },
  ResourcesSelect: {
    component:ResourcesSelect,
    label: "资源选择",
    useType:[useType.form],
    dataChangeValueType: dataType.list,
    propInfo: {
      datas: {
        label: "资源信息",
        dataType: dataType.resources_list,
        sourceType:"api",
        must: true,
      },
    },
  },
  VfTreeInput: {
    component:VfTreeInput,
    label: "树型选择组件",
    useType:[useType.form],
    dataChangeValueType: dataType.string,
    propInfo: {
      datas: {
        label: "VfTree结构化数据",
        sourceType:"api",
        dataType: dataType.VfTree_list,
        must: true,
      },
      // valField: "code",
      // valField: {
      //   label: "取值字段",
      //   dataType: dataType.string,
      //   must: true,
      // },
    },
},
  // TabSelectInput:{
  //   component:TabSelectInput,
  //   dataChangeValueType: dataType.string,
  //   label:"tab选择组件",
  //   propInfo:{
  //     datas:{
  //       label: "待选择的分组tab数据",
  //       sourceType:'api',
  //       dataType:dataType.id_name_list
  //     }
  //   }
  // },
  GroupSelect: {
    component:GroupSelect,
    dataChangeValueType: dataType.list,
    useType:[useType.form],
    label: "Page分组选择",
    propInfo: {
      datas: {
        label: "Title/List结构的数据",
        sourceType:'api',
        dataType: dataType.pageSelect_list,
        must: true,
      },
      selectType:
      {
        label: "选择维度",
        dataType:dataType.string,
        fixed:{
          dicts: [
          {value:"more",label:"多选"},
          // {value:"one",label:"单选"},
          {value:"typeOne",label:"单选"}
        ],
        }
      },
    },
  },
  QueryBuilder: {
    component:QueryBuilder,
    dataChangeValueType: dataType.string,
    label: "查询条件设计器",
    useType:[useType.form],
    propInfo: {
      datas: {
        label: "实体模型名称",
        dataType: dataType.string,
        sourceType:"field",
        must: true,
      },
    },
  },

  VfEditor: {
    component:VfEditor,
    dataChangeValueType: dataType.string,
    useType:[useType.form],
  },
  VfImage: {
    component:VfImage,
    useType:[useType.form],
    dataChangeValueType: [dataType.string, dataType.list],
    propInfo: {
      datas: {
        label: "已上传",
        dataType:dataType.fileList,
        sourceType:"api"
      },
    },
  },
  SelectIcon:{
    component:SelectIcon,
    useType:[useType.form],
    dataChangeValueType:dataType.string,
    label: "图标选择",
  },
table:{
    dataChangeValueType:dataType.objList,
    label: "数据子集",
    useType:[useType.form],
    component:FormTable,
    propInfo:{
      type:{
        sourceType:"sys",
        label:"实体类",
        dataType:dataType.string,
      }
    }
  }
};
