import { BankFlow } from "@src/api/bank/BankFlow";
import Content from "@src/pages/template/content";
import React from "react";

export default () => {
  return (
    <Content<BankFlow>
      entityType="bankFlow"
      filterType="bankFlowPageReq"
      showOrder={false}
      column={[
        "name",
        "certCode",
        "account",
        "txCode",
        "amount",
        "subjectName",
        "occurDate",
        "sysUserId",
        "sysDeptId",
      ]}
    ></Content>
  );
};
