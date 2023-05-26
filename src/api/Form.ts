import apiClient from "@src/api/base/apiClient";
import { DbEntity, ItemType,  Result, SaveBean, VoBean } from "@src/api/base";

import {  FormFieldDto, FormFieldVo } from "@src/api/FormField";
import { FormTabDto } from '@src/api/FormTab';

/**
 * DB的模型信息
 */
export interface Form extends DbEntity {
  title: string; //模型名称
  type: string; //标识
  itemType: ItemType// 类型
  entityType: string;
  name: string;
  sort:number; //排序号
  module:string;//模块
  icon:string;//图标
  modelSize:number;//模块大小 12网格里的占比大小
  pageSize:number;//分页大小
  version:number;  //模型版本
  listApiPath:string; //列表请求ts方法地址
  saveApiPath:string; //数据保存ts方法地址
  prefixNo:string;//编号前缀
}

/**
 * 保存的模型结构
 */
export interface FormDto extends SaveBean,Form{
  fields: FormFieldDto[]; //字段信息
  formTabDtos?:FormTabDto[];//页签信息
}

/**
 * 视图展示层的VO模型，包涵
 * 1. java模型 modelInfo
 * 2. 关联表数据 FormDto
 */
export interface FormVo extends VoBean,Omit<FormDto,"fields">  {
  parentsName:string[];//继承和实现的类的名称
  fields: FormFieldVo[]; //字段信息
}


export interface SelectCompVo extends VoBean {
  id: string;
  name: string;
  detailList: { id: string; label: string }[];
}
/**
 * 未编辑的模型信息
 */
export const models = (uiType: string): Promise<Result<FormVo[]>> => {
  return apiClient.get(`/form/models/${uiType}`);
};


export interface formPageReq{ 
  itemType?:"entity"|"save"|"req"|"vo"|"fk"|"relation", //模型类型
  entityType?:string, //关联实体类型
  type?:string,//模型标识
  id?:string,//模型id
  design?:boolean //当前表单是否处于设计模式
}

/**
 * 指定模型及接口的TS代码
 */
 export const tsCode = (entity: string): Promise<Result<string>> => {
  return apiClient.get(`/form/tsCode/${entity}`);
};

/**
 * 未编辑的模型信息
 */
export const model = (params:formPageReq): Promise<Result<FormVo>> => {
  return apiClient.get(`/form/model`, { params });
};

// /**
//  * 原始模型信息
//  */
// export const javaModel = (
//   modelName: string
// ): Promise<Result<ModelInfo>> => {
//   return apiClient.get(`/form/javaModel/${modelName}`);
// };


// /**
//  * 原始模型信息
//  */
//  export const javaModels = (
//  req:formPageReq
// ): Promise<Result<ModelInfo[]>> => {
//   return apiClient.get(`/form/javaModels`,{params:req});
// };


/**
 * db存在的模型信息
 */
 export const list = (
  req:formPageReq
 ): Promise<Result<FormVo[]>> => {
   return apiClient.get(`/form/list`,{params:req});
 };

/**
 * 已发布的所有实体模型
 * @returns
 */
export const entityModels = (): Promise<Result<FormVo[]>> => {
  return apiClient.get(`/form/entityModels`);
};


/**
 * 表单保存
 */
 export const save = (form: Form): Promise<Result<FormDto>> => {
  return apiClient.post(`/form/save`, form);
};

/**
 * 表单保存
 */
export const saveFormDto = (dto: Partial<FormDto>): Promise<Result<FormVo>> => {
  return apiClient.post(`/form/save/formDto`, dto);
};

/**
 * 根据id查询表单详情
 */
export const detailFormVo = ({
  formId,
}: {
  formId: string;
}): Promise<Result<FormVo>> => {
  return apiClient.get(`/form/detail/formVo/${formId}`);
};

/**
 * 统计项选择组件数据请求
 * 考虑去重，SelectCompVo结构在后端封装了，麻烦，应该是有个转换函数，能把后端的转换过来
 * 且目前后端也没有SelectCompVo 对象，故不合理
 */
export const formReportItemAll = (): Promise<Result<SelectCompVo[]>> => {
  return apiClient.get(`/form/formReportItemAll`);
};

export const formReportKpiAll = (): Promise<Result<SelectCompVo[]>> => {
  return apiClient.get(`/form/formReportKpiAll`);
};

/** 
  * 模型初始化
  * @return
  */
 export const init=(id: string): Promise<Result<FormVo>>=>{
  return apiClient.post(`/form/init/${id}`  );
};
