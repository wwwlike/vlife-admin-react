
import apiClient from './apiClient'
import {PageVo,DbEntity,Result, SaveBean} from './base'
import { PageApiParam } from './PageApiParam';
// 组件属性
export interface PageComponentProp extends DbEntity{
  pageComponentId: string;  // 所属组件
  sourceType: string;  // 属性值来源
  propVal: string;  // 属性值
  propName: string;  // 属性名称
  listNo:number; //排序号
  subName:string;//子属性
  apiMethod:string;//数据转换方法
}


export interface PageComponentPropDto extends SaveBean{
  pageComponentId: string;  // 所属组件
  sourceType: string;  // 属性值来源
  propVal: string;  // 属性值
  propName: string;  // 属性名称
  listNo:number; //排序号
  subName:string;//子属性
  apiMethod:string;//数据转换方法
  params:PageApiParam[]; 
  
}


/** 
   * 保存组件属性;
   * @param dto 组件属性;
   * @return 组件属性;
   */
export const saveComponentProp=(dto: PageComponentProp): Promise<Result<PageComponentProp>>=>{
  return apiClient.post(`/pageComponentProp/save/componentProp`  ,dto  );
};
/** 
   * 明细查询组件属性;
   * @param id 主键id;
   * @return 组件属性;
   */
export const detail=(id: string): Promise<Result<PageComponentProp>>=>{
  return apiClient.get(`/pageComponentProp/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/pageComponentProp/remove/${id}`  );
};