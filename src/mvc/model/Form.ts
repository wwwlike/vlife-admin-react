import apiClient from "../apiClient";
import { DbEntity, ModelInfo, Result, SaveBean, VoBean } from "../base";
import { FormGroup } from "../FormGroup";
import { FormField, FormFieldDto, FormFieldVo } from "./FormField";

export interface Form extends DbEntity {
  title: string;
  type: string;
  itemType: string;
  entityType: string;
  gridSpan: number;
  name: string;
}

export interface FormDto extends SaveBean {
  title?: string;
  type?: string;
  itemType?: string;
  entityType?: string;
  uiType: string;
  gridSpan?: number;
  name?: string;
  fields?: Partial<FormFieldDto>[];
  groups?: FormGroup[];
}

export interface FormVo extends VoBean {
  title: string;
  type: string;
  uiType: string;
  itemType: string;
  entityType: string;
  gridSpan: number;
  name: string;
  fields: FormFieldVo[];
  groups: FormGroup[];
  parentsName:string[];
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

/**
 * 未编辑的模型信息
 */
export const model = (params: {
  uiType: string;
  modelName: string;
}): Promise<Result<FormVo>> => {
  return apiClient.get(`/form/model/`, { params });
};

/**
 * 原始模型信息
 */
export const javaModel = (
  modelName: string
): Promise<Result<ModelInfo>> => {
  return apiClient.get(`/form/javaModel/${modelName}`);
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
 */
export const formReportItemAll = (): Promise<Result<SelectCompVo[]>> => {
  return apiClient.get(`/form/formReportItemAll`);
};

export const formReportKpiAll = (): Promise<Result<SelectCompVo[]>> => {
  return apiClient.get(`/form/formReportKpiAll`);
};
