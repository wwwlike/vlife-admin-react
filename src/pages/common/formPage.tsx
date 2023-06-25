import VlifeForm, { FormProps } from "@src/components/form";
import { useAuth } from "@src/context/auth-context";
import { FormVo } from "@src/api/Form";
import React, { useEffect, useMemo, useState } from "react";
import { find } from "@src/api/base/baseService";
import CheckModel from "@src/pages/sysConf/model/checkModel";
import { IdBean } from "@src/api/base";
import {
  ModelOperations,
  ModelOperationsImpl,
} from "@src/components/form/func";
import { Field, Form } from "@formily/core";
const mode = import.meta.env.VITE_APP_MODE;
/**
 * 入参：formData=> 表单初始化数据
 * 内部逻辑
 * 请求表单模型->提取字典模型
 * formData+表单模型->请求外键信息
 * 1. 表单数据提取
 * 2. 字典数据提取
 * 3. 外键数据提取
 * 4. 数据透传
 */
export interface FormPageProps<T extends IdBean>
  extends Omit<FormProps<T>, "modelInfo"> {
  type: string; //表单模型必传
  title?: string; //表单名称
  modelInfo?: FormVo; //模型信息可选，设计表单时实时传
  //将模型传输出去
  onVfForm?: (formVo: FormVo) => void;

  /**
   * 适配封装对外的方法
   */
  onChange?: (
    data: any,
    model: ModelOperations, //模型封装
    event: "init" | "submit" | string //当前事件 string=>改变的字段
  ) => void;
}
const FormPage = <T extends IdBean>({
  type,
  modelInfo,
  className,
  onDataChange,
  onClickFieldComponent,
  onVfForm,
  design,
  ...props
}: FormPageProps<T>) => {
  const { getDict, getFormInfo, groups, user } = useAuth(); //context里的字典信息、模型信息提取

  const [model, setModel] = useState<FormVo | undefined>(
    modelInfo ? { ...modelInfo } : undefined
  );
  //外键字段(待删除)
  const [fkMap, setFkMap] = useState<any>({}); // 外键数据集合

  //模型信息提取，模型信息返回
  useEffect(() => {
    if (model === undefined) {
      getFormInfo({ type, design }).then((data) => {
        if (data?.id) {
          setModel(data);
          if (onVfForm) {
            onVfForm(data);
          }
        }
      });
    }
  }, [type, design, groups]);

  //模型信息提取，模型信息返回
  useEffect(() => {
    if (modelInfo) {
      setModel({ ...modelInfo });
    }
  }, [JSON.stringify(modelInfo)]);

  //模型数据，无数据时去取字段的默认值
  const formData = useMemo(() => {
    if (model && props.formData === undefined) {
      const memoModel: any = {};
      model.fields.forEach((field) => {
        if (field.initialValues && field.fieldName) {
          memoModel[field.fieldName] = field.initialValues;
        }
      });
      return memoModel;
    }
    return props.formData;
  }, [model, props.formData]);

  /**
   * 模型里的字典数组
   */
  const modelDicts = useMemo((): string[] => {
    let allFieldCodes =
      model?.fields.map((f) => {
        return f.dictCode;
      }) || [];
    const distCodes: string[] = [];
    allFieldCodes.forEach((s) => {
      if (s) distCodes.push(s);
    });
    return distCodes;
  }, [model?.fields]);

  /**
   * 外键字段信息
   * 字段：字段请求模块
   */
  const fkInfos = useMemo((): { fieldName: string; entityName: string }[] => {
    if (!formData) {
      //没有数据则不用提炼
      return [];
    }
    //找出外键的字段
    const fkFields =
      model?.fields.filter((f) => f.x_component === "RelationInput") || [];
    // filedINfo 转换成 {fieldName，enetityName}结构的数据
    return fkFields.map((f) => {
      if (f.fieldName === "createId" || f.fieldName === "modifyId") {
        //外键特例
        return { fieldName: f.pathName, entityName: "sysUser" };
      }
      var delimited = f.pathName.split("_");
      var query_field_entityName = delimited[delimited.length - 1];
      if (query_field_entityName === "id") {
        query_field_entityName = delimited[delimited.length - 2];
      } else if (query_field_entityName.endsWith("Id")) {
        query_field_entityName = query_field_entityName.substring(
          0,
          query_field_entityName.length - 2
        );
      }
      return {
        fieldName: f.fieldName,
        entityName: query_field_entityName,
        // }
      };
    });
  }, [model, formData]);

  useEffect(() => {
    //step2 找到字段里有字典的数据，并从全局context里得到本次需要的字典数据
    fkInfos.forEach((f) => {
      if (formData[f.fieldName]) {
        const isStr = typeof formData[f.fieldName] === "string";
        const ids: string[] = isStr
          ? [formData[f.fieldName]]
          : props.formData[f.fieldName];
        find(f.entityName, "id", ids).then((data) => {
          data.data?.forEach((e) => {
            fkMap[e.id] = e.name;
            setFkMap({ ...fkMap });
          });
        });
      }
    });
  }, [fkInfos]);

  const form = useMemo(() => {
    if (model && formData) {
      return (
        <VlifeForm
          {...props}
          key={formData.id + props.key}
          modelInfo={model}
          design={design}
          dicts={getDict({
            emptyLabel: type === "req" ? "全部" : "请选择",
            codes: [...modelDicts],
          })}
          fkMap={fkMap}
          onField={(field: Field, form: Form, formVo: FormVo) => {
            if (props.onChange) {
              props.onChange(
                form.values(),
                new ModelOperationsImpl(form),
                field.path.toString()
              );
            }
          }}
          onDataChange={(data, form, formVo, field) => {
            if (props.onChange) {
              props.onChange(data, new ModelOperationsImpl(form), field);
            }
            if (onDataChange) {
              onDataChange(data, form, formVo, field);
            }
          }}
          formData={formData}
        />
      );
    } else {
      return <>${type}模型无法解析，请检查名称是否准确</>;
    }
  }, [model, formData]);

  return (
    <>
      {mode === "pro" || type === undefined ? (
        <>{form}</>
      ) : (
        <CheckModel modelName={[type]}>{form}</CheckModel>
      )}
    </>
  );
};
// };
export default FormPage;
