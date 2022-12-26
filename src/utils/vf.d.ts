/**
 * vlife的数据结构定义相关内容
 */

import { getDataType, sourceType } from '@src/pages/design/fieldSetting/componentData';

/**
 * vlife里数据类型 
 * 字符串/数字/布尔/复杂对象
 * 数组类型需要VfType来定义
 */
 export type VfDataType=String|Number|Boolean|Object;


 /**
  * api ：和入参一致的api出参
  * field：从给定的一个对象的某个属性上取值 （表单可以用，查询组件目前没有应用场景）
  * fixed：用户固定输入
  * sys:从系统进行取值，暂未定义
  * dict：从字典表进行取值
  */
 type sourceType="API"|"FIELD"|"FIXED"|"SYS"|"DICT"|"REPORT_ITEM"

 export interface VfSourceType{
  sourceType,//数据来源，每个数据确定数据来源


 }

 /**
  * 数据详情
  */
 export type VfType={
   isArray:boolean; //是否集合
   type:VfDataType, //数据类型；集合则是里面的泛型类型
   subType?:{
     [subKey:string]:VfType;
     alais:string; //subType的别名 
   }
 }

 
 export const VfString:VfType={
   isArray:false,
   type:String,
 }

 export const VfNumber:VfType={
  isArray:false,
  type:Number,
}

export const VfBoolean:VfType={
  isArray:false,
  type:Boolean,
}

