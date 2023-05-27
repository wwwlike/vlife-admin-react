import React, { lazy, FC, useEffect, useState } from "react";
import { Link, Route, useRoutes, RouteObject } from "react-router-dom";
import {
  WrapperRouteComponent,
  WrapperRouteWithOutLayoutComponent,
} from "./config";
import { AppProviders } from "@src/context";
import Empty from "@src/pages/common/Empty";
// 下一步做动态组件提取
//桌面
// import DemoPage =lazy(() => import( "@src/pages/demo"));
const DashboardPage = lazy(() => import("@src/pages/dashboard"));
//模版页面
const MainTemplatePage = lazy(() => import("@src/pages/template/main"));
//示例
const ExamplePage = lazy(() => import("@src/pages/example"));
//系统管理
const UserPage = lazy(() => import("@src/pages/sysManage/user"));
const DeptPage = lazy(() => import("@src/pages/sysManage/dept"));
const RolePage = lazy(() => import("@src/pages/sysManage/role"));
const GroupPage = lazy(() => import("@src/pages/sysManage/group"));
//系统配置
const ModelDesignPage = lazy(() => import("@src/pages/sysConf/formDesign")); //模型设计页
const ModelIndelPage = lazy(() => import("@src/pages/sysConf/model")); //模型主页
const ModelDetailPage = lazy(() => import("@src/pages/sysConf/model/detail")); //模型明细页
const ModelCodePage = lazy(() => import("@src/pages/sysConf/model/code")); //模型明细页
const MenuPage = lazy(() => import("@src/pages/sysConf/menu"));
const ResourcesPage = lazy(() => import("@src/pages/sysConf/resources"));
const DictPage = lazy(() => import("@src/pages/sysConf/dict"));
const EventPage = lazy(() => import("@src/pages/sysConf/event")); //事件主页

//业务系统
const LoginPage = lazy(() => import("@src/pages/login"));
const LayoutPage = lazy(() => import("@src/pages/layout"));

//erp
const LinkManPage = lazy(() => import("@src/pages/erp/linkman"));
const SupplierPage = lazy(() => import("@src/pages/erp/supplier"));
const CustomerPage = lazy(() => import("@src/pages/erp/customer"));
const ProductPage = lazy(() => import("@src/pages/erp/product"));
const OrderPurchasePage = lazy(() => import("@src/pages/erp/orderPurchase"));
const OrderSalePage = lazy(() => import("@src/pages/erp/orderSale"));

//report（plus）
const ReportItemPage = lazy(() => import("@src/plus/report/item")); //统计项
const ReportKpiPage = lazy(() => import("@src/plus/report/kpi"));
// const ReportKpiPage =lazy(() => import( "@src/plus/report/kpi")); //指标
const ReportDesignPage = lazy(() => import("@src/plus/report/design")); //报表设计器
const ReportPage = lazy(() => import("@src/plus/common/ReportPage")); //配置的报表

//pageDesign（plus）
const PageDesignIndexPage = lazy(() => import("@src/plus/page/design")); //页面设计列表页
//页面设置
const PageDesignLayoutPage = lazy(() => import("@src/plus/page/design/layout"));

//页面设置
const ViewPage = lazy(() => import("@src/plus/page/design/component/page"));

