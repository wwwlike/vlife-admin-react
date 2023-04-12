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
  onFormInit,
  onFormMount,
  onFormValuesChange,
  Field,
  onFieldValueChange,
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
import { Result, TranDict } from "@src/api/base";
import { FormVo } from "@src/api/Form";
import { eventReaction } from "./reactions";
import { FormFieldVo } from "@src/api/FormField";
import { useAuth } from "@src/context/auth-context";
import {
  fetchPropObj, //组件动态数据提取
  fetchStaticPropObj, //组件静态数据提取
} from "@src/components/form/view";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import DesignFormItem from "@src/components/form/DesignFormItem";

import { DataType, sourceType } from "@src/dsl/schema/base";
import { exist } from "@src/api/base/baseService";
import { ComponentInfos } from "@src/dsl/datas/components";
import { PropInfo } from "@src/dsl/schema/component";

// const useAsyncDataSource = (service) => (field: FormFieldVo) => {
//   field.loading = true;
//   service(field).then(
//     action.bound((data: Result<FormVo>) => {
//       field.componentProps.datas = data.data;
//       // alert(field.componentProps.datas.length);
//       field.loading = false;
//     })
//   );
// };

// const load1 = async (field: Field) => {
//   const componentSetting: ComponentSetting =
//     field.componentProps.componentSetting;
//   if (componentSetting) {
//     const props = Object.keys(componentSetting);
//     //对组件的属性进行遍历
//     props.map((oneProp) => {
//       const sourceType = componentSetting[oneProp].sourceType;
//       const apiModel = ApiInfo[componentSetting[oneProp].api];
//       //只要固定有值，不管选择的是不是固定的
//       if (componentSetting[oneProp].fixed) {
//         //给字段级组件指定prop传固定值
//         field.componentProps[oneProp] = componentSetting[oneProp].fixed;
//       } else if (sourceType.startsWith("api") && apiModel && apiModel.api) {
//         //接口是否有入参判断，有则要取值
//         const params = apiModel.params;
//         const argument = {};
//         let mustFlag = true;
//         if (params) {
//           Object.keys(params).forEach((k) => {
//             //当前接口的一个参数
//             const currParam = componentSetting[oneProp].apiParams
//               ? componentSetting[oneProp].apiParams[k]
//               : undefined;
//             if (currParam) {
//               if (
//                 currParam.fixed &&
//                 (currParam.sourceType === "fixed" ||
//                   currParam.sourceType === undefined)
//               ) {
//                 argument[k] = currParam.fixed;
//               } else if (
//                 currParam.sourceType === "field" &&
//                 field.query(currParam.field).get("value")
//               ) {
//                 argument[k] = field.query(currParam.field).get("value");
//               }
//             }
//             //应该有值，但是没有值
//             if (params[k].must === true && (!currParam || !argument[k])) {
//               mustFlag = false;
//             }
//           });
//         }
//         // return { prop: oneProp, service: apiModel.api(argument) };
//         //必填的字段must有值，那么就去调用接口
//         if (mustFlag) {
//           // 所有动态加载数据的组件使用的接口都会传name, id, entityName;
//           apiModel
//             .api({ ...argument, ...field.componentProps.apiCommonParams })
//             .then((data) => {
//               field.componentProps[oneProp] = data.data;
//             });
//         }
//       }
//     });
//   }
// };

