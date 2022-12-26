import qs from "qs";
import apiClient from "../apiClient";
import { DbEntity, Result, SaveBean, VoBean } from "../base";
import { ReportTableItem } from "./ReportTableItem";

// 报表
export interface ReportTable extends DbEntity {
  code: string; // 报表编码
  name: string; // 报表名称
}
// 报表配置视图
export interface ReportTableVo extends VoBean {
  code: string; // 报表编码
  name: string; // 报表名称
  items: ReportTableItem[]; // 报表项目
}

/**
 * 页面选择的临时对象
 */
export interface ReportTableDto extends SaveBean {
  code: string;
  id?: string;
  groupColumn: string;
  func: string;
  name: string;
  itemIds?: string[];
  kpiIds?: string[];
}

/**
 * 保存dto
 */
export interface ReportTableSaveDto extends SaveBean {
  code: string;
  id: string;
  name: string;
  groupColumn: string;
  func: string;
  items: ReportTableItem[];
}
/**
 * 保存报表;
 * @param dto 报表;
 * @return 报表;
 */
export const saveReportTableSaveDto = (
  dto: Partial<ReportTableSaveDto>
): Promise<Result<ReportTableSaveDto>> => {
  return apiClient.post(`/reportTable/save/reportTableSaveDto`, dto);
};
/**
 * 明细查询报表配置视图;
 * @param id 主键id;
 * @return 报表配置视图;
 */
export const detail = (id: string): Promise<Result<ReportTableVo>> => {
  return apiClient.get(`/reportTable/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/reportTable/remove/${id}`);
};

/**
 * 查询所有报表配置
 */
export const listAll = (): Promise<Result<ReportTableSaveDto[]>> => {
  return apiClient.get(`/reportTable/list/all`);
};

/**
 * 报表结果查询
 */
export const report = (params: {
  itemCode?:string[];//统计项目code
  reportCode?: string; //报表code
  groups: string[]; //分组信息
}): Promise<Result<any[]>> => {
  return apiClient.get(
    `/reportTable/report?${qs.stringify(params, {
      allowDots: true,
      arrayFormat: "comma",
    })}`
  );
};


/**
 * 报表结果查询
 */
 export const chart = ({codes,group}: {
  codes: string[]; //报表code
  group: string; //分组信息
}): Promise<Result<any[]>> => {
  return apiClient.get(
    `/reportTable/chart?code=${codes[0]}&group=${group}`
  );
};

/**
 * 单个指标值查询
 */
 export const total = (params: {
  code: string; //报表code
}): Promise<Result<number>> => {
  return apiClient.get(
    `/reportTable/total/${params.code}`
  );
};