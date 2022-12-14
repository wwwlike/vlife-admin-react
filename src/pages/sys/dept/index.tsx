import React, { useState } from "react";
import { Card } from "@douyinfe/semi-ui";
import FormPage from "@src/pages/common/formPage";
import TablePage from "@src/pages/common/tablePage";

export default () => {
  const [reqData, setReqData] = useState<any>();
  return (
    <div className="h-full overscroll-auto">
      <div className="h-full w-72 float-left ">
        <Card
          title="部门管理"
          bordered={true}
          className="h-full"
          headerLine={false}
          headerStyle={{ fontSize: "small" }}
        >
          <FormPage
            type="req"
            onDataChange={(data) => setReqData({ ...data })}
            entityName="sysDept"
            modelName="sysDeptPageReq"
          />
        </Card>
      </div>
      <div className="h-full md:min-w-3/4">
        <Card
          title="部门列表"
          headerLine={false}
          bordered={false}
          className="h-full"
        >
          <TablePage req={reqData} entityName="sysDept" editModel="sysDept" />
        </Card>
      </div>
    </div>
  );
};
