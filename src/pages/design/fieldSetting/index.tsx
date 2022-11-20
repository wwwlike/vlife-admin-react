import { Collapse, Divider, Form, InputGroup } from "@douyinfe/semi-ui";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { isObjectFieldState } from "@formily/core";
import { useAuth } from "@src/context/auth-context";
import { FormVo } from "@src/mvc/model/Form";
import { FormFieldVo } from "@src/mvc/model/FormField";
import { useUpdateEffect } from "ahooks";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import schemaDef, { deps, SchemaClz, types } from "../data/vlifeSchema";
import { ComponentSetting } from "./componentData";
import FieldComponent from "./FieldComponent";

/**
 * schemaData选择组件
 * 接收FormFieldVo数据，与schemaData对应的数据进行操作，隐藏组件的数据需要清空
 */

interface schemaModalProp {
  field: FormFieldVo;
  form: FormVo;
  onDataChange: (field: FormFieldVo) => void; //数据修改后回调
}
export default ({ field, form, onDataChange, ...prop }: schemaModalProp) => {
  const api = useRef<FormApi>();
  const { getDict } = useAuth();

  /**
   * 返回的数据
   */
  const [fieldData, setFieldData] = useState<FormFieldVo>();

  useUpdateEffect(() => {
    if (fieldData) {
      onDataChange({ ...fieldData });
    }
  }, [fieldData]);
  /**
   *  对字段属性的字典，和列宽,所在容器进行计算和提取在这里完成组装
   */
  const fieldsConf = useMemo((): SchemaClz => {
    const dictTypes = getDict({ emptyLabel: "请选择" })[0].sysDict;
    schemaDef["dictCode"].items = [];
    schemaDef["formGroupCode"].items = [];
    if (form.groups && form.groups.length > 0) {
      form.groups.forEach((group, index) => {
        schemaDef["formGroupCode"].items?.push({
          value: group.code,
          label: group.name || "",
        });
      });
    }
    dictTypes.forEach((dict) => {
      schemaDef["dictCode"].items?.push({
        value: dict.code || "",
        label: dict.title || "",
      });
    });

    return schemaDef;
  }, [form, api.current?.getValues()]);

  //表单数据初始化,字段变化数据重新初始化
  useEffect(() => {
    if (field) {
      api.current?.setValues({ ...field });
      setFieldData({ ...field });
    }
  }, [field.fieldName]);

  /**
   *formData有的字段覆盖filed的并返回出去
   */
  const backData = useCallback(
    (formData: any): FormFieldVo => {
      const back = { ...field };
      // alert(JSON.stringify(formData));
      Object.keys(fieldsConf).forEach((attr) => {
        back[attr] = formData[attr];
      });
      //3个特例'
      back["x_component"] = formData["x_component"];
      back["componentType"] = formData["componentType"];
      back["componentSettingJson"] = formData["componentSettingJson"];

      return back;
    },
    [field.fieldName]
  );

  /**
   * 计算返回去的数据
   */
  const computerData = useCallback(
    (formData: any): FormFieldVo => {
      if (fieldData) {
        const back = { ...fieldData };
        // alert(JSON.stringify(formData));
        Object.keys(fieldsConf).forEach((attr) => {
          back[attr] = formData[attr];
        });
        //3个特例'
        // back["x_component"] = formData["x_component"];
        // back["componentType"] = formData["componentType"];
        // back["componentSettingJson"] = formData["componentSettingJson"];
        // alert(formData["componentSettingJson"]);
        return back;
      }
    },
    [fieldData, field.fieldName]
  );

  const check = useCallback(
    (fieldName: string, dd: deps | deps[] | undefined): boolean => {
      if (dd === undefined) return true;
      const fieldVal: FormFieldVo =
        api.current?.getValues() === undefined
          ? field
          : api.current?.getValues();
      let arr: deps[] = [];
      if (dd instanceof Array<deps>) {
        arr = dd;
      } else {
        arr.push(dd);
      }
      let back: boolean = false;
      back =
        //大类必须都满足
        arr.filter((a) => a.value.includes(field[a.field])).length ===
        arr.length;

      // if (fieldName === "x_component") {
      //   console.log("arr", arr);
      // }

      return back;
    },
    [field, api.current?.getValues()]
  );
  return (
    <>
      <div
        style={{
          fontSize: "14px",
          borderStyle: "dotted solid dashed solid",
          borderColor: "#cccccc",
        }}
      >
        {field ? (
          <div>
            <b style={{ font: "14px" }}>
              &nbsp;&nbsp;&nbsp;&nbsp;标识/类型：{field.fieldName}/{field.type}/
              {field.fieldType}
              <Divider margin="12px" />
            </b>
          </div>
        ) : (
          "请选择一个表单元素"
        )}
      </div>
      <Form
        getFormApi={(formApi) => (api.current = formApi)}
        layout="vertical"
        labelAlign="left"
        labelPosition="left"
        onValueChange={(data, val) => {
          // console.log("data", data);
          // console.log("val", val);
          //一次只变动一个的时候触发回调
          // if (Object.values(val).length === 1) {
          setFieldData(computerData(data));
          // }
        }}
      >
        <Collapse accordion defaultActiveKey={"panel_0"} keepDOM={true}>
          {types.map((t, index) => {
            return (
              <Collapse.Panel
                key={"panel_" + index}
                header={t.title}
                itemKey={"panel_" + index}
                style={{ padding: "2px" }}
              >
                {/* 第一个panel放入设置组件 */}
                {index === 0 && field.fieldName ? (
                  <FieldComponent
                    fieldName={field.fieldName}
                    fields={form.fields}
                    x_component={field.x_component}
                    componentSettingJson={field.componentSettingJson}
                    onDataChange={(data: {
                      x_component: string;
                      componentSetting: ComponentSetting;
                    }) => {
                      setFieldData({
                        ...fieldData,
                        ...data,
                        componentSettingJson: JSON.stringify(
                          data.componentSetting
                        ),
                      });
                      // api.current.setValues("x_component", data.x_component);
                    }}
                  />
                ) : (
                  ""
                )}

                {Object.keys(fieldsConf)
                  .filter((key) => fieldsConf[key].tag === t.value)
                  .map((key, index) => {
                    if (
                      //1无依赖值无UI场景，2有依赖有ui都满足 3满足ui场景 4满足字段依赖
                      (fieldsConf[key].deps === undefined &&
                        fieldsConf[key].uiType === undefined) ||
                      (fieldsConf[key].uiType &&
                        fieldsConf[key].uiType === form.uiType && //场景满足
                        fieldsConf[key].deps &&
                        // fieldsConf[key].deps?.value.includes(
                        //   field[fieldsConf[key].deps?.field || ""]
                        // )

                        check(key, fieldsConf[key].deps)) ||
                      (fieldsConf[key].uiType &&
                        fieldsConf[key].deps == undefined &&
                        fieldsConf[key].uiType === form.uiType) ||
                      (fieldsConf[key].deps &&
                        fieldsConf[key].uiType == undefined &&
                        check(key, fieldsConf[key].deps))
                      // fieldsConf[key].deps?.value.includes(
                      //   field[fieldsConf[key].deps?.field || ""]
                      // )
                    ) {
                      if (fieldsConf[key].type === "select") {
                        const optionList = fieldsConf[key].items?.filter(
                          (f) => {
                            if (
                              //选择项的显示根据依赖值是否满足来完成进一步的展示
                              (f.deps === undefined &&
                                f.uiType === undefined) ||
                              (f.deps &&
                                check(key, f.deps) &&
                                // f.deps.value.includes(
                                //   field[f.deps?.field || ""]
                                // )

                                f.uiType &&
                                form.uiType === f.uiType) ||
                              (f.deps &&
                                f.uiType === undefined &&
                                check(key, f.deps)) ||
                              // f.deps.value.includes(
                              //   field[f.deps?.field || ""]
                              // )
                              (f.uiType &&
                                f.deps === undefined &&
                                form.uiType === f.uiType)
                            ) {
                              return true;
                            }
                            return false;
                          }
                        );
                        if (optionList && optionList?.length > 0) {
                          return (
                            <Form.Select
                              showClear
                              key={"select_" + index + key}
                              field={key}
                              label={fieldsConf[key].name}
                              style={{ width: "100%" }}
                              optionList={optionList}
                            ></Form.Select>
                            // </div>
                          );
                        }
                      }
                      if (fieldsConf[key].type === "input") {
                        return (
                          <Form.Input
                            key={"input_" + key}
                            field={key}
                            label={fieldsConf[key].name}
                            style={{ width: "100%" }}
                          ></Form.Input>
                        );
                      }
                      if (fieldsConf[key].type === "switch") {
                        return (
                          <InputGroup key={"group" + key + index}>
                            <Form.Switch
                              key={"switch" + key + index}
                              field={key}
                              label={fieldsConf[key].name}
                            />
                          </InputGroup>
                        );
                      }
                    }
                  })}
              </Collapse.Panel>
            );
          })}
        </Collapse>
      </Form>
    </>
  );
};
