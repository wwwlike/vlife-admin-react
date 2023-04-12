import { Space, Table, Tag } from "@douyinfe/semi-ui";
import {
  ColumnProps,
  RowSelection,
  TableProps,
} from "@douyinfe/semi-ui/lib/es/table";
import { useAuth } from "@src/context/auth-context";
// import { checkLineNumber, VfButton } from "@src/datas/ButtonDatas";
import { IdBean } from "@src/api/base";
import { FormVo } from "@src/api/Form";
import { FormFieldVo } from "@src/api/FormField";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { sourceType } from "@src/dsl/schema/base";
import { formatDate } from "@src/util/func";
import VfImage from "@src/components/VfImage";
import SelectIcon from "@src/components/SelectIcon";
import VlifeButton, { VFButtonPorps } from "@src/components/vlifeButton";
import { checkLineNumber, VfButton } from "@src/dsl/schema/button";

/**
 * > 目前使用semi的组件进行vlife的table的二次封装、
 * - 在table的强大功能之上，封装我们需要的最常见功能给到调用方，达到易用的目的。
 * 1. 列头显隐藏支持()
 * 2. 列数据转换(字典/boolean)
 * 3. 表及列按钮渲染（显隐/可用状态/不可用提示）
 * 4. 单选/多选展示，与特定按钮状态进行绑定
 */
/**
 * <T> 行数据类型
 */
export interface ListProps<T extends IdBean> extends TableProps {
  //模型信息
  model: FormVo;
  //行点击事件触发
  lineClick?: (obj: T) => void;
  //表格按钮信息
  //行按钮
  lineBtn?: VfButton<T>[];
  // 手工传入要显示的列,配置设置的无效
  column?: string[];
  //外键数据
  fkMap?: any; //外键数据的键值对
  parentMap?: any; //上级单位的键值对
  // 能否选择多选
  select_more?: boolean; // undefined|false|true ->无勾选框|单选|多选
  checkedBottomShow?: boolean; //选中的数据在下方展示
  // 选中后下方现实的列
  // select_show_field?: string; //选中时进行展示的字段，不传则不展示
  //选中后的回调事件
  onSelected?: (selecteds: T[]) => void;
  // 已经选中的数据
  // selected?: T[]; //进入之前选中的数据信息
}

