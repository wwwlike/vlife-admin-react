/**
 * 树型数据选择组件
 * 只在查询req模型里使用
 */
import { TreeSelect } from "@douyinfe/semi-ui";
import { checkSubData } from "@src/utils/utils";
import { useUpdateEffect } from "ahooks";
import React, { useCallback, useMemo, useState } from "react";
import { VfBaseProps, VfTree } from "..";

interface TreeQueryProps extends VfBaseProps<string, VfTree[]> {
  /**
   *点击值字段标识
   */
  valField: "id" | "code";
  /**
   * 根节点code,
   * 设置了则从他开始，没有设置就是从最短的开始
   */
  root: string;
}

//树的数据结构
interface treeElementProps {
  label: string;
  value: string;
  key: string;
  children?: treeElementProps[];
}

/**
 * 树型选择input组件(支持有VfTree=>code,pcode,name,id的组件)
 * 待：机构/地区/部门联合树如何实现？
 */
const VfTreeInput = ({
  valField = "id",
  root,
  datas,
  value,
  read,
  onDataChange,
  ...props
}: TreeQueryProps) => {
  const [val, setVal] = useState(value);

  useUpdateEffect(() => {
    onDataChange(val);
  }, [val]);
  /**
   * 查找根节点，有指定就用，无则找pcode最短的，code作为
   */
  const findRoot = useMemo((): string[] => {
    if (root) return [root];
    if (datas) {
      const findNull: string[] = datas
        .filter((d: any) => d.pcode === undefined || d.pcode === null)
        .map((d: any) => d.code);
      if (findNull && findNull.length > 0) return findNull;
    } else {
    }
    return [];
  }, [datas]);

  /**
   * 使用递归调用的方式组装数据
   * @sub 是否是查children,那么就不是eq,是startWith
   * @code 查询的编码
   */
  const treeData = useCallback(
    (code: string | undefined, sub: boolean): treeElementProps[] => {
      if (datas === null || datas === undefined || datas.length === 0) {
        return [];
      }
      //遍历全部，效率值得商榷找到开发头的
      return datas
        .filter(
          (d: VfTree) =>
            sub && code
              ? checkSubData(code, d.code) //找子级
              : code
              ? d.code === code
              : findRoot.filter((dd) => dd === d.code).length > 0 //父级
        )
        .map((dd) => {
          return {
            value: dd[valField],
            label: dd.name,
            key: dd[valField],
            children: treeData(dd.code, true),
          };
        });
    },
    [datas]
  );
  return (
    <>
      {read ? (
        <div className="formily-semi-text">
          {datas?.filter((d) => d.code === val).map((d) => d.name)}
        </div>
      ) : (
        <>
          <TreeSelect
            value={val}
            onSelect={setVal}
            style={{ width: "100%" }}
            treeData={treeData(root, false)}
          />
        </>
      )}
    </>
  );
};

export default VfTreeInput;
