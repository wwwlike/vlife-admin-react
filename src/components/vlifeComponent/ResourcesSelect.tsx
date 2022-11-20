import React, { useCallback, useMemo } from "react";
import { CheckboxGroup, Divider } from "@douyinfe/semi-ui";
import { SysResources } from "@src/mvc/SysResources";
import { VfBaseProps } from "..";
/**
 * 资源选择组件，能适配所有业务的放在组件里，这个只能算是特定功能模块
 */
export interface ResourcesSelectProps
  extends VfBaseProps<string[], SysResources[]> {}

const ResourcesSelect = ({
  value,
  datas,
  onDataChange,
  read,
}: ResourcesSelectProps) => {
  /**
   * 菜单信息
   */
  const menus = useMemo((): SysResources[] => {
    if (datas) {
      return datas.filter((f) => f.type === "1") || []; //1是菜单
    } else {
      return [];
    }
  }, [datas]);

  /**
   * 菜单下的资源信息获取方法
   */
  const getResources = useCallback(
    (menuCode: string): { label: string; value: string }[] => {
      const resources: SysResources[] = datas.filter(
        (f) => f.menuCode === menuCode
      );
      return resources.map((r) => {
        return { label: r.name, value: r.id };
      });
    },
    [datas]
  );

  return (
    <>
      {menus.length === 0
        ? "没有请求到任何可分配的选项"
        : menus.map((menu) => {
            return (
              <div key={"div_" + menu.id}>
                <h3 style={{ marginTop: "20px" }}>
                  <b>{menu.name}</b>
                </h3>
                <Divider margin="8px" />
                <CheckboxGroup
                  value={value}
                  onChange={onDataChange}
                  options={getResources(menu.resourcesCode)}
                  direction="horizontal"
                />
              </div>
            );
          })}
    </>
  );
};

export default ResourcesSelect;
