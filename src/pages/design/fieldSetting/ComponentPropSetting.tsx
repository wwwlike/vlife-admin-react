/**
 * 组件属性设置
 */
import { IconSetting } from "@douyinfe/semi-icons";
import { Badge, Input, Select, SideSheet, Typography } from "@douyinfe/semi-ui";
import { PageComponentPropDto } from "@src/mvc/PageComponentProp";
import { useAuth } from "@src/context/auth-context";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import SelectIcon from "@src/components/vlifeComponent/SelectIcon";
import ApiSetting from "../ApiSetting";
import { PageApiParam } from "@src/mvc/PageApiParam";
import { FormFieldVo } from "@src/mvc/model/FormField";
import { dataType, PropInfo } from "../data/componentData";
import { ApiInfo } from "@src/mvc/apis";
import VfImage from "@src/components/vlifeComponent/VfImage";
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
  const { dicts, getModelInfo } = useAuth();

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
      onDataChange({ ...propData, propVal: val === "" ? undefined : val });
    },
    [{ ...propData }] //对象要处理呀
  );

  /**
   * 固定取值来源于返回，展现形式是select
   */
  const [fixedSelectDatas, setFixedSelectDatas] =
    useState<{ label: string; value: any }[]>();

  useEffect(() => {
    const fixed = propInfo.fixed;
    if (fixed) {
      if (fixed.dicts) {
        setFixedSelectDatas(fixed.dicts);
      } else if (fixed.promise) {
        fixed.promise().then((d) => {
          setFixedSelectDatas(d);
        });
      }
    }
  }, [{ ...propInfo }]);

  // /**
  //  * 接口取数据则填充
  //  */
  // const [apiOptionList, setApiOpenList] =
  //   useState<{ label: string; value: any }[]>();

  /**
   * 异步的api数据
   */
  const [apiOptionList, setApiOpenList] = useState<
    { label: string; value: any }[]
  >([]);

  const typeEqOption = useMemo((): { label: string; value: any }[] => {
    if (propInfo.sourceType === "api") {
      const allApiOptions = Object.keys(ApiInfo).map((k) => ({
        label: ApiInfo[k].label,
        value: k,
      }));
      //数据类型一致的接口过滤结果
      const typeEqOption = allApiOptions.filter(
        (f) =>
          // 1.1接口的类型和属性类型大类型一致
          (ApiInfo[f.value].dataType === propInfo.dataType &&
            (propInfo.dataModel === undefined || // 1.2 模型类型为空或者包涵关系，或者是父子关系
              (ApiInfo[f.value].dataModel &&
                propInfo.dataModel.includes(
                  ApiInfo[f.value].dataModel || "xxxxxxx" //xxx不会到达的,TS的bug
                )))) ||
          (propInfo.otherData && //2 数据关系不一致，但在可以转换的范围内，属性支持的tran转换类型，就是接口的类型
            Object.keys(propInfo.otherData).includes(ApiInfo[f.value].dataType))
      );
      return typeEqOption;
    }
    return [];
  }, [propInfo]);

  //设置异步满足的，所有满足的一次性设置
  useEffect(() => {
    if (propInfo.dataModel) {
      Promise.all(
        Object.keys(ApiInfo).map((key) => {
          const modelName = ApiInfo[key].dataModel;
          if (
            modelName &&
            propInfo.dataModel &&
            !propInfo.dataModel.includes(modelName)
          ) {
            const d = async (): Promise<number> => {
              const len: number = await getModelInfo(modelName).then((d) => {
                return (
                  d?.parentsName.filter((name) =>
                    propInfo.dataModel?.includes(name)
                  ).length || 0
                );
              });
              return len;
            };
            return d().then((len) => {
              if (len > 0) return key;
              return undefined;
            });
          }
          return undefined;
        })
      ).then((d) => {
        setApiOpenList(
          d
            .filter((key) => key)
            .map((key) => {
              return {
                value: key,
                label: ApiInfo[key || ""].label,
              };
            })
        );
      });
    }
  }, [typeEqOption, propInfo]);

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
        propInfo.dict === undefined ? (
          //固定值 图标选择组件
          propInfo.dataType === dataType.icon ? (
            <SelectIcon
              key={"icon_" + listNo + propName}
              value={propData?.propVal}
              onDataChange={onPropValChange}
            />
          ) : propInfo.dataType === dataType.image ? (
            <VfImage value={propData?.propVal} onDataChange={onPropValChange} />
          ) : fixedSelectDatas ? (
            <Select
              optionList={fixedSelectDatas}
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
          <>
            <Select
              showClear
              value={propData.propVal}
              optionList={[...typeEqOption, ...apiOptionList]}
              onChange={onPropValChange}
            />
          </>
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
      <SideSheet
        title="组件属性数据来源设置"
        visible={visible}
        onCancel={change}
      >
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
