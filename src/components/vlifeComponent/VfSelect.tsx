import { Select, Space } from "@douyinfe/semi-ui";
import { useUpdateEffect } from "ahooks";
import React, { useCallback, useEffect, useState } from "react";
import { VfBaseProps } from "..";

/**
 * 单选组件
 */
interface VSelectProps extends VfBaseProps<any, any[]> {
  labelField: string;
  valField: string;
}

/**
 * 支持2种数据类型的select表单组件
 * 字典数据结构 VfDict => val/title
 * 外键数据结构 VfRelation => id/name
 * code/Name也需要支持
 */
const VfSelect = ({
  fieldName,
  labelField,
  valField,
  datas,
  read,
  value,
  onDataChange,
  ...propsvalue
}: VSelectProps) => {
  //选中的值
  const [val, setVal] = useState<any>(value);
  // const [flag, setFlag] = useState<{ value: string; label: string }>({
  //   value: valField,
  //   label: labelField,
  // });

  //更新则传出去
  useUpdateEffect(() => {
    onDataChange(val);
  }, [val]);

  return read === true ? (
    <Space>
      {val
        ? datas
            ?.filter((d) => d[valField] + "" === val + "")
            .map((d) => {
              return <>{d[labelField]}</>;
            })
        : "-"}
    </Space>
  ) : (
    <>
      {datas?.filter((d) => {
        d[valField] + "" === val + "";
      }).length > 0
        ? val + ""
        : undefined}
      <Select
        showClear
        onChange={(data) => {
          setVal(data + "");
        }}
        //连接"" 解决number于string 匹配
        value={
          datas?.filter((d) => {
            return d[valField] + "" === val + "";
          }).length > 0
            ? val + ""
            : undefined
        }
        optionList={datas?.map((d) => {
          return { label: d[labelField], value: d[valField] + "" };
        })}
      ></Select>
    </>
  );
};
export default VfSelect;
