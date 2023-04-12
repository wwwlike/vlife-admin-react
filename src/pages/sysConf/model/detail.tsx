import { Button } from "@douyinfe/semi-ui";
import { useAuth } from "@src/context/auth-context";
import { ModelInfo } from "@src/api/base";
import { Form, save, javaModels, list } from "@src/api/Form";
import { useNiceModal } from "@src/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IconClose } from "@douyinfe/semi-icons";

const Entity = () => {
  const local = useLocation();
  const navigate = useNavigate();

  const entityType = useMemo<string>(() => {
    const length = local.pathname.split("/").length;
    return local.pathname.split("/")[length - 1];
  }, []);

  const { dicts } = useAuth();
  //加载弹出表单modal
  const formModal = useNiceModal("formModal");
  //java模型信息
  const [models, setModels] = useState<ModelInfo[]>([]);
  //数据库保存的模型信息
  const [dbEntitys, setDbEntitys] = useState<Form[]>();

  const ItemTypeInfo: { [key: string]: string } = {
    entity: "实体模型(entity:通常用作表单、列表、视图的模型)",
    save: "传输模型(dto:通常用作表单的模型，也可以当作列表和视图的模型)",
    vo: "视图模型(vo:通常用作视图和列表模型)",
    req: "查询模型(req:数据过来的查询模型)",
  };

  /**
   * @param read  展现形式
   * @param model 模型信息
   * @param record 初始数据
   * @param save 确认按钮触发的方法m
   */
  const modelEdit = useCallback(
    (modelInfoData: Form | ModelInfo) => {
      formModal
        .show({
          //这里因为是any,所以show无提示，不优雅,
          entityType: "form",
          type: "form",
          title: "启用模型",
          saveFun: save,
          formData: { ...modelInfoData },
          itemType: "entity",
        })
        .then((saveData: any) => {
          if (dbEntitys && saveData) {
            setDbEntitys([...dbEntitys, saveData.data]);
          } else {
            setDbEntitys([saveData.data]);
          }
        });
    },
    [entityType]
  );

  useEffect(() => {
    if (entityType) {
      javaModels({ entityType }).then((d) => {
        if (d.data) {
          setModels(d.data);
        }
        list({ entityType }).then((d) => {
          if (d.data) {
            setDbEntitys(d.data);
          } else {
            setDbEntitys([]);
          }
        });
      });
    }
  }, [entityType]);

  return (
    <div className="items-stretch overflow-hidden bg-white rounded-md ">
      {/*justify-end 要配合 flex  */}
      <div className=" absolute right-2 top-2">
        <Button
          type="primary"
          icon={<IconClose />}
          onClick={() => {
            navigate(-1);
          }}
          aria-label="关闭"
        />
      </div>
      {/* Entity 实体模型 */}
      {Object.keys(ItemTypeInfo).map((key) => {
        return models?.filter((d) => d.itemType === key).length > 0 ? (
          <div key={`entity_item_type${key}`} className="mt-6  mx-auto px-2 ">
            <div className="mt-3 sm:mt-2">
              <div className="hidden sm:block">
                <div className="flex items-center border-b border-gray-200">
                  <a
                    href="#"
                    aria-current="page"
                    className={`border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    {ItemTypeInfo[key]}
                  </a>
                </div>
                <div>
                  <ul role="list" className="grid  p-2 gap-4 grid-cols-10">
                    {/* 1.先显示DB里的(已启用) */}
                    {dbEntitys
                      ?.filter((db) => db.itemType === key)
                      .map((model, index) => (
                        <li
                          className="relative"
                          key={"li_" + model.type}
                          onClick={() => {
                            navigate(`/sysConf/modelDesign/${model.type}`);
                          }}
                        >
                          <div className="relative block w-full h-24 border-2 border-gray-300 border-dashed rounded-lg p-2 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              {model.title}
                            </span>
                            <p>{model.type}</p>
                          </div>
                        </li>
                      ))}
                    {/* 2  Java解析的(待启用) */}
                    {models
                      ?.filter(
                        (d) =>
                          d.itemType === key &&
                          !dbEntitys?.map((db) => db.type).includes(d.type)
                      )
                      .map((model, index) => (
                        <li
                          className="relative bg-gray-200 group cursor-pointer hover:bg-slate-50"
                          key={index + model.type}
                          onClick={() => {
                            modelEdit(model);
                          }}
                        >
                          <div className="hidden group-hover:block text-xs text-purple-700 text-opacity-50 absolute p-1 border-dashed rounder-lg  bottom-0 right-0">
                            双击启用
                          </div>
                          <div className="relative block w-full h-24 border-2 border-gray-300 border-dashed rounded-lg p-2 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              {model.title}
                            </span>
                            <p>{model.type}</p>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        );
      })}
      {/* 其他模型 */}
      {/* <div className="mt-6  mx-auto px-2 ">
        <div className="mt-3 sm:mt-2">
          <div className="hidden sm:block">
            <div className="flex items-center border-b border-gray-200">
              <a
                href="#"
                aria-current="page"
                className={`border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Req 查询模型
              </a>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Entity;