const TableIndex = <T extends IdBean>({
  lineClick,
  model,
  lineBtn,
  dataSource,
  fkMap,
  column,
  parentMap,
  select_more = true,
  onSelected,
  // selected,
  checkedBottomShow,
  children,
  ...props
}: ListProps<T>) => {
  const { dicts } = useAuth();
  // 选中的行记录
  const [selectedRow, setSelectedRow] = useState<T[]>([]);

  const select_show_field = useMemo(() => {
    const field: FormFieldVo[] = model.fields;
    if (field.filter((f) => f.fieldName === "label").length > 0) return "label";
    if (field.filter((f) => f.fieldName === "title").length > 0) return "title";
    if (field.filter((f) => f.fieldName === "name").length > 0) return "name";
    return "id";
  }, [model]);

  // useEffect(() => {
  //   setSelectedRow(selected ? selected : []);
  // }, [selected]);

  useEffect(() => {
    if (onSelected) {
      onSelected(selectedRow);
    }
  }, [selectedRow]);

  //选中的id
  const selectIds = useMemo<string[]>(() => {
    const s: string[] = [];
    selectedRow.forEach((line) => {
      if (line.id) s.push(line.id);
    });
    return s;
  }, [selectedRow]);

  /**
   * 按钮状态检查
   */
  const btnCheck = useCallback(
    (item: VfButton<T>, ...record: T[]): Partial<VFButtonPorps> => {
      let checkResult: Partial<VFButtonPorps> = {};
      let msg: string | void = undefined;
      //1.长度校验
      if (item.enable_recordNum) {
        msg = checkLineNumber(item.enable_recordNum, ...record);
      }
      //2.对象match=>eq匹配校验,
      const matchObj: any = item.enable_match;
      if (matchObj) {
        Object.keys(matchObj).forEach((key: string) => {
          if (
            key in matchObj &&
            key in record[0] &&
            record.filter((r: any) => r[key] === matchObj[key]).length !==
              record.length
          ) {
            msg = `${
              model.fields.filter((f) => f.fieldName === key)[0].title
            }不满足`;
          }
        });
      }
      //check函数校验( 最灵活)
      if (msg === undefined && item.statusCheckFunc) {
        msg = item.statusCheckFunc(...record);
      }
      if (msg) {
        if (item.disable_hidden === true) {
          checkResult.hidden = true;
        } else {
          checkResult.disabled = true;
          checkResult.tooltip = msg;
        }
      }
      return checkResult;
    },
    []
  );

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

      //字典 ，Boolean,外键，Pcode翻译处理
      columnshow?.forEach((m: Partial<ColumnProps & FormFieldVo>) => {
        if (
          m.pageComponentPropDtos &&
          m.pageComponentPropDtos.filter(
            (f) => f.sourceType === sourceType.dict
          ).length > 0 &&
          dicts
        ) {
          const dictCode = m.pageComponentPropDtos.filter(
            (f) => f.sourceType === sourceType.dict
          )[0].propVal;

          m["render"] = (text, record, index) => {
            if (text === "" || text === null || text === undefined) {
              return "-";
            }
            return dicts[dictCode || "vlife"] &&
              dicts[dictCode || "vlife"].data ? (
              dicts[dictCode || "vlife"].data?.filter(
                (d) => d.value + "" === text + ""
              ).length > 0 ? (
                dicts[dictCode || "vlife"].data?.filter(
                  (d) => d.value + "" === text + ""
                )[0].color ? (
                  <Tag
                    color={
                      dicts[dictCode || "vlife"].data?.filter(
                        (d) => d.value + "" === text + ""
                      )[0].color
                    }
                  >
                    {
                      dicts[dictCode || "vlife"].data?.filter(
                        (d) => d.value + "" === text + ""
                      )[0].label
                    }
                  </Tag>
                ) : (
                  dicts[dictCode || "vlife"].data?.filter(
                    (d) => d.value + "" === text + ""
                  )[0].label
                )
              ) : (
                "-"
              )
            ) : (
              "-"
            );
          };
        } else if (m.type === "boolean") {
          m["render"] = (text, record, index) => {
            return text === null ? "-" : text ? "是" : "否";
          };
        } else if (m.entityFieldName === "id" && fkMap) {
          m["render"] = (text, record, index) => {
            return fkMap[text];
          };
        } else if (m.fieldName === "pcode" && parentMap) {
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
      if (lineBtn && lineBtn.length > 0) {
        columnshow?.push({
          title: "操作",
          fieldName: "operate",
          render: (text, record, index) => {
            return (
              <Space>
                {lineBtn.map((item: VfButton<T>, index: number) => {
                  let checkResult: Partial<VFButtonPorps> = btnCheck(
                    item,
                    record
                  );
                  // alert(JSON.stringify(checkResult));
                  const button = (
                    <VlifeButton
                      btnType="text"
                      key={
                        index +
                        "_" +
                        item.model?.entityType +
                        item.model?.type +
                        item.code +
                        "_" +
                        record.id
                      }
                      code={item.code}
                      theme="borderless"
                      type="primary"
                      tooltip={item.tooltip}
                      // hidden={true}
                      onClick={() => {
                        if (item.click) item.click(item, index, record);
                      }}
                      {...checkResult}
                    >
                      {item.title}
                    </VlifeButton>
                  );
                  return button;
                })}
              </Space>
            );
          },
        });
      }
      return columnshow;
    }
    return [];
  }, [model, lineBtn, column, fkMap, lineBtn, dataSource]);

  const onRow = useMemo(
    () => (record: any, index: any) => {
      // 给偶数行设置斑马纹
      if (index % 2 === 1) {
        return {
          style: {
            background: "var(--semi-color-fill-0)",
          },
          onClick: (e: any) => {
            if (lineClick) {
              lineClick(record);
            }
          },
        };
      } else {
        return {
          onClick: (e: any) => {
            if (lineClick) {
              lineClick(record);
            }
          },
        };
      }
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
            setSelectedRow([record]);

            // if (select_show_field) {
            //   setSelectedRow([
            //     { id: record.id, name: record[select_show_field] },
            //   ]);
            // } else {
            //   setSelectedRow([record]);
            // }
          } else {
            setSelectedRow([]);
          }
        }
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

  const handleRow = (record: any, index: any) => {
    // 给偶数行设置斑马纹
    if (index % 2 === 0) {
      return {
        style: {
          background: "var(--semi-color-fill-0)",
        },
      };
    } else {
      return {};
    }
  };

  return (
    <div>
      {/* <div className=" space-x-0.5"> {tableButtonMemo}</div> */}
      <Table
        showHeader={true}
        // style={{ lineHeight: "24px" }}
        bordered={true}
        rowKey={"id"}
        dataSource={dataSource}
        columns={memoColumns}
        // onRow={onRow}
        // title={<div className=" absolute top-0">{children}</div>}
        size="middle"
        rowSelection={select_more != undefined ? rowSelection : undefined}
        {...props}
      />
      {select_show_field && checkedBottomShow && (
        <div className=" space-x-2">
          {selectedRow.map((one: any) => {
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
                {one[select_show_field]}
              </Tag>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TableIndex;
