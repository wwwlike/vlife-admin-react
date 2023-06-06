import { BankBatch } from "@src/api/bank/BankBatch";
import Content from "@src/pages/template/content";
import React from "react";

export default () => {
  return (
    <Content<BankBatch>
      title="存档批次"
      entityType="bankBatch"
      filterType="bankBatchPageReq"
      showOrder={false}
    ></Content>
  );
};
