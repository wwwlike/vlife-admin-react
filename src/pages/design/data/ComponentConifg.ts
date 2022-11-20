//最终这个文件应该自动从tsx里分析提取出来
/**
 * dataOut
 */
enum outType {
  string = "string",
  boolean = "string",
}

export interface ComponentAttr {
  /**
   * 组件名称
   */
  name: string;
  /**
   * 数据返回类型(和表单字段匹配)
   */
  outType: outType;
  /**
   * 组件数据需求类型,入参数据类型,必填的和接口出参必须有的
   *
   */
  datas: any;
}
/**
 * 基础组件
 */
export const basicComponent = [];
/**
 * 业务型组件
 */
export const busniessComponent = [];
