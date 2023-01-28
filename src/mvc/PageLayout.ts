
import apiClient from './apiClient'
import {PageVo,DbEntity,Result, VoBean, SaveBean} from './base'
import { PageComponent, PageComponentDto } from './PageComponent';
// 页面布局
export interface PageLayout extends DbEntity{
  name: string;  // 页面名称
  url: string;  // 路由地址
  auth: boolean;  // 是否需要权限
  module:boolean; //是否实模块页面
  h:number; //组件页面高度
  img:string;//预览图片
  componentOver:boolean;//内部组件支持覆盖
}

export interface PageConfDto extends SaveBean{
  id: string; 
  name:string;
  url:string;
  auth:boolean;
  h:number;
  img:string;//预览图片
  module:boolean; //是否实模块页面
  componentOver:boolean;//内部组件支持覆盖
  content?:PageComponentDto[]; //布局元素组件配置集合信息
}
/** 
   * 保存页面布局;
   * @param dto 页面布局;
   * @return 页面布局;
   */
export const savePageConfDto=(dto: Partial< PageConfDto>): Promise<Result<PageConfDto>>=>{
  return apiClient.post(`/pageLayout/save/pageConfDto`  ,dto  );
};
/** 
   * 明细查询页面布局;
   * @param url 路由地址;
   * @return 页面布局;
   */
export const detail=(url: string): Promise<Result<PageConfDto>>=>{
  return apiClient.get(`/pageLayout/detail/${url}`  );
};
/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/pageLayout/remove/${id}`  );
};


/** 
 * 全部自定义配置页面
 */
 export const listAll=(): Promise<Result<PageLayout[]>>=>{
  return apiClient.get(`/pageLayout/list/all`  );
};