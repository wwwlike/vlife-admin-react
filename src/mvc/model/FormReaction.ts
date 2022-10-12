import apiClient from '@src/mvc/apiClient'
import { PageVo, DbEntity, Result, VoBean } from '@src/mvc/base'
// 表单响应
export interface FormReaction extends DbEntity {
  formEventId: string // 触发的事件
  formFieldId: string // 响应字段
  reactionAttr: string // 响应属性
  reactionValue: string // 响应值
}

export interface FormReactionVo extends VoBean {
  // depsFieldName: string //依赖的字段
  // depsAttr: string //字段属性
  // depsEventType: string //事件
  // depsVal: string //字段值域
  fieldName: string
  formFieldId: string // 响应字段
  reactionAttr: string // 响应属性
  reactionValue: string // 响应值
}
/**
 * 保存表单响应;
 * @param dto 表单响应;
 * @return 表单响应;
 */
export const save = (dto: FormReaction): Promise<Result<FormReaction>> => {
  return apiClient.post(`/formReaction/save`, { params: dto })
}
/**
 * 明细查询表单响应;
 * @param id 主键id;
 * @return 表单响应;
 */
export const detail = (id: string): Promise<Result<FormReaction>> => {
  return apiClient.get(`/formReaction/detail/${id}`)
}
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/formReaction/remove/${id}`)
}
