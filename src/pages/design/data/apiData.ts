
/**
 * API的数据结构
 */
import { Result } from "@src/mvc/base";
import { dataType } from '../data/componentData';

/**
 * 接口参数信息
 * 接口入参接收的应该都是固定值，
 */
export interface  ParamInfo{
  label: string; //参数名称
  sourceType:"fixed"|"dict"|"field" //参数的数据来源
  defValue?:any;//参数默认值
  fixed?:{// sourceType===fixed, 以下固定取值的2种情况
    dicts?:{value:any,label:string}[]//自定义字典
    promise?:()=>Promise<{value:any,label:string}[]>  //api返回的数据
  },  
  dict?:{// sourceType===dict,
    dictCode:string
  },
  must?: boolean; //是否必填,默认不是必须的
}

/**
 * 单个API定义信息
 */
export interface ApiProp{
  label: string; //接口名称
  dataType: dataType; //出参数据类型（接口确应只返回一种类型数据结构，所以这里不是数组）
  dataModel?:string;//实际返回的数据模型类型
  remark?: string; //接口说明
  codeDemo?: any; //返回代码示例(预览时使用)
  api:  (params?: any) =>  Promise<Result<any>>; // 接口
  params?: {
    [key: string]:ParamInfo; 
  }; //接口入参信息定义
};

/**
 * API对象数据结构
 */
export interface ApiDef {
  [key: string]: ApiProp;
}
