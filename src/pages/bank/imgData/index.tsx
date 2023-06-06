import { BankImgData } from "@src/api/bank/BankImgData";
import Content from "@src/pages/template/content";
import React from "react";

export default () => {
  return (
    <Content<BankImgData>
      entityType="bankImgData"
      listType="bankImgDataVo"
      filterType="bankImgDataPageReq"
      showOrder={false}
    ></Content>
  );
};
