import React from "react";
import { SysDept } from "@src/api/SysDept";
import Content from "../../template/content";

export default () => {
  return (
    <Content<SysDept>
      title="部门"
      entityType="sysDept"
      filterType="sysDeptPageReq"
    ></Content>
  );
};
