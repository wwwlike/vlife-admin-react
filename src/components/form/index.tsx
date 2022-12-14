/**
 * 使用formliy + semi联合打造的动态表单
 * 考虑使用reactQuery,从后台取得表单信息，然后缓存起来。
 *
 * https://zhuanlan.zhihu.com/p/577439561
 * 组件化
 */
import React, { useCallback, useMemo } from "react";
import {
  registerValidateLocale,
  createForm,
  Form,
  IFormFeedback,
  onFormInit,
  onFormMount,
  onFormValuesChange,
  Field,
} from "@formily/core";
import {
  FormProvider,
  mapReadPretty,
  connect,
  createSchemaField,
} from "@formily/react";

import {
  FormItem,
  PreviewText,
  FormGrid,
  GridColumn,
  ArrayItems,
  ArrayTable,
  FormTab,
} from "@formily/semi";
import { Result, TranDict } from "@src/mvc/base";
import { FormVo } from "@src/mvc/model/Form";
import { eventReaction, loadDeps } from "./reactions";
import FormTable from "../table/FormTable";
import { FormFieldVo, loadData } from "@src/mvc/model/FormField";
import { action } from "@formily/reactive";
import { useAuth } from "@src/context/auth-context";
import { ComponentInfo } from "@src/pages/design/fieldSetting/componentData";
import {
  fetchPropObj, //动态数据提取
  fetchStaticPropObj, //静态数据提取
} from "../layout/Views";
import { PageComponentPropDto } from "@src/mvc/PageComponentProp";

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
    //  field.componentProps.apiCommonParams
    fetchPropObj(
      pageComponentPropDtos,
      ComponentInfo[field.componentProps["fieldInfo"].x_component],
      field.componentProps.apiCommonParams,
      field
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
  entityName: string; //预留字段
  reload?: boolean; //重新加载
  modelInfo: FormVo; //模型信息
  formData?: any; // form初始数据
  highlight?: string; //高亮字段(设计器使用)
  //“表单数据”数据变化回调,最新变化的字段，查询条件里常用
  onDataChange?: (data: any, field?: string) => void;
  //将最"新表单信息"传输出去（formModal使用）
  onForm?: (form: Form) => void;
  read?: boolean; //显示模式
  onError?: (error: IFormFeedback[]) => void; // 将最新错误信息传输出去 formModal使用
  dicts?: TranDict[]; //所有用到的字典信息(没有从authContext里取，避免耦合)
  fkMap?: any; // 外键对象信息{ID,NAME}
  //单字段模式，只显示fieldMode里的一个字段
  fieldMode?: string;
  //覆盖model.fileds里的数据，也可以对field里没有的信息可以进行补充
}
const formTab = FormTab.createFormTab?.("tab1");

registerValidateLocale({
  "zh-CN": {
    required: "该字段必填",
  },
});

