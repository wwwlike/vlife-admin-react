import React from "react";
import Content from "../../template/content";
import {
  OrderPurchase,
  OrderPurchaseDto,
  state,
} from "@src/api/erp/OrderPurchase";
import { OrderPurchaseDetail } from "@src/api/erp/OrderPurchaseDetail";
import { BtnType, RecordNum } from "@src/dsl/schema/button";
import { IconPriceTag } from "@douyinfe/semi-icons";

export default () => {
  return (
    <Content<OrderPurchase>
      entityType="orderPurchase"
      filterType="orderPurchasePageReq"
      listType="orderPurchase"
      editType="orderPurchaseDto"
      lineBtn={[
        {
          key: "orderpurchaseEdit",
          type: BtnType.EDIT,
          // disable_hidden: true,
          tooltip: "已采购，不可编辑",
          enable_match: { state: "2" },
        },
        {
          key: "orderpurchaseRm",
          type: BtnType.RM,
          // disable_hidden: true,
          tooltip: "已采购，不可删除",
          enable_match: { state: "2" },
        },
      ]}
      tableBtn={[
        {
          title: "采购完成",
          key: "reset",
          code: "orderPurchase:finish",
          icon: <IconPriceTag />,
          enable_recordNum: RecordNum.MORE,
          tableApi: (...ids: string[]) => state({ ids, state: "1" }),
          statusCheckFunc: (...record: OrderPurchase[]) => {
            if (record.filter((r) => r.state === "1").length > 0) {
              return "请选择状态为没有完成的采购单";
            }
          },
        },
        {
          key: "orderPurchaseRm",
          type: BtnType.RM,
          statusCheckFunc: (...record: OrderPurchase[]) => {
            if (record.filter((r) => r.state === "1").length > 0) {
              return "只能对采购状态是未完成的订单进行删除";
            }
          },
        },
      ]}
      dataComputer={{
        funs: (data: OrderPurchaseDto) => {
          const total = data.details?.reduce(
            (sum: number, current: OrderPurchaseDetail) => {
              return sum + current.price * current.total;
            },
            0
          );
          return { ...data, totalPrice: total };
        },
      }}
    ></Content>
  );
};
