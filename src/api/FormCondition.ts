import { DbEntity, PageQuery, PageVo, Result } from "@src/api/base";
import apiClient from "@src/api/base/apiClient";
// 查询过滤条件
export interface FormCondition extends DbEntity {
  formId: string; // 实体模型id
  entityType: string; // 实体类型
  name: string; // 查询名称
  conditionJson: string; // 查询条件(JSON)
}
//过滤条件的查询模型
export interface FormConditionPageReq extends PageQuery {
  search: string;
  formId: string;
}
/**
 * 保存查询过滤条件;
 * @param dto 查询过滤条件;
 * @return 查询过滤条件;
 */
export const save = (dto: FormCondition): Promise<Result<FormCondition>> => {
  return apiClient.post(`/formCondition/save`, dto);
};
/**
 * 明细查询查询过滤条件;
 * @param id 主键id;
 * @return 查询过滤条件;
 */
export const detail = (id: string): Promise<Result<FormCondition>> => {
  return apiClient.get(`/formCondition/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/formCondition/remove/${id}`);
};

/**
 * 过滤条件分页查询
 */
export const page = (
  req: FormConditionPageReq
): Promise<Result<PageVo<FormCondition>>> => {
  return apiClient.get(`/formCondition/page`, { params: req });
};


/**
 * 指定模块字段全量查询
 * 后期支持查询指定字段类型
 */
 export const listAll = (params: {
  formId: string;
}): Promise<Result<FormCondition>> => {
  return apiClient.get(`/formCondition/list/all?formId=${params.formId}`);
};
