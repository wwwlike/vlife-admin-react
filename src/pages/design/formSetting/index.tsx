/**
 * 表单配置
 * 包含保单列数和分组容器的定义
 */

import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
} from "@douyinfe/semi-ui";
import { ArrayField, FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { FormVo } from "@src/mvc/model/Form";
import { useUpdateEffect } from "ahooks";
import React, { useEffect } from "react";
import { useRef, useState } from "react";
interface formSettingProp {
  form: FormVo;
  uiType: "req" | "save";
  onDataChange: (form: FormVo) => void;
}

export default ({ form, uiType, onDataChange, ...prop }: formSettingProp) => {
  const api = useRef<FormApi>();
  const [formData, setFormData] = useState<FormVo>({ ...form });
  //非首次执行
  useUpdateEffect(() => {
    onDataChange({ ...formData });
  }, [formData]);
  return (
    <Card>
      <Form
        getFormApi={(formApi) => (api.current = formApi)}
        labelAlign="left"
        labelPosition="left"
        onValueChange={(currData, val) => {
          if (Object.keys(val).length === 1) {
            // 单词改变通知出去
            setFormData({ ...formData, ...currData });
          }
        }}
      >
        <Row>
          <Col span={12}>
            <Form.Input
              field="name"
              initValue={formData.name}
              label="表单名称"
              style={{ width: "90%" }}
            />
          </Col>
          <Col span={12}>
            <Form.Select
              label="列数"
              style={{ width: "90%" }}
              field="gridSpan"
              initValue={formData.gridSpan || (uiType === "req" ? 1 : 2)}
              optionList={[
                { label: "1列", value: 1 },
                { label: "2列", value: 2 },
                { label: "3列", value: 3 },
                { label: "4列", value: 4 },
                { label: "5列", value: 5 },
                { label: "6列", value: 6 },
              ]}
            ></Form.Select>
          </Col>
        </Row>
        <Divider margin="12px" align="left">
          Tab页
        </Divider>
        <ArrayField field="groups" initValue={formData.groups}>
          {({ add, arrayFields, addWithInitValue }) => (
            <React.Fragment>
              <Button onClick={add} theme="light">
                新增
              </Button>
              {/* <Button onClick={() => {addWithInitValue({ name: '自定义贴纸', type: '2D' });}} style={{ marginLeft:8 }}>新增带有初始值的行</Button> */}
              {arrayFields.map(({ field, key, remove }, i) => (
                <Row key={"row" + i}>
                  <Col span={8} key="col1">
                    <Form.Input
                      field={`${field}[name]`}
                      label="页签名称"
                      style={{ width: "90%" }}
                    ></Form.Input>
                  </Col>
                  <Col span={4} key="col4">
                    <Button
                      type="danger"
                      theme="borderless"
                      onClick={remove}
                      style={{ margin: 12 }}
                    >
                      删
                    </Button>
                  </Col>
                </Row>
              ))}
            </React.Fragment>
          )}
        </ArrayField>
      </Form>
      {/* {JSON.stringify(formData.name)} */}
    </Card>
  );
};
