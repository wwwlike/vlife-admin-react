/**
 * 可以考虑一个组件一个配置信息；或者把配置信息写入到组件内部；
 */
 import {
  DatePicker as SemiDatePicker,
  Input as SemiInput,
  TextArea as SemiTextArea,
} from "@douyinfe/semi-ui";

import { connect, mapReadPretty } from '@formily/react';
import { InputNumber, PreviewText, Select } from '@formily/semi';
import VData from '@src/components/form/VData';
import QueryBuilder from '@src/components/queryBuilder';
import GroupSelect from '@src/components/vlifeComponent/GroupSelect';
import RelationTagInput from '@src/components/vlifeComponent/RelationTagInput';
import ResourcesSelect from '@src/components/vlifeComponent/ResourcesSelect';
import SearchInput from '@src/components/vlifeComponent/SearchInput';
import SelectIcon from '@src/components/vlifeComponent/SelectIcon';
import SelectTag from '@src/components/vlifeComponent/SelectTag';
import VfEditor from '@src/components/vlifeComponent/VfEditor';
import VfImage from '@src/components/vlifeComponent/VfImage';
import VfTreeInput from '@src/components/vlifeComponent/VfTreeInput';
import VfTreeSelect from '@src/components/vlifeComponent/VfTreeSelect';

const Input = connect(SemiInput, mapReadPretty(PreviewText.Input));
const TextArea = connect(SemiTextArea, mapReadPretty(PreviewText.Input));
const DatePicker = connect(SemiDatePicker, mapReadPretty(PreviewText.Input));
import { SysFile } from '@src/mvc/SysFile';

export type sourceType='fixed'|'api'|'field'|'dict'|'sys'|'table'
/**
 * 1. field.type,和field.fieldType和它进行匹配
 * 2. 自定义接口返回类型使用它进行匹配
 */
export enum dataType {
  icon="Icon",//图片类型数据，其实也是字符串;
  dictList="dictList",//字典集合类型数据；
  string = "string",
  object="object",
  number="number",
  stringList="string_list",
  integer = "integer",
  list = "list",
  date = "date",
  code_name_list = "code_name_lsit", //编码name数据结构
  id_name_list = "id_name_list", //规范:标识为idName对象的数组
  val_title_list = "val_title_list", //规范:标识为idName对象的数组
  VfTree_list = "vfTree_list", // 属性结果数据，包含 id,code,pcode,name
  resources_list = "resources_list", //资源类型的数组
  pageSelect_list = "group_list", //页面分级选择的数据结构   { name: string; detailList: { label: string; value: string }[] }[]
  formVo = "formVo", //单个表单信息
}


export interface  ComponentInfo  {
  label?: string; //组件名称
  //组件分类 dict=> 要求字段dictcode有值；可以直接让组件和字典匹配，其他的都不用选择了 ； relation要求字段id结尾，
  // type?: "relation" | "dict";
  icon?:any,//组件图标表示
  w?: number,//组件grid布局宽度
  h?: number,//组件grid布局高度
  component:any,//组件
  //用于和字段 field.type进行匹配，在范围里则可以使用组件
  dataChangeValueType?: dataType | dataType[];  //数组表示支持其中一个即可
  //组件说明
  remark?: string;
  //组件属性对象信息
  propInfo?: PropDef;
};
export interface ComponentDef {
  //组件编码code
  [key: string]:ComponentInfo
}

/**
 * 字段属性设置的结果信息
 */
export interface ComponentSetting {
  //属性标识
  [propName: string]: {
    // 组件数据来源是 "api_dict"，是api的一种，会自动设置用指定的 api，然后只用选择api需要的code（这个字典select也封装好了）
    // 数据来源是 api_findName,也是指定选择用findNameapi,只能
    // sourceType: "fixed" | "api" | "api_dict" | "api_realation" | "field"; // 属性来源 去掉来源
    sourceType:sourceType,
    fixed?: string; //固定匹配值值=>sourceType=fixed
    field?: string; //固定匹配指定表单字段 sourceType=field
    api?: string; //api组件对应
    apiParams?: {
      //api组件
      [paramName: string]: {
        //参数标识
        // sourceType: "field" | "fixed" | "dict"; // 取值来源(字段关联,固定传值)
        sourceType:sourceType,
        field?: string; //匹配字段
        fixed?: string; // 匹配接口
      };
    }; //接口
  };
}


export const fullSourceType={
  "api":"接口取值",
  "fixed":"固定值",
  "sys":"系统变量",
  "field":"字段取值",
  "dict":"字典取值"
}



export interface  PropInfo{
    label?: string; //属性名称，没有则默认等于key
    dataType:dataType, //属性字段类型，这里决定组件可以用什么类型的接口，因为组件属性支持多种类型
    // type?:VfType;// 数据类型，启用后删除
    sourceType?:sourceType //[]|sourceType, //属性数据来源执行，执行了则不用在页面选择,需要调整成指定一个来源 不填写默认就是fixed
    fixed?:{// sourceType===fixed, 以下固定取值的2种情况
      dicts:{value:any,label:string}[]//自定义字典
    },
    dict?:{// sourceType===dict,
      dictCode:string
    },
    table?:{ //2 来源实体表的某行记录值，会去访问`${tableName}/list/all`
      entityName:string, //表名
      valField?:string, //值字典
      labelField?:string, //label字段
      table_req?:any, //入参 
    }

