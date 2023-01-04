import apiClient from "../apiClient";
import { BaseRequest, DbEntity, Result } from "../base";

// 关键指标
export interface ReportKpi extends DbEntity {
  code: string; //指标编码
  formId: string; //所属实体模块
  reportItemId: string; //分子
  reportItemOtherId: string; //分母
  name: string; // 指标名称
}
// 指标查询条件
export interface ReportKpiReq extends BaseRequest {}
/**
 * 列表查询关键指标;
 * @param req 指标查询条件;
 * @return 关键指标;
 */
export const list = (req: ReportKpiReq): Promise<Result<ReportKpi[]>> => {
  return apiClient.get(`/reportKpi/list`, { params: req });
};
/**
 * 保存关键指标;
 * @param dto 关键指标;
 * @return 关键指标;
 */
export const save = (dto: ReportKpi): Promise<Result<ReportKpi>> => {
  return apiClient.post(`/reportKpi/save`, dto);
};
/**
 * 明细查询关键指标;
 * @param id 主键id;
 * @return 关键指标;
 */
export const detail = (id: string): Promise<Result<ReportKpi>> => {
  return apiClient.get(`/reportKpi/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/reportKpi/remove/${id}`);
};

/**
 * 绩效kpi所有数据
 */
export const listAll = (): Promise<Result<ReportKpi[]>> => {
  return apiClient.get(`/reportKpi/list/all`);
};
