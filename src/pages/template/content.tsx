import {
  Button,
  Card,
  Divider,
  Dropdown,
  SplitButtonGroup,
} from "@douyinfe/semi-ui";
import { IdBean } from "@src/api/base";
import FormPage from "@src/pages/common/formPage";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconArrowLeft,
  IconDoubleChevronLeft,
  IconDoubleChevronRight,
  IconSetting,
  IconTreeTriangleDown,
} from "@douyinfe/semi-icons";
import { DropDownMenuItem } from "@douyinfe/semi-ui/lib/es/dropdown";
import TablePage, { TablePageProps } from "@src/pages/common/tablePage";
import { useNiceModal } from "@src/store";
import { FormVo } from "@src/api/Form";
import OrderPage from "../common/orderPage";
const mode = import.meta.env.VITE_APP_MODE;

/**
 * 查询列表的布局page组件
 * 其实也应该通过页面设计来组装，不用手写该组件
 */

export interface ContentProps<T extends IdBean> extends TablePageProps<T> {
  //按钮名称
  title?: string;
  filterType?: string; //过滤条件模型名称
  showOrder?: boolean; //是否显示order
  // filterData?: any; //初始的过滤条件
}

/**
 * crud 左右布局模版
 * @param param0
 * @returns
 */
const Content = <T extends IdBean>({
  title,
  entityType,
  editType = entityType,
  listType = editType,
  filterType,
  lineBtn,
  tableBtn,
  formVo,
  req,
  showOrder = true,
  // filterData,
  ...props
}: Partial<ContentProps<T>> & { entityType: String }) => {
  const [formData, setFormData] = useState<any>({});
  const confirmModal = useNiceModal("vlifeModal");
  const [model, setModel] = useState<FormVo | undefined>(formVo);
  const navigate = useNavigate();
  const tableReq = useMemo(() => {
    return { ...req, ...formData };
  }, [req, formData]);
  const [filterOpen, setFilterOpen] = useState(true);
  const menu = useMemo((): DropDownMenuItem[] => {
    let arrays: DropDownMenuItem[] = [
      {
        node: "item",
        name: "查询配置",
        onClick: () => {
          navigate(`/sysConf/model/design/${filterType}/filter`);
        },
      },
      {
        node: "item",
        name: "列表配置",
        onClick: () => {
          navigate(`/sysConf/model/design/${listType}/list`);
        },
      },
      {
        node: "item",
        name: "表单配置",
        onClick: () => {
          navigate(`/sysConf/model/design/${editType}/form`);
        },
      },
      { node: "divider" },
      {
        node: "item",
        name: "权限资源",
        onClick: () => {
          navigate(`/sysConf/resources`);
        },
      },
      {
        node: "item",
        name: "模型管理",
        onClick: () => {
          navigate(`/sysConf/model/${entityType}`);
        },
      },
      {
        node: "item",
        name: "前端代码",
        onClick: () => {
          navigate(`/sysConf/model/code/${entityType}`);
        },
      },
    ];

    let existModel = [filterType, listType, editType];

    if (lineBtn) {
      lineBtn.forEach((l) => {
        if (l.model && l.model.type && !existModel.includes(l.model.type)) {
          arrays.push({
            node: "item",
            name: l.title + "配置",
            onClick: () => {
              navigate(`/sysConf/formDesign/${l.model?.type}`);
            },
          });
          existModel.push(l.model.type);
        }
      });
    }
    if (tableBtn) {
      tableBtn.forEach((l) => {
        if (l.model && l.model.type && !existModel.includes(l.model.type)) {
          arrays.push({
            node: "item",
            name: l.title + "模型",
            onClick: () => {
              navigate(`/conf/design/${l.model?.type}`);
            },
          });
          existModel.push(l.model.type);
        }
      });
    }

    return arrays;
  }, [lineBtn, tableBtn]);

  return (
    <div className="h-full flex">
      {filterType && filterOpen && (
        <div className="h-full flex-none  w-72">
          <Card
            title={`${title ? title : model ? model.name : ""}管理`}
            bordered={true}
            className="h-full"
            headerLine={false}
            headerStyle={{ fontSize: "small" }}
            headerExtraContent={
              <></>
              // <Tooltip content="模型设置">
              //   <IconSetting
              //     onClick={() => {
              //       navigate(`/conf/design/${filerModelName}/filter`);
              //     }}
              //     className=" cursor-pointer  hidden group-hover:block "
              //   />
              // </Tooltip>
            }
          >
            <FormPage
              key={`filter${filterType}`}
              formData={req}
              onDataChange={(data) => setFormData({ ...data })}
              type={filterType}
            />
            {/* 排序 */}
            {model?.fields && showOrder && (
              <>
                <Divider className=" m-2">请选择排序条件</Divider>
                <OrderPage
                  filterType={filterType}
                  fields={model.fields}
                  onDataChange={(str) => {
                    setFormData({ ...formData, order: { orders: str } });
                  }}
                />
              </>
            )}
          </Card>
        </div>
      )}
      <div className="h-full flex-1 cursor-pointer relative ">
        {filterOpen && (
          <IconDoubleChevronLeft
            size="large"
            className=" absolute -left-3 top-1/2"
            onClick={() => {
              setFilterOpen(false);
            }}
          />
        )}
        {!filterOpen && (
          <IconDoubleChevronRight
            size="large"
            className="cursor-pointer absolute left-0 top-1/2"
            onClick={() => {
              setFilterOpen(true);
            }}
          />
        )}

        <Card
          title={`${title ? title : model ? model.name : ""}列表`}
          headerLine={false}
          bordered={false}
          className="h-full group"
        >
          {props.children}
          {
            <TablePage<T>
              key={entityType + listType}
              listType={listType}
              editType={editType}
              entityType={entityType}
              lineBtn={lineBtn}
              tableBtn={tableBtn}
              req={tableReq}
              formVo={model}
              //列表数据回传
              //模型信息回传
              onFormModel={(formVo: FormVo) => {
                // alert(formVo.title);
                setModel(formVo);
              }}
              //错误信息回传
              onHttpError={(e) => {
                if (e.code === 4404) {
                  confirmModal.show({
                    title: `接口错误`,
                    children: (
                      <>{`${e.code}无法访问，请配置或者在模块页面手工传入loadData的prop`}</>
                    ),
                    okFun: () => {
                      navigate(`/conf/design/${listType}/list`);
                    },
                  });
                }
              }}
              {...props}
            >
              {/* 重构 */}
              {/* {filterType && (
                <FormPage
                  key={`filter${filterType}`}
                  onDataChange={(data) => setFormData({ ...data })}
                  type={filterType}
                />
              )} */}
            </TablePage>
          }
        </Card>
      </div>
    </div>
  );
  // <CheckModel modelName={[entityType, listType, editType]} buttons={lineBtn}>
  //   {content}
  // </CheckModel>
};

Content.header = function ToolbarHeader(props: any) {
  return <div className={`toolbar-header ${props.type}`}>{props.title}</div>;
};
export default Content;
