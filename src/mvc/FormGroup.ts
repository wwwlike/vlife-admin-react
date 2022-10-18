import apiClient from "./apiClient";
import { PageVo, DbEntity, Result } from "./base";
// 表单容器
export interface FormGroup extends DbEntity {
  component: string; // 容器组件
  code: string; // 组件编号
  pcode: string; // 放置位置
  name: string; // 组名
  sort: string; // 同级序号
}
/**
 * 保存表单容器;
 * @param dto 表单容器;
 * @return 表单容器;
 */
export const save = (dto: FormGroup): Promise<Result<FormGroup>> => {
  return apiClient.post(`/formGroup/save`, dto);
};
/**
 * 明细查询表单容器;
 * @param id 主键id;
 * @return 表单容器;
 */
export const detail = (id: string): Promise<Result<FormGroup>> => {
  return apiClient.get(`/formGroup/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/formGroup/remove/${id}`);
};
