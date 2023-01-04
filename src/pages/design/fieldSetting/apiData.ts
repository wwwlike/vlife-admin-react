import { Result } from "@src/mvc/base";
import { listAll as formFieldListAll } from "@src/mvc/model/FormField";
import { listAll as resourcesListAll, listMenu } from "@src/mvc/SysResources";
import { listAll as reportItemListAll, ReportItem } from "@src/mvc/model/ReportItem";
import { roleAllResources } from "@src/mvc/SysResources";
import { listAll as orgList } from "@src/mvc/SysOrg";
import { listAll as deptList } from "@src/mvc/SysDept";
import { listAll as areaList } from "@src/mvc/SysArea";
import { listAll as conditionList } from "@src/mvc/model/FormCondition";
import {
  entityModels,
  detailFormVo,
  formReportItemAll,
  formReportKpiAll,
} from "@src/mvc/model/Form";
import { listByCode } from "@src/mvc/SysDict";
import { dataType } from "./componentData";
import { findName } from "@src/provider/baseProvider";
import { listSysFilterVo } from "@src/mvc/SysGroup";
import { details,  test, test1, test2 } from '@src/mvc/SysFile';
import { total } from '@src/mvc/model/ReportTable';

/**
 * 接口参数信息
 * 接口入参接收的应该都是固定值，
 */
export interface  ParamInfo{
  label: string; //参数名称
  sourceType:"fixed"|"dict"|"field" //参数的数据来源
  fixed?:{// sourceType===fixed, 以下固定取值的2种情况
    dicts?:{value:any,label:string}[]//自定义字典
    promise?:Promise<{value:any,label:string}[]> //api返回的数据
  },
  dict?:{// sourceType===dict,
    dictCode:string
  },
  must?: boolean; //是否必填,默认不是必须的
}


/**
 * 接口参数定义
 * 接口参数，不能来源于
 */
export interface ParamDef {
  [key: string]:ParamInfo; 
}

/**
 * 单个API定义信息
 */
export interface ApiProp{
  label: string; //接口名称
  dataType: dataType; //出参数据类型（接口确应只返回一种类型数据结构，所以这里不是数组）
  remark?: string; //接口说明
  codeDemo?: any; //返回代码示例(预览时使用)
  api:  (params?: any) =>  Promise<Result<any>>; // 接口
  params?: ParamDef; //接口入参信息定义
};

/**
 * API对象数据结构
 */
export interface ApiDef {
  [key: string]: ApiProp;
}

export const ApiInfo: ApiDef = {
  formListALl: {
    label: "模型列表(id)",
    dataType: dataType.id_name_list,
    api: entityModels,
  },//formListAll_entityType 与 formListALl 可以进行合并，dataType返回数组
  formListAll_entityType: {
    label: "模型列表(entityType)",
    dataType: dataType.entityType_name_list,
    api: entityModels,
  },
  formFieldListAll: {
    label: "字段列表(id)",
    dataType: dataType.id_name_list,
    api: formFieldListAll,
    params: {
      formId: { 
        must: true, 
        label: "模型id", 
        sourceType:"field" 
      },
    },
  },

  formFieldListAll_fieldName: {
    label: "字段列表(fieldName)",
    dataType: dataType.fieldName_title_list,
    api: formFieldListAll,
    params: {
      formId: { must: true, label: "模型id", sourceType:"field" },
    },
  },
  // formFieldListAll: {
  //   label: "模型字段信息",
  //   dataType: dataType.id_name_list,
  //   api: formFieldListAll,
  //   params: {
  //     formId: { must: true, label: "模型id", dataType: dataType.string,sourceType:"field" },
  //   },
  // },
  formConditionListAll: {
    label: "查询条件",
    dataType: dataType.id_name_list,
    api: conditionList,
    params: {
      formId: { must: true, label: "模型id", sourceType:"field"},
    },
  },
  reportItemListAll: {
    label: "统计项",
    dataType: dataType.id_name_list,
    api: reportItemListAll,
    params: {
      formId: { must: false, label: "模型id", sourceType:"field"},
    },
  },
  getDictByCode: {
    label: "字典信息",
    dataType: dataType.val_title_list,
    api: listByCode,
    params: {
      code: { must: true, label: "字典编码",sourceType:"dict" },
    },
  },
  resourcesListAll: {
    label: "资源信息",
    dataType: dataType.id_name_list,
    api: resourcesListAll,
    params: {
      menuCode: {
        must: false,
        label: "菜单code",
        sourceType:'field'
      },
    },
  },
  resourcesListAll_code: {
    label: "资源信息code",
    dataType: dataType.resourcesCode_name_list,
    api: resourcesListAll,
    params: {
      menuCode: {
        must: false,
        label: "菜单code",
        sourceType:'field'
      },
    },
  },
  listMenu: {
    label: "菜单资源",
    dataType: dataType.resources_list,
    api: listMenu,
  },
  areaTree: {
    label: "地区树",
    dataType: dataType.VfTree_list,
    api: areaList,
  },
  orgTree: {
    label: "机构树",
    dataType: dataType.VfTree_list,
    api: orgList,
  },
  deptTree: {
    label: "部门树",
    dataType: dataType.VfTree_list,
    api: deptList,
  },
  findName: {
    label: "关联名称信息",
    dataType: dataType.id_name_list,
    api: findName,
    params: {
      fieldEntityType: {
        must: true,
        label: "模型名称",
        sourceType:"fixed"
      },
      val: {
        must: true,
        label: "外键ID",
        sourceType:"fixed"
      },
    },
  },
  sysFileDetails:{
    label:"文件列表",
    dataType:dataType.fileList,
    //dataType:Array<SysFile>,
    api:details,
    params:{
      ids:{
        // dataType:dataType.list,
        label:"文件id列表",
        sourceType:'field',
        // must:true,
      }
    }
  },
  total:{
    label:"数据统计",
    dataType:dataType.number,//出参数据类型
    api:total,//出参数据来源接口
    params:{
      code:{
        label:"统计项编码",
        sourceType:"fixed",
        fixed:{
          //  dicts:[{value:"1",label:"2222"}]
          promise:reportItemListAll().then(d=>{return d.data?d.data.map((item:ReportItem)=>
            {return {value:item.code,label:item.name}}):[]}),
        }
        // dataType:dataType.string,
        // sourceType:"api",
        // table:{
        //   entityName:"reportItem",
        //   valField:"code",
        //   labelField:"name"
        // }
      }
    }
  },
  test:{
    label:"测试返回string",
    dataType:dataType.string,
    api:test
  },
  test1:{
    label:"测试对象返回",
    dataType:dataType.object,
    api:test1
  },
  test2:{
    label:"测试数组对象",
    dataType:dataType.list,
    api:test2
  },

  roleAllResources: {
    label: "角色资源",
    dataType: dataType.resources_list,
    api: roleAllResources,
  },
  sysFilterSelect: {
    api: listSysFilterVo,
    label: "行级数据筛选列表",
    dataType: dataType.pageSelect_list,
  },
  detailFormVo: {
    api: detailFormVo,
    label: "实体详情",
    dataType: dataType.formVo,
    params: {
      formId: {
        must: true,
        label: "模型id",
        sourceType:"field",
      },
    },
  },
  KPformReportItemPageSelect: {
    api: formReportItemAll,
    label: "统计项列表",
    dataType: dataType.pageSelect_list,
  },
  formReportKpiPageSelect: {
    api: formReportKpiAll,
    label: "指标项列表",
    dataType: dataType.pageSelect_list,
  },
};
