import { Button, Modal } from "@douyinfe/semi-ui";
import { FormVo } from "@src/mvc/model/Form";
import FormPage from "@src/pages/common/formPage";
import TablePage from "@src/pages/common/tablePage";
import { useUpdateEffect } from "ahooks";
import { useState } from "react";
import { VfButton } from ".";
import { VfBaseProps } from "..";

/**
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

  const customBtn: VfButton[] = [
    {
      title: "修改",
      tableBtn: false,
      click: (btn, number, data) => {
        setFormData(data);
        setIndex(number);
      },
    },
    {
      title: "删除",
      tableBtn: false,
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
          type="save"
          formData={formData}
          onDataChange={setFormData}
          entityName={type}
          modelName={type}
        />
      </Modal>
      <TablePage
        btnEnable={{ disable: true }}
        key={"table_sub" + props.fieldName}
        datas={tableData}
        entityName={type}
        customBtns={!read ? customBtn : undefined}
      ></TablePage>
    </div>
  );
};
