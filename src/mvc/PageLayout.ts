
import apiClient from './apiClient'
import {PageVo,DbEntity,Result, VoBean, SaveBean} from './base'
import { PageComponent, PageComponentDto } from './PageComponent';
// 页面布局
export interface PageLayout extends DbEntity{
  name: string;  // 页面名称
  sysUserId: string;  // 对应用户
  sysGroupId: string;  // 对应权限组
}

export interface PageConfDto extends SaveBean{
  id: string; 
  content:Partial< PageComponentDto>[]; 
}
/** 
   * 保存页面布局;
   * @param dto 页面布局;
   * @return 页面布局;
   */
export const savePageConfDto=(dto: PageConfDto): Promise<Result<PageConfDto>>=>{
  return apiClient.post(`/pageLayout/save/pageConfDto`  ,dto  );
};
/** 
   * 明细查询页面布局;
   * @param id 主键id;
   * @return 页面布局;
   */
export const detail=(id: string): Promise<Result<PageConfDto>>=>{
  return apiClient.get(`/pageLayout/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/pageLayout/remove/${id}`  );
};