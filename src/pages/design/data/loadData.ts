import { roleAllResources } from "@src/mvc/SysResources";
import { listAll, listMenu } from "@src/mvc/SysResources";
import { listAll as orgList } from "@src/mvc/SysOrg";
import { listAll as fieldList } from "@src/mvc/model/FormField";
import { listAll as deptList } from "@src/mvc/SysDept";
import { listAll as areaList } from "@src/mvc/SysArea";
import { list as listUser } from "@src/mvc/SysUser";
import { listSysFilterVo } from "@src/mvc/SysGroup";
import { findName } from "@src/provider/baseProvider";
import {
  detailFormVo,
  entityModels,
  formReportItemAll,
  formReportKpiAll,
} from "@src/mvc/model/Form";
import { loadData } from "@src/mvc/model/FormField";
import { listAll as itemListAll } from "@src/mvc/model/ReportItem";

/**
 * 组件异步接口信息
 * formPage里调用接口取数据，网form/index组件里传值
 */
// export interface loadDatasProps {
//   /** 异步接口 */
//   loadData: (params: componentProps | any) => Promise<Result<any>>;
//   /**组件需要额外传入的固定的prop参数 */
//   props?: any;
//   /** 接口固定的入参 ，formPage从这里提取数据，传入到loadData方法里*/
//   params?: any;
//   /** 接口动态入参（级联组件异步拉取数据时候使用）=>form/index里进行异步数据提取（reactions方式）
//    * 动态入参数据基本都是从组件里的字段提取出来，不同组件字段命名存在不一的情况，故在这里有一个配置对应的Json设置
//    * modelName: { formItem: "entityName" }, => 表示 接口的入参modelName,对应formItem实体的 entityName字段
//    * */
//   dynamic?: { [interfaceParamsName: string]: { [key: string]: string } }; //可以对应的入参名称,配置方式实现，级联
// }

// export interface CustomField {

// }

// 实现可以赋值任意字段 key接口描述
const loadDatas: { [key: string]: loadData } = {
  roleAllResources: {
    loadData: roleAllResources,
  },
  resourcesApiAll: {
    loadData: listAll,
  },
  //外键名称
  findName: {
    loadData: findName,
  },
  listMenu: {
    loadData: listMenu,
  },
  listUser: {
    loadData: listUser,
  },
  areaTree: {
    loadData: areaList,
    props: {
      valField: "code",
    },
  },
  orgTree: {
    loadData: orgList,
    props: {
      valField: "code",
    },
  },
  deptTree: {
    loadData: deptList,
    props: {
      //组件里传值
      valField: "code",
    },
  },
  entityModels: {
    loadData: entityModels,
  },
  deptSelect: {
    loadData: deptList,
  },
  orgSelect: {
    loadData: orgList,
  },
  areaSelect: {
    loadData: areaList,
  },
  sysFilterSelect: {
    loadData: listSysFilterVo,
    props: {
      valField: "id",
    },
  },
  KPformReportItemPageSelect: {
    loadData: formReportItemAll,
    props: {
      selectType: "more",
    },
  },
  formReportKpiPageSelect: {
    loadData: formReportKpiAll,
    props: {
      selectType: "more",
    },
  },
  reportItemSelect: {
    loadData: itemListAll,
    dynamic: {
      formId: {
        reportKpi: "formId",
      },
    },
  },
  reportItemAllSelect: {
    loadData: itemListAll,
  },
  fieldAllList: {
    loadData: fieldList,
    dynamic: {
      formId: {
        reportItem: "formId",
      },
    },
  },
  // saveModel: {
  //   //模型信息
  //   loadData: model,
  //   props: {
  //     uiType: "save",
  //   },
  //   //表示model接口有一个动态入参modelName,当前模型是formItem时，用它的entityName传入
  //   dynamic: {
  //     modelName: { formItem: "entityName" },
  //   },
  // },
  detailFormVo: {
    loadData: detailFormVo,
    dynamic: {
      id: { formCondition: "formId" },
    },
  },

  // FormTable: {
  //   loadData: model,
  //   props: {
  //     //二外传参
  //     uiType: "save",

  //   },
  // },
};

export default loadDatas;
