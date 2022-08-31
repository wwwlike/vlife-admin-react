/**
 * 根据vlife的req模型结合formily实现配置搜索组件功能
 */
/**
 * 使用formliy + semi联合打造的动态表单
 * 考虑使用reactQuery,从后台取得表单信息，然后缓存起来。
 */
 import React, { useCallback, useEffect, useMemo, useState } from 'react';
 import { createForm, onFormInit,onFormMount,onFormValuesChange } from '@formily/core';
 import { createSchemaField,  FormConsumer,  FormProvider, Observer, observer, Schema, useFieldSchema, useForm } from '@formily/react';
 import { FormItem, Input ,FormGrid,GridColumn,ArrayItems,ArrayTable,FormTab,DatePicker} from '@formily/semi';
 import { fieldInfo, ModelInfo, TranDict } from '@src/types/vlife';
 import RelationInput from '@src/components/form/comp/RelationInput'
 import SearchInput from '@src/components/form/comp/SearchInput'
 import DictSelectTag from '@src/components/form/comp/DictSelectTag'
 import { FormProps } from '..';
 import TreeQuery from '../comp/TreeQuery';



 /**
  * 表单布局展示，需要固定卸载函数式组件之外
  */
  const SchemaField = createSchemaField({
   components: {
     Input,FormItem,FormGrid,GridColumn,ArrayItems,ArrayTable,FormTab,DatePicker,
     RelationInput,//封装关系选择formily组件，
     SearchInput,
     DictSelectTag,
     TreeQuery,
   },
 })
//   //表信息
//  export interface FormProps {
//    entityName:string,
//    formData?:any, // form初始数据
//    setFormData:(data:any)=>void //修改数据传出去
//    setError?: () => void; //校验错误信息
//    hideColumns?: string[]; //需要隐藏的不显示的列
//    read?: boolean; //只读模式
//    dicts?: TranDict[]; //字典信息
//    layout?:string,// [] 横/纵布局
//    modelInfo:ModelInfo|undefined;
//    maxColumns?: number[];//列信息
//    fkMap?:any;
   
//  }

 export default ({entityName,
  maxColumns=[2,2,2],
  dicts,formData,onDataChange,fkMap,
  modelInfo,fieldsCover
}:FormProps) => {
   
  // const [schema,setSchema]=useState<any>({});
  /**
    * 动态表单数据初始化
    */
   const form = useMemo(
     () =>{
       return createForm({
         readPretty: false,
         initialValues: {
          ...formData
         },
         effects() {
           onFormInit((form)=>{
           }),
           onFormValuesChange((form) => {
             if(onDataChange)
             onDataChange({...form.values})
           })
         },
       })},
     [modelInfo,fieldsCover]
   )
//formData,compData

   /**
    * 字典数据提取(字典显示有抖动这里需要测试)
    */
   const fieldEnum=useCallback((dictCode:string)=>{
     const dictEnum:{label:string,value:any}[]=[];
     if(dicts){
       const array=dicts.filter((sysDict)=>{
         //console.log(sysDict.column.toLowerCase()+"_"+dictCode.toLowerCase())
         if(sysDict.column.toLowerCase()===dictCode.toLowerCase()){
             return true;
         }
       })
       if(array){
         array[0].sysDict.forEach(d=>{
           dictEnum.push({label:d.title,value:d.val});
         })
       }
     }
     return dictEnum;
   },[dicts])
 

   /**
    * 单个表单属性组合/覆盖
    */
   const fieldInfos=useMemo(():(fieldInfo)[]=>{
    if(!fieldsCover){
      return modelInfo?.fields||[];
    }else{
      // console.log('fieldsCover',fieldsCover);
      return modelInfo?.fields.map(field=>{
        const filterResult:Partial<fieldInfo>[] =fieldsCover.filter(cover=>{
          // console.log(cover.dataIndex,field.dataIndex)
          return cover.dataIndex===field.dataIndex})
     
        if(filterResult&&filterResult[0]){
          return {...field,...filterResult[0]}
        }
        return field;
      })||[]
    }
  },[fieldsCover,modelInfo?.fields])
 

   const schema= useMemo(()=>{
    const pp:any={};
    fieldInfos.forEach((f)=>{
    const prop:any=pp[f.dataIndex]={};
    prop.title=f.title;
    prop['x-decorator']= 'FormItem';

    // if(compData&&compData[f.dataIndex]!==undefined){
    //   console.log("compData[f.dataIndex]",compData[f.dataIndex])
    //   prop['x-component-props']={...prop['x-component-props'],
    //   [f.dataIndex]:compData[f.dataIndex]};
    // }

      //传入的附加属性放入到组件props里的当前组件dataIndex字段之上
      if(f.props){
        prop['x-component-props']={...prop['x-component-props'],
        [f.dataIndex]:f.props};
      }

      if(f.component){
        prop['x-component']=f.component;
      }else if(f.dictCode||f.type==='boolean'){
        prop['x-component']='DictSelectTag'
        if(f.dictCode)
          prop.enum=fieldEnum(f.dictCode);
        else
          prop.enum=[{label:'是',value:true},{label:'否',value:false}]
        prop['x-component-props']=f;
      }else if (f.dataIndex!=='id'&&
      (f.pathName.endsWith('Id')||f.pathName.endsWith('_id'))){
        // &&f.entityType!==modelInfo?.entityType 对应问题20
        prop['x-component']='RelationInput';
        prop['x-component-props']={...prop['x-component-props'],'fkMap':fkMap,...f};
      }else if (f.type==='date'){
        prop['x-component']='DatePicker';
        if(f.fieldType==='list'){
          prop['x-component-props']={...prop['x-component-props'],type:'dateRange','format':"yyyy/MM/dd"};
        }else{
          prop['x-component-props']={...prop['x-component-props'],'format':"yyyy/MM/dd"};
        }
      }else{
        prop['x-component']='SearchInput';
      }
      // layout?: 'vertical' | 'horizontal' | 'inline';
      prop[' x-decorator-props']={layout:'vertical',labelAlign:'left'};
      prop.type='string';
      })
      return {
        type: 'object',
        properties: {
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              maxColumns: maxColumns, //
            },
            properties:pp
          }
        },
      }
    },[modelInfo,fkMap,formData]) //异步加载的数据，需要监听
   
  
   return (
     <div>       
       <FormProvider form={form}>
         <SchemaField schema={schema}></SchemaField>
       </FormProvider> 
     </div>
     )
 }
 
 
 
 
