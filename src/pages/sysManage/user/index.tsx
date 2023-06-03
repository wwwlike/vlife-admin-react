import React from "react";
import { reset, state, SysUser } from "@src/api/SysUser";
import { IconPlay, IconPause, IconForward } from "@douyinfe/semi-icons";
import Content from "../../template/content";
import { BtnType, RecordNum } from "@src/dsl/schema/button";
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
        onAfterSave={(key: any, d) => {
          //保存之后回调方法
        }}
        validate={{
          age: (val: any, formData: object) => {
            return val > 100 ? "value不正确" : undefined;
          },
        }}
        lineBtn={[
          {
            title: "启用",
            code: "sysUser:state", //加入权限
            type: BtnType.EDIT,
            icon: <IconPlay />,
            disable_hidden: true,
            enable_match: { state: "-1" }, //属性匹配方式校验
            statusCheckFunc: (record: SysUser) => {
              //得到全量数据，根据数据进行复杂逻辑校验；
            },
            // 简化api ,增加手工表校验。
            tableApi: (id: string) => state({ ids: [id], state: "1" }),
          },
          {
            title: "停用",
            code: "sysUser:state",
            icon: <IconPause />,
            enable_match: { state: "1" },
            disable_hidden: true,
            statusCheckFunc: (record: SysUser) => {},
            tableApi: (id: string) => state({ ids: [id], state: "-1" }),
          },
        ]}
        tableBtn={[
          {
            title: "密码重置",
            className: "fieldSelectTour",
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
