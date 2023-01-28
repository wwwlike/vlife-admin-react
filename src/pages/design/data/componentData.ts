/**
 * 组件的数据结构
 */

import { DbEntity } from '@src/mvc/base';

export type sourceType='fixed'|'field'|'dict'|'sys'|'api'
/**
 * 1. field.type,和field.fieldType和它进行匹配
 * 2. 自定义接口返回类型使用它进行匹配
 * 3. 需要dataType进行瘦身
 */
export enum dataType {
  event="event", //事件数据类型
  page="page",//分页数据
  icon="Icon",//图片类型数据，其实也是字符串;
  image="image",
  dictList="dictList",//字典集合类型数据；
  fileList="file,file_list",//文件实体
  string = "string",
  boolean="boolean",
  object="object",
  number="number",
  stringList="string_list",
  integer = "integer",
  double="double",
  list = "string_list",
  objList="list",
  date = "date",
  dateList="date_list",
  label_value_list="label_value_list",
  code_name_list = "code_name_lsit", //编码name数据结构
  resourcesCode_name_list="resourcesCode_name_list",
  entityType_name_list="entityType_name_list",
  fieldName_title_list="fieldName_title_list",
  id_name_list = "id_name_list", //规范:标识为idName对象的数组
  val_title_list = "val_title_list", //规范:标识为idName对象的数组
  VfTree_list = "vfTree_list", // 属性结果数据，包含 id,code,pcode,name
  resources_list = "resources_list", //资源类型的数组
  pageSelect_list = "group_list", //页面分级选择的数据结构   { name: string; detailList: { label: string; value: string }[] }[]
  formVo = "formVo", //单个表单信息
}
export enum useType {
  form,query,view
}

/**
 * 单个组件的数据结构信息
 */
export interface  ComponentInfo  {
  label?: string; //组件名称
  icon?:any,//组件表示图标
  w?: number,//组件在grid布局里的宽度
  h?: number,//组件在grid布局里的高度
  component:any,//组件
  useType?:useType[]|useType //组件使用场景
  //组件onChange时间返回的数据类型，一般是和filed=> fieldType,field进行匹配，在范围里则可以使用组件
  // FieldComponentSetting里的check有相关逻辑
  dataChangeValueType?: dataType | dataType[];  
  //组件使用说明
  remark?: string;
  //组件属性对象定义信息
  propInfo?: PropDef;
};

/**
 * 封装所有组件的对象定义
 */
export interface ComponentDef {
  //组件编码code
  [key: string]:ComponentInfo
}


/**
 * 组件属性的定义信息
 * 属性要能支持事件
 */
export interface  PropInfo{
    label?: string; //属性名称，没有则默认等于key
    dataType:dataType, //属性字段类型，这里决定组件可以用什么类型的接口，因为组件属性支持多种类型
    dataModel?:string[],// 能支持的数据类型
    sourceType?:sourceType //[]|sourceType, //属性数据来源执行，执行了则不用在页面选择,需要调整成指定一个来源 不填写默认就是fixed
    fixed?:{// sourceType===fixed, 以下固定取值的2种情况
      dicts?:{value:any,label:string}[]//自定义字典
      promise?:()=>Promise<{value:any,label:string}[]> //api返回的数据
    },
    dict?:{// sourceType===dict,
      dictCode:string
    },
    sys?:{
      key?:"fieldType"
    },
    otherData?: { [key:string]: (otherData:any)=>any }, //其他类型的数据， 对应的转换方法(dataType)
    dataSub?:PropDef //下一级数据的定义信息 能支持嵌套一集了
    must?: boolean; //是否必填,默认不是必须的

    //思考form里是否有相关使用场景，那么该如何处理；
    // dataType ==='event' //需要给该事件的方法体里选择一个函数；
    event?:{
      params?:{//出参就是api的入参， api包涵就可以使用
          [name:string]:dataType} ;// 出参参数名
          // label:string,//出参中文名称
          // dataType:dataType, //出参类型
          // defaultValue?:any;//默认值参数值
          //事件调用哪个方法 paramName 给到事件的哪个参数？
          //方法最后得到的值 给到 prop里的哪个
        //回调得到的值给到哪个属性上
      propName?:string; //api数据付给到哪个属性上
    } 
}

/**
 * 属性封装对象
 */
export interface PropDef {
  //属性编码,datas树型
  [key: string]: PropInfo| string; //字符串就是写死的树型值
}

/**
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