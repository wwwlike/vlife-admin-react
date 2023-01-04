import { Select } from "@douyinfe/semi-ui";
import { FormFieldVo } from "@src/mvc/model/FormField";
import { PageComponentPropDto } from "@src/mvc/PageComponentProp";
import React, { useCallback, useMemo } from "react";
import { ComponentDef, ComponentInfo, dataType } from "./componentData";
import ComponentSetting from "./ComponentSetting";
/**
 * 字段组件设置(新方式）
 * 采用page_的表存储（之前是field的json字段存储）)
 */
interface FieldComponentSettingProps {
  /** 字段名称 */
  fieldName: string;
  /** 已经选择的组件类型 */
  x_component?: string;
  /** 组件设置的属性信息(涵接口参数设置) */
  pageComponentPropDtos?: Partial<PageComponentPropDto>[];
  /** 其他字段信息 (组件入参来源选择field时使用) */
  fields: FormFieldVo[];
  /** 数据回传 */
  onDataChange: (data: {
    x_component: string;
    pageComponentPropDtos?: Partial<PageComponentPropDto>[];
  }) => void;
}

/**
 *
 * 1.组件选择
 * 2.组件属性设置
 */
const FieldComponentSetting = ({
  fieldName,
  x_component,
  pageComponentPropDtos,
  fields,
  onDataChange,
}: FieldComponentSettingProps) => {
  /** 当前字段信息 */
  const currField = useMemo((): FormFieldVo => {
    const field = fields.filter((f) => f.fieldName === fieldName)[0];
    return field;
  }, [fieldName, fields]);
  // type list basic

  const check = (
    componentDataType: dataType,
    currField: FormFieldVo
  ): boolean => {
    // alert(currField.type + "_" + currField.fieldType);
    return (
      (currField.fieldType === "basic" &&
        componentDataType === currField.type) ||
      componentDataType === currField.type + "_" + currField.fieldType ||
      (componentDataType === dataType.objList &&
        currField.fieldType === "list" &&
        currField.type !== "string" &&
        currField.type !== "integer" &&
        currField.type !== "boolean" &&
        currField.type !== "double")
    );
  };

  /** 字段类型能够使用的模型信息对象 */
  const usableComponents = useMemo((): ComponentDef => {
    //所有组件名称 keys
    const keys: string[] = Object.keys(ComponentInfo);
    const components: any = {};
    keys.forEach((key) => {
      if (key === "ResourcesSelect") {
        // alert(
        //   check(ComponentInfo[key].dataChangeValueType as dataType, currField)
        // );
      }
      //1 不是数组，但是匹配
      if (
        ComponentInfo[key].dataChangeValueType instanceof Array === false &&
        check(ComponentInfo[key].dataChangeValueType as dataType, currField)
      ) {
        components[key] = ComponentInfo[key];
      } else if (
        //2 数组包涵
        ComponentInfo[key].dataChangeValueType instanceof Array &&
        (ComponentInfo[key].dataChangeValueType as Array<dataType>).filter(
          (m) => {
            return check(m, currField);
          }
        ).length > 0
      ) {
        components[key] = ComponentInfo[key];
      }
    });
    return components;
  }, [currField.type]);

  return (
    <>
      {/* {JSON.stringify(pageComponentPropDtos)} */}
      {/* 1. 选择组件 */}
      <Select
        value={x_component}
        filter
        key={fieldName + "fieldComponent_select"}
        showClear
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
        onChange={(d) => {
          onDataChange({ x_component: d as string });
        }}
      />
      {/* 2. 组件属性设置 */}
      {x_component ? (
        <>
          <ComponentSetting
            componentInfo={ComponentInfo[x_component]}
            pageKey={fieldName}
            pageComponentPropDtos={pageComponentPropDtos}
            onDataChange={(
              editPageComponentPropDtos: Partial<PageComponentPropDto>[]
            ) => {
              onDataChange({
                x_component: x_component,
                pageComponentPropDtos: [...editPageComponentPropDtos],
              });
              //替换指定组件里的指定属性设置值
            }}
            fields={fields}
          />
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default FieldComponentSetting;
