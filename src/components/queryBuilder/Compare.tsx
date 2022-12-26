import { DatePicker, Input, Select } from "@douyinfe/semi-ui";
import { FormVo } from "@src/mvc/model/Form";
import { fixedVal, OPT } from "@src/pages/design/data/dataModel";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@src/context/auth-context";
import { where } from ".";
import { FormFieldVo } from "@src/mvc/model/FormField";
import fieldSetting from "@src/pages/design/fieldSetting";

interface CompareProps {
  form: FormVo;
  onDataChange: (data: Partial<where<any>>) => void;
  data: Partial<where<any>>;
}

/**
 * 对比组件
 * 传入数据类型，返回比对方式，比对值，转换等信息出去
 */
export default ({ data, form, onDataChange }: CompareProps) => {
  const { dicts } = useAuth();
  const [reData, setReData] = useState(data);
  useEffect(() => {
    onDataChange({ ...reData });
  }, [reData]);

  const currField = useMemo((): FormFieldVo | undefined => {
    if (reData.fieldName) {
      return form.fields.filter((f) => f.fieldName === reData.fieldName)[0];
    }
    return undefined;
  }, [reData.fieldName]);
  return (
    <>
      <Select
        style={{ width: "130px" }}
        placeholder="字段"
        value={reData.fieldName}
        optionList={[
          ...form.fields.map((d) => {
            return { label: d.title, value: d.fieldName };
          }),
        ]}
        onChange={(data) => {
          setReData({ ...reData, fieldName: data as string, value: undefined });
        }}
      />
      <Select
        placeholder="匹配转换"
        style={{ width: "130px" }}
        value={reData.opt}
        optionList={[
          ...Object.keys(OPT).map((k) => {
            return {
              value: k,
              label: OPT[k]["label"],
            };
          }),
        ]}
        onChange={(data) => {
          setReData({ ...reData, opt: data as string });
        }}
      />
      {/* 值：动态值;固定值；多个值；组件不同，都需要考虑 */}
      {reData.opt === "fix" ? ( //固定值
        <Select
          placeholder="动态值"
          style={{ width: "130px" }}
          value={reData.fixCode}
          optionList={[
            ...Object.keys(fixedVal).map((k) => {
              return {
                value: k,
                label: fixedVal[k]["label"],
              };
            }),
          ]}
          onChange={(data) => {
            setReData({ ...reData, fixCode: data as string });
          }}
        />
      ) : reData.opt === "eq" && currField && currField.dictCode !== null ? ( // 字典类型
        <Select
          style={{ width: "130px" }}
          value={reData.value ? reData.value[0] : undefined}
          onChange={(data) => {
            setReData({ ...reData, value: [data as string] });
          }}
          optionList={dicts[currField.dictCode].data}
        ></Select>
      ) : reData.opt === "eq" ? (
        <Input
          placeholder="值"
          style={{ width: "130px" }}
          value={
            reData.value && reData.value.length > 0
              ? reData.value[0]
              : undefined
          }
          onChange={(data: string) => {
            setReData({ ...reData, value: [data] });
          }}
        />
      ) : reData.opt === "in" && currField && currField.type === "date" ? (
        <>
          <DatePicker style={{ width: "100px" }}></DatePicker>
        </>
      ) : (
        ""
      )}
    </>
  );
};
