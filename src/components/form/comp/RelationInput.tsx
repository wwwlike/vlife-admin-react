import { Input, TagInput } from "@douyinfe/semi-ui";
import React, { useEffect, useMemo, useState } from "react";
import { useNiceModal } from "@src/store";
import { observer, useField, useForm } from "@formily/react";
import { useSelector } from "react-redux";
import { ArrayField } from "@formily/core";
/**
 * 外键关系展示[INPUT+TAG]组件
 * 1. 核心状态：
 * 展示内容
 * 使用了接口，不能成为组件，需要移到page模块里
 * 外键数据查询的组件
 * 1. 点击后弹出 外键表的table页面。
 * 2. 关闭(隐藏)Input如果在modal的页面
 * 3. 选择或者关闭弹出框后，原先的modal页面显示出来并赋值
 * 4. input框上要显示中文
 * 5. 调用table的弹出组件
 */
interface RelationInputProps {
  project: { id: string; name: string }[];
}

const RelationInput = observer((props: RelationInputProps) => {
  const field = useField<ArrayField>();
  const form = useForm();
  //获得焦点打开的层
  const { show, hide, activeModalId, showAsSub, hideAndOpenParent } =
    useNiceModal("tableModal");
  //上一个modal的参数
  const args = useSelector((state: any) => state[activeModalId]);
  const formModal = useNiceModal("formModal");
  //弹出层table进入时选中的数据
  const [project, setProject] = useState<{ id: string; name: string }[]>([]);
  // 请求主键的名称考虑用reqctQuery缓存起来
  const [entityName, setEntityName] = useState("");
  //字段名
  const [fieldName, setFieldName] = useState(field.props.name as string);
  //判断是否选多个
  const selectMore = useMemo(() => {
    return !(
      field.componentProps["type"] === "string" &&
      field.componentProps["fieldType"] === "basic"
    );
  }, [field.componentProps]);

  /**
   * input所在的form打开时候调用
   */
  useEffect(() => {
    //待优化从form里取
    const fkmap = field?.componentProps.fkMap; //所有外键数据
    let temp: { id: string; name: string }[] = [];
    for (const x in fkmap) {
      if (typeof field.value === "string" && x === field.value) {
        temp.push({ id: x, name: fkmap[x] });
      } else if (field.value instanceof Array) {
        //数组字段 关系字段在关联表
        field.value?.forEach((id) => {
          if (id === x) {
            temp.push({ id: x, name: fkmap[x] });
          }
        });
      }
    }
    if (temp.length > 0) {
      setProject([...temp]);
    }
    const names = field.componentProps["pathName"].split("_");
    if (names.length > 1 && names[names.length - 1] === "id") {
      setEntityName(names[names.length - 2]);
    } else if (names[names.length - 1].endsWith("Id")) {
      setEntityName(
        names[names.length - 1].substring(0, names[names.length - 1].length - 2)
      );
    }
  }, [field]);

  //全局store
  const gloable = useSelector((state) => state);
  //写成useCallback不在modal时会不弹出来
  //弹出列表
  const onFocus = () => {
    showAsSub({
      entityName, //模块
      selected: project, //选中项
      btnEnable: { disable: true },
      select_more: selectMore, //selectMore->选不选？选单个多个？
      select_show_field: "name", // 当前配合后端写死为name
    }).then((data: any) => {
      //点确认后回调,data=>table返回的数据
      if (activeModalId) {
        // tue=>  showAsSub之前是弹出框
        //弹出层展示->给initData赋值id, 在form层请求name
        //...formModal.args 打开之前的窗口口
        if (data.length === 0) {
          hideAndOpenParent({
            ...args,
            initData: { ...form.values, [fieldName]: undefined },
          });
        } else if (selectMore) {
          // console.log("map",fieldName,data.map((d:any)=>d.id));
          hideAndOpenParent({
            ...args,
            initData: {
              ...form.values,
              [fieldName]: data.map((d: any) => d.id),
            },
          });
        } else {
          hideAndOpenParent({
            ...args,
            initData: {
              ...form.values,
              [fieldName]: data.map((d: any) => d.id)[0],
            },
          });
        }
        // setProject(data.map((d:any)=>{d.id,d.name}))
      } else {
        // 改form里的值
        if (data.length === 0) {
          form.setValuesIn(fieldName, undefined);
        } else if (selectMore) {
          form.setValuesIn(
            fieldName,
            data.map((d: any) => d.id)
          );
        } else {
          form.setValuesIn(fieldName, data.map((d: any) => d.id)[0]);
        }
        //本页面input展示内容改变
        setProject(data);
      }
      // },300)
    });
  };
  return form.readPretty ? (
    <> {project.map((m) => m.name)}</>
  ) : (
    <>
      {/* {JSON.stringify(project)} */}
      <TagInput
        showClear
        placeholder={field.title}
        value={project.map((m) => m.name)}
        defaultValue={project.map((m) => m?.id)}
        onFocus={onFocus}
        onRemove={(v, i) => {
          const obj = [
            ...project.filter((d, index) => {
              return i !== index;
            }),
          ];
          setProject([...obj]);
          if (obj.length > 0) {
            if (selectMore) {
              form.setValuesIn(
                fieldName,
                obj.map((p) => p.id)
              );
            } else {
              form.setValuesIn(fieldName, obj.map((p) => p.id)[0]);
            }
          } else {
            if (selectMore) {
              form.setValuesIn(fieldName, []);
            } else {
              form.setValuesIn(fieldName, undefined);
            }
          }
        }}
      />
    </>
  );
});
export default RelationInput;
