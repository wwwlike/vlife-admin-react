import { Select } from "@douyinfe/semi-ui";
import Label from "@douyinfe/semi-ui/lib/es/form/label";
import { connect, mapProps } from "@formily/react";
/**
 * 将vlife返回的数据转换成 semi需要select需要的格式 label和value
 * 指定了name就用
 * props对应的是 ["x-component-props"]里的属性
 * field对应的是 schema里的字段全量信息 包含有 x-component-props
 */
export default connect(
  Select,
  mapProps((props, field: any) => {
    // alert(field["componentProps"].datas);
    // if (field.props.name === "fieldName") {
    //   // alert(field["componentProps"].datas);
    // }
    let datas: any[] = [];
    let key = "id"; //默认value是id
    let label = "name"; //默认lable=name
    if (
      field["componentProps"].datas &&
      field["componentProps"].datas.length > 0
    ) {
      datas = field["componentProps"].datas;
      // 规则：当前组件字段名称不包含id,则默认认为是和来源表里的字段名称是一致的
      if (
        field.props.name.indexOf("id") === -1 &&
        field.props.name.indexOf("Id") === -1 &&
        datas[0][field.props.name] //有这个字段
      ) {
        key = field.props.name;
      }
      //特列
      if (field.props.name === "menuCode") {
        key = "resourcesCode";
      }

      if (datas[0][label] === undefined) {
        label = "title";
        if (datas[0]["title"] === undefined) {
          label = key;
        }
      }
    }
    return {
      ...props,
      optionList: datas.map((data) => {
        return { value: data[key], label: data[label] };
      }),
    };
  })
);