export default ({
  entityName,
  dicts,
  formData,
  onDataChange,
  onForm,
  reload,
  read,
  fkMap,
  modelInfo,
  onError,
  highlight,
  fieldMode,
}: FormProps) => {
  const { getDict, dicts: allDict } = useAuth();

  /**
   * 将数据与模型对应的数值取出来当入参数传入到loaddata里
   */
  const load = async (field: any) => {
    // alert(JSON.stringify(field.componentProps));
    if (field.componentProps && field.componentProps.loadDatas) {
      const loadDatas: loadData = field.componentProps.loadDatas;
      const deptField = loadDeps(
        loadDatas.dynamic, //复杂了
        entityName
      );
      const pp: any = {};
      Object.keys(deptField).forEach((key) => {
        pp[key] = field.query(deptField[key]).get("value");
      });
      return loadDatas.loadData({
        ...loadDatas.props,
        ...pp,
      });
    }
  };

  //

  /**
   * 动态表单数据初始化
   * 使用参考：https://core.formilyjs.org/zh-CN/api/models/form
   */
  const form = useMemo(
    () =>
      createForm({
        readPretty: read,
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
          }),
            onFormInit((form) => {}),
            onFormValuesChange((form) => {
              if (form.errors.length > 0 && onError !== undefined) {
                setTimeout(() => onError(form.errors), 200);
              }
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
    [modelInfo, fkMap, formData, read, reload]
  );

  const SchemaField = useMemo(() => {
    const components: any = {};
    Object.keys(ComponentInfo)
      .filter((key) => ComponentInfo[key].component)
      .forEach((key) => {
        components[key] = ComponentInfo[key].component;
      });

    return createSchemaField(
      {
        components: {
          ...components,
          PreviewText,
          FormItem,
          FormGrid,
          GridColumn,
          ArrayItems,
          FormTab,
          ArrayTable,
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
    [dicts, reload]
  );

  /**
   * 过滤得到分组的表单对象
   * @param pp 过滤的表单对象
   * @param groupId 分组id
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
        (pp[key]["formGroupCode"] === null && index === 0) ||
        pp[key]["formGroupCode"] === code
      ) {
        tmp[key] = pp[key];
      }
    });
    return tmp;
  };

  const sysComponents = ["Input"];
  /**
   * 动态表单formily
   * 后端FormField转换成schema信息
   */
  const schema = useMemo(() => {
    const pp: any = {};
    if (modelInfo) {
      let fields = modelInfo.fields;
      if (fieldMode) {
        fields = modelInfo.fields.filter((f) => f.fieldName === fieldMode);
      }

      fields.forEach((f: FormFieldVo) => {
        pp[f.fieldName] = { ...f };
        const prop: any = pp[f.fieldName];
        // java属性不能包含“-”是"_",故进行转换，并批量赋值
        Object.keys(prop)
          .filter((key) => key.startsWith("x_"))
          .map((key) => {
            // formily 转换对应的字段， vlife转换之前的字段，用来取值
            return { formily: key.replaceAll("_", "-"), vlife: key };
          })
          .forEach((obj) => {
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

        prop["x-decorator"] = "FormItem";
        // 高亮字段(表单设计器)；设计器还缺少对tab页签的切换高亮
        if (f.fieldName === highlight) {
          prop["x-decorator-props"] = {
            ...prop["x-decorator-props"],
            style: { backgroundColor: "#e5ffff" },
          };
        }
        // 添加级联响应
        if (f.events) {
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
          (f.x_component === "Select" || f.x_component === "DictSelectTag") &&
          f.dictCode
        ) {
          prop.enum = fieldEnum(f.dictCode, f.type);
        } else if (f.x_component === "DatePicker") {
          //日期格式设置（需在设计器里指定日期格式（待））
          if (f.fieldType === "list") {
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
        //正则验证
        if (f.vlife_pattern) {
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
            onDataChange: (data: any) => {
              if (
                (typeof data === "string" &&
                  (data === "undefined" ||
                    data === "null" ||
                    data === undefined ||
                    data === null)) ||
                (data instanceof Array && data.length === 0)
              ) {
                console.log("fieldDataChange", data);
                //字段属性去除
                form.deleteValuesIn(f.fieldName);
              } else if (f.fieldType === "basic" && data instanceof Array) {
                console.log("fieldDataChange", data);

                form.setValuesIn(f.fieldName, data[0]);
              } else {
                form.setValuesIn(f.fieldName, data);
              }
            },
            //把字段信息全放入
            fieldInfo: {
              ...f,
            },
            //组件设置信息（ 待移除）
            componentSetting: f.componentSetting,
            //组件设置信息
            pageComponentPropDtos: f.pageComponentPropDtos,
            //组件prop组件接口取值通用参数，不一定使用但是每次必定传，固需要用则参数名称应该和下面一致
            apiCommonParams: {
              entityName, //当前业务模型名称
              id: formData.id, //当前业务记录id,
              fieldName: f.fieldName, //当前字段
              val: formData[f.fieldName], //当前字段的值
              //               fieldEntityType: f.entityType,
            },
            read: read, //预览状态
          };
        }
        // 组件属性值提取
        //1  从组件定义信息里(ComponentData.conponentConf) 提取写死的值(prop=‘xxx’)
        const propInfo = ComponentInfo[f.x_component]?.propInfo;
        if (propInfo) {
          const keys = Object.keys(propInfo);
          keys.forEach((k) => {
            if (typeof propInfo[k] === "string") {
              prop["x-component-props"] = {
                ...prop["x-component-props"],
                [k]: propInfo[k],
              };
            }
          });
        }
        //2 组件属性db库配置里提取 fixed类型的存储的固定属性值 ;
        if (f.pageComponentPropDtos && f.pageComponentPropDtos.length > 0) {
          const obj =
            fetchStaticPropObj(
              f.pageComponentPropDtos,
              ComponentInfo[f.x_component],
              allDict,
              f,
              formData //表单数据
            ) || {};
          prop["x-component-props"] = {
            ...prop["x-component-props"],
            ...obj,
          };

          if (prop["x-reactions"]) {
            prop["x-reactions"] = [...prop["x-reactions"], "{{load1}}"];
          } else {
            prop["x-reactions"] = ["{{load1}}"];
          }
        }

        // 异步数据提取 组件动态属性从componentSetiting里提取
        // if (f.componentSetting && f.componentSetting !== null) {

        // }
        // }

        // getPropObj().then((o) => {
        //   prop["x-component-props"] = {
        //     ...prop["x-component-props"],
        //     optionList: [{ label: "aaa", value: "234" }],
        //   };
        // });

        // componentPropCreate(
        //   f.pageComponentPropDtos, //属性值
        //   ComponentInfo[f.x_component], //组件属性信息
        //   (props) => {
        //     //设置组件属性的回调方法
        //     prop["x-component-props"] = {
        //       ...prop["x-component-props"],
        //       ...props,
        //     };
        //   },
        //   allDict
        // );
        // let props: any = {};
        // //视图组件传值组装
        // // 1.组装fixed的简单对象
        // f.pageComponentPropDtos
        //   .filter(
        //     (p) =>
        //       p.propName &&
        //       p.propVal &&
        //       (p.sourceType?.startsWith("fixed") || p.sourceType === "table")
        //   )
        //   .forEach((p) => {
        //     const dt = getDataType(
        //       ComponentInfo[f.x_component],
        //       p.propName,
        //       p.subName
        //     );
        //     props = valueAdd(
        //       p,
        //       props,
        //       dt === dataType.icon ? (
        //         <SelectIcon read={true} value={p.propVal} />
        //       ) : (
        //         p.propVal
        //       )
        //     );
        //   });

        // //dict取值

        // f.pageComponentPropDtos
        //   ?.filter((p) => p.propName && p.sourceType === "dict")
        //   .forEach((p) => {
        //     const dt = getDataType(
        //       ComponentInfo[f.x_component],
        //       p.propName,
        //       p.subName
        //     );
        //     //数据转换
        //     props = valueAdd(p, props, [{ val: "1", title: "2" }]);
        //   });

        // prop["x-component-props"] = {
        //   ...prop["x-component-props"],
        //   ...props,
        // };

        //业务组件
        // if (f.componentType === "business") {
        //   prop["x-component-props"]["field"] = f;
        //   // 组件的datas会是动态的，这时如何处理
        //   prop["x-component-props"] = {
        //     ...prop["x-component-props"],
        //     [f.fieldName]: f.props, //写属性名则知道去取需要的，固定写法,待模型规范处理后去除
        //     ...f, //FormFieldVo里的所有字段打平进来
        //     props: f.props, // 直顶名称写死 待模型规范处理后去除
        //     ...f.props, // 模型信息固定入参 loadData.ts里的prop固定入参
        //     form: modelInfo, //模型信息传入自定义组件
        //     onDataChange: (data: any) => {
        //       // 自定义组件值回传
        //       if (f.fieldType === "basic" && data instanceof Array) {
        //         form.setValuesIn(f.fieldName, data[0]);
        //       } else {
        //         form.setValuesIn(f.fieldName, data);
        //       }
        //     },
        //     read: read, //预览状态
        //   };
        // }
        //作用?
        prop.type = "string";
      });

      const schemaObj: any = { type: "object", properties: {} };
      const grid = {
        type: "void",
        "x-component": "FormGrid",
        "x-component-props": {
          maxColumns: [
            modelInfo.gridSpan,
            modelInfo.gridSpan,
            modelInfo.gridSpan,
          ], //固定6列
          minColumns: [
            modelInfo.gridSpan,
            modelInfo.gridSpan,
            modelInfo.gridSpan,
          ],
        },
      };
      //有分组则加入分组容器，把内容组件放入容器里
      if (modelInfo.groups) {
        schemaObj.properties = {
          collapse: {
            type: "void",
            "x-component": "FormTab",
            properties: {},
          },
        };

        modelInfo.groups.forEach((group, index) => {
          schemaObj.properties.collapse.properties[group.code] = {
            type: "void",
            "x-component": "FormTab.TabPane",
            "x-component-props": {
              tab: group.name,
            },
            properties: {
              content: {
                ...grid,
                properties: filterProperties(pp, group.code, index),
              },
            },
          };
        });
        return schemaObj;
      } else {
        //无分组直接返回
        // alert("222");
        return {
          type: "object",
          properties: {
            content: { ...grid, properties: pp },
          },
        };
      }
    }
    return {};
  }, [modelInfo, fkMap, read, reload, formData]);

  // const normalSchema = {
  //   type: "object",
  //   properties: {
  //     username: {
  //       type: "string",
  //       title: "用户名",
  //       required: true,
  //       "x-decorator": "FormItem",
  //       "x-component": "VVV",
  //       "x-component-props": { name: "1", id: "2" },
  //     },
  //   },
  // };

  // useEffect(() => {
  // alert(“1”)
  // }, [form]);

  return schema ? (
    <>
      {/* {JSON.stringify(modelInfo.fields[2].componentSetting)} */}
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
    </>
  ) : (
    <></>
  );
};
