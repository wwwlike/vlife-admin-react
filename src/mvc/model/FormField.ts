import { Schema } from "@formily/react";
import apiClient from "@src/mvc/apiClient";
import { DbEntity, Result, VoBean } from "@src/mvc/base";
// import { ComponentSetting } from "@src/pages/design/fieldSetting/componentData";
import { PageComponentPropDto } from '../PageComponentProp';
import { FormEventVo } from "./FormEvent";
import { FormReactionVo } from "./FormReaction";

// 列表字段
export interface FormField extends DbEntity {
  name: string; // ==title
  formId: string; // 所属表单
  formGroupCode: String; //所属上一级容器
  pathName: string; // 全路径
  fieldName: string; // 字段名
  entityType: string; //字段实体模型名称
  entityFieldName: string; //数据库模型字段
  componentType: string; //组件类型（基础组件，业务组件）
  description: string; // 描述
  readOnly: boolean; // 只读
  sort: number; // 顺序
  type: string; // 元素类型
  title: string; // 标题
  required: boolean; // 必填
  initialValues: string; // 默认值
  component: string; // 采用组件
  dictCode: string; // 字典的coden
  dataIndex: string; // formliy里的字段名称，默认一致
  x_decorator: string; // 包裹组件
  x_hidden: boolean; // 隐藏
  disabled: boolean; // 禁用
  fieldType: string; // 字段类型
  x_decorator_props$gridSpan: number; //包裹元素所占grid列数
  x_component_props$placeholder: string; //input填写说明
  x_decorator_props$layout: string; //标签位置
  x_decorator_props$labelAlign: string; //标签对齐方式
  x_validator: string; //校验方式
  vlife_pattern: string; //正则校验
  vlife_message: string; //校验不通过提醒
  listShow: boolean; //列表展示
  componentSettingJson: string;
}

// 字段dto
export interface FormFieldDto extends FormField {
  //字段对应组件属性设置信息集合
   pageComponentPropDtoList?: Partial<PageComponentPropDto>[];
}

/**
 * 字段级组件会固定接收的属性信息，
 * 后台接口根据需求进行设计是否都需要
 */
export interface componentProps {
  /** 模块名称 */
  entityName: string;
  /** 字段所在模型名称 */
  modelName: string;
  /** 字段名称 */
  fieldName?: string; //组件字段 fieldId
  /** 字段实体类(真实值来源所在的实体) */
  fieldEntityType: String;
  /** from修改查看时行记录id */
  id?: string;
  /** 字段值 */
  val?: string | string[];
}

/**
 * 异步组件得相关属性
 */
export interface loadData {
  /** 组件渲染需要的数据库数据 */
  datas?: any[];
  /** 异步取datas的接口 */
  loadData: (params: componentProps | any) => Promise<Result<any>>;
  /** loadData固定的入参，在formPage模块提取数据，传入到loadData方法里 */
  params?: any;
  /** 自定义组件需的固定的prop参数 */
  props?: any;
  /** 接口动态入参（级联组件异步拉取数据时候使用）=>form/index里进行异步数据提取（reactions方式）
   * 动态入参数据基本都是从组件里的字段提取出来，不同组件字段命名存在不一的情况，故在这里有一个配置对应的Json设置
   * modelName: { formItem: "entityName" }, => 表示 接口的入参modelName,对应formItem实体的 entityName字段
   * */
  dynamic?: { [interfaceParamsName: string]: { [key: string]: string } };
}
/**
 * 字段模型属性
 */
export interface FormFieldVo extends VoBean, Schema {
  [key: string]: any; // 实现可以赋值任意字段
  name: string; // ==title
  formId: string; // 所属表单
  pathName: string; // 全路径
  fieldName: string; // 字段名
  entityType: string; //字段实体模型名称
  entityFieldName: string; //数据库模型字段
  componentType: string; //组件类型（基础组件，业务组件）
  description: string; // 描述
  readOnly: boolean; // 只读
  sort: number; // 顺序
  type: string; // 元素类型
  title: string; // 标题
  required: boolean; // 必填
  initialValues: string; // 默认值
  x_component: string; // 采用组件
  dictCode: string; // 字典的coden
  dataIndex: string; // formliy里的字段名称，默认一致
  x_decorator: string; // 包裹组件
  x_hidden: boolean; // 隐藏
  disabled: boolean; // 禁用
  fieldType: string; // 字段类型
  x_decorator_props$gridSpan: number; //字段所占列数
  x_component_props$placeholder: string; //input填写说明
  x_decorator_props$layout: string; //标签位置
  x_decorator_props$labelAlign: string; //标签对齐方式
  apiKey: string; // 自定义展示组件需要调用的api关键字(名称)，去loadData.ts里换取实际api接口对象
  x_validator: string; //校验方式
  vlife_pattern: string; //正则校验
  vlife_message: string; //校验不通过提醒
  listShow: boolean; //列表展示
  //--- vo注入字段
  events: FormEventVo[]; //当前field触发的事件
  reactions: FormReactionVo[]; //字段的查询条件
  loadDatas: loadData; // 异步加载数据的相关属性注入(待干掉)
  componentSettingJson: string; //组件设置jsoN信息
  // componentSetting: ComponentSetting; //json转换对象信息
  pageComponentPropDtos:Partial<PageComponentPropDto>[];//字段所在组件的设置信息
}

/**
 * 保存列表字段;
 * @param dto 列表字段;
 * @return 列表字段;
 */
export const save = (dto: FormField): Promise<Result<FormField>> => {
  return apiClient.post(`/formField/save`, { params: dto });
};
/**
 * 明细查询列表字段;
 * @param id null;
 * @return 列表字段;
 */
export const detail = (id: string): Promise<Result<FormField>> => {
  return apiClient.get(`/formField/detail/${id}`);
};
/**
 * 逻辑删除;
 * @param id null;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/formField/remove/${id}`);
};

/**
 * 指定模块字段全量查询
 * 后期支持查询指定字段类型
 */
export const listAll = (params: {
  formId: string;
}): Promise<Result<FormField>> => {
  return apiClient.get(`/formField/list/all?formId=${params.formId}`);
};
