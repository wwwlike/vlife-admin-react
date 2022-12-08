import VVV from '@src/components/form/VVV';
import { Form } from "@src/mvc/model/Form";
import { SysArea } from '@src/mvc/SysArea';
import { SysFile } from '@src/mvc/SysFile';
import { ReactNode } from 'react';
import { Interface } from "readline";

/**
 * 1. field.type,和field.fieldType和它进行匹配
 * 2. 自定义接口返回类型使用它进行匹配
 */
export enum dataType {
  string = "string",
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
  type?: "relation" | "dict";
  icon?:any,//组件图标表示
  w?: number,//组件grid布局宽度
  h?: number,//组件grid布局高度
  component?:any,
  //用于和字段 field.type进行匹配，在范围里则可以使用组件
  dataChangeValueType?: any | any[];
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
    sourceType: "fixed" | "api" | "api_dict" | "api_realation" | "field"; // 属性来源 去掉来源
    fixed?: string; //固定匹配值值=>sourceType=fixed
    field?: string; //固定匹配指定表单字段 sourceType=field
    api?: string; //api组件对应
    apiParams?: {
      //api组件
      [paramName: string]: {
        //参数标识
        sourceType: "field" | "fixed" | "dict"; // 取值来源(字段关联,固定传值)
        field?: string; //匹配字段
        fixed?: string; // 匹配接口
      };
    }; //接口
  };
}

interface T<S>{
  t:S;
}

export interface  PropInfo{
    label?: string; //属性名称，没有则默认等于key
    dataType?: any | any[]|Number|String; //属性字段类型，这里决定组件可以用什么类型的接口，因为组件属性支持多种类型
    dataSub?:PropDef //下一级数据的定义信息  这样就试吃嵌套了
    must?: boolean; //是否必填,默认不是必须的
    dict?: { [key: string]: string }; //字典类型设置，在前端以下拉框形式展示
}
/**
 * 属性定义
 */
export interface PropDef {
  //属性编码,datas树型
  [key: string]: PropInfo| string; //字符串就是写死的树型值
}


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
    dataChangeValueType: dataType.string,
  },
  SearchInput: {
    dataChangeValueType: dataType.string,
    label: "搜索组件",
    remark: "用于搜索，防抖动延迟搜索组件",
  },
  SelectTag: {
    dataChangeValueType: [dataType.string, dataType.integer, dataType.list],
    type: "dict",
    propInfo: {
      datas: {
        label: "字典数据",
        dataType: dataType.val_title_list, //要选来源（接口，接口的参数）2步设置，对于这种明确的需要一次设置成
        must: true,
      },
    },
  },
  InputNumber: {
    dataChangeValueType: dataType.integer,
  },
  VfSelect: {
    label: "下拉选择",
    dataChangeValueType: [dataType.string, dataType.integer],
    type: "dict",
    remark: "支持字典项选择和外键选择(数据量不要太大了)",
    propInfo: {
      datas: {
        label: "option数据",
        dataType: [dataType.id_name_list, dataType.code_name_list], //要选来源（接口，接口的参数）2步设置，对于这种明确的需要一次设置成
        must: true,
      },
      valField: {
        label: "值字段",
        dataType: dataType.string,
      },
      labelField: {
        label: "展示字段",
        dataType: dataType.string,
        must: true,
      },
    },
  },
  RelationTagInput: {
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
    label: "日期",
    dataChangeValueType: dataType.date,
  },
  ResourcesSelect: {
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
        dict: {
          more: "多选",
          one: "单选",
          typeOne: "一组一个",
        },
      },
    },
  },
  QueryBuilder: {
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
    dataChangeValueType: dataType.string,
  },
  VfImage: {
    dataChangeValueType: [dataType.string, dataType.list],
    propInfo: {
      datas: {
        label: "已上传图片信息",
        dataType: [Array<SysFile>]
      },
    },
  },
  SelectIcon:{
    dataChangeValueType:dataType.string,
    label: "图标选择",
  }
};
