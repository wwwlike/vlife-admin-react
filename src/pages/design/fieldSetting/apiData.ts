import { Result } from "@src/mvc/base";
import { listAll as formFieldListAll } from "@src/mvc/model/FormField";
import { listAll as resourcesListAll, listMenu } from "@src/mvc/SysResources";

import { listAll as reportItemListAll } from "@src/mvc/model/ReportItem";
import { roleAllResources } from "@src/mvc/SysResources";
import { listAll as orgList } from "@src/mvc/SysOrg";
import { listAll as deptList } from "@src/mvc/SysDept";
import { listAll as areaList } from "@src/mvc/SysArea";

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

/**
 * 接口参数定义
 */
export interface ParamDef {
  [key: string]: {
    label: string; // 参数名称
    must?: boolean; // 是否必须
    dataType: dataType; //参数类型
  };
  // | string; //直接给值，固定传参，不用端设置
}
/**
 * 接口定义
 */
export interface ApiDef {
  [key: string]: {
    label: string; //名称
    dataType: dataType; //出参数据类型
    remark?: string; //说明备注信息
    codeDemo?: string; //返回代码示例
    api: (params?: any) => Promise<Result<any>>; // 接口
    params?: ParamDef; //接口定义信息
  };
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
