//显示的依赖定义
export type deps = {
  field: string; //依赖的属性
  value: string[]; //依赖的值 满足其中之一即可
};
export interface designProp {
  name: string;
  type: "select" | "input" | "switch"; // 设置组件得类型
  tag: "basic" | "rule" | "layout"; //所在分组标签
  uiType?: "req" | "save"; //使用场景
  deps?: deps | deps[]; //字段显示依赖,如果是数组都需要满足
  group?: { label: string; value: string }[]; //二级分类 如果有该二级分类，则先经过二级分类在选择items
  items?: {
    label: string;
    value: string | number; //嵌套一个，尤它进行值得选择
    uiType?: "req" | "save";
    groupKey?: string; //所在分组
    deps?: deps | deps[]; // 满足得一项，或者多项都满足
  }[]; //子项显示依赖
}

export interface SchemaClz {
  [key: string]: designProp;
}

export const types: { title: string; value: string }[] = [
  { title: "基础属性", value: "basic" },
  { title: "校验规则", value: "rule" },
  { title: "外观布局", value: "layout" },
];

const schemaDef: SchemaClz = {
  title: {
    name: "标题",
    type: "input",
    tag: "basic",
  },
  initialValues: {
    name: "默认值",
    type: "input",
    tag: "basic",
  },
  dictCode: {
    name: "字典项目",
    type: "select",
    tag: "basic",
    deps: { field: "x_component", value: ["Select", "DictSelectTag"] },
    items: [],
  },
  x_hidden: {
    name: "隐藏",
    type: "switch",
    tag: "layout",
  },
  required: {
    name: "必填",
    type: "switch",
    tag: "rule",
    uiType: "save",
  },
  readOnly: {
    name: "只读",
    type: "switch",
    tag: "layout",
  },
  listShow: {
    name: "列表",
    type: "switch",
    tag: "layout",
    uiType: "save",
  },
  x_validator: {
    name: "校验方式",
    type: "select",
    tag: "rule",
    deps: { field: "x_component", value: ["Input", "Input.TextArea"] },
    items: [
      { label: "email", value: "email" },
      { label: "phone", value: "phone" },
      { label: "number", value: "number" },
      { label: "idcard", value: "idcard" },
      { label: "正则", value: "pattern" },
    ],
  },
  vlife_pattern: {
    name: "正则校验",
    type: "input",
    tag: "rule",
    deps: { field: "x_validator", value: ["pattern"] },
  },
  vlife_message: {
    name: "校验提醒",
    type: "input",
    tag: "rule",
    deps: { field: "x_validator", value: ["pattern"] },
  },
  x_component_props$placeholder: {
    name: "填写说明",
    type: "input",
    tag: "basic",
    deps: { field: "x_component", value: ["Input"] },
  },
  x_decorator_props$layout: {
    name: "标签显示位置",
    type: "select",
    tag: "layout",
    items: [
      {
        label: "顶部",
        value: "vertical",
      },
      {
        label: "水平",
        value: "horizontal",
      },
    ],
  },
  x_decorator_props$labelAlign: {
    name: "标签对齐方式",
    type: "select",
    tag: "layout",
    deps: { field: "x_decorator_props$layout", value: ["vertical"] },
    items: [
      {
        label: "居左",
        value: "left",
      },
      {
        label: "居右",
        value: "right",
      },
    ],
  },
  formGroupCode: {
    name: "所在页签",
    type: "select",
    tag: "layout",
    // deps://有数量才显示
    // deps: { field: "x_decorator_props$layout", value: ["vertical"] },
    items: [],
  },
  x_decorator_props$gridSpan: {
    name: "组件宽度",
    type: "select",
    tag: "layout",
    items: [
      {
        label: "1列",
        value: 1,
      },
      {
        label: "2列",
        value: 2,
      },
      {
        label: "3列",
        value: 3,
      },
      {
        label: "4列",
        value: 4,
      },
      {
        label: "5列",
        value: 5,
      },
      {
        label: "6列",
        value: 6,
      },
    ],
  },
};

export default schemaDef;
