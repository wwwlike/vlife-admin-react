import Search from "@src/components/search";
import Table from "@src/components/table";
import Form from "@src/components/form";
import { FormFieldVo } from "@src/mvc/model/FormField";

/**
 * 字段类型
 */
export enum VfType {
  STRING = "string",
  ARRAY = "list",
}

export interface VfTree {
  code: string;
  pcode: string;
  name: string;
  id: string;
}

/**
 * 支持字典和外键name形成选择项
 */
export interface VfDict {
  val: string;
  title: string;
}
export interface VfRelation {
  id: string;
  name: string;
}
export interface VfCode {
  code: string;
  name: string;
}
/**
 * vlife组件属性基类
 */
export interface VfBaseProps<T, D> {
  //字段名
  fieldName: string;
  //字段初始值
  value: T;
  //数据传出来事件
  onDataChange: (data: T | undefined) => void;
  //组件渲染需要得异步数据
  datas?: D;
  // 表态只读状态
  read: boolean;
  //组件字段信息
  fieldInfo: FormFieldVo;
  className?:string;
}

export interface VfBaseViewProps<D>{
  data:D;
  
}
/**
 * vlife的组件库
 */
export { Search, Table, Form };
