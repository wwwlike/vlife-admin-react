import {
  Button,
  Popover,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "@douyinfe/semi-ui";
import {
  ColumnProps,
  RowSelection,
  TableProps,
} from "@douyinfe/semi-ui/lib/es/table";
import { useAuth } from "@src/context/auth-context";
import { TranDict } from "@src/mvc/base";
import { FormVo } from "@src/mvc/model/Form";
import { FormFieldVo } from "@src/mvc/model/FormField";
import { SysFile } from "@src/mvc/SysFile";
import { formatDate } from "@src/utils/utils";
import React, { useEffect, useMemo, useState } from "react";
import SelectIcon from "../vlifeComponent/SelectIcon";
import VfImage from "../vlifeComponent/VfImage";

/**
 * > 目前使用semi的组件进行vlife的table的二次封装、
 * - 在table的强大功能之上，封装我们需要的最常见功能给到调用方，达到易用的目的。
 * 1. 列头显隐藏支持()
 * 2. 列数据转换(字典/boolean)
 * 3. 表及列按钮渲染（显隐/可用状态/不可用提示）
 * 4. 单选/多选展示，与特定按钮状态进行绑定
 */

/**
 * 按钮计算属性
 */
export type BtnMemoProp = {
  title?: string; //如存在则覆盖父级title
  disable?: boolean; //禁用状态
  prompt?: string; //提示语言
};
/**
 * 按钮状态
 */
export interface VfButton {
  title: string; //按钮名称
  entityName?: string; //按钮所属模块
  icon?: string; //按钮图标
  key?: string; //按钮Key，权限判定时使用
  tableBtn?: boolean; //是否是表的bmtn
  index?: number; //排序索引
  loading?: boolean; //是否是加载状态
  attr?: (...objs: any) => BtnMemoProp; //按钮动态属性，禁用、不能用提醒内容，覆盖上一级的title(loading时候可以用，`进行中`)
  //-------------------
  model?: string; //按钮触发调用的视图弹出层名称或者对象,说明需要弹框
  readView?: boolean; //预览模式
  okFun?: (...record: any) => void; //最后确认回调方法
  click?: (btn: VfButton, line: number, ...record: any) => void; //按钮点击事件
}

export interface ListProps extends TableProps {
  //模型信息
  model: FormVo;
  //行点击
  lineClick?: (obj: any) => void;
  //按钮信息
  tableBtn?: VfButton[];
  // 手工传入要显示的列,配置设置的无效
  column?: string[];
  //字典字段
  sysDict?: TranDict[];
  //外键数据
  fkMap?: any; //外键数据的键值对
  parentMap?: any; //上级单位的键值对
  // 能否选择多选
  select_more?: boolean; // undefined|false|true ->无勾选框|单选|多选
  // 选中后下方现实的列
  select_show_field?: string; //选中时进行展示的字段，不传则不展示
  //选中后的回调事件
  onSelected?: (selecteds: selectType[]) => void;
  // 已经选中的数据
  selected?: any[]; //进入之前选中的数据信息
}

type selectType = { id: string; name: string };
export default ({
  lineClick,
  model,
  tableBtn,
  sysDict,
  dataSource,
  fkMap,
  column,
  parentMap,
  select_more = true,
  select_show_field,
  onSelected,
  selected,
  children,
  ...props
}: ListProps) => {
  const { dicts } = useAuth();
  const [selectedRow, setSelectedRow] = useState<selectType[]>(
    selected ? [...selected] : []
  );
  const selectIds = useMemo<(string | number)[]>(() => {
    return selectedRow.map((row) => {
      return row.id;
    });
  }, [selectedRow]);

  useEffect(() => {
    if (onSelected) {
      onSelected(selectedRow);
    }
  }, [selectedRow]);

  //行按钮
  const lineMemoBtns = useMemo<VfButton[]>(() => {
    return (
      tableBtn?.filter((btn) => {
        return !btn.tableBtn;
      }) || []
    );
  }, [tableBtn]);

  /**
   * 表按钮
   */
  const tableMemoBtns = useMemo(() => {
    return (
      tableBtn?.filter((btn) => {
        return btn.tableBtn;
      }) || []
    );
  }, [tableBtn]);

  //列信息
  const memoColumns = useMemo((): ColumnProps<any>[] => {
    // step1 过滤要展示的列
    const columnshow: Partial<ColumnProps & FormFieldVo>[] = [];
    if (model && model.fields) {
      let temp: ColumnProps & FormFieldVo[] = [];
      //column->手工指定展示的列
      if (column) {
        model.fields
          .filter((f) => column.includes(f.fieldName))
          .forEach((d) => {
            temp.push({ ...d, dataIndex: d.fieldName });
          });
        columnshow.push(
          ...temp.sort(function (a: ColumnProps, b: ColumnProps) {
            if (a.dataIndex && b.dataIndex)
              return column.indexOf(a.dataIndex) - column.indexOf(b.dataIndex);
            else {
              return 0;
            }
          })
        );
      } else {
        model.fields // 根据配置展示需要的列 是editor组件类型的列不展示
          .filter(
            (f) =>
              f.x_hidden !== true &&
              f.listShow !== false &&
              f.x_component !== "VfEditor"
          )
          .forEach((f) => {
            columnshow.push({ ...f, dataIndex: f.fieldName });
          });
      }

      // step2 字典转换
      // columnshow?.forEach((m: Partial<ColumnProps & FormFieldVo>) => {
      //   sysDict?.forEach((d) => {
      //     if (m.dictCode?.toLowerCase() === d.column.toLowerCase()) {
      //       m["render"] = (text, record, index) => {
      //         return (
      //           d.sysDict.find((dd) => {
      //             return dd.val + "" === text + "";
      //           })?.title || "-"
      //         );
      //       };
      //     }
      //   });
      // });

      //Boolean,外键，Pcode翻译处理
      columnshow?.forEach((m: Partial<ColumnProps & FormFieldVo>) => {
        if (
          m.pageComponentPropDtos &&
          m.pageComponentPropDtos.filter((f) => f.sourceType === "dict")
            .length > 0
        ) {
          const dictCode = m.pageComponentPropDtos.filter(
            (f) => f.sourceType === "dict"
          )[0].propVal;

          m["render"] = (text, record, index) => {
            return dicts[dictCode || "vlife"].data?.filter(
              (d) => d.value + "" === text + ""
            )[0].label;
          };
        } else if (m.type === "boolean") {
          m["render"] = (text, record, index) => {
            return text === null ? "-" : text ? "是" : "否";
          };
        } else if (m.entityFieldName === "id") {
          m["render"] = (text, record, index) => {
            return fkMap[text];
          };
        } else if (m.fieldName === "pcode") {
          m["render"] = (text, record, index) => {
            return parentMap[text];
          };
        } else if (m.type === "date") {
          m["render"] = (text, record, index) => {
            return formatDate(text, "yyyy-MM-dd");
          };
        }
      });

      //图标组件转换
      //图像组件转换
      columnshow?.forEach((m: Partial<ColumnProps & FormFieldVo>) => {
        if (m.x_component === "VfImage") {
          m["render"] = (text, record, index) => {
            return (
              <VfImage
                size="small"
                value={text}
                read={true}
                onDataChange={() => {}}
                fieldName={""}
              />
            );
          };
        } else if (m.x_component === "SelectIcon") {
          m["render"] = (text, record, index) => {
            return <SelectIcon value={text} read={true} />;
          };
        }
      });

      //行按钮添加
      if (lineMemoBtns.length > 0) {
        columnshow?.push({
          title: "操作",
          fieldName: "operate",
          render: (text, record, index) => {
            return (
              <Space>
                {lineMemoBtns.map((item) => {
                  let prop: BtnMemoProp = {};
                  if (item?.attr) {
                    prop = item?.attr(record);
                  }
                  //icon={<Icon name={item.key||''} />}
                  const button = (
                    <Button
                      key={"_" + item.model + item.key + "_" + record.id}
                      disabled={prop.disable}
                      theme="borderless"
                      type="primary"
                      onClick={() => {
                        item.click && item.click(item, index, record);
                      }}
                    >
                      {item.title}
                    </Button>
                  );
                  if (prop.prompt) {
                    return (
                      <Tooltip
                        key={"prop_" + item.model + item.key + "_" + record.id}
                        content={prop.prompt}
                      >
                        {/* {JSON.stringify(record)} */}
                        {button}
                      </Tooltip>
                    );
                  } else {
                    return button;
                  }
                })}
              </Space>
            );
          },
        });
      }
      return columnshow;
    }
    return [];
  }, [model, lineMemoBtns, sysDict, column]);

  const onRow = useMemo(
    () => (record: any, index: any) => {
      return {
        onClick: (e: any) => {
          if (lineClick) {
            lineClick(record);
          }
        },
      };
    },
    []
  );
  const rowSelection = useMemo((): RowSelection<any> => {
    return {
      disabled: !select_more, //全局选中按钮
      selectedRowKeys: selectIds,
      onSelect: (record: any, selected: any) => {
        if (select_more == false) {
          if (selected == true) {
            if (select_show_field) {
              setSelectedRow([
                { id: record.id, name: record[select_show_field] },
              ]);
            } else {
              setSelectedRow([record]);
            }
          } else {
            setSelectedRow([]);
          }
        }
        //console.log(`select row: ${selected}`, record);
      },
      // onSelectAll: (selected:any, selectedRows:any[]) => {
      //     console.log(`select all rows: ${selected}`, selectedRows);
      // },
      onChange: (
        selectedRowKeys: (string | number)[] | undefined,
        selectedRows: any[] | undefined
      ) => {
        if (select_more) {
          if (selectedRows) {
            setSelectedRow([
              ...selectedRows.map((row) => {
                if (select_show_field) {
                  return { id: row.id, name: row[select_show_field] };
                } else {
                  return row;
                }
              }),
            ]);
          }
        }
      },
    };
  }, [selectedRow]);

  return (
    <>
      {tableMemoBtns.map((item) => {
        let prop: BtnMemoProp = {};
        if (item?.attr) {
          prop = item?.attr(...selectedRow);
        }
        const button = (
          <Button
            icon={<SelectIcon size="default" value={item.icon} read />}
            loading={item.loading}
            key={item.entityName + "_" + item.model + "_" + item.key}
            onClick={() => {
              if (item.click) {
                //-1 表示全局表的按钮
                item.click(item, -1, ...selectedRow);
              }
              setSelectedRow([]);
            }}
            disabled={prop?.disable}
          >
            {/* {JSON.stringify(item)} */}
            {!prop.disable && prop.title ? prop.title : item.title}
          </Button>
        );

        if (prop.prompt) {
          return (
            <Popover
              visible={prop.prompt ? false : true}
              key={"prop" + item.entityName + "_" + item.key}
              showArrow
              content={prop.prompt}
            >
              {button}
            </Popover>
          );
        } else {
          return button;
        }
      })}
      {children}
      <>
        {/* {JSON.stringify(parentMap)} */}
        <Table
          rowKey={"id"}
          dataSource={dataSource}
          columns={memoColumns}
          onRow={onRow}
          rowSelection={select_more != undefined ? rowSelection : undefined}
          {...props}
        />
      </>
      {select_show_field &&
        selectedRow.map((one) => {
          return (
            <Tag
              key={one.id}
              avatarShape="circle"
              size="large"
              closable={true}
              onClose={() => {
                setSelectedRow([
                  ...selectedRow.filter((row) => {
                    return row.id !== one.id;
                  }),
                ]);
              }}
            >
              {one.name}
            </Tag>
          );
        })}
    </>
  );
};
