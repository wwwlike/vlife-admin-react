import qs from "qs";
import apiClient from "../apiClient";
import { DbEntity, PageQuery, PageVo, Result } from "../base";

// 报表统计项
export interface ReportItem extends DbEntity {
  code: string; // 项目编码
  fieldName: string; // 聚合字段
  entityType: string; // 所在实体
  formConditionId: string; // 过滤条件
  havingFilter: string; // 聚合过滤条件
  func: string; // 聚合方式
  name: string; // 项目名称
}

// 报表统计项
export interface ReportItemCompVo extends DbEntity {
  label: string;
  value: string;
}

// 报表统计项
export interface ReportItem extends DbEntity {
  code: string; // 项目编码
  fieldName: string; // 聚合字段
  entityType: string; // 所在实体
  formConditionId: string; // 过滤条件
  havingFilter: string; // 聚合过滤条件
  func: string; // 聚合方式
  name: string; // 项目名称
}

// 工作项查询条件
export interface ReportItemPageReq extends PageQuery {
  search: string; // 统计项名称/编码
  formId: string; // 所在模型
}

/**
 * 保存报表统计项;
 * @param dto 报表统计项;
 * @return 报表统计项;
 */
export const save = (dto: ReportItem): Promise<Result<ReportItem>> => {
  return apiClient.post(`/reportItem/save`, dto);
};
/**
 * 明细查询报表统计项;
 * @param id 主键id;
 * @return 报表统计项;
 */
export const detail = (id: string): Promise<Result<ReportItem>> => {
  return apiClient.get(`/reportItem/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/reportItem/remove/${id}`);
};

/**
 * 分页查询单个查询统计项目;
 * @param req 工作项查询条件;
 * @return 单个查询统计项目;
 */
export const page = (
  req: ReportItemPageReq
): Promise<Result<PageVo<ReportItem>>> => {
  return apiClient.get(`/reportItem/page`, { params: req });
};

/**
 * 分页查询单个查询统计项目;
 * @param req 工作项查询条件;
 * @return 单个查询统计项目;
 */
export const listAll = (
  req?: ReportItemPageReq
): Promise<Result<ReportItem[]>> => {
  return apiClient.get(
    `/reportItem/list/all?${qs.stringify(req, {
      allowDots: true, //多级对象转str中间加点
      arrayFormat: "comma", //数组采用逗号分隔 ,这里转换不通用，get查询都需要这样转换
    })}`
  );
};

export const test = (req: { aa: string }): Promise<Result<string>> => {
  return apiClient.get(
    `/reportItem/test?${qs.stringify(req, {
      allowDots: true, //多级对象转str中间加点
      arrayFormat: "comma", //数组采用逗号分隔 ,这里转换不通用，get查询都需要这样转换
    })}`
  );
};
