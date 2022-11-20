import apiClient from "../apiClient";
import { PageVo, DbEntity, PageQuery, Result } from "../base";
// 单个查询统计项目
export interface FormItem extends DbEntity {
  itemType: string; // 项目类型
  code: string; // 查询标识
  entityName: string; // 实体名称
  name: string; // 项目名称
  conditionJson: string; // 查询聚合条件
}
// 工作项查询条件
export interface FormItemPageReq extends PageQuery {
  search: string; // 项目名称
  entityName: string; // 实体名称
}
/**
 * 分页查询单个查询统计项目;
 * @param req 工作项查询条件;
 * @return 单个查询统计项目;
 */
export const page = (
  req: FormItemPageReq
): Promise<Result<PageVo<FormItem>>> => {
  return apiClient.get(`/formItem/page`, { params: req });
};
/**
 * 保存单个查询统计项目;
 * @param dto 单个查询统计项目;
 * @return 单个查询统计项目;
 */
export const save = (dto: FormItem): Promise<Result<FormItem>> => {
  return apiClient.post(`/formItem/save`, dto);
};
/**
 * 明细查询单个查询统计项目;
 * @param id 主键id;
 * @return 单个查询统计项目;
 */
export const detail = (id: string): Promise<Result<FormItem>> => {
  return apiClient.get(`/formItem/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/formItem/remove/${id}`);
};
