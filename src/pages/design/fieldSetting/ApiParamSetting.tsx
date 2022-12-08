/**
 * 单个API的参数设置
 */
import { Input, Select } from "@douyinfe/semi-ui";
import Title from "@douyinfe/semi-ui/lib/es/typography/title";

import { PageApiParam } from "@src/mvc/PageApiParam";
import { useDebounceEffect, useUpdateEffect } from "ahooks";
import React, { useState } from "react";
import { ApiProp } from "./apiData";

interface ApiParamSettingProps {
  /**参数名 */
  paramName: string;
  /** 参数定义信息 */
  data: ApiProp;
  /** 参数设置信息 */
  value?: PageApiParam;
  onDataChange: (d: Partial<PageApiParam>) => void;
}

const ApiParamSetting = ({
  data,
  paramName,
  value,
  onDataChange,
}: ApiParamSettingProps) => {
  const [info, setInfo] = useState<Partial<PageApiParam>>(
    value || { sourceType: "fixed", paramName: paramName }
  );
  const [val, setVal] = useState<string>(info.paramVal);
  useUpdateEffect(() => {
    if (onDataChange && info) {
      onDataChange(info);
    }
  }, [info]);

  useDebounceEffect(
    () => {
      setInfo({ ...info, paramVal: val });
    },
    [val],
    {
      wait: 1000,
    }
  );

  return (
    <div className=" flex ">
      <Title heading={6}>{paramName}</Title>
      <div>
        <Select
          value={info.sourceType}
          optionList={[
            { label: "常量值", value: "fixed" },
            { label: "系统值", value: "sys" },
          ]}
          onChange={(v) => setInfo({ ...info, sourceType: v as string })}
        />
      </div>
      <div>
        <Input value={val} onChange={(v) => setVal(v as string)} />
      </div>
    </div>
  );
};

export default ApiParamSetting;
