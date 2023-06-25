import { FormVo } from '@src/api/Form';
import { FormField } from '@src/api/FormField';
import { DataType, TsType } from '../schema/base';

/**
 * api数据过滤函数集合
 * 对于组件入参是数组型的入参属性，可对其进行过滤
 */
export interface filter{
  title:string;//过滤器标题
  dataType?:DataType;//出参数据类型 // 可以省区
  dataModel:TsType|string; //数据模型
  func:(datas:any[])=>any[],
}

export interface filterObj{
  [key:string]:filter
}

export const filterFuns:filterObj={
   erpEntity: {
      title:"进销存模型",
      dataModel:"FormVo",
      func:(formVo:FormVo[])=>{
        return formVo.filter((d,index)=>d.itemType==='entity'&&d.module==='erp');
      },
   },
   groupField:{
    title:"可分组字段",
    dataModel:"FormField",
    func:(fields:FormField[])=>{
      return fields.filter((ff: FormField) => {
        if (
          ff.dataType === "basic" &&
          (ff.fieldType === "date" ||
            ff.pathName.endsWith("Id") ||
            ff.dictCode)
        ) {
          return true;
        }
        return false;
      });
    },
   },
   numberField:{
    title:"数值类型字段",
    dataModel:"FormField",
    func:(fields:FormField[])=>{
      return fields.filter((ff: FormField) =>ff.dataType === "basic" &&ff.fieldType === "number"
      );
    },
   }
}
