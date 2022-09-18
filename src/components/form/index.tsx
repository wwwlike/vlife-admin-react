/**
 * 使用formliy + semi联合打造的动态表单
 * 考虑使用reactQuery,从后台取得表单信息，然后缓存起来。
 */
import React, { useCallback, useMemo } from 'react';
import { createForm, Form, IFormFeedback, onFormInit,onFormMount,onFormValuesChange } from '@formily/core';
import { createSchemaField, FormProvider} from '@formily/react';
import { FormItem, Input ,FormGrid,GridColumn,Select,ArrayItems,ArrayTable, Checkbox,DatePicker} from '@formily/semi';
import {  fieldInfo, ModelInfo, TranDict } from '@src/mvc/base';
import RelationInput from '@src/components/form/comp/RelationInput'
import RoleResourcesSelect from '@src/pages/auth/role/RoleResourcesSelect/formily';
import TabSelect from './comp/TabSelect';
import PageSelect from './comp/PageSelect';
import TreeSelect from './comp/TreeSelect';

/**
 * 表单布局展示，需要固定写在函数式组件之外
 * 圈定所有组件
 */
 const SchemaField = createSchemaField({
  components: {
    Input,FormItem,FormGrid,GridColumn,Select,ArrayItems,ArrayTable,Checkbox,DatePicker,
    RelationInput,//封装关系选择formily组件。特定组件支持特定业务
    RoleResourcesSelect,// 特定的业务型组件 占2列；自定义组件，根据传参来处理
    TabSelect, //tab方式的过滤，权限选择上级权限时使用在，应该会被TreeSelect取代
    PageSelect, //平铺选择组件（查询条件过滤使用在）
    TreeSelect
  },
})

/**
 * 数据联动
 * https://react.formilyjs.org/zh-CN/api/shared/schema#schemareactions
 */
export interface reactions{
  dependencies:string[],
  when:string,
  fulfill:{
    state:{
      value:string
    }
  }
}

 //表信息
export interface FormProps {
  entityName:string,
  formData?:any, // form初始数据
  // setFormData:(data:any)=>void //修改数据传出去
  onDataChange?:(data:any,field?:string)=>void; //整体数据变化回调,最新变化的字段
  onForm?:(form:Form)=>void;
  hideColumns?: string[]; //需要隐藏的不显示的列
  read?: boolean; //只读模式
  dicts?: TranDict[]; //字典信息
  layout?:string,// [] 横/纵布局
  fkMap?:any; // 外键对象信息{ID,NAME}
  maxColumns?: number[];//列信息
  modelInfo:ModelInfo|undefined;
  onError?:((error:IFormFeedback[])=>void);
  reactions?:Map<string,reactions>; //联动关系
  hideCols?:string[]; //表单隐藏字段
  readonlyCols?:string[]; //表单只读字段
  requiredCols?:string[]; //表单必填字段
  //覆盖model.fileds里的数据，也可以对field里没有的信息可以进行补充
  fieldsCover?:(Partial<fieldInfo>&{dataIndex:string})[]
}

