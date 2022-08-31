import {useNiceModal } from '@src/store';
import React, {useCallback, useEffect, useMemo, useState } from 'react';
import { getFkInfo, useDetail, useDetails, useModelInfo, usePage, useRemove, useSave } from '@src/provider/baseProvider';
import Table, { BtnMemoProp, ListProps, VfButton } from '@src/components/table';
import { useAuth } from '@src/context/auth-context';
import { reactions } from '@src/components/form';
import { useLocation } from 'react-router-dom';
import { fieldInfo } from '@src/types/vlife';

type editModelProps={
  name:string,
  fieldsCover?:(Partial<fieldInfo>&{dataIndex:string})[],
  // 下面的字段应该要整合到fieldsCover里成为各个字段的属性
  reactions?:Map<string,reactions>,
  hideCols?:string[], //隐藏字段
  readonlyCols?:string[], //只读字段
  requiredCols?:string[],//表单必填字段
}
/**
 * 业务融合page模块(模块-> 简化页面调用)
 * 1. 列头信息请求封装
 * 2. 数据信息请求
 * 3. table属性透传
 * 4. save,edit,delete,默认调用方法提供
 */
 export interface tablePageProps extends ListProps {
    entityName:string,  //实体模型
    listModel?:string,  //列表模型信息,为空则=entityName
    editModel?:string|editModelProps, // 编辑视图模型，为空则=entityName
    viewModel?:string, //视图查看模型，为空则=entityName
    initData?:object,//新增时初始化的默认数据，不可改
    reload?:boolean,//发生变化则刷新
    req?:any //搜索form待入的条件
    btnEnable?:{read?:boolean,edit?:boolean,add?:boolean,rm?:boolean,batchRm?:boolean,view?:boolean} //默认开放的按钮
    customBtns?:VfButton[], //页面传入的个性化按钮
    onGetData?:(datas:any[])=>void//数据加载完成事件,把数据传出去
    // onEditCallBack?:(id:string)=>Promise<any>,//编辑之前取得其他非表单外键之外需要传入的数据
    // onAddCallBack?:()=>Promise<any>,//新增之前取得传入表单的数据
  }
 
/**
 * # page粒度较大通用业务模块页面级别的组件，它将接口和无状态的组件粘合起来
 * 1. 优势，业务 方便页面调用，在页面代码里不用写大量与vlife相关的接口交互，以及逻辑封装的前端代码
 * ## tablePage 分页列表及按钮功能模块级组件
 * 1. 取得字典及字段模型信息
 * 2. 透传
 * 3. 封装table里的按钮回调事件方法
 * 4. 编辑和查看时如果和listModel不是一个模型，那么需要去取数据给到模型。
 * 5. view的模型可以直接查询到进行展示。
 * 6. edit取数据如果editvo模型也是view模型那么可以用，如果不是则需要去取数据。
 */