    // sourceTyepDetail?:{//不同数据源对象取值时进行进一步设置时的字段。
    //   //dict_字典取值时的入参
    //   fixed_dictCode?:string //固定值时取的字典分类
    //   dict_code?:string,//sourceTypedict时 字典取值时编码
    //   // table时的入参，对应实体需要有listAll方法
    //   table_entityName?:string,//查询实体
    //   table_req?:any, //查询条件
    //   table_valField?:string,//取值val字段
    //   table_labelField?:string,// 取值label字段
    // },//具体来源指定 dict指定底朝天Code，fixed：可选指定从指定表字段取值    
    dataSub?:PropDef //下一级数据的定义信息 能支持嵌套一集了
    must?: boolean; //是否必填,默认不是必须的
    dicts?: { [key: string]: string }; //字典类型设置，在前端以下拉框形式展示,待移入到 sourceTypeDetail里去
}
/**
 * 属性定义
 */
export interface PropDef {
  //属性编码,datas树型
  [key: string]: PropInfo| string; //字符串就是写死的树型值
}

/**
 * 
 * @param def 返回组件指定属性的数据类型
 * @param propName 组件属性
 * @param subName  二级属性
 * @returns 
 */
export const getDataType=(def:ComponentInfo,propName:string,subName?:string):any=>{
  if(def.propInfo){
  const propObj:PropInfo=def.propInfo[propName] as PropInfo
  if(subName && propObj.dataSub){
   return  (propObj.dataSub[subName] as PropInfo).dataType
  }else{
  return   propObj.dataType
  }
}
  return null;
}
/**
 * 组件信息
 */
export const ComponentInfo: ComponentDef = {
  VData: {
    component:VData,
    label: "页面选择组件",
    dataChangeValueType: dataType.string,
    propInfo: {
      data: {
        label: "IDNAME数组",
        dataType: dataType.id_name_list,
        must: false,
      },
      data1: {
        label: "数组2形式",
        dataType: dataType.id_name_list,
        must: false,
      },
      name: {
        label: "姓名",
        dataType: dataType.string,
        must: false,
      },
    },
  },
  Input: {
    component:Input,
    dataChangeValueType: dataType.string,
  },
  SearchInput: {
    component:SearchInput,
    dataChangeValueType: dataType.string,
    label: "搜索组件",
    remark: "用于搜索，防抖动延迟搜索组件",
  },
  SelectTag: {
    label:"tag标签(字典)",
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
    dataChangeValueType: dataType.integer,
  },
  VfSelect_DICT: {
    component:Select,
    label: "字典下拉框",
    dataChangeValueType: [dataType.string, dataType.number,dataType.list],
    remark: "支持字典项选择和外键选择(数据量不要太大了)",
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
  VfSelect_Entity: {
    component:Select,
    label: "表数据下拉框",
    dataChangeValueType: [dataType.string, dataType.number,dataType.list],
    propInfo: {
      optionList:{//optionList的数据需要确定是哪张表的数据进行下拉选择
        label:"实体表",
        sourceType:"table",
        dataType:dataType.string,// fixed里
        table:{
          entityName:"form",
        }
        // sourceTyepDetail:{
        //   table_entityName:"reportItem",
        //   table_valField:"code",
        //   table_labelField:"name"
        // }
      },
      valField:"id",
      labelField:"name",
    },
  },
  RelationTagInput: {
    component:RelationTagInput,
    label: "关联弹框选择",
    dataChangeValueType: [dataType.string, dataType.list],
    propInfo: {
      datas: {
        label: "已选择数据",
        dataType: dataType.id_name_list, //要选来源（接口，接口的参数）2步设置，对于这种明确的需要一次设置成
        must: false,
      },
    },
  },
  VfTreeSelect: {
    component:VfTreeSelect,
    label: "树型查询组件",
    dataChangeValueType: dataType.string,
    propInfo: {
      datas: {
        label: "VfTree结构化数据",
        dataType: dataType.VfTree_list,
        must: true,
      },
      valField: "code",
    },
  },
  DatePicker: {
    component:DatePicker,
    label: "日期",
    dataChangeValueType: dataType.date,
  },
  ResourcesSelect: {
    component:ResourcesSelect,
    label: "资源选择",
    dataChangeValueType: dataType.list,
    propInfo: {
      datas: {
        label: "资源信息",
        dataType: dataType.resources_list,
        must: true,
      },
    },
  },
  VfTreeInput: {
    component:VfTreeInput,
    label: "树型选择组件",
    dataChangeValueType: dataType.string,
    propInfo: {
      datas: {
        label: "VfTree结构化数据",
        dataType: dataType.VfTree_list,
        must: true,
      },
      valField: {
        label: "取值字段",
        dataType: dataType.string,
        must: true,
      },
    },
  },
  GroupSelect: {
    component:GroupSelect,
    dataChangeValueType: dataType.list,
    label: "Page分组选择",
    propInfo: {
      datas: {
        label: "Title/LIst结构的数据",
        dataType: dataType.pageSelect_list,
        must: true,
      },
      selectType: {
        label: "选择维度",
        dataType:dataType.string,
        fixed:{dicts: [
          {value:"more",label:"多选"},
          {value:"one",label:"单选"},
          {value:"typeOne",label:"一组一个"}
        ],
        }
      },
    },
  },
  QueryBuilder: {
    component:QueryBuilder,
    dataChangeValueType: dataType.string,
    label: "查询条件设计器",
    propInfo: {
      datas: {
        label: "实体模型信息",
        dataType: dataType.formVo,
        must: true,
      },
    },
  },

  VfEditor: {
    component:VfEditor,
    dataChangeValueType: dataType.string,
  },
  VfImage: {
    component:VfImage,
    dataChangeValueType: [dataType.string, dataType.list],
    propInfo: {
      datas: {
        label: "已上传图片信息",
        // dataType: [Array<SysFile>]
        dataType:dataType.list
      },
    },
  },
  SelectIcon:{
    component:SelectIcon,
    dataChangeValueType:dataType.string,
    label: "图标选择",
  }
};