export const allRoute: any[] = [
  //系统业务
  {
    path: "/",
    element: (
      <WrapperRouteComponent
        element={<LayoutPage />}
        titleId="vlife-admin首页"
        auth
      />
    ),
    children: [
      {
        path: "dashboard/workbeach",
        element: (
          <WrapperRouteComponent
            element={<DashboardPage />}
            titleId="工作台"
            auth
          />
        ),
      },
      {
        path: "*",
        element: (
          <WrapperRouteComponent
            element={
              <Empty
                title="高级功能需要授权"
                description="添加微信`vlifeboot`申请开通"
                type="405"
              />
            }
            titleId="405"
          />
        ),
      },
    ],
  },
  //CRUD页面模版，根据路由后缀确定访问哪个模型
  {
    path: "/vlife",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="业务模版" auth />
    ),
    children: [
      {
        path: "*",
        element: (
          <WrapperRouteComponent
            element={<MainTemplatePage />}
            titleId="模版"
            auth
          />
        ),
      },
    ],
  },
  //系统管理
  {
    path: "/sysManage",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="系统配置" auth />
    ),
    children: [
      {
        path: "user",
        element: (
          <WrapperRouteComponent
            element={<UserPage />}
            titleId="用户管理"
            auth
          />
        ),
      },
      {
        path: "role",
        element: (
          <WrapperRouteComponent
            element={<RolePage />}
            titleId="角色管理"
            auth
          />
        ),
      },
      {
        path: "group",
        element: (
          <WrapperRouteComponent
            element={<GroupPage />}
            titleId="权限组管理"
            auth
          />
        ),
      },
      {
        path: "dept",
        element: (
          <WrapperRouteComponent
            element={<DeptPage />}
            titleId="权限组管理"
            auth
          />
        ),
      },
    ],
  },

  //系统配置
  {
    path: "/sysConf",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="系统配置" auth />
    ),
    children: [
      {
        path: "menu",
        element: (
          <WrapperRouteComponent
            element={<MenuPage />}
            titleId="菜单管理"
            auth
          />
        ),
      },
      {
        path: "event",
        element: (
          <WrapperRouteComponent
            element={<EventPage />}
            titleId="表单事件"
            auth
          />
        ),
      },
      {
        path: "dict",
        element: (
          <WrapperRouteComponent
            element={<DictPage />}
            titleId="字典管理"
            auth
          />
        ),
      },
      {
        path: "resources",
        element: (
          <WrapperRouteComponent
            element={<ResourcesPage />}
            titleId="权限资源管理"
            auth
          />
        ),
      },
      {
        path: "model",
        element: (
          <WrapperRouteComponent
            element={<ModelIndelPage />}
            titleId="模型管理"
            auth
          />
        ),
      },
      {
        path: "modelDesign/*",
        element: (
          <WrapperRouteComponent
            element={<ModelDesignPage />}
            titleId="模型设计"
            auth
          />
        ),
      },
      {
        path: "modelCode/*",
        element: (
          <WrapperRouteComponent
            element={<ModelCodePage />}
            titleId="模型代码"
            auth
          />
        ),
      },
      {
        path: "modelDetail/*",
        element: (
          <WrapperRouteComponent
            element={<ModelDetailPage />}
            titleId="模型明细"
            auth
          />
        ),
      },
    ],
  },

  {
    path: "/erp",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="进销存" auth />
    ),
    children: [
      {
        path: "linkman",
        element: (
          <WrapperRouteComponent
            element={<LinkManPage />}
            titleId="联系人"
            auth
          />
        ),
      },
      {
        path: "supplier",
        element: (
          <WrapperRouteComponent
            element={<SupplierPage />}
            titleId="供应商"
            auth
          />
        ),
      },
      {
        path: "customer",
        element: (
          <WrapperRouteComponent
            element={<CustomerPage />}
            titleId="客户"
            auth
          />
        ),
      },
      {
        path: "product",
        element: (
          <WrapperRouteComponent
            element={<ProductPage />}
            titleId="产品"
            auth
          />
        ),
      },
      {
        path: "orderPurchase",
        element: (
          <WrapperRouteComponent
            element={<OrderPurchasePage />}
            titleId="采购单"
            auth
          />
        ),
      },
      {
        path: "orderSale",
        element: (
          <WrapperRouteComponent
            element={<OrderSalePage />}
            titleId="销售单"
            auth
          />
        ),
      },
    ],
  },
  {
    path: "/example",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="组件演示" auth />
    ),
    children: [
      {
        path: "*",
        element: (
          <WrapperRouteComponent
            element={<ExamplePage />}
            titleId="demo"
            auth
          />
        ),
      },
    ],
  },
  // plus 高级版本
  {
    path: "/report",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="报表设置" auth />
    ),
    children: [
      {
        path: "item",
        element: (
          <WrapperRouteComponent
            element={<ReportItemPage />}
            titleId="统计项维护"
            auth
          />
        ),
      },
      {
        path: "kpi",
        element: (
          <WrapperRouteComponent
            element={<ReportKpiPage />}
            titleId="指标维护"
            auth
          />
        ),
      },
      {
        path: "design",
        element: (
          <WrapperRouteComponent
            element={<ReportDesignPage />}
            titleId="报表设计"
            auth
          />
        ),
      },
      {
        path: "table",
        element: (
          <WrapperRouteComponent
            element={<ReportPage />}
            titleId="配置结果"
            auth
          />
        ),
      },
    ],
  },
  {
    path: "/page",
    element: (
      <WrapperRouteComponent
        element={<LayoutPage />}
        titleId="页面和模块"
        auth
      />
    ),
    children: [
      {
        path: "design",
        element: (
          <WrapperRouteComponent
            element={<PageDesignIndexPage />}
            titleId="页面配置主页"
            auth
          />
        ),
      },
      {
        path: "layout/*",
        element: (
          <WrapperRouteComponent
            element={<PageDesignLayoutPage />}
            titleId="页面设计器"
            auth
          />
        ),
      },
    ],
  },
  //独立访问的页面
  {
    path: "/page/admin",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="组件演示" auth />
    ),
    children: [
      {
        path: "*",
        element: (
          <WrapperRouteComponent
            element={<ViewPage />}
            titleId="独立页面"
            auth
          />
        ),
      },
    ],
  },
  //独立访问的页面
  {
    path: "/page/*",
    element: <ViewPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: (
      <WrapperRouteWithOutLayoutComponent
        element={
          <Empty title="找不到咯" description="这里什么也没有~" type="404" />
        }
        titleId="404"
      />
    ),
  },
];

const RenderRouter: FC = () => {
  const [routeList, setRouteList] = useState<RouteObject[]>(allRoute);
  const element = useRoutes([...routeList]);

  // const element = useRoutes([...routeList]);

  // /**
  //  * 静态路由
  //  */
  // const routes = useMemo((): any => {
  //   return element;
  // }, [routeList]);

  return <AppProviders>{element}</AppProviders>;
};

export default RenderRouter;
