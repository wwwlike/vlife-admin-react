import { Input } from "@douyinfe/semi-ui";
import React from "react";
/**
 * 输出类型
 */
enum outType {
  /**
   *字符串
   */
  string = "string",
  /**
   * 布尔类型
   */
  boolean = "string",
}

interface dataType {
  aa: { name: string };
}

interface VfBaseProps<T extends outType, S> {
  /**
   * 反应事件
   */
  onDataChange: (data: T) => void;
  /** 组件需求数据 */
  data?: S; //组件渲染需要得辅助数据,
  //通过接口loadData里得数据取到得数据类型和data是一致得得则可以给该组件使用
  //如果loadData取得得不一致,则需要用formily得适配器进行转换
  /** 字段初始数据 */
  value?: T;
}
/**
 * input属性
 */
interface VfInputProps extends VfBaseProps<outType.string, dataType> {
  valField: string;
}

/**
 * XX组件
 * @prop 参数
 */
const VfInput: React.FC<VfInputProps> = (prop) => {
  return <Input></Input>;
};

export default VfInput;
