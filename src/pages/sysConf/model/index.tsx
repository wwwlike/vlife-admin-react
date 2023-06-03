import { Button, TabPane, Tabs, Tooltip } from "@douyinfe/semi-ui";
import { FormVo, list } from "@src/api/Form";
import { useAuth } from "@src/context/auth-context";
import { renderIcon } from "@src/pages/layout/components/sider";
import react, { useCallback, useEffect, useMemo, useState } from "react";
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

  const color: any = {
    sys: "bg-yellow-50",
    conf: "bg-gray-50",
    page: "bg-blue-50",
    report: "bg-green-50",
    erp: "bg-red-50",
  };

  const apps = user?.menus.filter((f) => f.app && f.entityPrefix) || [];

  //当前模块各个分类的颜色块
  const [currAppColor, setCurrAppColor] = useState<string[]>([]);
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
      <div
        key={e.entityType}
        className={`group relative block w-full h-24 border-2 
        ${
          color[e.module] !== undefined ? color[e.module] : "bg-white"
        } border-gray-300 border-dashed rounded-lg p-2 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      >
        <Tooltip content="前端代码">
          <Button
            size="small"
            className=" rounder-br-lg absolute bottom-0 right-0"
            onClick={() => {
              navigate("/sysConf/model/code/" + e.type);
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
              navigate("/sysConf/model/" + e.type);
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
    (app: SysMenu): FormVo[] => {
      const entityPrefixs: string[] = app.entityPrefix.split(",");
      return dbEntitys
        .filter((d) => {
          const module = d.module;
          return (
            entityPrefixs.filter(
              (e) => d.module.toLocaleLowerCase() === e.toLocaleLowerCase()
            ).length > 0
          );
        })
        .sort((a, b) => {
          return a.entityType.localeCompare(b.entityType);
        });
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
        {apps.map((m, index) => (
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
              {liEntity(m).map((e) => {
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
