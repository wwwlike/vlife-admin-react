import { Button, TabPane, Tabs, Tooltip } from "@douyinfe/semi-ui";
import { FormVo, list } from "@src/api/Form";
import { useAuth } from "@src/context/auth-context";
import { renderIcon } from "@src/pages/layout/components/sider";
import { title } from "process";
import react, { useCallback, useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import { useNavigate } from "react-router-dom";
import { IconCode } from "@douyinfe/semi-icons";
import { SysMenu } from "@src/api/SysMenu";
import { findSubs } from "@src/util/func";
const Model = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  //全部实体模型
  const [dbEntitys, setDbEntitys] = useState<FormVo[]>([]);

  useEffect(() => {
    list({ itemType: "entity" }).then((d) => {
      if (d.data) {
        setDbEntitys(d.data);
      } else {
        setDbEntitys([]);
      }
    });
  }, []);

  const card = useCallback((e: FormVo) => {
    return (
      <div className=" group relative block w-full h-24 border-2 border-gray-300 border-dashed rounded-lg p-2 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <Tooltip content="前端代码">
          <Button
            size="small"
            className=" rounder-br-lg absolute bottom-0 right-0"
            onClick={() => {
              navigate("/sysConf/modelCode/" + e.type);
            }}
            icon={<IconCode />}
          />
        </Tooltip>
        <span className="mt-2 block text-sm font-medium text-gray-900">
          {e.title}
        </span>
        <p>{e.type}</p>

        <div className=" hidden absolute group-hover:block justify-center  bottom-1 space-x-2">
          <Button
            size="small"
            className=" text-sm"
            onClick={() => {
              navigate("/sysConf/modelDetail/entity/" + e.type);
            }}
          >
            模型管理
          </Button>
        </div>
      </div>
    );
  }, []);

  /**
   * 模块下的实体
   */
  const liEntity = useCallback(
    (appId: string): FormVo[] => {
      if (user?.menus && dbEntitys) {
        const menus: SysMenu[] = findSubs(
          user.menus,
          user.menus.filter((m) => m.id === appId)[0]
        ).filter((m) => m.entityType);

        return dbEntitys.filter((d) =>
          menus.map((m) => m.entityType).includes(d.type)
        );
      }
      return [];
    },
    [user?.menus, dbEntitys]
  );

  /**
   * 外键关联实体
   */
  const realationEntity = useCallback((appId: string) => {}, []);

  return (
    <Scrollbars autoHide={true}>
      <Tabs>
        {user?.menus
          .filter((m) => m.app)
          .map((m, index) => (
            <TabPane
              icon={renderIcon(m.icon)}
              itemKey={m.id}
              key={`app${m.id}`}
              tab={m.name}
            >
              <div
                role="list"
                className="grid  p-2 gap-4  sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10"
              >
                {liEntity(m.id).map((e) => {
                  return card(e);
                })}
              </div>
              {/* liEntity */}
            </TabPane>
          ))}
      </Tabs>
    </Scrollbars>
  );
};

export default Model;
