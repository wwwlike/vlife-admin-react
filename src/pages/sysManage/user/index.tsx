import React from "react";
import { exist, reset, state, SysUser } from "@src/api/SysUser";
import { IconPlay, IconPause, IconForward } from "@douyinfe/semi-icons";
import { Result } from "@src/api/base";
import Content from "../../template/content";
import { RecordNum } from "@src/dsl/schema/button";
import VfTour from "@src/components/VfTour";
import { Button } from "@douyinfe/semi-ui";

export default () => {
  return (
    <VfTour
      steps={[{ selector: ".tourB", content: <div>2222222226222222</div> }]}
    >
      <Content<SysUser>
        entityType="sysUser"
        filterType="sysUserPageReq"
        req={{ state: "1" }}
        onAfterSave={(key: string, d) => {}}
        lineBtn={[
          {
            title: "启用",
            code: "sysUser:state",
            key: "open",
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
          // {
          //   title: "修改2",
          //   model: {
          //     entityType: "sysUser",
          //     type: "sysUser",
          //     validate: {
          //       name: (v, dto: any) => {
          //         return exist({
          //           fieldName: "name",
          //           fieldVal: v,
          //           id: dto.id,
          //         }).then((d: Result<number>) => {
          //           if (d.data && d.data > 0) {
          //             return "用户名已存在";
          //           }
          //         });
          //       },
          //     },
          //   },
          // },
        ]}
        tableBtn={[
          {
            title: "密码重置",
            key: "reset",
            className: "tourB",
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
