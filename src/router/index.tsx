import React, { lazy, FC, useEffect, useState } from "react";
import { RouteObject } from "react-router";
import { Link, Route, useRoutes } from "react-router-dom";
import {
  WrapperRouteComponent,
  WrapperRouteWithOutLayoutComponent,
} from "./config";
import LayoutPage from "../pages/layout";
import Empty from "@src/components/empty";
import LoginPage from "@src/pages/login";
import { AppProviders } from "@src/context";
import CmsPage from "@src/components/cms";
/**
 * 这里是路由配置页面
 * menu\config.ts 是菜单内容的配置信息
 */

const TemplatePage = lazy(() => import("../pages/template"));
const DashboardWorkbeach = lazy(() => import("../pages/dashboard/workbeach"));
const IndexPage = lazy(() => import("../pages/dashboard"));
const Quickstart = lazy(() => import("../pages/guide/quickstartMp4"));
const AreaPage = lazy(() => import("../pages/sys/area"));
const ReportPage = lazy(() => import("../pages/common/ReportPage"));
const UserPage = lazy(() => import("../pages/sys/user"));
const OrgPage = lazy(() => import("../pages/sys/org"));
const DeptPage = lazy(() => import("../pages/sys/dept"));
const DictPage = lazy(() => import("../pages/sys/dict"));
const FormConditionPage = lazy(() => import("../pages/conf/form/condition"));
const ReportItemPage = lazy(() => import("../pages/conf/report/item"));
const ReportKpiPage = lazy(() => import("../pages/conf/report/kpi"));
const ReportDesignPage = lazy(() => import("../pages/report"));
const ResourcesPage = lazy(() => import("../pages/auth/resources"));
const FilterPage = lazy(() => import("../pages/auth/filter"));
const RolePage = lazy(() => import("@src/pages/auth/role"));
const GroupPage = lazy(() => import("@src/pages/auth/group"));
const Abnormal403 = lazy(() => import("@src/pages/abnormal/403"));
const Abnormal404 = lazy(() => import("@src/pages/abnormal/404"));
const Abnormal500 = lazy(() => import("@src/pages/abnormal/500"));
const TsCode = lazy(() => import("@src/pages/tsCode"));
const MP4 = lazy(() => import("@src/pages/guide"));
const DesignPage = lazy(() => import("@src/pages/design"));
const ProjectPage = lazy(() => import("@src/pages/bus/project"));
const NewsPage = lazy(() => import("@src/pages/bus/oaNews"));
//页面设置
const LayOutPage = lazy(() => import("@src/components/layout"));
//页面列表
const LayOutList = lazy(() => import("@src/components/layout/list"));
const Page = lazy(() => import("@src/pages/page"));
const Header = lazy(() => import("@src/components/cms/header"));
const RenderRouter: FC = () => {
  const [routeList, setRouteList] = useState<RouteObject[]>([
    {
      path: "/",
      element: (
        <WrapperRouteComponent element={<LayoutPage />} titleId="" auth />
      ),
      children: [
        {
          path: "sys/user",
          element: (
            <WrapperRouteComponent
              element={<UserPage />}
              titleId="用户管理"
              auth
            />
          ),
        },
        {
          path: "sys/dict",
          element: (
            <WrapperRouteComponent
              element={<DictPage />}
              titleId="字典管理"
              auth
            />
          ),
        },
        {
          path: "conf/design",
          element: (
            <WrapperRouteComponent
              element={<DesignPage />}
              titleId="表单设计"
            />
          ),
        },
        {
          path: "conf/report",
          element: (
            <WrapperRouteComponent
              element={<ReportDesignPage />}
              titleId="报表设计"
            />
          ),
        },
        {
          path: "conf/formCondition",
          element: (
            <WrapperRouteComponent
              element={<FormConditionPage />}
              titleId="查询过滤条件"
            />
          ),
        },
        {
          path: "conf/reportItem",
          element: (
            <WrapperRouteComponent
              element={<ReportItemPage />}
              titleId="报表项维护"
            />
          ),
        },
        {
          path: "conf/reportKpi",
          element: (
            <WrapperRouteComponent
              element={<ReportKpiPage />}
              titleId="报表指标维护"
            />
          ),
        },
        {
          path: "conf/resources",
          element: (
            <WrapperRouteComponent
              element={<ResourcesPage />}
              titleId="资源管理"
              auth
            />
          ),
        },
        {
          path: "auth/role",
          element: (
            <WrapperRouteComponent
              element={<RolePage />}
              titleId="角色管理"
              auth
            />
          ),
        },
        {
          path: "report",
          element: (
            <WrapperRouteComponent
              element={<ReportPage />}
              titleId="统计分析"
              auth
            />
          ),
        },
        {
          path: "conf/layout",
          element: (
            <WrapperRouteComponent
              element={<LayOutList />}
              titleId="首页设计"
              auth
            />
          ),
        },
        {
          path: "conf/layout/*",
          element: (
            <WrapperRouteComponent
              element={<LayOutPage />}
              titleId="页面设计"
              auth
            />
          ),
        },
        {
          path: "auth/group",
          element: (
            <WrapperRouteComponent
              element={<GroupPage />}
              titleId="权限组管理"
              auth
            />
          ),
        },
        {
          path: "conf/filter",
          element: (
            <WrapperRouteComponent
              element={<FilterPage />}
              titleId="行级权限配置"
              auth
            />
          ),
        },
        {
          path: "template/*",
          element: (
            <WrapperRouteComponent
              element={<TemplatePage />}
              titleId="动态模板"
              auth
            />
          ),
        },
        {
          path: "oa/project",
          element: (
            <WrapperRouteComponent
              element={<ProjectPage />}
              titleId="项目管理"
              auth
            />
          ),
        },
        {
          path: "oa/news",
          element: (
            <WrapperRouteComponent element={<NewsPage />} titleId="新闻" />
          ),
        },
        {
          path: "sys/sysDept",
          element: (
            <WrapperRouteComponent
              element={<DeptPage />}
              titleId="部门管理"
              auth
            />
          ),
        },
        {
          path: "sys/sysOrg",
          element: (
            <WrapperRouteComponent
              element={<OrgPage />}
              titleId="机构管理"
              auth
            />
          ),
        },
        {
          path: "sys/sysArea",
          element: (
            <WrapperRouteComponent
              element={<AreaPage />}
              titleId="地区管理"
              auth
            />
          ),
        },
        {
          path: "dashboard/workbeach",
          element: (
            <WrapperRouteComponent
              element={<Page moduleId="desktop" />}
              titleId="工作台"
              auth
            />
          ),
        },

        {
          path: "help",
          element: (
            <WrapperRouteComponent element={<MP4 />} titleId="视频介绍" />
          ),
        },
        {
          path: "abnormal/403",
          element: (
            <WrapperRouteComponent
              element={<Abnormal403 />}
              titleId="403"
              auth
            />
          ),
        },
        {
          path: "abnormal/404",
          element: (
            <WrapperRouteComponent
              element={<Abnormal404 />}
              titleId="404"
              auth
            />
          ),
        },
        {
          path: "abnormal/500",
          element: (
            <WrapperRouteComponent
              element={<Abnormal500 />}
              titleId="500"
              auth
            />
          ),
        },
        {
          path: "ts/code",
          element: (
            <WrapperRouteComponent element={<TsCode />} titleId="文件下载" />
          ),
        },
      ],
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "cms",
      element: (
        <WrapperRouteWithOutLayoutComponent
          element={<CmsPage />}
          titleId="vlife官网"
        />
      ),
    },
    {
      path: "page/*",
      element: (
        <WrapperRouteWithOutLayoutComponent
          element={<Page />}
          titleId="vlife官网"
        />
      ),
    },
    {
      path: "header/*",
      element: (
        <WrapperRouteWithOutLayoutComponent
          element={<Header />}
          titleId="vlife官网"
        />
      ),
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
  ]);

  const element = useRoutes([...routeList]);
  useEffect(() => {
    // setElement();
    // listAll().then((d: Result<PageLayout[]>) => {
    //   // alert(d.data?.length);
    //   setRouteList([
    //     ...routeList,
    //     {
    //       path: "login1234",
    //       element: (
    //         <WrapperRouteWithOutLayoutComponent
    //           element={<LoginPage />}
    //           titleId="VLIFE快速开发平台"
    //         />
    //       ),
    //     },
    //   ]);
  }, []);

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
