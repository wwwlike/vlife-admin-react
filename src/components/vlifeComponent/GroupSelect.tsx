import { CheckboxGroup, Divider } from "@douyinfe/semi-ui";
import { useUpdateEffect } from "ahooks";
import React, { useCallback, useEffect, useState } from "react";
import { VfBaseProps } from "..";
/**
 实现效果如下
标题1
---------------
[] 标题1的选自内容1
[] 标题1的选自内容2
------------------------
标题2
---------------
[] 标题2的选自内容1
[] 标题2的选自内容2
.......
后端返回的数据，应该是如下结构
[
  {
    <label>:标题1,
    <detail>:[
      <label>:选择的明细
      <id>:hehe
    ]
  }
]
 */

/**
 * 页面级选择组件（需要封装datas数据结构）
 * 该结构和vlife的数据设计还是有一定差异，之前通过formily适配器进行转换
 */
interface GroupSelectProps
  extends VfBaseProps<
    string[], //name
    { name: string; detailList: { label: string; value: string }[] }[]
  > {
  selectType: "typeOne" | "one" | "more"; //每个分类选一个|全局选一个|多选
  onChange: (value: string[]) => void;
}
/**
 * 页面平铺选择组件
 */
const GroupSelect = ({
  datas,
  value,
  onDataChange,
  selectType = "typeOne",
}: GroupSelectProps) => {
  const handleChange = useCallback(
    (index: number, checked: string[]) => {
      if (onDataChange && datas) {
        //先取消datas里index该分类里的suoyou7选项，添加checked里选择的选项

        if (value === undefined || value.length === 0) {
          onDataChange(checked);
        } else {
          const clearIds = datas[index].detailList.map((d) => d.value);
          let returnIds = value.filter((d) => !clearIds.includes(d));
          returnIds.push(...checked);
          onDataChange(returnIds);
        }
      }
    },
    [value, onDataChange, datas]
  );

  return (
    <>
      {JSON.stringify(value)}
      {datas
        ? datas.map((d, index) => {
            return d.detailList && d.detailList.length > 0 ? (
              <div key={"div_" + d.name}>
                <h3 style={{ marginTop: "20px" }}>
                  <b>{d.name}</b>
                  <Divider margin="12px" />
                </h3>
                <CheckboxGroup
                  value={value}
                  onChange={(checkeds) => {
                    handleChange(index, checkeds);
                  }}
                  options={d.detailList}
                  direction="horizontal"
                />
              </div>
            ) : (
              ""
            );
          })
        : ""}
    </>
  );
};
export default GroupSelect;
