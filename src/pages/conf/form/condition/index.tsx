import { Card } from "@douyinfe/semi-ui";
import { PageQuery } from "@src/mvc/base";
import FormPage from "@src/pages/common/formPage";
import TablePage from "@src/pages/common/tablePage";
import React, { useState } from "react";

export default () => {
  const [formData, setFormData] = useState<Partial<PageQuery>>({});
  return (
    <div className="h-full overscroll-auto">
      <div className="h-full w-72 float-left ">
        <Card
          title="查询过滤条件"
          bordered={true}
          className="h-full"
          headerLine={false}
          headerStyle={{ fontSize: "small" }}
        >
          <FormPage
            type="req"
            onDataChange={(data) => setFormData({ ...data })}
            entityName="formCondition"
            modelName="formConditionPageReq"
          />
        </Card>
      </div>
      <div className="h-full md:min-w-3/4">
        <Card
          title="查询过滤条件"
          headerLine={false}
          bordered={false}
          className="h-full"
        >
          <TablePage
            req={{ ...formData }} //去除字符串结尾的0
            entityName="formCondition"
            select_more={true}
          />
        </Card>
      </div>
    </div>
  );
};
