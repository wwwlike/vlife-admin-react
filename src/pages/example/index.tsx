import { useTitle } from "ahooks";
import React, { ReactNode, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import FormPage from "../common/formPage";
import TablePage from "../common/tablePage";

import CodeBlock from "./CodeBlock";

interface DemoObj {
  code: string;
  title: string;
  remark?: string;
  scope?: Record<string, unknown>;
}

export default () => {
  const demos: { [key: string]: DemoObj | DemoObj[] } = {
    "1": [
      {
        code: `<FormPage type="sysUser"  />`,
        title: "数据库表模型sysUser",
        scope: { FormPage },
      },
      {
        code: `<FormPage type="userPasswordModifyDto" />`,
        title: "数据传输模型dto",
        scope: { FormPage },
      },
    ],
    "2": [
      {
        code: `
      <FormPage type="sysUser" formData={{
        email: "vlifelowcode@163.com",
        tel: "888888",
        usetype:"1",
        username:"admin",
        id:"111111112222",
        age:18
      }} readPretty={true} />;`,
        title: "预览模式(实体模型)",
        scope: { FormPage },
      },
      {
        code: `
      <FormPage type="userDetailVo" formData={{
        email: "vlifelowcode@163.com",
        tel: "888888",
        usetype:"1",
        age:18
      }} readPretty={true} />;`,
        title: "预览模式(userDetailVo视图)",
        scope: { FormPage },
      },
    ],
    3: {
      code: `
      <FormPage type="sysUser"  />;`,
      title: "预览模式",
      scope: { FormPage },
    },

    basicList: [
      {
        code: `
      <TablePage entityType="sysUser" btnHide={true} />;`,
        title: "基础列表(默认有修改，删除、新增)",
        scope: { TablePage },
      },
      {
        code: `
        <TablePage entityType="sysUser"  />`,
        title: "无任何按钮",
        scope: { TablePage },
      },
      {
        code: `
        <TablePage entityType="sysUser" btnHide={true} 
        tableBtn={[
          {
            title: "密码重置",
          },
        ]}

        lineBtn={[
          {
            title: "启用",
          },
          {
            title: "停用",
          },
        ]}

        />`,
        title: "自定义按钮",
        scope: { TablePage },
      },
    ],
  };
  const { pathname } = useLocation();

  const demo = useMemo((): DemoObj | DemoObj[] | undefined => {
    const length = pathname.indexOf("/example/") + 9;
    const name = pathname.substring(length);
    return demos[name];
  }, [pathname]);

  const title = useMemo((): string => {
    return "";
  }, [demo]);
  // useTitle(title);

  if (demo && !Array.isArray(demo)) {
    return <CodeBlock title={demo.title} code={demo.code} scope={demo.scope} />;
  } else if (demo && Array.isArray(demo)) {
    return (
      <div>
        {(demo as Array<DemoObj>).map((d, index) => (
          <CodeBlock
            key={`demoObj${index}`}
            title={d.title}
            code={d.code}
            scope={d.scope}
          />
        ))}
      </div>
    );
  } else {
    return <>demo没有找到,需要再在menu里配置</>;
  }
};
