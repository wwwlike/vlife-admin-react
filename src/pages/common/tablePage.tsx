import {useNiceModal } from '@src/store';
import React, {useCallback, useEffect, useMemo, useState } from 'react';
import { find, useDetail,useModelInfo, usePage, useRemove, useSave } from '@src/provider/baseProvider';
import Table, { BtnMemoProp, ListProps, VfButton } from '@src/components/table';
import { useAuth } from '@src/context/auth-context';
import { reactions } from '@src/components/form';
import { useLocation } from 'react-router-dom';
import { fieldInfo, Result } from '@src/mvc/base';

/**
 * 待写个文档
 */
export type modelProps={
  name:string,
  fieldsCover?:(Partial<fieldInfo>&{dataIndex:string})[],
  // 下面的字段应该要整合到fieldsCover里成为各个字段的属性
  reactions?:Map<string,reactions>,
  hideCols?:string[], //隐藏字段
  readonlyCols?:string[], //只读字段
  requiredCols?:string[],//表单必填字段
}

/*页面自带的按钮信息 */
type btnList={
  disable:boolean,//全部禁用
  edit:boolean,
  add:boolean,
  rm:boolean,
  batchRm:boolean,
  view:boolean
}
/**
 * 业务融合page模块(模块-> 简化页面调用)
 * 1. 列头信息请求封装
 * 2. 数据信息请求
 * 3. table属性透传
 * 4. save,edit,delete,默认调用方法提供
 */
 export interface tablePageProps extends ListProps {
    entityName:string,  //实体模型名称
    listModel:string,  //列表模型信息,为空则=entityName
    editModel:string|modelProps, // 编辑视图模型，为空则=entityName
    viewModel:string|modelProps, //视图查看模型，为空则=entityName
    initData:object,//新增时初始化的默认数据，不可改
    reload:boolean,//发生变化则刷新
    req:any //搜索form待入的条件
    btnEnable:Partial<btnList>, //页面自带按钮进行开关
    customBtns:VfButton[], //页面传入的个性化按钮
    onGetData:(datas:any[])=>void//数据加载完成事件,把数据传出去
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
  btnEnable={disable:false,edit:true,add:true,rm:true,batchRm:true,view:true},//read==true,后面都无效
  ...props}:Partial<tablePageProps>&{entityName:string})=>{

  //加载弹出表单modal
  const formModal = useNiceModal("formModal");
  const confirmModal = useNiceModal("confirmModal");
  const {getDict,user,checkBtnPermission}=useAuth()
  const [fkMap,setFkMap]=useState<any>({});
  const [parentMap,setParentMap]=useState<any>({});

  /**
   * 校验用户是否能操作这个数据
   */
  const checkUser=useCallback((records:any[]):boolean=>{
    return  records.filter(record=>
      (record.createId===user?.id||record.modifyId===user?.id) //2个字段等于当前用户id
      ||
      ('createId' in record==false && 'modifyId' !in record ==false)//没有这2个字段
      ||
      (record.createId===null&&record.modifyId===null)
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
   * 新增按钮的可操作权限和外部数据关联,
   * 当前时能看见新增按钮，就能处理
   */
  const addCheck=useCallback((...data:any):BtnMemoProp=> {
    return {disable:false}
  },[]);

  /**
   * 删除按钮逻辑控制
   */
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
  const {runAsync:baseSave} =useSave({})

  // const {runAsync:save} =useSave({entityName,modelName:typeof editModel=='string'?editModel:editModel.name})
  //获得数据明细的方法，??xxDetail如何传参
  const {runAsync:getDetail}=useDetail({entityName})
  //数据删除方法
  const {runAsync:rm} =useRemove({entityName})
  // 外键信息提取

  // const entityRm=(btn:VfButton,...data:any)=>{
  //   //console.log('data',data)
   
  // };

  


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
   * 提取外键字段信息
   */
  const fkInfos=useMemo(()=>{
    //列表模型是实体模型则去取外键信息；视图模型可以自己封装应该封装好不用去取
    if(modelInfo&&listModel&&entityName&&listModel===entityName){
      return modelInfo?.data?.fields.filter(f=>{
        return f.entityFieldName==="id"&& entityName!==f.entityType && !props.hideColumns?.includes(f.dataIndex)
      });
    }
    return [];
  },[modelInfo])

    /**
   * 上级的code
   */
     const pcodeField=useMemo(():fieldInfo|undefined=>{
      //列表模型是实体模型则去取外键信息；视图模型可以自己封装应该封装好不用去取
      if(modelInfo){
        return modelInfo?.data?.fields.find(f=>{
          return f.dataIndex==="pcode"
        });
      }
      return undefined;
    },[modelInfo])
  

  /**
   * 获得本页外键字段的id,name的键值集合
   */
  useEffect(()=>{
    fkInfos?.forEach( f=>{
      const ids:string[]=data?.data?.result.map(d=>d[f.dataIndex] as string)||[];
      if(ids.length>0){
        find(f.entityType,"id",ids).then(data=>{
          data.data?.forEach(e=>{
            fkMap[e.id]=e.name
            setFkMap({...fkMap})      
          })
        })
      }
    })
},[fkInfos,data])


  /**
   * 获得本页外键字段的id,name的键值集合
   */
   useEffect(()=>{
    if(pcodeField){
      const codes:string[]=data?.data?.result.map(d=>d[pcodeField.dataIndex] as string)||[];
      if(codes.length>0){
        find(pcodeField.entityType,"code",codes).then(data=>{
          data.data?.forEach(e=>{
            parentMap[e.code]=e.name
            setParentMap({...parentMap})      
          })
        })
      }
    }
},[pcodeField,data])

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


/**
 * 过滤列表模型里的字段里是字段类型的字典key集合
 */
const dictKeys:string[]=useMemo(()=>{
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
   * @param read  展现形式
   * @param model 模型信息
   * @param record 初始数据
   * @param save 确认按钮触发的方法m
   */
  const modalShow=(read:boolean,model:string|modelProps,record:any,save?:any)=>{
    const modelName=typeof model=='string'?model:model.name;
    formModal.show({ //这里因为是any,所以show无提示，不优雅,
      entityName,
      modelName,
      initData:record,
      saveFun:save,
      type:'dataForm',
      //模型传的是复杂类型(modelProps),则需要数据内容打散透传给modal
      ... typeof model!=='string'? model:undefined,
      read
    }).then((saveData) => {
      pageRefresh();
    });
  }

  /**
   * 弹出层
   * @param modelName 弹出层的数据model
   * @param fun 弹出层里点保存的回调方法
   * @param view 是否是read视图 true时 fun是可以为空的
   * @param record  弹出层的数据m
   */
  const showDiv=(model:string|modelProps,isView:boolean,record?:any,fun?:any)=>{
    const modelName=typeof model=='string'?model:model.name;
    // 列表模型和编辑模型不同，需要去后台取编辑模型数据后在打开弹出框
    if(model!==listModel&&record&&record.id){
      getDetail(record.id,modelName).then(data=>{
        modalShow(isView,model,data.data,fun);
      })
    }else{
        modalShow(isView,model,record?record:initData,fun);
    }
  }

  /**
   * 点击按钮统一触发的方法
   * @param btn 按钮信息
   * @param record 按钮所在行数据或者复选框选择的所有数据
   */
  const btnClick=(btn:VfButton,...record:any)=>{
    if(btn.model){
      // const mName=typeof btn.model=='string'?btn.model:btn.model.name;
      const isView=btn.readView===undefined?false:btn.readView;
      showDiv(btn.model,isView,record?record[0]:undefined,btn.okFun);
    }else if(btn.okFun!==undefined){
      confirmModal.show({
        saveFun: ()=>{
          return btn.okFun&&btn.okFun(record.length>0?[...record].map((d:any)=>d.id):undefined)},
          title:`确认${btn.title}${record.length}条记录`
      }).then(data=>{
        pageRefresh();
      })
    }
  }

  /**
   * 通用保存方法调用
   */
  const save =useCallback((entityName:string,mName?:string|modelProps)=>{
    const modelName=mName?(typeof mName=='string'?mName:mName.name):undefined;
    return (data:any)=> baseSave(data,entityName,modelName)
  },[])

  const local=useLocation();
  const tableBtn=useMemo(():VfButton[]=>{
    const memoBtns:VfButton[]=[];
    const addDefBtn:VfButton={title:'新增',entityName,model:editModel,tableBtn:true,key:'save',okFun:save(entityName,editModel),click:btnClick,attr:addCheck}
    const rmDefBtn:VfButton={title:'删除',entityName,tableBtn:false,key:'remove',click:btnClick,okFun:rm, attr:batchRmCheck}
    const batchRmDefBtn:VfButton={title:'删除',entityName,tableBtn:true,key:'remove',click:btnClick,okFun:rm,attr:batchRmCheck}
    const editDefBtn:VfButton={title:'修改',entityName,model:editModel,tableBtn:false,key:'save',okFun:save(entityName,editModel),click:btnClick,attr:editCheck}
    const detailDefBtn:VfButton={title:'查看',entityName,readView:true, model:viewModel,tableBtn:false,key:'detail',click:btnClick}

    //fromTmp 是模板页面template 当前先不进行权限判断
    const  fromTmp=local.pathname.includes('/template/');
    if(btnEnable.disable===undefined||btnEnable.disable===false){
      if(btnEnable.add&&(fromTmp||checkBtnPermission(addDefBtn))){
        memoBtns.push(addDefBtn)
      }
      if(btnEnable.batchRm&&(fromTmp||checkBtnPermission(batchRmDefBtn))){
        memoBtns.push(rmDefBtn,batchRmDefBtn)
      }
      if(btnEnable.edit&&(fromTmp||checkBtnPermission(editDefBtn))){
        memoBtns.push(editDefBtn)
      }
      //能看列表就能看详情
       memoBtns.push(detailDefBtn)
    }
    customBtns?.forEach(cus=>{
      if(checkBtnPermission(cus)){
        //自定义按钮如果没有传入点击事件，则用默认本页自带的逻辑
        if(cus.click===undefined){
          cus.click=btnClick
        }
        //确认保存的方法如果没有设置，也使用baseProvider里的
        if(cus.okFun===undefined&&cus.model){
          cus.okFun=save(cus.entityName||entityName,cus.model) 
        }
        memoBtns.push(cus)
      }
    })
    return memoBtns;
  },[customBtns,user?.resourceCodes,btnEnable,local])

  return (
    <div>
      <Table 
          columns={modelInfo?.data?.fields}
          hideColumns={['createDate','modifyDate','status','id','createId','modifyId','code','sysAreaId','sysOrgId','sysDeptId']}
          sysDict={getDict(...dictKeys)}
          dataSource={data?.data?.result}
          tableBtn={tableBtn}
          fkMap={fkMap}
          parentMap={parentMap}
          {...pagination}
          {...props}
          >
         </Table>
          </div>
 )
}
export default TablePage;

