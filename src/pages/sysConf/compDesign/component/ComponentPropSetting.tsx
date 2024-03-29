import { IconSetting } from "@douyinfe/semi-icons";
import { Badge, Input, Select, SideSheet, Typography } from "@douyinfe/semi-ui";
import { FormFieldVo } from "@src/api/FormField";
import { PageApiParam } from "@src/api/PageApiParam";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import SelectIcon from "@src/components/SelectIcon";
import VfImage from "@src/components/VfImage";
import { useAuth } from "@src/context/auth-context";
import { ApiInfo } from "@src/dsl/datas/apis";
import { filter, filterFuns } from "@src/dsl/datas/filters";
import { ApiProp, ParamInfo } from "@src/dsl/schema/api";
import { DataType, sourceType } from "@src/dsl/schema/base";
import { PropInfo } from "@src/dsl/schema/component";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ApiSetting from "./ApiSetting";

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
  /** formily会传入 */
  fields?: FormFieldVo[];
  //组件所有入参信息
  componentProp: any;
}
/**
 * 组件单个属性设置
 */
const ComponentPropSetting = ({
  propName,
  subName,
  listNo,
  propInfo,
  propObj,
  onDataChange,
  componentProp,
  fields,
}: PropSettingProps) => {
  const { dicts, getFormInfo } = useAuth();

  /** 单个属性模型信息 */
  const propData = useMemo((): Partial<PageComponentPropDto> => {
    if (propObj) {
      return { ...propObj };
    } else {
      return {
        propName,
        subName,
        listNo,
        sourceType: propInfo.sourceType || sourceType.fixed, //默认固定值来源
      };
    }
  }, [propName, subName, listNo, propInfo, propObj]);

  /**
   *
   * @param api api
   * @returns
   */
  const paramRequiredSetting = (api: ApiProp): boolean => {
    if (api.params) {
      const params: { [key: string]: ParamInfo } = api.params;
      return (
        Object.keys(params).filter((key) =>
          ["dict", "field", "fixed"].includes(params[key].sourceType)
        ).length > 0
      );
    }
    return false;
  };

  const onPropValChange = useCallback(
    (val: any) => {
      onDataChange({ ...propData, propVal: val === "" ? undefined : val });
    },
    [{ ...propData }]
  );

  const onRelateValChange = useCallback(
    (val: any) => {
      onDataChange({ ...propData, relateVal: val === "" ? undefined : val });
    },
    [{ ...propData }]
  );

  const onFilterFuncChange = useCallback(
    (val: any) => {
      onDataChange({ ...propData, filterFunc: val === "" ? undefined : val });
    },
    [{ ...propData }]
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
        fixed.promise(componentProp).then((d) => {
          setFixedSelectDatas(d);
        });
      }
    }
  }, [componentProp]); //  }, [{ ...propInfo }]);

  /**
   * 异步的api数据
   */
  const [apiOptionList, setApiOpenList] = useState<
    { label: string; value: any }[]
  >([]);

  /**
   * api进行转换匹配，需要选择的数组
   */
  const [relationObj, setRelationObj] = useState<{
    [key: string]: { label: string; value: string }[];
  }>({});

  /**
   * eq方式匹配到的API接口数据
   */
  const typeEqOption = useMemo((): { label: string; value: string }[] => {
    if (propInfo.sourceType === "api") {
      //所有api解析
      const allApiOptions = Object.keys(ApiInfo).map((k) => ({
        label: ApiInfo[k].label,
        value: k,
      }));
      //数据类型一致的接口过滤结果
      const typeEqOption = allApiOptions.filter((f) => {
        const filters = ApiInfo[f.value].match?.filter(
          (m) =>
            m.dataModel === propInfo.dataModel &&
            m.dataType === propInfo.dataType
        );
        return (
          (ApiInfo[f.value].dataType === propInfo.dataType &&
            ApiInfo[f.value].dataModel === propInfo.dataModel) ||
          (filters && filters.length > 0)
        );
      });
      return typeEqOption;
    }
    return [];
  }, [propInfo]);

  useEffect(() => {
    const tranObj: any = {};
    typeEqOption.forEach((api) => {
      ApiInfo[api.value].match?.forEach((m) => {
        if (
          m.dataModel === propInfo.dataModel &&
          m.dataType === propInfo.dataType &&
          typeof m.func !== "function"
        ) {
          tranObj[api.value] = m.func.map((mm) => {
            return { label: mm.label, value: mm.key };
          });
        }
      });
    });

    setRelationObj(tranObj);
  }, [typeEqOption]);

  //满足条件的异步接口分析
  //去查询模型信息里 dataModel 扩展开的
  useEffect(() => {
    if (propInfo.dataModel && propInfo.sourceType === sourceType.api) {
      Promise.all(
        Object.keys(ApiInfo).map((key) => {
          const modelName = ApiInfo[key].dataModel; //接口支持的数据模型
          if (
            modelName &&
            propInfo.dataModel &&
            !propInfo.dataModel.includes(modelName) //一致的 在 typeEqOption里处理了
          ) {
            const d = async (): Promise<number> => {
              const len: number = await getFormInfo({ type: modelName }).then(
                (d) => {
                  return (
                    d?.parentsName?.filter(
                      (name) => propInfo.dataModel === name
                    ).length || 0
                  );
                }
              );
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
        const apiList = d.filter((key) => key);
        setApiOpenList(
          apiList.map((key) => {
            return {
              value: key,
              label: ApiInfo[key || ""].label,
            };
          })
        );
      });
    }
  }, [propInfo]);

  /**
   * api侧滑面板控制属性
   */
  const [visible, setVisible] = useState(false);
  const change = () => {
    setVisible(!visible);
  };

  return (
    <div key={"div_" + listNo + propName}>
      {/* {JSON.stringify(componentProp)} */}
      <div className="flex space-x-2 mb-2 p-2 w-full mt-2">
        <div className="semi-form-field-label-text semi-form-field-label">
          <label>{propInfo.label}</label>
        </div>
        {/* 1 固定值录入 */}
        {(propInfo.sourceType === "fixed" ||
          propInfo.sourceType === undefined) &&
        propInfo.dict === undefined ? (
          //固定值 图标选择组件
          propInfo.dataType === DataType.icon ? (
            <SelectIcon
              key={"icon_" + listNo + propName}
              value={propData?.propVal}
              onDataChange={onPropValChange}
            />
          ) : propInfo.dataType === DataType.image ? (
            <VfImage value={propData?.propVal} onDataChange={onPropValChange} />
          ) : fixedSelectDatas ? (
            <Select
              className="w-full"
              optionList={fixedSelectDatas}
              value={propData?.propVal}
              onChange={onPropValChange}
            />
          ) : (
            <>
              <Input value={propData?.propVal} onChange={onPropValChange} />
            </>
          )
        ) : (
          <></>
        )}
        {/* 2字典选择 */}
        {(propInfo.sourceType === sourceType.dict || propInfo.dict) && (
          //vlife是选择字典类目
          <Select
            style={{ width: "100%" }}
            showClear
            value={propData.propVal}
            optionList={dicts[propInfo?.dict?.dictCode || "vlife"].data}
            onChange={onPropValChange}
          />
        )}

        {propInfo.sourceType === sourceType.field && (
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
        )}
        {propInfo.sourceType === sourceType.sys && (
          //vlife是选择字典类目
          <Select
            style={{ width: "100%" }}
            showClear
            value={propData.propVal}
            optionList={[{ label: "字段所在的实体模型", value: "entityType" }]}
            onChange={onPropValChange}
          />
        )}
        {/* 4  api选择;  (api调整后，需要把参数设置的全部给清空(目前没有做) )*/}
        {propInfo.sourceType === sourceType.api && (
          <Select
            showClear
            style={{ width: "90%" }}
            value={propData.propVal}
            optionList={[...typeEqOption, ...apiOptionList]}
            onChange={onPropValChange}
          />
        )}
        {/* {propData.propVal && <>{JSON.stringify(ApiInfo[propData.propVal])}</>} */}
        {propData.propVal &&
          ApiInfo[propData.propVal] &&
          ApiInfo[propData.propVal].params !== undefined &&
          paramRequiredSetting(ApiInfo[propData.propVal]) && (
            <Badge position="rightBottom" count={"api"} type="danger">
              <IconSetting
                className=" cursor-pointer"
                size="large"
                onClick={change}
              />
            </Badge>
          )}
      </div>

      {/* 是接口由匹配取值，且有对应的过滤函数则显示 */}
      {propData.propVal &&
        propData.sourceType === sourceType.api &&
        propInfo.dataType === DataType.array &&
        Object.keys(filterFuns).filter((k) => {
          return (
            filterFuns[k].dataModel ===
            ApiInfo[propData.propVal || ""].dataModel
          );
        }).length > 0 && (
          <div className="flex space-x-2 mb-2 p-2 w-full mt-2">
            <div className="semi-form-field-label-text semi-form-field-label">
              <label>数据过滤</label>
            </div>
            <Select
              showClear
              style={{ width: "90%" }}
              value={propData.filterFunc}
              optionList={Object.keys(filterFuns)
                .filter((k) => {
                  return (
                    filterFuns[k].dataModel ===
                    ApiInfo[propData.propVal || ""].dataModel
                  );
                })
                .map((d: string) => {
                  return { label: filterFuns[d].title, value: d };
                })}
              onChange={onFilterFuncChange}
            />
          </div>
        )}

      {/* 数据转换 */}
      {propData.propVal && relationObj[propData.propVal] && (
        <div className="flex space-x-2 mb-2 p-2 w-full mt-2">
          <div className="semi-form-field-label-text semi-form-field-label">
            <label>数据转换</label>
          </div>
          <Select
            showClear
            style={{ width: "90%" }}
            value={propData.relateVal}
            optionList={relationObj[propData.propVal]}
            onChange={onRelateValChange}
          />
        </div>
      )}

      <SideSheet title="API参数设置" visible={visible} onCancel={change}>
        {propInfo.sourceType === "api" && propData.propVal && propInfo && (
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
        )}
      </SideSheet>
      {/* api参数设置，需要调整层弹出方式，可优化整个布局 */}
    </div>
  );
};

export default ComponentPropSetting;