//异步加载数据，联动数据
const load1 = async (field: Field) => {
  const pageComponentPropDtos: PageComponentPropDto[] =
    field.componentProps["pageComponentPropDtos"];
  if (pageComponentPropDtos)
    fetchPropObj(
      //请求组件属性的值
      pageComponentPropDtos, //组件设置的db设置信息(包涵参数设置)
      ComponentInfos[field.componentProps["fieldInfo"].x_component], //组件信息
      // field.componentProps.apiCommonParams, //下面设置进来的
      field //字段信息；其实只传这一个值，上面三个可以都取得到
    ).then((data) => {
      if (data) {
        Object.keys(data).forEach((oneProp) => {
          field.componentProps[oneProp] = data[oneProp];
        });
      }
    });
};
// reaction
//https://react.formilyjs.org/zh-CN/api/shared/schema#schemareactions
//表信息
export interface FormProps {
  key?: string;
  className?: string;
  modelInfo: FormVo; //模型信息
  formData?: any; // 表单数据/默认初始化数据
  design?: boolean; //自定义表单设计模式（设计模式采用的是FormItem）
  highlight?: string; //高亮字段(当前聚焦需要高亮的)
  readPretty?: true; //显示模式
  dicts?: TranDict[]; //所有用到的字典信息(没有从authContext里取，避免耦合)
  fkMap?: any; // 外键对象信息{ID,NAME}
  //单字段模式，只显示fieldMode里的一个字段
  fieldMode?: string;
  validate?: {
    [key: string]: (val: any, formData: object) => string | Promise<any> | void;
  };
  //表单数据回传
  onDataChange?: (data: any, field?: string) => void;
  //formily信息回传(formModal使用)
  onForm?: (form: Form) => void;
  // 将最新错误信息传输出去 formModal使用
  onError?: (error: IFormFeedback[]) => void;
  //design触发的相关操作回调事件
  onClickFieldComponent?: (
    fieldName: string,
    opt: "click" | "must" | "delete" //点击区域
  ) => void; //当前聚焦字段点击的字段，设计器时才会触发
  //覆盖model.fileds里的数据，也可以对field里没有的信息可以进行补充
}
const formTab = FormTab.createFormTab?.("tab1");

registerValidateLocale({
  "zh-CN": {
    required: "必填项",
  },
});

