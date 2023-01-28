/**
 * 把用户信息放置到 context里去
 */
import { AuthForm, useCurrUser, useLogin } from "@src/provider/userProvider";
import { useAllDict } from "@src/provider/dictProvider";
import { ModelInfo, Result, TranDict } from "@src/mvc/base";
import { useAllResources } from "@src/mvc/SysResources";
import { useMount, useSize } from "ahooks";
import React, {
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SysDict } from "@src/mvc/SysDict";
import { UserDetailVo } from "@src/mvc/SysUser";
import { FormVo, model, javaModel } from "@src/mvc/model/Form";
import { SysResources } from "@src/mvc/SysResources";
import { useEffect } from "react";
import { number } from "echarts";

export const localStorageKey = "__auth_provider_token__";
//全局状态类型定义，初始化为undefiend ,注意这里返回的是Pomise函数
const AuthContext = React.createContext<
  | {
      //返回模型信息(旧待删除)
      getModelInfo: (modelName: string) => Promise<ModelInfo | undefined>;
      //模型信息
      getFormInfo: (
        modelName: string,
        uiType: "save" | "vo" | "list" | "req"
      ) => Promise<FormVo | undefined>;
      //当前用户
      user: UserDetailVo | undefined;
      //所有模型
      models: any;
      getIcon: (key: string) => string;
      login: (form: AuthForm) => void;
      loginOut: () => void;
      screenSize?: { width: number; height: number; sizeKey: string }; //当前屏幕大小
      //获得字典信息,如果codes不传，则返回一级字典
      getDict: (obj: { emptyLabel?: string; codes?: string[] }) => TranDict[];
      dicts: {
        [key: string]: {
          data: { value: string; label: string }[];
          label: string;
        };
      };
      //按钮权限认证
      checkBtnPermission: (code: string) => boolean; //检查按钮权限
      error: string | null | undefined;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext";

/**
 * AuthProvider 将 authContext页面层次进行了封装
 * 把 authContext需要的数据注入了进来
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  /** 当前用户信息 */
  const [user, setUser] = useState<UserDetailVo>();
  /**
   * 权限权限资源信息
   */
  const [allResources, setAllResources] = useState<SysResources[]>();

  //存模型信息的对象，key是modelName, modelInfoProps
  // 与数据库一致的，有UI场景的模型信息
  const [models, setModels] = useState<any>({});

  const [javaModels, setJavaModels] = useState<any>({});

  const [dicts, setDicts] = useState<SysDict[]>([]);
  /** 全量字典信息 */
  const [dictObj, setDictObj] = useState<{
    [key: string]: { data: { value: string; label: string }[]; label: string };
  }>({});
  const [error, setError] = useState<string | null>();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { data: currUser, runAsync: runCurruser } = useCurrUser();
  const { runAsync: asyncResources } = useAllResources();

  const { runAsync: userLogin } = useLogin();
  const { data: allDict, runAsync } = useAllDict();
  //不刷新则只加载一次
  useMount(() => {
    //拉取用户信息的同步拉拉取字典信息
    runCurruser().then((res) => {
      setUser(res.data);
      runAsync().then((res) => {
        if (res.data) {
          setDicts(res.data);
          const obj: any = {};

          res.data.forEach((d) => {
            if (obj[d.code] === undefined) {
              if (d.val === null) {
                obj[d.code] = { label: d.title, data: [] };
              } else {
                obj[d.code] = {
                  label: "",
                  data: [{ label: d.title, value: d.val }],
                };
              }
            } else {
              if (d.val === null) {
                obj[d.code].label = d.title;
              } else {
                obj[d.code].data.push({ label: d.title, value: d.val });
              }
            }
          });

          obj["vlife"] = {
            lable: "字典类目",
            data: res.data
              .filter((d) => d.val === null)
              .map((d) => {
                return { value: d.code, label: d.title };
              }),
          };
          setDictObj(obj);
        }
      });
    });
    //同步拉取全量资源信息
    asyncResources({}).then((d) => {
      setAllResources(d.data);
    });
  });

  const getIcon = useCallback(
    (key: string): string => {
      if (allResources) {
        const icons = allResources?.filter((r) => r.resourcesCode === key);
        if (icons && icons.length > 0) {
          return icons[0].icon;
        }
      }
      return "";
    },
    [allResources]
  );

  /**
   * 获得后台Java内存里的模型原始信息
   * @param modelName
   */
  async function getModelInfo(
    modelName: string
  ): Promise<ModelInfo | undefined> {
    if (javaModels[modelName] === undefined) {
      //简写
      let model = await (await javaModel(modelName)).data;
      setJavaModels({ ...javaModel, modelName: model });
      // then的写法
      // await modelInfo(entityName,modelName).then(data=>{
      //   model=data.data;
      //   setModels({...models,modelName:model})
      // });
      // alert(JSON.stringify(model?.parentsName));
      return model;
    } else {
      return javaModels[modelName];
    }
  }

  async function getFormInfo(
    modelName: string,
    uiType: "save" | "vo" | "list" | "req"
  ): Promise<FormVo | undefined> {
    if (models[modelName + uiType] === undefined) {
      //简写
      let form = await (await model({ uiType, modelName })).data;
      setModels({ ...models, [modelName + uiType]: { ...form } });
      return form;
      //组件设置json转对象
      // const fields = form?.fields.map((f) => {
      //   return {
      //     ...f,
      //     componentSetting: f.componentSettingJson
      //       ? JSON.parse(f.componentSettingJson)
      //       : {},
      //   };
      // });
      // setModels({ ...models, [modelName + uiType]: { ...form, fields } });
      // return { ...form, fields };
    } else {
      return models[modelName + uiType];
    }
  }

  // /**
  //  * 获得模型信息，modelN
  //  * @param modelName
  //  * @returns
  //  */
  // const getModelInfo11= (entityName:string,modelName:string):ModelInfo | undefined=>{
  //   let modelResult =undefined;
  //   if(models[modelName]===undefined){
  //        modelResult = ( modelInfo(modelName,entityName)).data
  //       // setModels({...models,modelName:modelResult.data})
  //     }
  //   return modelResult;
  // }

  /**
   * @param codes 多条字典信息
   * @returns
   */
  const getDict = ({
    emptyLabel = "全部",
    codes,
  }: {
    emptyLabel?: string;
    codes?: string[];
  }): TranDict[] => {
    let tranDicts: TranDict[] = [];
    if (dicts) {
      if (codes) {
        //指定的字典
        codes.forEach((code) => {
          const codeDicts: Pick<SysDict, "title" | "val">[] = [];
          codeDicts.push({ val: undefined, title: emptyLabel });
          codeDicts.push(
            ...dicts.filter((sysDict) => {
              return sysDict.code === code && sysDict.val;
            })
          );

          tranDicts.push({ column: code, sysDict: codeDicts });
        });
      } else {
        //一级字典
        const codeDicts: Pick<SysDict, "title" | "val">[] = [];
        codeDicts.push({ val: undefined, title: emptyLabel });
        codeDicts.push(
          ...dicts.filter((sysDict) => {
            return sysDict.val === undefined || sysDict.val === null;
          })
        );

        tranDicts.push({ column: "", sysDict: codeDicts });
      }
    }
    return tranDicts;
  };

  const login = useCallback((from: AuthForm) => {
    userLogin(from).then((result) => {
      if (result.code == "200" && result.data) {
        window.localStorage.setItem(localStorageKey, result.data);
        runCurruser().then((res) => {
          setUser(res.data);
          runAsync().then((res) => {
            if (res.data) {
              setDicts(res.data);
            }
          });
        });
      } else {
        setError(result.msg);
      }
    });
  }, []);

  /**
   * @param btnObj 检查按钮权限
   * @returns
   */
  const checkBtnPermission = useCallback(
    (code: string): boolean => {
      // if (user?.username === "manage") {
      //   return true;
      // }
      //按钮有模块和key就校验权限
      if (user && user.resourceCodes && code) {
        return user?.resourceCodes?.includes(code);
      }
      return false;
    },
    [user?.resourceCodes]
  );

  const loginOut = useCallback(() => {
    window.localStorage.removeItem(localStorageKey);
    setUser(undefined);
    navigate("/login");
  }, []);
  const [screenSize, setScreenSize] = useState<{
    width: number;
    height: number;
    sizeKey: string;
  }>();
  const ref = useRef(null);
  const size = useSize(ref);
  useEffect(() => {
    let sizeKey = "3xl";
    if (screenSize === undefined || screenSize.width < 640) {
      sizeKey = "sm";
    } else if (screenSize.width < 768) {
      sizeKey = "md";
    } else if (screenSize.width < 1024) {
      sizeKey = "lg";
    } else if (screenSize.width < 1280) {
      sizeKey = "xl";
    } else if (screenSize.width < 1536) {
      sizeKey = "2xl";
    }
    if (size) setScreenSize({ ...size, sizeKey });
  }, [size]);

  return (
    <div ref={ref}>
      <AuthContext.Provider
        children={children}
        value={{
          user,
          login,
          error,
          loginOut,
          getIcon,
          dicts: dictObj,
          getDict,
          checkBtnPermission,
          getModelInfo,
          getFormInfo,
          models,
          screenSize,
        }}
      />
    </div>
  );
};

/**
 *  这里是简化了context的调用
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider中使用");
  }
  return context;
};
