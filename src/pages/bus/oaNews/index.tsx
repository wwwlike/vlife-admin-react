/**
 * 新闻列表页面
 */
import { Card } from "@douyinfe/semi-ui";
import FormPage from "@src/pages/common/formPage";
import TablePage from "@src/pages/common/tablePage";
import React, { useState } from "react";
export default () => {
  const [formData, setFormData] = useState<any>({});
  const entityName = "oaNews";
  return (
    <div className="h-full overscroll-auto">
      <div className="h-full w-72 float-left ">
        <Card
          title="新闻管理"
          bordered={true}
          className="h-full"
          headerLine={false}
          headerStyle={{ fontSize: "small" }}
        >
          {
            <FormPage
              type="req"
              onDataChange={(data) => setFormData({ ...data })}
              entityName={entityName}
              modelName="OaNewsPageReq"
            />
          }
        </Card>
      </div>
      <div className="h-full md:min-w-3/4">
        <Card
          title="新闻管理列表"
          headerLine={false}
          bordered={false}
          className="h-full"
        >
          <TablePage
            req={formData} //搜索条件
            entityName={entityName}
            select_more={true}
          ></TablePage>
        </Card>
      </div>
    </div>
  );
};
