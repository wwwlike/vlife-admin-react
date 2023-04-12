import { SysDict } from "../SysDict";

/**
 * 与后台相关对应的基类
 * 
 */

// 数据传输dto
export interface IdBean {
  id: string;
}

/**
 * 支持字典和外键name形成选择项
 */
 export interface IFkItem extends IdBean {
  name: string;
}


export interface ITree extends IdBean {
  code: string;
  pcode: string;
  name: string;
}

//export interface IModel<T extends IdBean>{}
/**
 * 所有模型bean基类，空实现
 */
export interface IModel{}

/**
 * 可当做外键表的实体实现接口
 */
export interface IFkItem extends IdBean{
  name:string;

}

//数据逻辑状态
export interface IStatus {
  status?: string;
}
//数据库实体
export interface DbEntity extends IdBean, IStatus {
  createId?: string; //创建人
  modifyId?: string; //修订人
  createDate?: Date; //创建日期
  modifyDate?: Date; // 修订日期
}
// 后端返回数据封装
export interface Result<D> {
  code: string;
  msg: string;
  data: D | undefined;
}
/**
 * 分页查询条件
 */
export interface PageQuery {
  pager: {
    page: number;
    size: number;
  };
}
/**
 *查询分页结果
 */
export interface PageVo<T extends IdBean> {
  page: number;
  size: number;
  total: number;
  totalPage: number;
  first: boolean;
  lasts: boolean;
  result: T[];
}
export interface VoBean extends IdBean {}
export interface SaveBean extends IdBean {}

/**
 * 查询条件基类
 * 所有field的input查询方式的均可以用search进行联合模糊搜索
 */
export interface BaseRequest {
  search: string; //
}

/**
 * 字典封装的对象信息
 */
export interface TranDict {
  column: string;
  sysDict: Partial<SysDict>[];
}

export enum ItemType{
  entity="entity",
  save="save",
  req="req",
  vo="vo",
  basic="basic",
  list="list",
}

// export interface ModelBase extends  {

// }
/**
 * 模型信息,非数据库
 */
export interface ModelInfo extends IdBean {
  title: string; //模型名称
  type: string;  //模型标识
  itemType: ItemType; //模型类别
  entityType: string; //模型关联实体的标识
  parentsName:string[];//继承和实现的类的名称
}

