/**
 * 使用formliy + semi联合打造的动态表单
 * 考虑使用reactQuery,从后台取得表单信息，然后缓存起来。
 *
 * https://zhuanlan.zhihu.com/p/577439561
 * 组件化
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  registerValidateLocale,
  createForm,
  Form,
  IFormFeedback,
  onFormValuesChange,
  Field,
  onFieldValueChange,
  onFieldReact,
  onFieldMount,
  GeneralField,
} from "@formily/core";
import { FormProvider, createSchemaField } from "@formily/react";

import {
  FormItem,
  Section,
  PreviewText,
  FormGrid,
  GridColumn,
  ArrayItems,
  ArrayTable,
  FormTab,
} from "@formily/semi";
import { IdBean, Result, TranDict } from "@src/api/base";
import { FormVo } from "@src/api/Form";
import { eventReaction } from "./reactions";
import { FormFieldVo } from "@src/api/FormField";
import { useAuth } from "@src/context/auth-context";
import {
  fetchPropObj, //组件动态数据提取
  fetchStaticPropObj, //组件静态数据提取
} from "@src/components/form/view";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import DesignFormItem from "@src/components/form/component/DesignFormItem";
import GroupLabel from "@src/components/form/component/GroupLabel";
import { DataType } from "@src/dsl/schema/base";
import { exist } from "@src/api/base/baseService";
import { ComponentInfos } from "@src/dsl/datas/components";
import SelectIcon from "../SelectIcon";

interface fieldSettingProps<T> {
  validate?: (formData: T, formVo: FormVo) => string | Promise<any> | void;
  hidden?: (formData: T, formVo: FormVo) => boolean;
}

//表信息
export interface FormProps<T> {
  key?: string;
  className?: string;
  modelInfo: FormVo; //模型信息
  formData?: any; // 表单数据/默认初始化数据
  design?: boolean; //自定义表单设计模式（设计模式采用的是FormItem）
  highlight?: string; //高亮字段(当前聚焦需要高亮的)
  readPretty?: true; //显示模式
  dicts?: TranDict[]; //所有用到的字典信息(没有从authContext里取，避免耦合)
  ignoredFields?: string[]; //排除不展示的字段
  fkMap?: any; // 外键对象信息{ID,NAME}
  //单字段模式，只显示fieldMode里的一个字段
  fieldMode?: string;
  //页面字段手工设置,页面初始化，和页面任何数据有变化都会触发这里
  fieldSetting?: {
    [field: string]: fieldSettingProps<T>;
  };
  //指定字段校验
  validate?: {
    //指定[key]字段的校验函数;校验函数： (val字段值：formData:整个表单数据)=>
    [key: string]: (val: any, formData: T) => string | Promise<any> | void;
  };
  //整个表单的被动级联设置
  formEvents?: {
    [fieldName: string]: (field: Field, form: Form, model: FormVo) => void;
  };
  //手工数据联动计算函数,watchFields 不传则监听整个表单的变化(目前没有用到，提高性能)
  dataComputer?: { funs: (data: any) => any; watchFields?: string[] };
  //表单数据改变时触发
  onDataChange?: (data: any, form: Form, formVo: FormVo, field: string) => void;
  //单个字段加载完毕触发
  onField?: (field: Field, form: Form, formVo: FormVo) => void;
  //表单初始化完毕时触发
  onForm?: (form: Form, formVo: FormVo) => void;
  // 将最新错误信息传输出去 formModal使用
  onError?: (error: IFormFeedback[]) => void;
  //design触发的相关操作回调事件
  onClickFieldComponent?: (
    fieldName: string,
    opt: "click" | "must" | "delete" //点击区域
  ) => void; //当前聚焦字段点击的字段，设计器时才会触发
  //覆盖model.fileds里的数据，也可以对field里没有的信息可以进行补充
}

// reaction
//https://react.formilyjs.org/zh-CN/api/shared/schema#schemareactions

const formTab = FormTab.createFormTab?.("tab1");

registerValidateLocale({
  "zh-CN": {
    required: "必填项",
  },
});

export default <T extends IdBean>({
  className,
  dicts,
  formData,
  onDataChange,
  onForm,
  onField,
  readPretty,
  fkMap,
  modelInfo,
  onError,
  highlight,
  onClickFieldComponent,
  fieldMode,
  ignoredFields,
  dataComputer,
  validate,
  formEvents,
  fieldSetting,
  design = false,
}: FormProps<T>) => {
  const [fetchData, setFecthData] = useState<any>({});

  //异步加载数据，联动数据
  const load1 = async (field: Field) => {
    const pageComponentPropDtos: PageComponentPropDto[] =
      field.componentProps["pageComponentPropDtos"];
    if (pageComponentPropDtos)
      fetchPropObj(
        form,
        //请求组件属性的值
        pageComponentPropDtos, //组件设置的db设置信息(包涵参数设置)
        ComponentInfos[field.componentProps["fieldInfo"].x_component], //组件信息
        // field.componentProps.apiCommonParams, //下面设置进来的
        field //字段信息；其实只传这一个值，上面三个可以都取得到
      ).then((field: Field) => {
        // if (field.componentProps.fetchData) {
        // if (data) {
        //   Object.keys(data).forEach((oneProp) => {
        //     let propData = data[oneProp];
        //     //属性过滤，低代码传入过滤方法
        //     const fieldName = field.props.name as string;
        //     if (
        //       filterProps &&
        //       filterProps[fieldName] &&
        //       filterProps[fieldName][oneProp]
        //     ) {
        //       propData = filterProps[fieldName][oneProp](
        //         propData,
        //         modelInfo,
        //         form.values
        //       );
        //     }
        //     field.componentProps[oneProp] = propData;
        //   });
        // }
      });
  };

  /**
   * 动态表单数据初始化
   * 使用参考：https://core.formilyjs.org/zh-CN/api/models/form
   */
  const form = useMemo(
    () =>
      createForm({
        readPretty,
        initialValues: {
          ...formData,
        },
        //表单的生命周期
        effects() {
          //待废弃，有性能，但是每个字段各自设置比较麻烦
          if (formEvents) {
            //form里任意字段值有变化触发调用
            Object.keys(formEvents).forEach((fieldName) => {
              onFieldReact(`${fieldName}`, (field, form) =>
                // 字段，表单，模型，fetchData->异步请求到的没有加工的原始数据
                formEvents[fieldName](field as Field, form, modelInfo)
              );
            });
          }
          if (fieldSetting) {
            Object.keys(fieldSetting).forEach((fieldName) => {
              onFieldValueChange(fieldName, (field) => {
                const fSet: fieldSettingProps<T> = fieldSetting[fieldName];
                if (fSet.validate) {
                }
                if (fSet.hidden) {
                  fSet.hidden(field.form.values, modelInfo);
                }
              });
            });
          }
          // onFormMount((form: Form) => {
          //   if (onForm != undefined) {
          //     if (
          //       form.query("groupColumn") &&
          //       form.query("groupColumn").take()
          //     ) {
          //       console.log("aaa", fetchData);
          //       onForm(form, modelInfo);
          //     }
          //   }
          //   alert("formmount");
          // }),
          onFormValuesChange((form) => {
            if (form.errors.length > 0 && onError !== undefined) {
              setTimeout(() => onError(form.errors), 200);
            }
            //表单数据传输出去
            if (onDataChange !== undefined) {
              onDataChange(form.values, form, modelInfo, "");
            }
            if (dataComputer && dataComputer.watchFields === undefined) {
              form.setValues(dataComputer.funs(form.values));
            }
            //表达formily信息传输出去
            if (onForm != undefined) {
              // onForm(form, modelInfo);
            }
          });
          // validate 外部数据校验函数，
          if (validate) {
            Object.keys(validate).forEach((fieldName) => {
              //onFieldValueChange 需要做到数据变化后延迟访问到这里
              onFieldValueChange(fieldName, (field) => {
                const message = validate[fieldName](
                  field.value,
                  field.form.values
                );
                if (message) {
                  if (typeof message === "string") {
                    field.setFeedback({
                      code: "ValidateError",
                      type: "error",
                      messages: [message],
                    });
                  } else {
                    //异步校验方式
                    message.then((d) => {
                      field.setFeedback({
                        code: "ValidateError",
                        type: "error",
                        messages: [d],
                      });
                    });
                  }
                } else {
                  field.setFeedback({});
                }
              });
            });
          }
          // 根据字段设置，在form内部组装 相关校验
          modelInfo.fields.forEach((field) => {
            onFieldMount(field.fieldName, (field: GeneralField, form: Form) => {
              if (onField) {
                onField(field as Field, form, modelInfo);
              }
            });

            field.validate_unique &&
              onFieldValueChange(field.fieldName, (formilyField) => {
                formilyField.value &&
                  exist({
                    entityType: field.entityType,
                    fieldName: field.fieldName,
                    fieldVal: formilyField.value,
                    id: formilyField.form.getValuesIn("id"),
                  }).then((d: Result<number>) => {
                    if (d.data && d.data > 0) {
                      formilyField.setFeedback({
                        code: "ValidateError",
                        type: "error",
                        messages: [field.title + "已经存在了"],
                      });
                    } else {
                      formilyField.setFeedback({});
                    }
                  });
              });
          });
        },
      }),
    [modelInfo, fkMap, formData, readPretty]
  );

  const { dicts: allDict } = useAuth();

  const SchemaField = useMemo(() => {
    const components: any = {};
    Object.keys(ComponentInfos)
      .filter((key) => ComponentInfos[key].component)
      .forEach((key) => {
        components[key] = ComponentInfos[key].component;
      });

    return createSchemaField(
      {
        components: {
          ...components,
          PreviewText,
          FormItem,
          Section,
          FormGrid,
          GridColumn,
          ArrayItems,
          FormTab,
          ArrayTable,
          DesignFormItem,
          GroupLabel,
        },
      }
      // },
    );
  }, []);

  /**
   * 字典数据提取
   *
   *
   */
  const fieldEnum = useCallback(
    (dictCode: string, fieldType: string) => {
      const dictEnum: { label?: string; value: any }[] = [];
      if (dicts) {
        const array = dicts.filter((sysDict) => {
          if (sysDict.column.toLowerCase() === dictCode.toLowerCase()) {
            return true;
          }
        });
        if (array && array.length > 0) {
          array[0].sysDict.forEach((d) => {
            if (fieldType === "integer") {
              dictEnum.push({ label: d.title, value: Number(d.val) });
            } else {
              dictEnum.push({ label: d.title, value: d.val });
            }
          });
        }
      }
      return dictEnum;
    },
    [dicts]
  );

  /**
   * 过滤得到分组的表单对象
   * @param pp 过滤的表单对象
   * @param tabId 分组id
   * @param index 分组索引号
   * @returns
   */
  const filterProperties = function (
    pp: any,
    code: string, //组件编码
    index: number
  ): any {
    const tmp: any = {};
    Object.keys(pp).forEach((key) => {
      if (
        (pp[key]["formTabCode"] === null && index === 0) ||
        pp[key]["formTabCode"] === code
      ) {
        if (pp[key + "_divider"]) {
          //关联添加分割线添加
          tmp[key + "_divider"] = pp[key + "_divider"];
        }
        tmp[key] = pp[key];
      }
    });
    return tmp;
  };

  const sysComponents = ["Input", "InputNumber"];
  /**
   * 动态表单formily
   * 后端FormField转换成schema信息
   */
  const schema = useMemo(() => {
    const pp: any = {};
    if (modelInfo) {
      let fields: FormFieldVo[] = modelInfo.fields;
      if (fieldMode) {
        fields = modelInfo.fields.filter((f) => f.fieldName === fieldMode);
      }

      if (ignoredFields) {
        fields = modelInfo.fields.filter(
          (f) => !ignoredFields.includes(f.pathName)
        );
      }

      fields
        .sort((a, b) => {
          return a.sort - b.sort;
        })
        //f=> FormFieldDto
        .forEach((f: FormFieldVo, index: number) => {
          if (index >= 0) {
            if (f.divider) {
              pp[f.fieldName + "_divider"] = {
                type: "object",
                "x-component": "GroupLabel",
                "x-decorator": "FormItem",
                "x-component-props": {
                  text: f.dividerLabel,
                },
                "x-decorator-props": {
                  gridSpan: 4,
                },
              };
            }

            pp[f.fieldName] = { ...f };
            const prop: any = pp[f.fieldName];
            // java属性不能包含“-”是"_",故进行转换，并批量赋值
            Object.keys(prop)
              .filter((key) => key.startsWith("x_"))
              .map((key) => {
                // formily 转换对应的字段， vlife转换之前的字段，用来取值
                return { formily: key.replaceAll("_", "-"), vlife: key };
              })
              .forEach((obj: { formily: string; vlife: string }) => {
                //[key: string]: any
                const vlifeVal = f[obj.vlife]; // bs端存属性(包含下划线_和$的属性)存的值
                if (vlifeVal) {
                  const objs = obj.formily.split("$");
                  if (objs.length === 1) {
                    prop[obj.formily] = vlifeVal;
                  } else if (objs.length === 2) {
                    //最多支持3层嵌套(不优雅先如此写死支持2层嵌套)
                    if (prop[objs[0]] === undefined) {
                      prop[objs[0]] = {};
                    }
                    prop[objs[0]][objs[1]] = vlifeVal;
                  } else if (objs.length === 3) {
                    if (prop[objs[0]] === undefined) {
                      prop[objs[0]] = {};
                    }
                    if (prop[objs[0]][objs[1]] === undefined) {
                      prop[objs[0]][objs[1]] = {};
                    }
                    prop[objs[0]][objs[1]][objs[2]] = vlifeVal;
                  }
                }
              });
            //隐藏标签
            if (prop.hideLabel) {
              if (design) {
                prop.title = (
                  <>
                    {prop.title}
                    <SelectIcon value="IconEyeClosedSolid" read size="small" />
                  </>
                );
              } else {
                prop.title = "";
              }
            }

            //包裹的组件，设计器的包裹组件替换掉FormItem
            if (design) {
              prop["x-decorator"] = "DesignFormItem";
              prop["x-decorator-props"] = {
                ...prop["x-decorator-props"],
                itemType: modelInfo.itemType,
                // extra: "描述文案",
                onClick: (
                  fieldName: string,
                  opt: "click" | "delete" | "must"
                ) => {
                  //点击组件上的按钮
                  if (onClickFieldComponent)
                    onClickFieldComponent(fieldName, opt);
                  //当前选中的字段
                },
                highlight,
                design: true,
                ...f,
              };
            } else {
              //https://semi.formilyjs.org/components/form-item
              prop["x-decorator"] = "FormItem";
              prop["x-decorator-props"] = {
                ...prop["x-decorator-props"],
                labelStyle: {
                  display: f.hideLabel ? "none" : "",
                },
                bordered: false,
              };
            }
            // 高亮字段(表单设计器)
            if (f.fieldName === highlight) {
              prop["x-decorator-props"] = {
                ...prop["x-decorator-props"],
                style: { backgroundColor: "rgba(33, 150, 243, 0.15)" },
              };
            }
            // 数据库添加添加级联响应
            if (f.events && (design === false || design === undefined)) {
              prop["x-reactions"] = eventReaction(f.events, modelInfo.fields);
            }

            if (f.fieldName === "code") {
              prop["x-reactions"] = [
                {
                  dependencies: ["formId", "func"],
                  fulfill: (field: any) => {
                    // 直接使用 field.value 获取当前字段的值并设置可选项列表
                    const hobbies =
                      field.value === "male"
                        ? ["健身", "足球"]
                        : ["瑜伽", "美食"]; // 根据不同性别设置不同的爱好选项
                    field.componentProps = {
                      ...field.componentProps,
                      optionList: [],
                    };
                  },
                },
              ];
            }
            //组件关联属性附加(待移除,也需要从页面添加)
            if (
              (f.x_component === "Select" ||
                f.x_component === "DictSelectTag") &&
              f.dictCode
            ) {
              prop.enum = fieldEnum(f.dictCode, f.fieldType);
            } else if (f.x_component === "DatePicker") {
              //日期格式设置（需在设计器里指定日期格式（待））
              if (f.dataType === DataType.array) {
                prop["x-component-props"] = {
                  ...prop["x-component-props"],
                  type: "dateRange",
                  format: "yyyy/MM/dd",
                };
              } else {
                prop["x-component-props"] = {
                  ...prop["x-component-props"],
                  format: "yyyy/MM/dd",
                };
              }
            } else if (f.x_component === "RelationInput") {
              //待移除
              //模型信息全部传入到RelationInput里，该组件与接口耦合
              prop["x-component-props"] = {
                ...prop["x-component-props"],
                fkMap: fkMap,
                ...f,
              };
            }
            const isValidRegExp = (str: string) => {
              try {
                new RegExp(str);
                return true;
              } catch (e) {
                return false;
              }
            };

            //正则验证
            if (f.vlife_pattern && isValidRegExp(f.vlife_pattern)) {
              prop["x-validator"] = {
                validator:
                  `{{(value, rule)=> {
                   if (!value) return ''
                   return /` +
                  f.vlife_pattern +
                  `/.test(value)
                 }}}`,
                message: f.vlife_message ? f.vlife_message : "校验不通过",
              };
            }
            if (prop["x-component-props"] === undefined) {
              prop["x-component-props"] = {};
            }

            /**
             * 自定义组件渲染，需要的属性准备
             * 一. 组件的属性的可以来源于1. fixed固定设置的值，2.api接口获取的数据值
             * 二. 请求接口如果也需要传参，那么也有2处来源 1. 固定的参数值，2从关联字段去取
             * 注意：这里如果请求数据是异步的：有什么影响没
             */

            if (!sysComponents.includes(f.x_component)) {
              prop["x-component-props"] = {
                ...prop["x-component-props"],
                design: design,
                //表单元素级组件onDataChange函数构建传入
                onDataChange: (data: any) => {
                  if (
                    (typeof data === "string" &&
                      (data === "undefined" ||
                        data === "null" ||
                        data === undefined ||
                        data === null)) ||
                    (data instanceof Array && data.length === 0)
                  ) {
                    //字段属性去除
                    form.deleteValuesIn(f.fieldName);
                  } else if (f.dataType === "basic" && data instanceof Array) {
                    form.setValuesIn(f.fieldName, data[0]);
                  } else {
                    form.setValuesIn(f.fieldName, data);
                  }
                },
                //自定义组件 VfBaseProps 的入参
                fieldInfo: {
                  ...f, //把字段信息全放入
                },
                entityType: modelInfo.entityType,
                componentSetting: f.componentSetting,
                //组件设置信息
                pageComponentPropDtos: f.pageComponentPropDtos,
                // 组件prop组件接口取值通用参数，不一定使用但是每次必定传，固需要用则参数名称应该和下面一致
                apiCommonParams: {
                  type: modelInfo.type,
                  itemType: modelInfo.itemType,
                  entityType: modelInfo.entityType, //当前业务模型名称
                  id: formData?.id, //当前业务记录id,
                  fieldName: f.fieldName, //当前字段
                  val: formData ? formData[f.fieldName] : undefined, //当前字段的值
                  //               fieldEntityType: f.entityType,
                },
                read: readPretty, //预览状态
              };
            }
            // 组件属性值提取
            //1  从组件定义信息里(ComponentData.conponentConf) 提取写死的值(prop=‘xxx’)
            const propInfo = ComponentInfos[f.x_component]?.propInfo;
            if (propInfo) {
              const keys = Object.keys(propInfo);
              keys.forEach((k) => {
                if (
                  typeof propInfo[k] === "string" ||
                  typeof propInfo[k] === "boolean" ||
                  typeof propInfo[k] === "number"
                ) {
                  prop["x-component-props"] = {
                    ...prop["x-component-props"],
                    [k]: propInfo[k],
                  };
                }
              });
            }
            //2 组件属性db库配置里提取 fixed类型的存储的固定属性值 ;
            if (f.pageComponentPropDtos && f.pageComponentPropDtos.length > 0) {
              //2 同步prop属性获取和设置
              const obj =
                fetchStaticPropObj(
                  f.pageComponentPropDtos,
                  ComponentInfos[f.x_component],
                  allDict,
                  f,
                  formData //表单数据
                ) || {};

              // 静态数据过滤器
              // Object.keys(obj).forEach((key) => {
              //   if (
              //     filterProps &&
              //     filterProps[f.fieldName] &&
              //     filterProps[f.fieldName][key]
              //   ) {
              //     obj[key] = filterProps[f.fieldName][key](
              //       obj[key],
              //       modelInfo,
              //       form.values
              //     );
              //   }
              // });
              prop["x-component-props"] = {
                ...prop["x-component-props"],
                ...obj,
              };
              //3 异步属性获取和设置
              if (prop["x-reactions"]) {
                //累加设置的联动部
                prop["x-reactions"] = [...prop["x-reactions"], "{{load1}}"];
              } else {
                prop["x-reactions"] = ["{{load1}}"];
              }
            }
            prop.type = "string"; //?
          }
        });

      const schemaObj: any = { type: "object", properties: {} };
      const grid = {
        type: "void",
        "x-component": "FormGrid",
        "x-component-props": {
          minWidth: 50, //最小宽度
          // minColumns: [4, 4, 4],
          maxColumns: [
            modelInfo.modelSize,
            modelInfo.modelSize,
            modelInfo.modelSize,
          ], //大中小尺寸
          minColumns: [
            modelInfo.modelSize,
            modelInfo.modelSize,
            modelInfo.modelSize,
          ],
        },
      };
      //有分组则加入分组容器，把内容组件放入容器里
      if (modelInfo.formTabDtos) {
        schemaObj.properties = {
          collapse: {
            type: "void",
            "x-component": "FormTab",
            properties: {},
          },
        };

        modelInfo.formTabDtos
          .sort((tab1, tab2) => tab1.sort - tab2.sort)
          .forEach((tab, index) => {
            schemaObj.properties.collapse.properties[tab.code] = {
              type: "void",
              "x-component": "FormTab.TabPane",
              "x-component-props": {
                tab: tab.name,
              },
              properties: {
                content: {
                  ...grid,
                  properties: filterProperties(pp, tab.code, index),
                },
              },
            };
          });
        return schemaObj;
      } else {
        return {
          type: "object",
          properties: {
            content: { ...grid, properties: pp },
          },
        };
      }
    }
    return {};
  }, [modelInfo, fkMap, readPretty, formData, highlight]); //, filterProps

  /**
   * 延迟让form里可以接口取到的原始数据
   */
  useEffect(() => {
    if (schema && form && onForm) {
      setTimeout(() => {
        onForm(form, modelInfo);
      }, 100);
    }
  }, [schema, form]);

  return schema ? (
    <div className={`${className} relative`}>
      {/* {highlight} */}
      <PreviewText.Placeholder value="-">
        <FormProvider form={form}>
          {/* {<FormConsumer>{(form) => JSON.stringify(form.values)}</FormConsumer>} */}
          <SchemaField
            schema={schema}
            scope={{
              formTab,
              // load,
              // useAsyncDataSource,
              load1,
              // useAsyncDataSource1,
            }}
          ></SchemaField>
        </FormProvider>
      </PreviewText.Placeholder>
    </div>
  ) : (
    <></>
  );
};
