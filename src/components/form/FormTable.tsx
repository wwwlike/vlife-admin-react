import { Button, Modal } from "@douyinfe/semi-ui";

import FormPage from "@src/pages/common/formPage";
import TablePage from "@src/pages/common/tablePage";
import { useUpdateEffect } from "ahooks";
import { useState } from "react";
import { IconTextStroked } from "@douyinfe/semi-icons";
import { FormVo } from "@src/api/Form";
import { VfBaseProps } from "@src/dsl/schema/component";
import { VfButton } from "@src/dsl/schema/button";

/**
 * 支持临时保存的数据列表 (用作1对多子表单使用)
 * 表单里的列表批量编辑组件
 * 待办：可以加入假分页
 */
interface FormTableProps extends VfBaseProps<any[], FormVo> {
  type: string; //字段类型
}

export default ({
  type,
  value,
  onDataChange,
  read,
  ...props
}: FormTableProps) => {
  //当前编辑行号，有值则弹出框弹出
  const [index, setIndex] = useState<number>();
  //表单数据
  const [formData, setFormData] = useState<any>();
  //列表数据
  const [tableData, setTableData] = useState<any[]>(value ? value : []);

  const lineButton: VfButton<any>[] = [
    {
      title: "修改",
      key: "sava",
      click: (btn: VfButton<any>, number, data) => {
        setFormData(data);
        setIndex(number);
      },
    },
    {
      title: "删除",
      key: "remove",
      icon: <IconTextStroked></IconTextStroked>,
      click: (btn, number, data) => {
        setTableData(tableData.filter((f, index) => index !== number));
      },
    },
  ];

  useUpdateEffect(() => {
    onDataChange(tableData);
  }, [tableData]);
  return (
    <div>
      {!read ? (
        <Button
          onClick={() => {
            setIndex(-1);
          }}
        >
          +
        </Button>
      ) : (
        ""
      )}
      <Modal
        title="关联选择"
        visible={index !== undefined ? true : false}
        onOk={() => {
          if (formData && index === -1) {
            const newData = [...tableData, formData];
            //新增
            setTableData(newData);
          } else if (formData && index !== -1) {
            //修改替换
            setTableData(
              tableData.map((f, num) => (num === index ? formData : f))
            );
          }
          setFormData(undefined);
          setIndex(undefined);
        }}
        centered
        onCancel={() => {
          setIndex(undefined);
        }}
        width={900}
        // bodyStyle={{ overflow: "auto" }}
      >
        <FormPage
          key={"formPage_" + index}
          formData={formData}
          onDataChange={setFormData}
          type={type}
        />
      </Modal>
      {/* {JSON.stringify(value)} */}
      <TablePage<any>
        btnHide={true}
        key={"table_sub" + props.fieldName + tableData.length}
        dataSource={tableData}
        entityType={type}
        // lineBtn={lineButton}
        lineBtn={!read ? lineButton : undefined}
      ></TablePage>
    </div>
  );
};
