/**
 * 查询统计项目过滤条件的设计器
 */
import { FormVo } from "@src/mvc/model/Form";
import React, { ReactNode, useEffect } from "react";
import { useState } from "react";
import { VfBaseProps } from "..";
import Design from "./design";

export interface where<T> {
  /** 字段 */
  fieldName: T;
  /** 匹配方式 */
  opt: string;
  /** 转换函数 */
  tran: string;
  /** 匹配值 */
  value: T[];
  /** 动态值的code */
  fixCode: string;
}

export interface group {
  fieldName: string;
  tran: string;
}
export type andOr = "and" | "or";
export interface FormItemCondition {
  orAnd: andOr;
  where: Partial<where<any>>[];
  conditions: Partial<FormItemCondition>[];
  group?: group;
}

// 将string 转换成 formItemCondition
export interface ItemDesignProps extends Partial<VfBaseProps<string, FormVo>> {
  //模型信息
  pageCondition?: Partial<FormItemCondition>;
  // 是否根节点
  isRoot?: boolean;
  // 嵌入的删除btn
  children?: ReactNode;
}

/**
 * queryBuilder
 * 1.查询条件维护
 * 2.SQL语句预览
 */
const QueryBuilder = ({
  onDataChange,
  value,
  pageCondition,
  datas,
  isRoot = true,
  children,
}: ItemDesignProps) => {
  const [conditions, setConditions] = useState<Partial<FormItemCondition>>(
    pageCondition ? pageCondition : value ? JSON.parse(value) : {}
  );

  useEffect(() => {
    if (onDataChange) {
      if (conditions && conditions !== null) {
        onDataChange(JSON.stringify(conditions));
      } else {
        onDataChange(undefined);
      }
    }
  }, [conditions]);

  useEffect(() => {
    if (conditions && conditions.where && conditions.where.length === 0) {
      setConditions({ ...conditions, where: undefined });
    }
    if (
      conditions &&
      conditions.conditions &&
      conditions.conditions.length === 0
    ) {
      setConditions({ ...conditions, conditions: undefined });
    }
  }, [conditions]);
  return datas ? (
    <>
      <Design
        root={isRoot}
        datas={datas}
        onDataChange={(data) => {
          setConditions(data);
        }}
        remove={children}
        condition={conditions}
      />
    </>
  ) : (
    <></>
  );
};

export default QueryBuilder;