export default ({
  className,
  dicts,
  formData,
  onDataChange,
  onForm,
  readPretty,
  fkMap,
  modelInfo,
  onError,
  highlight,
  onClickFieldComponent,
  fieldMode,
  validate,
  design = false,
}: FormProps) => {
  const { getDict, dicts: allDict, getFormInfo } = useAuth();

  //
  // useEffect(() => {
  //   alert("1");
  // });
  /**
   * 动态表单数据初始化
   * 使用参考：https://core.formilyjs.org/zh-CN/api/models/form
   */
  const form = useMemo(
    () =>
      createForm({
        readPretty,
        // editable:false,
        initialValues: {
          ...formData,
        },
        //表单的生命周期
        effects() {
          onFormMount((form) => {
            if (onForm != undefined) {
              onForm(form);
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
            field.validate_unique &&
              onFieldValueChange(field.fieldName, (formilyField) => {
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

          // onFieldValueChange("state", (field) => {
          //   field.setFeedback({
          //     code: "ValidateError",
          //     type: "error",
          //     messages: ["异常state"],
          //   });
          // });
          // onFieldValueChange("name", (field) => {
          //   field.setFeedback({
          //     code: "ValidateError",
          //     type: "error",
          //     messages: ["异常"],
          //   });
          // });
          // onFieldValueChange("name", (field) => {});
          onFormInit((form) => {}),
            onFormValuesChange((form) => {
              if (form.errors.length > 0 && onError !== undefined) {
                setTimeout(() => onError(form.errors), 200);
              }
              //去掉字符串"""
              // const formVal = Object.keys(form.values).reduce(
              //   (acc: any, key) => {
              //     const value = form.values[key];
              //     if (value !== "" && value !== undefined) {
              //       acc[key] = value;
              //     }
              //     return acc;
              //   },
              //   {}
              // );
              //表单数据传输出去
              if (onDataChange !== undefined) {
                onDataChange(form.values);
              }
              //表达formily信息传输出去
              if (onForm != undefined) {
                onForm(form);
              }
            });
        },
      }),
    [modelInfo, fkMap, formData, readPretty]
  );

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
                "x-component": "Section",
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
              prop.title = "";
            }

            // prop.error = [
            //   {
            //     address: "111",
            //     triggerType: "onInput",
            //     type: "error",
            //     code: "EffectError",
            //   },
            // ];

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
              prop["x-decorator"] = "FormItem";
              prop["x-decorator-props"] = {
                ...prop["x-decorator-props"],
                style: "",
                bordered: false,
                // fullness:true,
                // tooltipLayout: "text",
                // tooltip: "right",
                // colon: true, bg-gray-100 font-bold
                className: "font-bold",
                // addonAfter: <IconAlarm />,
                // size: "large",
                // size: "small",
              };
            }

            // 高亮字段(表单设计器)；设计器还缺少对tab页签的切换高亮/高亮能够有特殊的组件包裹比较好
            if (f.fieldName === highlight) {
              prop["x-decorator-props"] = {
                ...prop["x-decorator-props"],
                style: { backgroundColor: "rgba(33, 150, 243, 0.15)" },
              };
            }
            // 添加级联响应
            if (f.events && (design === false || design === undefined)) {
              prop["x-reactions"] = eventReaction(f.events, modelInfo.fields);
            }

            //组件需要异步加载数据 老方式

            // const apiInfo = loadDatas[f.apiKey];
            // if (apiInfo && apiInfo.dynamic) {
            //   if (prop["x-reactions"]) {
            //     prop["x-reactions"] = [
            //       ...prop["x-reactions"],
            //       "{{useAsyncDataSource(load)}}",
            //     ];
            //   } else {
            //     prop["x-reactions"] = ["{{useAsyncDataSource(load)}}"];
            //   }
            // }

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
                // style: { background: "transparent" },

                // className: " bg-red-100 ",
                // className: " bg-white border-2",
                //自定义组件事件入参 onDataChange
                onDataChange: (data: any) => {
                  // alert(JSON.stringify(data));
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

                //组件设置信息做什么的？
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
                // else {
                //   const pp = propInfo[k] as PropInfo;
                //   if ((pp.sourceType === sourceType.func, pp.func)) {
                //     prop["x-component-props"] = {
                //       ...prop["x-component-props"],
                //       [k]: pp.func(formData[f.fieldName]),
                //     };
                //   }
                // }
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

              prop["x-component-props"] = {
                ...prop["x-component-props"],
                ...obj,
              };
              //3 异步属性获取和设置

              if (prop["x-reactions"]) {
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
  }, [modelInfo, fkMap, readPretty, formData, highlight]);

  const normalSchema = {
    type: "object",
    properties: {
      grid: {
        type: "void",
        "x-component": "FormGrid",
        "x-component-props": {
          minWidth: 30, //最小宽度
          maxWidth: 300,
          minColumns: [4, 4, 4],
          maxColumns: [4, 4, 4],
        },
        group: {
          type: "void",
          "x-component": "FormGrid",
          "x-component-props": {
            minWidth: 30, //最小宽度
            maxWidth: 300,
            minColumns: [4, 4, 4],
            maxColumns: [4, 4, 4],
          },
          properties: {
            username: {
              type: "string",
              title: "用户名2",
              // "x-editable": false, //	字段可编辑	Boolean	editable
              // "x-read-pretty": true,
              // "x-disabled": true,
              // "x-validator": "email",
              "x-visible": true, //false隐藏
              "x-decorator": "FormItem",
              "x-decorator-props": { gridSpan: 4 },
              "x-component": "Input",
            },
            password: {
              type: "string",
              title: "用户名",
              readOnly: true,
              "x-decorator": "FormItem",
              "x-component": "Input",
              "x-decorator-props": { gridSpan: 4, bordered: true },
            },
          },
        },
      },
    },
  };

  const config = {
    type: "object",
    properties: {
      aaa: {
        type: "void",
        "x-decorator": "FormItem",
        "x-component": "Section",
        "x-component-props": {
          text: "checkbox area",
        },
        // "x-content": "apple",
        properties: {
          aaa: {
            type: "string",
            title: "checkbox",
            // len: 5,
            minLength: 5,
            // "x-validator": {
            //   len: 5,
            //   // exclusiveMinimum: 5,
            // },
            "x-decorator": "FormItem",
            "x-component": "Input",
            // "x-content": "apple",
          },
        },
      },
    },
  };

  // useEffect(() => {
  // alert(“1”)
  // }, [form]);

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
