import { IconSearch } from "@douyinfe/semi-icons";
import { Input } from "@douyinfe/semi-ui";
import { InputProps } from "@douyinfe/semi-ui/lib/es/input";
import { useUrlQueryParam } from "@src/utils/lib";
import { useDebounceEffect } from "ahooks";
import React, { useEffect, useState } from "react";
import { VfBaseProps } from "..";

/**
 * 搜索的时候分页要初始化
 * [防抖改URL] 过滤组件
 * 1. 延迟回调父组件给的set方法
 * 2. 实时修改URL里的入参
 * 参数：
 * 1. 回调方法 延迟执行的回调方法
 * 2. 参数名称 paramName
 * 可优化：
 * 1. 防抖时间可以作为入参
 * 2. 接收入参的提示名称（按姓名/XXX等搜索）
 * 3. 支持传入样式(不用semi组件，使用原生组件)
 * 4. 搜索时候又分页则清空分页参数
 */

interface SearchProps extends VfBaseProps<string, null> {
  /** 延迟毫秒数 */
  seconds: number;
  title: string;
}

/**
 * 可从url里去<fieldName>作为初始值
 * 搜索延迟，传参出去，并改变url
 * 该url最终要一直道form里去，req的form则能改
 */
export default ({
  seconds = 500,
  onDataChange,
  value,
  title,
  ...props
}: SearchProps & InputProps) => {
  const [urlParam, setUrlParam] = useUrlQueryParam([props.fieldName]);

  const [searchValue, setSearchValue] = useState(
    urlParam[props.fieldName] ? urlParam[props.fieldName] : value
  );

  useDebounceEffect(
    () => {
      setUrlParam({ [props.fieldName]: searchValue });
      if (onDataChange) onDataChange(searchValue);
    },
    [searchValue],
    {
      wait: 400,
    }
  );
  return (
    <>
      <Input
        placeholder={
          props.placeholder ? props.placeholder : "支持：" + title + "查询"
        }
        prefix={<IconSearch />}
        value={searchValue}
        onChange={(v) => {
          setSearchValue(v);
        }}
        showClear
      ></Input>
    </>
  );
};
