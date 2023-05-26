import React from "react";
import { reset, state, SysUser } from "@src/api/SysUser";
import { IconPlay, IconPause, IconForward } from "@douyinfe/semi-icons";
import Content from "../../template/content";
import { RecordNum } from "@src/dsl/schema/button";
import VfTour from "@src/components/VfTour";

export default () => {
  return (
    <VfTour
      code="dded"
      steps={[
        {
          selector: ".fieldSelectTour",
          content: "选择表单需要的字段，并且进行排序",
        },
      ]}
    >
      <Content<SysUser>
        entityType="sysUser"
        filterType="sysUserPageReq"
        req={{ state: "1" }}
        onAfterSave={(key: string, d) => {}}
        validate={{
          age: (val: any, formData: object) => {
            return val > 100 ? "value不正确" : undefined;
          },
        }}
        lineBtn={[
          {
            title: "启用",
            key: "open",
            code: "sysUser:state",
            icon: <IconPlay />,
            disable_hidden: true,
            enable_match: { state: "-1" },
            statusCheckFunc: (record: SysUser) => {
              return record.state === "1" ? "不能操作" : undefined;
            },
            // 简化api ,增加手工表校验。
            tableApi: (id: string) => state({ ids: [id], state: "1" }),
          },
          {
            title: "停用",
            key: "stop",
            code: "sysUser:state",
            icon: <IconPause />,
            disable_hidden: true,
            statusCheckFunc: (record: SysUser) => {
              if (record.state === "-1") return "不能操作";
            },
            tableApi: (id: string) => state({ ids: [id], state: "-1" }),
          },
        ]}
        tableBtn={[
          {
            title: "密码重置",
            className: "fieldSelectTour",
            key: "reset",
            tooltip: "密码会被重置成123456",
            code: "sysUser:reset",
            icon: <IconForward />,
            enable_recordNum: RecordNum.MORE,
            tableApi: reset,
          },
        ]}
      />
    </VfTour>
  );
};
