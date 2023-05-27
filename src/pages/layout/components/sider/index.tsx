import React, { FC, useEffect, useMemo, useState } from "react";
import { Layout, Nav } from "@douyinfe/semi-ui";
import { MenuItem } from "@src/menu/config";
import { useLocation, useNavigate } from "react-router-dom";
// import "../../index.scss";
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
  // 所有菜单（实体结构）
  const [menus, setMenus] = useState<SysMenu[]>([]);
  // 当前应用的（组件结构对象）
  const [allMenuList, setAllMenuList] = useState<MenuItem[]>([]);

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  // const locale = useStore((state) => state.locale)
  const { user, appId } = useAuth();

  // useEffect(() => {
  //   const getSub = (menus: SysMenu[], parent?: SysMenu): MenuItem[] => {
  //     // alert(menus.filter((m) => m.pcode === null).length);
  //     return menus
  //       .filter((m) =>
  //         parent ? m.pcode === parent.code : m.pcode === null && m.app !== true
  //       )
  //       .map((m) => {
  //         return {
  //           itemKey: m.id || "",
  //           text: m.name,
  //           code: m.code,
  //           icon: m.icon,
  //           path:
  //             m.url && m.url.endsWith("*")
  //               ? m.url.replace("*", m.placeholderUrl)
  //               : m.url,
  //           items: getSub(menus, m),
  //         };
  //       });
  //   };
  //   setMenus(user?.menus || []);
  //   const menuItems: MenuItem[] = getSub(
  //     user?.menus || [],
  //     appId ? user?.menus.filter((m) => m.id === appId)[0] : undefined
  //   );
  //   setAllMenuList(menuItems);
  // }, [appId]);

  /**
   * 有权限的菜单
   */
  const navList1 = useMemo(() => {
    let mList: MenuItem[] = [];
    if (user && user.menus && user.menus.length > 0 && appId) {
      const nav = (root: SysMenu): any[] => {
        return user?.menus
          .sort((a, b) => a.sort - b.sort)
          .filter((m) => m.pcode === root.code)
          .map((menu) => {
            return {
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
      return nav(user?.menus.filter((m) => m.id === appId)[0]);
    } else {
      return [];
    }
  }, [user?.menus, appId]);

  const onSelect = (data: any) => {
    window.localStorage.setItem("currMenuId", data.itemKey);
    setSelectedKeys([...data.selectedKeys]);
    navigate(data.selectedItems[0].path as string);
  };
  const onOpenChange = (data: any) => {
    setOpenKeys([...data.openKeys]);
  };

  // const findAppId = useEffect(() => {

  // }, [selectedkeys,pathname, menus]);
  // setSelectedKeys 和 path 双向绑定
  useEffect(() => {
    if (pathname && allMenuList && allMenuList.length > 0) {
      const keys: string[] = findMenuByPath(allMenuList, pathname, []);
      setSelectedKeys([keys.pop() as string]);
      setOpenKeys(Array.from(new Set([...openKeys, ...keys])));
    }
  }, [pathname, allMenuList]);

  return (
    <Sider
      className="shadow-lg "
      style={{ backgroundColor: "var(--semi-color-bg-1)" }}
    >
      <Nav
        items={navList1}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onSelect={onSelect}
        onOpenChange={onOpenChange}
        style={{ maxWidth: 220, height: "100%" }}
        // header={{
        // 	logo: <IconApps style={{ fontSize: 36 }} />,
        // 	text: 'VLife Admin',
        // }}
        // footer={{
        //   collapseButton: true,
        //   // collapseText: () => <div>{"展开"}</div>,
        // }}
      >
        <Nav.Footer collapseButton={true} />
      </Nav>
    </Sider>
  );
};

export default Index;
