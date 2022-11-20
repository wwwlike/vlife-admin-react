import { Input, Modal, Tag, TagInput } from "@douyinfe/semi-ui";
import React, { useCallback, useEffect, useState } from "react";
import { useNiceModal } from "@src/store";
import { VfBaseProps, VfType } from "..";
import { TagInputProps } from "@douyinfe/semi-ui/lib/es/tagInput";
import { useUpdateEffect } from "ahooks";
import { PreviewText } from "@formily/semi";
import TablePage from "@src/pages/common/tablePage";

/**
 * 业务型组件,不予任何接口耦合
 * 涉及到的组件有 TagInput,Modal
 * 优化点：将tabel层移入到本组件内部，不予redux耦合
 */
interface RelationSelectProps extends VfBaseProps<string | string[], any[]> {
  /** 字段类型 */
  type: VfType;
  /** 实体类型 */
  entityType: string; //字段所在实体
  /** 显示字段 */
  labelField: string;
  /** 值字段 */
  valField: string;
}

/**
 * 关系选择组件
 */
const RelationSelect: React.FC<RelationSelectProps & TagInputProps> = ({
  type,
  fieldName,
  value,
  entityType,
  valField = "id",
  onDataChange,
  labelField = "name",
  onFocus,
  datas,
  read,
  ...props
}) => {
  const [modalState, setModalState] = useState(false);
  //传出来选中的数据
  const [selected, setSelected] = useState<any[]>([]);
  const [values, setValues] = useState(datas);
  const focus = useCallback(() => {
    setModalState(true);
  }, [type, values]);

  useUpdateEffect(() => {
    if (values && values?.length > 0) {
      onDataChange(values?.map((v) => v.id));
    } else {
      onDataChange([]);
    }
  }, [values]);
  //写成useCallback不在modal时会不弹出来
  return (
    <>
      <Modal
        title="关联选择"
        visible={modalState}
        onOk={() => {
          setModalState(false);
          setValues(selected);
        }}
        centered
        onCancel={() => {
          setModalState(false);
        }}
        width={900}
        // bodyStyle={{ overflow: "auto" }}
      >
        <TablePage
          entityName={entityType}
          selected={values}
          onSelected={(data) => {
            setSelected(data);
          }} //table的选择事件
          btnEnable={{ disable: true }}
          select_more={type === VfType.STRING ? false : true}
          select_show_field={labelField}
        ></TablePage>
      </Modal>
      {!read ? (
        <div>
          <TagInput
            value={values?.map((m) => m[labelField])}
            defaultValue={values?.map((m) => m[valField])}
            // showClear
            onFocus={focus}
            {...props}
            onRemove={(v, i) => {
              const dd = values?.filter((a, index) => index !== i);
              setValues(dd);
            }}
          />
        </div>
      ) : (
        <div className="formily-semi-text">
          {values?.map((v) => v[labelField])}
        </div>
      )}
    </>
  );
};

export default RelationSelect;
