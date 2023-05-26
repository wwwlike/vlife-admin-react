import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import React from "react";
import { Card, Modal, Table, TabPane, Tabs } from "@douyinfe/semi-ui";
import prettier from "prettier/standalone";
import parserTypescript from "prettier/parser-typescript";

function formatCode(code: string) {
  return prettier.format(code, {
    parser: "typescript",
    plugins: [parserTypescript],
    tabWidth: 2,
    singleQuote: true,
    trailingComma: "es5",
  });
}

export interface ICodeBlockProps {
  title: string;
  code: string;
  scope: any;
  apiDocData?: any; //api文档
}
const CodeBlock = ({ title, code, scope, apiDocData }: ICodeBlockProps) => {
  return (
    <LiveProvider code={formatCode(code.trim())} scope={scope}>
      <div className=" flex w-full ">
        <Card title={title} className="  w-3/5 ">
          <Card>
            <LivePreview />
          </Card>
          <LiveError />
          {/* </div> */}
        </Card>
        <Card className=" w-2/5">
          <Tabs className="h-full " defaultActiveKey="1">
            <TabPane
              tab="ts代码"
              itemKey="1"
              style={{ background: "#f5f5f5", padding: 10 }}
            >
              <LiveEditor
                style={{
                  fontFamily: "Consolas",
                  fontSize: 18,
                  lineHeight: "1.5",
                }}
              />
            </TabPane>
            {apiDocData && (
              <TabPane tab="api说明" itemKey="2">
                <Table
                  columns={[
                    { dataIndex: "attr", title: "属性" },
                    { dataIndex: "interface", title: "类型" },
                    { dataIndex: "default", title: "默认值" },
                    { dataIndex: "remark", title: "描述" },
                  ]}
                ></Table>
              </TabPane>
            )}
          </Tabs>
        </Card>
      </div>
    </LiveProvider>
  );
};

export default CodeBlock;
