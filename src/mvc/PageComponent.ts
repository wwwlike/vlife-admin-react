
import apiClient from './apiClient'
import {PageVo,DbEntity,Result} from './base'
import {  PageComponentPropDto } from './PageComponentProp';
// 单元组件信息
export interface PageComponent extends DbEntity{
  h: number;  // 栅格高度
  x: number;  // 栅格横向位置
  y: number;  // 栅格纵坐标位置
  w: number;  // 栅格宽度
  name: string;  // 单元名称
  pageKey: string;  // 单元编号
  component: string;  // 单元组件类型
  pageLayoutId?: string;  // 组件单元所在页面
}

export interface PageComponentDto extends DbEntity{
  id?:string;
  h: number;  // 栅格高度
  x: number;  // 栅格横向位置
  y: number;  // 栅格纵坐标位置
  w: number;  // 栅格宽度
  name: string;  // 单元命名
  pageKey: string;  // 单元编号/编码
  component: string;  // 单元组件类型
  pageLayoutId?: string;  // 组件单元所在页面
  props?: Partial<PageComponentPropDto>[];// 组件属性信息集合
}

/** 
   * 保存单元组件信息;
   * @param dto 单元组件信息;
   * @return 单元组件信息;
   */
export const saveComponent=(dto: PageComponent): Promise<Result<PageComponent>>=>{
  return apiClient.post(`/pageComponent/save/component`  ,dto  );
};
/** 
   * 明细查询单元组件信息;
   * @param id 主键id;
   * @return 单元组件信息;
   */
export const detail=(id: string): Promise<Result<PageComponent>>=>{
  return apiClient.get(`/pageComponent/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/pageComponent/remove/${id}`  );
};