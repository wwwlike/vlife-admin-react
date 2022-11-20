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
  FormConsumer,
  useForm,
} from "@formily/react";

import {
  FormItem,
  PreviewText,
  FormGrid,
  GridColumn,
  Select,
  ArrayItems,
  ArrayTable,
  Checkbox,
  FormTab,
} from "@formily/semi";
import { Result, TranDict } from "@src/mvc/base";
import RelationInput from "@src/components/form/comp/RelationInput";
import RoleResourcesSelect from "@src/pages/auth/role/RoleResourcesSelect/formily";
import TabSelect from "@src/components/form/comp/TabSelect";
import PageSelect from "@src/components/form/comp/PageSelect";
import TreeSelect from "@src/components/form/comp/TreeSelect";
import VVV from "./VVV";
import {
  DatePicker as SemiDatePicker,
  Input as SemiInput,
  TextArea as SemiTextArea,
} from "@douyinfe/semi-ui";
import { FormVo } from "@src/mvc/model/Form";
import { eventReaction, loadDeps } from "./reactions";
import VlifeSelect from "./comp/VlifeSelect";
// import SearchInput from "./comp/SearchInput";
import DictSelectTag from "./comp/DictSelectTag";
// import TreeQuery from "./comp/TreeQuery";
import VfRelationSelect from "../select/RelationSelect";
import SearchInput from "@src/components/search";
import FormTable from "../table/FormTable";
import { FormFieldVo, loadData } from "@src/mvc/model/FormField";
import TreeQuery from "../tree/TreeQuery";
import QueryBuilder from "../queryBuilder";
import loadDatas from "@src/pages/design/data/loadData";
// import RelationSelect from "./comp/RelationSelect";
import { action } from "@formily/reactive";

const Input = connect(SemiInput, mapReadPretty(PreviewText.Input));
const TextArea = connect(SemiTextArea, mapReadPretty(PreviewText.Input));
const DatePicker = connect(SemiDatePicker, mapReadPretty(PreviewText.Input));
const RelationSelect = connect(
  VfRelationSelect,
  mapReadPretty(PreviewText.Input)
);

const useAsyncDataSource = (service) => (field: FormFieldVo) => {
  field.loading = true;
  service(field).then(
    action.bound((data: Result<FormVo>) => {
      field.componentProps.datas = data.data;
      // alert(field.componentProps.datas.length);
      field.loading = false;
    })
  );
};
/**
 * 表单布局展示，需要固定写在函数式组件之外
 * 圈定所有组件
 */
const SchemaField = createSchemaField({
  components: {
    Input,
    TextArea,
    PreviewText,
    FormItem,
    FormGrid,
    DatePicker,
    GridColumn,
    Select,
    ArrayItems,
    FormTab,
    ArrayTable,
    Checkbox,
    RelationInput, //封装关系选择formily组件。特定组件支持特定业务
    RelationSelect,
    RoleResourcesSelect, // 特定的业务型组件 占2列；自定义组件，根据传参来处理
    TabSelect, //tab方式的过滤，权限选择上级权限时使用在，应该会被TreeSelect取代
    PageSelect, //平铺选择组件（查询条件过滤使用在）
    TreeSelect,
    VlifeSelect,
    SearchInput,
    DictSelectTag,
    TreeQuery,
    FormTable, //列表组件
    QueryBuilder, // 查询组件
    VVV, //测试组件
  },
});

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
  /**
   * 将数据与模型对应的数值取出来当入参数传入到loaddata里
   */
  const load = async (field) => {
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

  /**
   * 字典数据提取
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

        if (f.events) {
          prop["x-reactions"] = eventReaction(f.events, modelInfo.fields);
        }

        //组件需要异步加载数据
        const apiInfo = loadDatas[f.apiKey];
        if (apiInfo && apiInfo.dynamic) {
          if (prop["x-reactions"]) {
            prop["x-reactions"] = [
              ...prop["x-reactions"],
              "{{useAsyncDataSource(load)}}",
            ];
          } else {
            prop["x-reactions"] = ["{{useAsyncDataSource(load)}}"];
          }
        }

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

        // propName: string; //属性名称
        // sourceType: "field" | "fixed" | "apiKey"; // 参数来源类型
        // field: string; //匹配某个字段的值
        // fixed: object; //固定值
        // api: {
        //   key: string; //propName对应的 选择的api的名称 (apiData里的名称)
        //   params: {
        //     name: string; //参数标识
        //     sourceType: "field" | "fixed"; // 取值来源(字段关联,固定传值)
        //     field: string; //匹配字段
        //     fixed: string; // 匹配接口
        //   }[];
        // }; //接口
        //业务组件,属性传值
        if (f.componentSetting && Object.keys(f.componentSetting).length > 0) {
          const pop = Object.keys(f.componentSetting).map((p) => {
            // alert(JSON.stringify(p));
            return { [p]: f.componentSetting[p].fixed };
          });

          prop["x-component-props"] = {
            ...prop["x-component-props"],
            id: "123",
            prop: {
              id: "1234",
            },
          };
        }

        // //业务组件
        // if (f.componentType === "busines333s") {
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
        return {
          type: "object",
          properties: {
            content: { ...grid, properties: pp },
          },
        };
      }
    }
    return {};
  }, [modelInfo, formData, read, reload]);

  const schema1 = {
    type: "object",
    properties: {
      username: {
        type: "string",
        title: "用户名",
        required: true,
        "x-decorator": "FormItem",
        "x-component": "VVV",
      },
    },
  };
  return (
    <PreviewText.Placeholder value="-">
      <FormProvider form={form}>
        {/* <FormConsumer>{(form) => JSON.stringify(schema)}</FormConsumer> */}
        <SchemaField
          schema={schema1}
          scope={{ formTab, load, useAsyncDataSource }}
        ></SchemaField>
      </FormProvider>
    </PreviewText.Placeholder>
  );
};
