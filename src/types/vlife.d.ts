/**
 *实体模型
 */
export interface IdBean {
  id: string;
}
/**
 * 数据库实体模型
 */
export interface DbEntity extends IdBean {
  createDate: Date;
  modifyDate: Date;
  createId: string;
  modifyId: string;
  status: string;
}

/**
 * 查询条件基类
 * 所有field的input查询方式的均可以用search进行联合模糊搜索
 */
export interface BaseRequest {
  search: string; //
}

/**
 * 分页入参模型 (待删除)
 */
export interface Pager extends BaseRequest {
  "pager.page": number;
  "pager.size": number;
}

export interface PageReq {
  pager: { page: number; size: number };
  //   "pager.page": string;
  //   "pager.size": string;
  // }
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

/**
 * 分页结果
 */
export interface Result<D> {
  data: D | undefined;
  msg: string;
  code: string;
}

// /**
//  * 字段信息
//  */
// export interface FieldInfo {
//   type?: string;
//   fieldType: string;
//   fieldName: string;
// }

export interface TranDict {
  column: string;
  sysDict: { val?: string | undefined; title: string }[];
}

/**
 * 模型信息
 */
export interface ModelInfo {
  title: string;
  type: string;
  itemType: string;
  entityType: string;
  fields: fieldInfo[];
}
//字段信息
export interface fieldInfo {
  dataIndex: string; // 字段名
  type: "string" | "number" | "boolean" | "date"; //字段类型 string
  fieldType: "basic" | "list";
  title: string; //中文名
  dictCode?: string; //字典code
  pathName: string; // 全量路径字段
  entityFieldName: string; //数据库模型字段
  entityType: string;
  // 附加属性
  component: string; //使用组件
  labelProps: any; //包装名称层属性
  span: number; //组件栅格数量
  props: {
    //自定义组件需要的属性
    params?: string[]; //loadData需要监听的属性，名称要修改
    loadData?: (obj?: any) => Promise<Result<any[]>>; //异步取数据的方法
    // any各组件独有的属性
    datas?: any[]; //元素单个加载时候给的数据
    syscParams?: string[]; //异步的参数名称集合
    syncDatas?: (obj: any) => Promise<Result<any>>; //组件提取时给的数据
  }; //
}

//表信息
export interface formInfo {
  initData?: any; //传进来的初始化数据
  setFormValues?: (t: any) => void; // 数据传出去
  setError?: () => void; //错误信息传输出去
  hideColumns?: string[]; //需要隐藏的不显示的列
  read?: boolean; //只读模式
  dicts?: TranDict[]; //字典信息
  fkIds?: { fk: string; vals: { id: string; name: string }[] }; // 外键信息
  fields: fieldInfo[]; //表单字段信息
  maxColumns?: number[];
}