export const TablePage=({
  entityName,
  listModel=entityName,
  editModel=entityName,
  viewModel=entityName,
  req,
  onGetData,
  reload,
  initData,
  customBtns,
  btnEnable={read:false,edit:true,add:true,rm:true,batchRm:true,view:true},//read==true,后面都无效
  ...props}:tablePageProps)=>{

  //加载弹出表单modal
  const formModal = useNiceModal("formModal");
  const confirmModal = useNiceModal("confirmModal");
  const {getDict,user,checkBtnPermission}=useAuth()
  const [fkMap,setFkMap]=useState<any>({});

  /**
   * 校验用户是否能操作这个数据
   */
  const checkUser=useCallback((records:any[]):boolean=>{
    return  records.filter(record=>
      (record.createId===user?.id||record.modifyId===user?.id)
      ||
      ('createId' in record==false && 'modifyId' !in record ==false)//没有这2个字段
      ).length===records.length;
  },[user?.id])

  const editCheck=useCallback((...data:any):BtnMemoProp=> {
    if(!checkUser(data)){
      return {disable:true,prompt:'无权修改他人创建的数据'}
    }else if('sys' in data[0]&&[...data].filter(d=>{
      return d.sys===true
    }).length>0){
        return {disable:true,prompt:'系统数据不能修改'}
    } 
    return {disable:false}
  },[]);

  /**
   * 新增按钮的可操作权限和外部数据关联
   */
  const addCheck=useCallback((...data:any):BtnMemoProp=> {
    return {disable:false}
  },[]);

  const batchRmCheck=useCallback((...data:any):BtnMemoProp=> {
    if (data.length===0){
      return {disable:true,prompt:'请选中至少一条记录'}
    } else if(!checkUser(data)){
      return {disable:true,prompt:'无权删除他人创建的数据'}
    } else if('sys' in data[0]&&[...data].filter(d=>{
      return d.sys===true
    }).length>0){
        return {disable:true,prompt:'系统数据不能删除'}
    } 
    return {disable:false}
  },[]);




  // 列头信息
  const {run:titleRun,data:modelInfo}=useModelInfo({entityName});
  // 列表信息
  const {run:page,refresh:pageRefresh,data}=usePage({entityName,listModel,onSuccess:(data)=>{
    if(onGetData){
      onGetData(data.data?.result||[]);
    }
  }});
  //数据保存的方法
  const {runAsync:save} =useSave({entityName,modelName:typeof editModel=='string'?editModel:editModel.name})
  //获得数据明细的方法，??xxDetail如何传参
  const {runAsync:getDetail}=useDetail({entityName})
  //数据删除方法
  const {runAsync:rm} =useRemove({entityName})
  // 外键信息提取
  const fkInfo=getFkInfo;
  // const {runAsync:views}=useDetails({entityName});
  const entityRm=(...data:any)=>{
    //console.log('data',data)
    confirmModal.show({
      saveFun: ()=>{return rm(data.map((d:any)=>d.id))},
      title:`确认删除${data.length}条记录`
    }).then(data=>{
      pageRefresh();
    })
  };

  useEffect(()=>{
    titleRun(listModel) //列头数据
  },[listModel])
    //监听组件外部查询条件的变化
  useEffect(()=>{req
    // console.log('req-> search组件会引起req搜索两次，第一次search空，第二次 undefiend，需要解决',req);
    // 弹出table目前没有做搜索条件,故无req入参
    page({...req})
  },[req,reload])

  /**
   * 外键信息
   */
  const fkInfos=useMemo(()=>{
    //不是entityName;则去取外键信息
    if(modelInfo&&listModel&&entityName&&listModel===entityName){
      return modelInfo?.data?.fields.filter(f=>{
        return f.entityFieldName==="id"&& entityName!==f.entityType && !props.hideColumns?.includes(f.dataIndex)
      });
    }
    return [];
  },[modelInfo])

  useEffect(()=>{
    //step2 找到字段里有字典的数据，并从全局context里得到本次需要的字典数据
    fkInfos?.forEach( f=>{
      const ids:string[]=data?.data?.result.map(d=>d[f.dataIndex] as string)||[];
      if(ids.length>0){
        fkInfo(f.entityType,ids).then(data=>{
          data.data?.forEach(e=>{
            fkMap[e.id]=e.name
            setFkMap({...fkMap})      
          })
        })
      }
    })
},[fkInfos,data])

   
  const setPage=useCallback((pageNo: number)=>{
    page({...req,...{pager:{page:pageNo}}})
  },[req]);

  const pagination=useMemo(() => {
    return {
      pagination: {
        formatPageText:props.select_more!==undefined,
        currentPage: data?.data?.page,
        pageSize: data?.data?.size,
        total: data?.data?.total,
        onPageChange: setPage,
      }
    };
  }, [data?.data,]);


  // 过滤列头信息里的字典
  const dictKeys:(string)[]=useMemo(()=>{
    if(modelInfo&&modelInfo.data){
      const r:(string|undefined)[]=  modelInfo.data.fields.map(f=>{
        return  f.dictCode
      });
      const s:string[]=[];
      r.forEach(str=>{
        if(str!=undefined)
          s.push(str)
      })
      return s;
    }
    return [];
  },[modelInfo])

  /**
   * 
   * @param read 
   * @param model 
   * @param record 
   * @param save 
   * @param compData indexForm里的组件需要的数据
   */
  const modalShow=(read:boolean,model:string,record:any,save?:any)=>{
    formModal.show({ //这里因为是any,所以show无提示，不优雅,
      entityName, //voName
      modelName:model,
      initData:record,
      saveFun:save,
      type:'dataForm',
      ... typeof editModel!=='string'? editModel:undefined,
      read
    }).then((saveData) => {
      pageRefresh();
    });
  }

  const eidtiModalShow=(record?:any)=>{
    const editName=typeof editModel=='string'?editModel:editModel.name;
    if(editName!==listModel&&record&&record.id){
      getDetail(record.id,editName).then(data=>{// 列表和编辑dto不同，需要加载数据
        modalShow(false,editName,data.data,save);
      })
    }else{
      modalShow(false,editName,record?record:initData,save);
    }
  }

  //触发调用的方法
  const entitySave=(record?:any)=>{
    eidtiModalShow(record);
   };

   const view=(record?:any)=>{
    if(viewModel!==listModel){
      getDetail(record.id,viewModel).then(data=>{
        modalShow(true,viewModel,data.data);
      })
    }else{
      modalShow(true,viewModel,record);
    }
   };

   const local=useLocation();
  
  const tableBtn=useMemo(():VfButton[]=>{
    const memoBtns:VfButton[]=[];
    const addDefBtn={title:'新增',entityName:entityName, tableBtn:true,key:'save',fun:entitySave,attr:addCheck}
    const rmDefBtn={title:'删除',entityName:entityName,tableBtn:false,key:'remove',fun:entityRm,attr:batchRmCheck}
    const batchRmDefBtn={title:'删除',entityName:entityName,tableBtn:true,key:'remove',fun:entityRm,attr:batchRmCheck}
    const editDefBtn={title:'修改',entityName:entityName,tableBtn:false,key:'save',fun:entitySave,attr:editCheck}
    const  fromTmp=local.pathname.includes('/template/');
    // 是模板页面则不进行权限判断
    if(btnEnable.read==false){
      if(btnEnable.add&&(fromTmp||checkBtnPermission(addDefBtn))){
        memoBtns.push(addDefBtn)
      }
      if(btnEnable.batchRm&&(fromTmp||checkBtnPermission(batchRmDefBtn))){
        memoBtns.push(rmDefBtn,batchRmDefBtn)
      }
      if(btnEnable.edit&&(fromTmp||checkBtnPermission(editDefBtn))){
        memoBtns.push(editDefBtn)
      }
    }
    customBtns?.forEach(cus=>{
      if(checkBtnPermission(cus)){
        memoBtns.push(cus)
      }
    })
    return memoBtns;
  },[customBtns,user?.resourceCodes,btnEnable,local])

  return (
    <div>
      <Table 
          columns={modelInfo?.data?.fields}
          hideColumns={['createDate','modifyDate','status','id','createId','modifyId']}
          sysDict={getDict(...dictKeys)}
          dataSource={data?.data?.result}
          tableBtn={tableBtn}
          fkMap={fkMap}
          {...pagination}
          {...props} //透传
          />
          {/* {JSON.stringify(data?.data?.result)} */}
          </div>
 )
}
export default TablePage;