export default ({maxColumns=[2,2,2],dicts,formData,
  onDataChange,onForm,read,fkMap,modelInfo,reactions,onError,
  hideCols,requiredCols,readonlyCols,fieldsCover}:FormProps) => {
    /**
   * 动态表单数据初始化
   * 使用参考：https://core.formilyjs.org/zh-CN/api/models/form
   */
     const form = useMemo(
      () =>
        createForm({
          readPretty: read,
          editable:false,
          initialValues: {
           ...formData
          },
          effects() {
            onFormMount((form)=>{
               if(onForm!=undefined){
                 onForm(form);
              }
            }),
            onFormInit((form)=>{
            }),
            onFormValuesChange((form) => {
              if(form.errors.length>0&&onError!==undefined){
                setTimeout(()=>onError(form.errors),200)
              }
              if(onDataChange!==undefined){
                onDataChange(form.values);
              }
              if(onForm!=undefined){
                onForm(form);
              }
              // setFormData({...form.values})
            })
          },
        }),
        [modelInfo,fieldsCover,fkMap]
    )

  
  /**
   * code层字段信息覆盖配置层的内容
   */
  // const fieldInfos=useMemo(():(fieldInfo)[]=>{
  //   if(!fieldsCover){
  //     return modelInfo?.fields||[];
  //   }else{
  //     return modelInfo?.fields.map(field=>{
  //       const filterResult:Partial<fieldInfo>[] =fieldsCover.filter(cover=>cover.dataIndex===field.dataIndex)
  //       if(filterResult&&filterResult[0]){
  //         return {...field,...filterResult[0]}
  //       }
  //       return field;
  //     })||[]
  //   }
  // },[fieldsCover,modelInfo?.fields])

  const fieldInfos=useMemo(():(fieldInfo)[]=>{
    const infos= ():fieldInfo[]=>{
      if(!fieldsCover){
        return modelInfo?.fields||[];
      }else{
        return modelInfo?.fields.map(field=>{
          const filterResult:Partial<fieldInfo>[] =fieldsCover.filter(cover=>{
            return cover.dataIndex===field.dataIndex})
          if(filterResult&&filterResult[0]){
            return {...field,...filterResult[0]}
          }
          return field;
        })||[]
      }
    }
    return infos().filter(f=>f.uiState!=='hide');
  },[fieldsCover,modelInfo?.fields])


   
  /**
   * 字典数据提取
   */
  const fieldEnum=useCallback((dictCode:string)=>{
    const dictEnum:{label:string,value:any}[]=[];
    if(dicts){
      const array=dicts.filter((sysDict)=>{
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
    // console.log(dictEnum)
    return dictEnum;
  },[dicts])

   /**
    * 动态表单formily
    */
   const schema= useMemo(()=>{
    const pp:any={};
      fieldInfos.filter(f=>{
       const hideFlag= hideCols&&hideCols.includes(f.dataIndex)
       if(hideFlag){
        return false;
       }else{
        return ((read&& f.dataIndex!=='id'&&f.dataIndex!=='status')||//
     (f.dataIndex&&
      f.dataIndex!=='id'&&
      f.dataIndex!=='status'&&
      f.dataIndex!=='code'&&
      f.dataIndex!=='createId'&&
      f.dataIndex!=='modifyId'&&
      f.dataIndex!=='createDate'&&
      f.dataIndex!=='modifyDate'
      // &&f.dataIndex!=='sysOrgId'&&
      // f.dataIndex!=='sysAreaId'&&
      // f.dataIndex!=='sysDeptId'
      ))
    }}).forEach((f)=>{
    
      pp[f.dataIndex]={};
      const prop:any=pp[f.dataIndex];
      prop.title=f.title;
      if(requiredCols&& (requiredCols.length===0||requiredCols.includes(f.dataIndex))){
         prop.required= true;
      }
      if(readonlyCols&&readonlyCols.includes(f.dataIndex)){
        prop.readPretty= true;
       }
      prop['x-decorator']= 'FormItem';

      if(f.labelProps){
        prop['x-decorator-props'] ={...f['labelProps']};
      }
      // if(f.span){
      //   prop['x-decorator-props']  ={ gridSpan: f.span };
      // }
      if(f.props){
        prop['x-component-props']={...prop['x-component-props'],
        [f.dataIndex]:f.props,
        'props':f.props}
      }

      if(f.component){
        prop['x-component']=f.component;
      }else if(f.dictCode){
        prop['x-component']='Select';
        prop.enum=fieldEnum(f.dictCode);
      }else if ((
        f.dataIndex!=='id'&&f.entityType!==modelInfo?.entityType&&
      (f.pathName.endsWith('Id')||f.pathName.endsWith('_id')))||
      (f.dataIndex==='modifyId'||f.dataIndex==='createId')){
        prop['x-component']='RelationInput';
        prop['x-component-props']={...prop['x-component-props'],'fkMap':fkMap,...f};
      }else if (f.type==='boolean'){
        prop['x-component']='Checkbox';
        // prop['x-component-props']={...prop['x-component-props'],'fkMap':fkMap,...f};
      }else if (f.type==='date'){
        prop['x-component']='DatePicker';
        prop['x-component-props']={...prop['x-component-props'],'format':"yyyy/MM/dd"};
      }else{
        prop['x-component']='Input';
      }
      if(reactions?.get(f.dataIndex)){
        prop['x-reactions']=reactions.get(f.dataIndex);
      }
      prop.type='string'
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
  },[modelInfo,fkMap,formData,fieldInfos])

  return (
    <div>
      {/* {JSON.stringify(fieldsCover)} */}
      <FormProvider form={form}>
        <SchemaField schema={schema}></SchemaField>
      </FormProvider>
      </div>
    )
}



