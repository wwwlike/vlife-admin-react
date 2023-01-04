/**
 * 组件属性设置
 */
import { IconSetting } from "@douyinfe/semi-icons";
import { Badge, Input, Select, SideSheet, Typography } from "@douyinfe/semi-ui";
import { PageComponentPropDto } from "@src/mvc/PageComponentProp";
import { useAuth } from "@src/context/auth-context";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ApiInfo } from "./apiData";
import { dataType, PropInfo } from "./componentData";
import SelectIcon from "@src/components/vlifeComponent/SelectIcon";
import { listAll } from "@src/provider/baseProvider";
import ApiSetting from "../ApiSetting";
import { PageApiParam } from "@src/mvc/PageApiParam";
import { FormFieldVo } from "@src/mvc/model/FormField";
const { Text } = Typography;
interface PropSettingProps {
  /** 属性 */
  propName: string;
  /** 子属性 */
  subName?: string;
  /** 所在数组序号 */
  listNo?: number;
  /** 属性定义信息 */
  propInfo: PropInfo;
  /** 属性录入信息 */
  propObj?: Partial<PageComponentPropDto>;
  onDataChange: (propObj: Partial<PageComponentPropDto>) => void;
  pageKey: String;
  fields?: FormFieldVo[];
  //所在页面组件key
}

const ComponentPropSetting = ({
  propName,
  subName,
  listNo,
  propInfo,
  propObj,
  pageKey,
  onDataChange,
  fields,
}: PropSettingProps) => {
  const { dicts } = useAuth();

  const propData = useMemo((): Partial<PageComponentPropDto> => {
    if (propObj) {
      return { ...propObj };
    } else {
      return {
        propName,
        subName,
        listNo,
        sourceType: propInfo.sourceType //sourceType 需要调整为 单个对象，不能是数组
          ? typeof propInfo.sourceType === "string"
            ? propInfo.sourceType
            : propInfo.sourceType[0]
          : "fixed",
      };
    }
  }, [propName, subName, listNo, propInfo, propObj]);

  const onPropValChange = useCallback(
    (val: any) => {
      onDataChange({ ...propData, propVal: val });
    },
    [{ ...propData }] //对象要处理呀
  );

  /**
   * sourceType=table时，从服务端请求的可以选择的数据集
   */
  // const [tableData, setTableData] = useState<{ label: string; value: any }[]>();

  useEffect(() => {
    // const table = propInfo.sourceType;
    // if (table === "table") {
    //   const entityName = "form";
    //   const labelField = "name";
    //   const valField = "entityType";
    //   // table.table_req
    //   listAll({ entityName, req: {} }).then((data) => {
    //     const datas = data.data?.map((d) => {
    //       return {
    //         label: d[labelField],
    //         value: d[valField],
    //       };
    //     });
    //     setTableData(datas);
    //   });
    // } else {
    //   setTableData(undefined);
    // }
  }, [{ ...propInfo }]);

  /**
   * api侧滑面板控制属性
   */
  const [visible, setVisible] = useState(false);
  const change = () => {
    setVisible(!visible);
  };

  // const style = {
  //   width: "42px",
  //   height: "42px",
  //   borderRadius: "4px",
  // };

  return (
    <div key={"div_" + listNo + propName}>
      {/* 1 固定值录入 */}
      <div className="flex space-x-2 mb-2 p-2">
        <div className=" w-24">{propInfo.label}</div>
        {(propInfo.sourceType === "fixed" ||
          propInfo.sourceType === undefined) &&
        // propInfo.table === undefined &&
        propInfo.dict === undefined ? (
          //固定值 图标选择组件
          propInfo.dataType === dataType.icon ? (
            <SelectIcon
              key={"icon_" + listNo + propName}
              value={propData?.propVal}
              onDataChange={onPropValChange}
            />
          ) : propInfo.fixed && propInfo.fixed.dicts ? (
            <Select
              optionList={propInfo.fixed.dicts}
              value={propData?.propVal}
              onChange={onPropValChange}
            />
          ) : (
            <Input value={propData?.propVal} onChange={onPropValChange} />
          )
        ) : (
          <></>
        )}
        {/* 2字典选择 */}
        {propInfo.sourceType === "dict" || propInfo.dict ? (
          //vlife是选择字典类目
          <Select
            style={{ width: "100%" }}
            showClear
            value={propData.propVal}
            optionList={dicts[propInfo?.dict?.dictCode || "vlife"].data}
            onChange={onPropValChange}
          />
        ) : (
          <></>
        )}
        {/* 3 取自数据表；
        {tableData ? (
          <Select
            showClear
            value={propData.propVal}
            onChange={onPropValChange}
            optionList={tableData}
          />
        ) : (
          <></>
        )} */}
        {propInfo.sourceType === "field" ? (
          //vlife是选择字典类目
          <>
            <Select
              style={{ width: "100%" }}
              showClear
              value={propData.propVal}
              optionList={fields?.map((m) => {
                return { value: m.fieldName, label: m.title };
              })}
              onChange={onPropValChange}
            />
          </>
        ) : (
          <></>
        )}
        {propInfo.sourceType === "sys" ? (
          //vlife是选择字典类目
          <>
            <Select
              style={{ width: "100%" }}
              showClear
              value={propData.propVal}
              optionList={[{ label: "字段所在实体类名", value: "type" }]}
              onChange={onPropValChange}
            />
          </>
        ) : (
          <></>
        )}
        {/* 4  api选择,api调整后，需要把参数设置的全部给清空(目前没有做) */}
        {propInfo.sourceType === "api" ? (
          <Select
            showClear
            value={propData.propVal}
            optionList={Object.keys(ApiInfo)
              .map((k) => ({
                label: ApiInfo[k].label,
                value: k,
              }))
              .filter(
                (f) =>
                  ApiInfo[f.value].dataType === propInfo.dataType || //1 接口的类型和属性类型一致
                  (propInfo.otherData && //2 属性支持的tran转换类型，就是接口的类型
                    Object.keys(propInfo.otherData).includes(
                      ApiInfo[f.value].dataType
                    ))
              )}
            onChange={onPropValChange}
          />
        ) : (
          ""
        )}
        {propData.propVal &&
        ApiInfo[propData.propVal] &&
        ApiInfo[propData.propVal].params !== undefined ? (
          <Badge position="rightBottom" count={"api"} type="danger">
            <IconSetting
              className=" cursor-pointer"
              size="large"
              onClick={change}
            />
          </Badge>
        ) : (
          <></>
        )}
      </div>
      <SideSheet title="滑动侧边栏" visible={visible} onCancel={change}>
        {propInfo.sourceType === "api" && propData.propVal && propInfo ? (
          <>
            {propInfo.dataType !== ApiInfo[propData.propVal].dataType ? (
              <div>
                选择的API和组件入参需要的api不一致(目前不会进来，仅为给的都是一致的，后期如果要做接口转换适配可以)
              </div>
            ) : (
              ""
            )}
            <ApiSetting
              apiName={propData.propVal}
              data={ApiInfo[propData.propVal]}
              onDataChange={(pageApiParams: Partial<PageApiParam>[]) => {
                onDataChange({ ...propData, params: pageApiParams });
              }}
              pageApiParams={propData.params}
              fields={fields}
            />
          </>
        ) : (
          ""
        )}
      </SideSheet>

      {/* api参数设置，需要调整层弹出方式，可优化整个布局 */}
    </div>
  );
};

export default ComponentPropSetting;
