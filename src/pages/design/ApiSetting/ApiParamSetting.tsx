/**
 * 组件属性设置
 */
import { IconSetting } from "@douyinfe/semi-icons";
import { Input, Select, SideSheet, Typography } from "@douyinfe/semi-ui";
import { PageComponentPropDto } from "@src/mvc/PageComponentProp";
import { useAuth } from "@src/context/auth-context";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import SelectIcon from "@src/components/vlifeComponent/SelectIcon";
import { listAll } from "@src/provider/baseProvider";
import ApiSetting from "../ApiSetting";
import { PropInfo } from "../fieldSetting/componentData";
import { PageApiParam } from "@src/mvc/PageApiParam";
const { Text } = Typography;
interface PropSettingProps {
  /** 参数名 */
  paramName: string;
  /** 参数信息 */
  paramInfo: PropInfo;
  /** 参数DB数据 */
  pageApiParam?: Partial<PageApiParam>;
  /**
   * 数据回传
   */
  onDataChange: (pageApiParam: Partial<PageApiParam>) => void;
}

const ComponentPropSetting = ({
  paramName,
  paramInfo,
  pageApiParam,
  onDataChange,
}: PropSettingProps) => {
  const { dicts } = useAuth();

  const paramData = useMemo((): Partial<PageApiParam> => {
    if (pageApiParam) {
      return { ...pageApiParam };
    } else {
      return {
        paramName: paramName,
        sourceType: paramInfo.sourceType, //可以去掉
      };
    }
  }, [paramName, pageApiParam, paramInfo]);

  const onParamValChange = useCallback(
    (val: any) => {
      onDataChange({ ...paramData, paramVal: val });
    },
    [{ ...paramData }] //对象要处理呀
  );

  // api数据支持的数据来源
  // dict field,fixed,table; api能否也支持？

  /**
   * sourceType=table时，从服务端请求的可以选择的数据集
   */
  const [tableData, setTableData] = useState<{ label: string; value: any }[]>();

  /**
   * 和ComponentPropSetting重复了，应该提取成
   */
  useEffect(() => {
    const table = paramInfo?.table;
    if (table && table.entityName) {
      const entityName = table.entityName;
      const labelField = table.labelField || "name";
      const valField = table.valField || "id";
      listAll({ entityName, req: table.table_req }).then((data) => {
        const datas = data.data?.map((d) => {
          return {
            label: d[labelField],
            value: d[valField],
          };
        });
        setTableData(datas);
      });
    }
  }, [paramInfo]);

  return (
    <div key={"api_div_" + paramName}>
      {/* 1 固定值录入 */}
      <div className="flex space-x-1 mb-2 p-2">
        <div className=" w-24">{paramInfo.label}</div>
        {(paramInfo.sourceType === "fixed" ||
          paramInfo.sourceType === undefined) &&
        paramInfo.table === undefined &&
        paramInfo.dict === undefined ? (
          //固定值 图标选择组件
          <Input value={paramData?.paramVal} onChange={onParamValChange} />
        ) : (
          <></>
        )}
        {/* 2字典选择 */}
        {paramInfo.sourceType === "dict" || paramInfo.dict ? (
          <Select
            style={{ width: "100%" }}
            showClear
            value={paramData.paramVal}
            optionList={dicts[paramInfo?.dict?.dictCode || "vlife"].data}
            onChange={onParamValChange}
          />
        ) : (
          <></>
        )}
        {/*3  表字段选择 */}
        {tableData ? (
          <Select
            showClear
            value={paramData.paramVal}
            onChange={onParamValChange}
            optionList={tableData}
          />
        ) : (
          <></>
        )}
        {/* 4  api选择,api调整后，需要把参数设置的全部给清空(目前没有做) */}
        {paramInfo.sourceType === "api" ? (
          <>api参数来源当前不能定义成从接口获取(sourceType!==api)</>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ComponentPropSetting;
