import { Card } from "@douyinfe/semi-ui";
import { PageQuery } from "@src/mvc/base";
import FormPage from "@src/pages/common/formPage";
import TablePage from "@src/pages/common/tablePage";
import React, { useState } from "react";
/**
 * 统计项管理
 */
export default () => {
  const [reqData, setReqData] = useState<Partial<PageQuery>>({});
  return (
    <div className="h-full overscroll-auto">
      <div className="h-full w-72 float-left ">
        <Card
          title="指标项管理"
          bordered={true}
          className="h-full"
          headerLine={false}
          headerStyle={{ fontSize: "small" }}
        >
          <FormPage
            type="req"
            onDataChange={(data) => setReqData({ ...data })}
            entityName="reportKpi"
            modelName="reportKpiPageReq"
          />
        </Card>
      </div>
      <div className="h-full md:min-w-3/4">
        <Card
          title="指标项列表"
          headerLine={false}
          bordered={false}
          className="h-full"
        >
          <TablePage req={{ ...reqData }} entityName="reportKpi" />
        </Card>
      </div>
    </div>
  );
};
