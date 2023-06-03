import React, { FC, useEffect, useMemo, useState } from "react";
import { Layout, Nav } from "@douyinfe/semi-ui";
import { MenuItem } from "@src/menu/config";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@src/context/auth-context";
import SelectIcon from "@src/components/SelectIcon";
import { SysMenu } from "@src/api/SysMenu";

const { Sider } = Layout;
export function renderIcon(icon: any) {
  if (!icon) {
    return null;
  }
  if (typeof icon === "string") {
    return <SelectIcon read value={icon} />;
  }
  return icon.render();
}
function findMenuByPath(menus: MenuItem[], path: string, keys: any[]): any {
  for (const menu of menus) {
    if (menu.path === path) {
      return [...keys, menu.itemKey];
    }
    if (menu.items && menu.items.length > 0) {
      const result = findMenuByPath(menu.items, path, [...keys, menu.itemKey]);
      if (result.length === 0) {
        continue;
      }
      return result;
    }
  }
  return [];
}

const Index: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]); //打开节点
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]); //选中节点
  const { user, app } = useAuth();
  /**
   * 当前应用当前用户拥有权限下的所有菜单
   */
  const currAppMenuList = useMemo(() => {
    if (user && user.menus && user.menus.length > 0 && app) {
      const nav = (root: SysMenu): MenuItem[] => {
        return user?.menus
          .sort((a, b) => a.sort - b.sort)
          .filter((m) => m.pcode === root.code)
          .map((menu) => {
            return {
              id: menu.id,
              itemKey: menu.id,
              text: menu.name,
              code: menu.code,
              icon: menu.icon ? renderIcon(menu.icon) : null,
              path:
                menu.url && menu.url.endsWith("*")
                  ? menu.url.replace("*", menu.placeholderUrl)
                  : menu.url,
              items: nav(menu),
            };
          });
      };
      return nav(user?.menus.filter((m) => app && m.id === app.id)[0]);
    } else {
      return [];
    }
  }, [user?.menus, app]);

  const onSelect = (data: any) => {
    window.localStorage.setItem("currMenuId", data.itemKey);
    setSelectedKeys([...data.selectedKeys]);
    navigate(data.selectedItems[0].path as string);
  };
  const onOpenChange = (data: any) => {
    setOpenKeys([...data.openKeys]);
  };

  /**
   * url直接打开找到应该展开的菜单
   */
  useEffect(() => {
    if (
      pathname &&
      currAppMenuList &&
      currAppMenuList.length > 0 &&
      selectedKeys.length === 0
    ) {
      const keys: string[] = findMenuByPath(currAppMenuList, pathname, []);
      setSelectedKeys([keys.pop() as string]);
      setOpenKeys(Array.from(new Set([...openKeys, ...keys])));
    }
  }, [pathname, currAppMenuList]);

  return (
    <Sider
      className="shadow-lg "
      style={{ backgroundColor: "var(--semi-color-bg-1)" }}
    >
      <Nav
        items={currAppMenuList}
        openKeys={openKeys} //打开父节点
        selectedKeys={selectedKeys} //选中的子节点
        onSelect={onSelect}
        onOpenChange={onOpenChange}
        style={{ maxWidth: 220, height: "100%" }}
      >
        <Nav.Footer collapseButton={true} />
      </Nav>
    </Sider>
  );
};

export default Index;
