import { Form, Select, Space, Tooltip } from "@douyinfe/semi-ui";
import { ArrayField, FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { useAuth } from "@src/context/auth-context";
import { FormFieldVo } from "@src/mvc/model/FormField";

import { IconHelpCircle } from "@douyinfe/semi-icons";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ApiInfo } from "./apiData";
import {
  ComponentDef,
  ComponentSetting,
  ComponentInfo,
  PropDef,
  dataType,
} from "./componentData";
import form from "@src/components/form";

export interface CompAttr {}
/**
 * 组件属性设置
 * 1. 主页选择组件
 * 2. 如果选择的组件需要关联接口，接口需要设置参数则在该页完成
 */
export interface FieldComponentData {
  x_component: string;
  componentSetting: ComponentSetting;
}
export interface CompAttrSettingProps {
  /** 字段名称 */
  fieldName: string;
  /** 选择组件 */
  x_component: string;
  /** 组件数据属性设置json */
  componentSettingJson?: string;
  /** 所有字段信息 */
  fields: FormFieldVo[];
  /** 传出去的组件信息 */
  onDataChange: (data: FieldComponentData) => void;
}
// 解析接口，解析组件，解析字段

/**
 * 设置组件入参属性，
 */
export default ({
  fieldName,
  fields,
  x_component,
  componentSettingJson,
  onDataChange,
  ...props
}: CompAttrSettingProps) => {
  const { getDict } = useAuth();
  const api = useRef<FormApi>();

  const dictType = useMemo((): { value: string; label: String }[] => {
    const dictTypes = getDict({ emptyLabel: "请选择" })[0].sysDict;
    return dictTypes.map((d) => {
      return { value: d.code, label: d.title };
    });
  }, []);
  //表单数据初始化,字段变化数据重新初始化
  useEffect(() => {
    const fieldComponentData = {
      x_component: x_component,
      componentSetting: componentSettingJson
        ? JSON.parse(componentSettingJson)
        : undefined,
    };
    api.current?.setValues(fieldComponentData);
    setComponentData(fieldComponentData);
  }, [fieldName]);

  const [componentData, setComponentData] = useState<FieldComponentData>();
  /** 当前字段信息 */
  const currField = useMemo((): FormFieldVo => {
    const field = fields.filter((f) => f.fieldName === fieldName)[0];
    return field;
  }, [fieldName, fields]);

  /** 字段类型能够使用的模型信息对象 */
  const usableComponents = useMemo((): ComponentDef => {
    //所有组件名称 keys
    const keys: string[] = Object.keys(ComponentInfo);

    const components: any = {};
    keys.forEach((key) => {
      const returnType = ComponentInfo[key].dataChangeValueType;
      if (
        (currField.fieldType === "basic" &&
          ComponentInfo[key].dataChangeValueType === currField.type) ||
        ComponentInfo[key].dataChangeValueType === currField.fieldType ||
        //组件
        (ComponentInfo[key].dataChangeValueType instanceof Array &&
          (ComponentInfo[key].dataChangeValueType as Array<dataType>).filter(
            (m) => {
              return m === currField.type || m === currField.fieldType;
            }
          ).length > 0)
      ) {
        components[key] = ComponentInfo[key];
      }
    });
    return components;
  }, [currField.type]);

  /** 选择的组件的需要设置的属性计算 */
  const currProps = useMemo((): PropDef => {
    if (
      componentData &&
      componentData.x_component &&
      ComponentInfo[componentData.x_component]
    ) {
      return ComponentInfo[componentData.x_component].propInfo;
    } else {
      //组件不存在
      return {};
    }
  }, [componentData]);

  return (
    <>
      {/* {JSON.stringify(componentData?.componentSetting)} */}
      <Form
        key={"fieldComponent" + fieldName}
        getFormApi={(formApi) => (api.current = formApi)}
        layout="vertical"
        labelAlign="left"
        labelPosition="left"
        // layout="horizontal"
        onValueChange={(data: FieldComponentData, val) => {
          setComponentData({ ...data });
          onDataChange({ ...data });
        }}
      >
        {/*01  组件选择 */}
        <Form.Select
          key={fieldName + "fieldComponent_select"}
          showClear
          field="x_component"
          label={
            <>
              {componentData &&
              componentData.x_component &&
              ComponentInfo[componentData.x_component] &&
              ComponentInfo[componentData.x_component].remark ? (
                <Tooltip
                  content={ComponentInfo[componentData.x_component].remark}
                >
                  <IconHelpCircle />
                </Tooltip>
              ) : (
                ""
              )}
              组件
            </>
          }
          style={{ width: "100%" }}
          optionList={Object.keys(usableComponents).map((key) => {
            return {
              label:
                key +
                (usableComponents[key].label
                  ? "(" + usableComponents[key].label + ")"
                  : ""),
              value: key,
            };
          })}
        />
        {/*02  组件属性配置 */}
        <>
          {currProps
            ? Object.keys(currProps).map((key, index) => {
                const pop = currProps[key];
                //PropDef类型数据进行遍历处理；‘string’固定值数据的在form/index直接组装
                if (typeof pop !== "string") {
                  //字典方式数据设置组件属性，设置fixed字段；(sourceType=undefined)
                  if (pop.dict) {
                    return (
                      <Form.Select
                        initValue={
                          componentData &&
                          componentData.componentSetting &&
                          componentData.componentSetting[key]
                            ? componentData.componentSetting[key].fixed
                            : undefined
                        }
                        style={{ width: "100%" }}
                        label={pop.label ? `${key}(${pop.label})` : key}
                        field={`componentSetting[${key}][fixed]`}
                        optionList={Object.keys(pop.dict).map((kv) => {
                          return { value: kv, label: pop.dict[kv] };
                        })}
                      />
                    );
                  } else {
                    //属性通过fixed,api获得
                    return (
                      <div key={key + "_div"}>
                        {/* <div style={{ width: "100%", display: "flex" }}> */}
                        <div key={`label_prop_${key}`}>
                          <b>{key}</b>
                          {pop.label ? `(${pop.label})` : ""}
                        </div>
                        <Space>
                          <Form.Select
                            labelPosition="top"
                            labelAlign="left"
                            key={key + "_select"}
                            style={{ width: "140px" }}
                            initValue={
                              componentData &&
                              componentData.componentSetting &&
                              componentData.componentSetting[key]
                                ? componentData.componentSetting[key].sourceType
                                : undefined
                            }
                            showClear
                            placeholder={`取值方式`}
                            noLabel
                            // label={`${pop.label}`}
                            field={`componentSetting[${key}][sourceType]`}
                          >
                            {/* 组件 type=='dict'标识组件支持字典类型，可以有快捷选择，不用选接口然后设置接口入参，
                    只用一步设置，完成对datas的接口选择，和接口的code属性关联即可 */}
                            {ComponentInfo[componentData.x_component].type ===
                              "dict" && key === "datas" ? (
                              <Select.Option
                                label="字典取值"
                                value={"api_dict"}
                              />
                            ) : (
                              ""
                            )}
                            {/* 所有情况都可以支持接口取值 */}
                            <Select.Option label="接口取值" value={"api"} />
                            {/* 不含有下滑线的prop是简单数据类型，则可以写入常量  暂时屏蔽掉*/}

                            {pop.dataType === dataType.string ||
                            pop.dataType === dataType.integer ? (
                              <Select.Option label="常量值" value={"fixed"} />
                            ) : (
                              ""
                            )}
                          </Form.Select>

                          {componentData &&
                          componentData.componentSetting &&
                          componentData.componentSetting[key] &&
                          componentData.componentSetting[key].sourceType ? (
                            componentData.componentSetting[key].sourceType ===
                            "fixed" ? (
                              <Form.Input
                                key={key + "_fixed"}
                                style={{ width: "140px" }}
                                field={`componentSetting[${key}][fixed]`}
                                // label="常量"
                                noLabel
                                initValue={
                                  componentData &&
                                  componentData.componentSetting &&
                                  componentData.componentSetting[key]
                                    ? componentData.componentSetting[key].fixed
                                    : undefined
                                }
                              />
                            ) : componentData.componentSetting[key]
                                .sourceType === "field" ? (
                              <Form.Select
                                key={key + "_field"}
                                style={{ width: "140px" }}
                                field={`componentSetting[${key}][field]`}
                                // label="对应字段"
                                noLabel
                                initValue={
                                  componentData &&
                                  componentData.componentSetting &&
                                  componentData.componentSetting[key]
                                    ? componentData.componentSetting[key].field
                                    : undefined
                                }
                                optionList={fields
                                  .filter((f) => f.type === pop.dataType)
                                  .map((f) => {
                                    return {
                                      label: f.fieldName,
                                      value: f.fieldName,
                                    };
                                  })}
                              />
                            ) : componentData.componentSetting[key]
                                .sourceType === "api" ? (
                              <>
                                <Form.Select
                                  showClear
                                  rules={[
                                    {
                                      required: pop.must,
                                      message: "必选",
                                    },
                                  ]}
                                  key={key + "_api_select"}
                                  style={{ width: "140px" }}
                                  field={`componentSetting[${key}][api]`}
                                  optionList={Object.keys(ApiInfo)
                                    .filter(
                                      (
                                        k1 // 相等或者包含
                                      ) =>
                                        ApiInfo[k1].dataType === pop.dataType ||
                                        pop.dataType.includes(
                                          ApiInfo[k1].dataType
                                        )
                                    )
                                    .map((k) => {
                                      return {
                                        label: ApiInfo[k].label,
                                        value: k,
                                      };
                                    })}
                                  initValue={
                                    componentData &&
                                    componentData.componentSetting &&
                                    componentData.componentSetting[key]
                                      ? componentData.componentSetting[key].api
                                      : undefined
                                  }
                                  noLabel
                                  // label="取值接口"
                                />
                              </>
                            ) : componentData.componentSetting[key]
                                .sourceType === "api_dict" &&
                              key === "datas" ? (
                              <>
                                {/* <b>字典编码</b> */}
                                <Select
                                  key={key + "select"}
                                  showClear
                                  style={{ width: "140px" }}
                                  optionList={dictType}
                                  value={
                                    componentData.componentSetting["datas"] &&
                                    componentData.componentSetting["datas"]
                                      .apiParams &&
                                    componentData.componentSetting["datas"]
                                      .apiParams["code"]
                                      ? componentData.componentSetting["datas"]
                                          .apiParams["code"].fixed
                                      : undefined
                                  }
                                  onChange={(code) => {
                                    const data: FieldComponentData = {
                                      ...componentData,
                                      componentSetting: {
                                        ...componentData.componentSetting,
                                        datas: {
                                          //属性
                                          sourceType: "api_dict", //属性来源api
                                          api: "getDictByCode", //选择的api
                                          apiParams: {
                                            code: {
                                              //api的参数
                                              sourceType: "fixed", //常量
                                              fixed: code + "", //固定值就是本select选择到的
                                            },
                                          },
                                        },
                                      },
                                    };
                                    onDataChange({ ...data });
                                    setComponentData({ ...data });
                                  }}
                                />
                              </>
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )}
                        </Space>
                        {/* </div> */}
                        {/* 接口参数配置 */}
                        {componentData &&
                        componentData.componentSetting &&
                        componentData.componentSetting[key] &&
                        componentData.componentSetting[key].sourceType ===
                          "api" &&
                        componentData.componentSetting[key].api &&
                        ApiInfo[componentData.componentSetting[key].api] &&
                        ApiInfo[componentData.componentSetting[key].api].params // api名称,选择的是api
                          ? // 遍历params
                            //接口入参对应
                            Object.keys(
                              ApiInfo[componentData.componentSetting[key].api]
                                .params
                            ).map((k, paramIndex) => {
                              return (
                                <div key={k + key + "div"}>
                                  <Form.Select
                                    rules={[
                                      {
                                        required:
                                          ApiInfo[
                                            componentData.componentSetting[key]
                                              .api
                                          ].params[k].must,
                                        message: "必填",
                                      },
                                    ]}
                                    key={k + key + "params_sourceType"}
                                    showClear
                                    placeholder={"取值方式"}
                                    style={{ width: "100%" }}
                                    label={`参数${k}`}
                                    field={`componentSetting[${key}][apiParams][${k}][sourceType]`}
                                    initValue={
                                      componentData.componentSetting[key]
                                        .apiParams &&
                                      componentData.componentSetting[key]
                                        .apiParams[k]
                                        ? componentData.componentSetting[key]
                                            .apiParams[k].sourceType
                                        : undefined
                                    }
                                  >
                                    <Select.Option
                                      label="常量"
                                      value={"fixed"}
                                    />
                                    <Select.Option
                                      label="表单字段"
                                      value={"field"}
                                    />
                                  </Form.Select>

                                  {componentData.componentSetting[key]
                                    .apiParams &&
                                  componentData.componentSetting[key].apiParams[
                                    k
                                  ] &&
                                  componentData.componentSetting[key].apiParams[
                                    k
                                  ].sourceType === "fixed" ? (
                                    <Form.Input
                                      key={k + key + "params_fixed"}
                                      style={{ width: "100%" }}
                                      field={`componentSetting[${key}][apiParams][${k}][fixed]`}
                                      label="常量"
                                      initValue={
                                        componentData.componentSetting[key]
                                          .apiParams &&
                                        componentData.componentSetting[key]
                                          .apiParams[k]
                                          ? componentData.componentSetting[key]
                                              .apiParams[k].fixed
                                          : undefined
                                      }
                                    />
                                  ) : (
                                    ""
                                  )}

                                  {componentData.componentSetting[key]
                                    .apiParams &&
                                  componentData.componentSetting[key].apiParams[
                                    k
                                  ] &&
                                  componentData.componentSetting[key].apiParams[
                                    k
                                  ].sourceType === "field" ? (
                                    <Form.Select
                                      key={k + key + "params_field"}
                                      style={{ width: "100%" }}
                                      field={`componentSetting[${key}][apiParams][${k}][field]`}
                                      label="对应字段"
                                      initValue={
                                        componentData.componentSetting[key]
                                          .apiParams &&
                                        componentData.componentSetting[key]
                                          .apiParams[k]
                                          ? componentData.componentSetting[key]
                                              .apiParams[k].field
                                          : undefined
                                      }
                                      optionList={fields.map((f) => {
                                        return {
                                          label: f.fieldName,
                                          value: f.fieldName,
                                        };
                                      })}
                                    />
                                  ) : (
                                    ""
                                  )}
                                </div>
                              );
                            })
                          : ""}
                      </div>
                    );
                  }
                }
              })
            : ""}
        </>
      </Form>
    </>
  );
};
