import apiClient from "./apiClient";
import { PageVo, DbEntity, Result } from "./base";
// 文件存储
export interface SysFile extends DbEntity {
  fileName: string; // 存放文件名
  size: string; // 文件大小
  name: string; // 原文件名
  url: string; // 访问地址
  viewMode: string; // 文件展现形式
}

/**
 * 明细查询文件存储;
 *
 * @param id 主键id;
 * @return 文件存储;
 */
export const detail = (id: string): Promise<Result<SysFile>> => {
  return apiClient.get(`/sysFile/detail/${id}`);
};
/**
 * 保存文件存储;
 *
 * @param dto 文件存储;
 * @return 文件存储;
 */
export const save = (dto: SysFile): Promise<Result<SysFile>> => {
  return apiClient.post(`/sysFile/save`, dto);
};
/**
 * 逻辑删除;
 *
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/sysFile/remove/${id}`);
};
