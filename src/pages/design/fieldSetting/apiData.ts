import { Result } from "@src/mvc/base";
import { listAll as formFieldListAll } from "@src/mvc/model/FormField";
import { listAll as resourcesListAll, listMenu } from "@src/mvc/SysResources";

import { listAll as reportItemListAll } from "@src/mvc/model/ReportItem";
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
import { dataType, PropInfo } from "./componentData";
import { findName } from "@src/provider/baseProvider";
import { listSysFilterVo } from "@src/mvc/SysGroup";
import { details, SysFile, test, test1, test2 } from '@src/mvc/SysFile';
import { total } from '@src/mvc/model/ReportTable';
import { list } from '@src/mvc/SysUser';




/**
 * 接口参数定义
 */
export interface ParamDef {
  [key: string]:PropInfo;
  // | string; //直接给值，固定传参，不用端设置
}

/**
 * 单个API定义信息
 */
export interface ApiProp{
  label: string; //名称
  dataType: dataType; //出参数据类型
  remark?: string; //说明备注信息
  codeDemo?: string; //返回代码示例
  api:  (params?: any) =>  Promise<Result<any>>; // 接口
  params?: ParamDef; //接口定义信息
};
/**
 * 接口定义
 */
export interface ApiDef {
  [key: string]: ApiProp;
}

export const ApiInfo: ApiDef = {
  formListALl: {
    label: "模型列表",
    dataType: dataType.id_name_list,
    api: entityModels,
  },
  formFieldListAll: {
    label: "模型字段信息",
    dataType: dataType.id_name_list,
    api: formFieldListAll,
    params: {
      formId: { must: true, label: "模型id", dataType: dataType.string },
    },
  },
  formConditionListAll: {
    label: "查询条件",
    dataType: dataType.id_name_list,
    api: conditionList,
    params: {
      formId: { must: true, label: "模型id", dataType: dataType.string },
    },
  },
  reportItemListAll: {
    label: "统计项",
    dataType: dataType.id_name_list,
    api: reportItemListAll,
    params: {
      formId: { must: false, label: "模型id", dataType: dataType.string },
    },
  },
  getDictByCode: {
    label: "字典信息",
    dataType: dataType.val_title_list,
    api: listByCode,
    params: {
      code: { must: true, label: "字典编码", dataType: dataType.string },
    },
  },
  resourcesListAll: {
    label: "资源信息",
    dataType: dataType.id_name_list,
    api: resourcesListAll,
    params: {
      menuCode: {
        must: false,
        label: "指定菜单code",
        dataType: dataType.string,
      },
    },
  },
  listMenu: {
    label: "菜单资源",
    dataType: dataType.code_name_list,
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
        dataType: dataType.string,
      },
      val: {
        must: true,
        label: "外键ID",
        dataType: dataType.string,
      },
    },
  },

  sysFileDetails:{
    label:"文件列表",
    dataType:dataType.list,
    //dataType:Array<SysFile>,
    api:details,
    params:{
      ids:{
        must:true,
        dataType:dataType.list,
        label:"文件id列表"
      }
    }
  },
  total:{
    label:"数据统计",
    dataType:dataType.number,
    api:total,
    params:{
      code:{
        label:"统计项编码",
        dataType:dataType.string,
        sourceType:"fixed",
        table:{
          entityName:"reportItem",
          valField:"code",
          labelField:"name"
        }
      
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
        dataType: dataType.string,
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
