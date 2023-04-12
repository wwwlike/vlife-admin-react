import React, { lazy, FC, useEffect, useState } from "react";
import { RouteObject } from "react-router";
import { Link, Route, useRoutes } from "react-router-dom";
import {
  WrapperRouteComponent,
  WrapperRouteWithOutLayoutComponent,
} from "./config";
import { AppProviders } from "@src/context";
// 下一步做动态组件提取
//示例
import ExamplePage from "@src/pages/example";
import DemoPage from "@src/pages/demo";
//系统管理
import UserPage from "@src/pages/sysManage/user";
import DeptPage from "@src/pages/sysManage/dept";
import RolePage from "@src/pages/sysManage/role";
import GroupPage from "@src/pages/sysManage/group";
//系统配置
import ModelDesignPage from "@src/pages/sysConf/formDesign"; //模型设计页
import ModelIndelPage from "@src/pages/sysConf/model"; //模型主页
import ModelDetailPage from "@src/pages/sysConf/model/detail"; //模型明细页
import ModelCodePage from "@src/pages/sysConf/model/code"; //模型明细页
import MenuPage from "@src/pages/sysConf/menu";
import ResourcesPage from "@src/pages/sysConf/resources";
import DictPage from "@src/pages/sysConf/dict";
//业务系统
import LoginPage from "@src/pages/login";
import LayoutPage from "@src/pages/layout";

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
          <WrapperRouteComponent element={<DemoPage />} titleId="工作台" auth />
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
    path: "/example",
    element: (
      <WrapperRouteComponent element={<LayoutPage />} titleId="演示说明" auth />
    ),
    children: [
      {
        path: "crud/*",
        element: (
          <WrapperRouteComponent
            element={<ExamplePage />}
            titleId="入口"
            auth
          />
        ),
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
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
