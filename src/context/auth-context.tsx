// import { AuthForm, useCurrUser, useLogin } from "@src/provider/userProvider";
// import { useAllDict } from "@src/provider/dictProvider";
import { TranDict } from "@src/api/base";
import { useAllResources } from "@src/api/SysResources";
import { useMount, useSize } from "ahooks";
import React, { ReactNode, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { all, SysDict } from "@src/api/SysDict";
import {
  currUser,
  gitToken,
  ThirdAccountDto,
  UserDetailVo,
  login as userLogin,
} from "@src/api/SysUser";
import { FormVo, model, formPageReq } from "@src/api/Form";
import { SysResources } from "@src/api/SysResources";
import { useEffect } from "react";
import { listAll, SysGroup } from "@src/api/SysGroup";
export const localStorageKey = "__auth_provider_token__";

export interface dictObj {
  [key: string]: {
    data: {
      value: string | undefined;
      label: string;
      color:
        | "amber"
        | "blue"
        | "cyan"
        | "green"
        | "grey"
        | "indigo"
        | "light-blue"
        | "light-green"
        | "lime"
        | "orange"
        | "pink"
        | "purple"
        | "red"
        | "teal"
        | "violet"
        | "yellow"
        | "white";
    }[];
    label: string;
  };
}
/**
 * 上次登录的用户名,清除token不会清除它
 */
export const localHistoryLoginUserName = "__local_history_login_username__";
//全局状态和函数
const AuthContext = React.createContext<
  | {
      /**1 attr */
      //当前用户
      user: UserDetailVo | undefined;
      //所有模型
      models: any;
      //当前屏幕大小
      screenSize?: { width: number; height: number; sizeKey: string };
      // 所有字典信息
      dicts: dictObj;
      //全局错误信息
      error: string | null | undefined;
      //所有权限组
      groups: { [id: string]: SysGroup };
      /**2 funs */
      //java模型信息
      // getModelInfo: (modelName: string) => Promise<ModelInfo | undefined>;
      //db模型信息
      getFormInfo: (params: formPageReq) => Promise<FormVo | undefined>;
      //模型缓存信息清除
      clearModelInfo: (modelName?: string) => void;
      //登录(可以移除到一般service里)
      login: (form: { password: string; username: string }) => void;
      giteeLogin: (code: string) => Promise<ThirdAccountDto | undefined>;
      loginOut: () => void;
      //指定key字典信息
      getDict: (obj: { emptyLabel?: string; codes?: string[] }) => TranDict[]; //如果codes不传，则返回字典类目
      //按钮权限认证
      checkBtnPermission: (code: string) => boolean; //检查按钮权限
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
  /** 数据库结构的字典信息 */
  const [dbDicts, setDbDicts] = useState<SysDict[]>([]);

  /** 权限组集合 */
  const [groups, setGroups] = useState<{ [key: string]: SysGroup }>({});

  /**封装好的全量字典信息 */
  const [dicts, setDicts] = useState<dictObj>({});
  const [error, setError] = useState<string | null>();
  const navigate = useNavigate();
  // const { data: currUser, runAsync: runCurruser } = useCurrUser();
  const { runAsync: asyncResources } = useAllResources();

  // const { runAsync: userLogin } = useLogin();
  // const { data: allDict, runAsync } = useAllDict();

  /**
   * 字典数据加载则更新
   */
  useEffect(() => {
    const obj: dictObj = {};
    dbDicts.forEach((d) => {
      if (obj[d.code] === undefined) {
        if (d.val === null) {
          obj[d.code] = { label: d.title, data: [] };
        } else {
          obj[d.code] = {
            label: "",
            data: [{ label: d.title, value: d.val, color: d.color }],
          };
        }
      } else {
        if (d.val === null) {
          obj[d.code].label = d.title;
        } else {
          obj[d.code].data.push({
            label: d.title,
            value: d.val,
            color: d.color,
          });
        }
      }
    });
    obj["vlife"] = {
      label: "字典类目",
      data: dbDicts
        .filter((d) => d.dictType === true)
        .map((d) => {
          return { value: d.code, label: d.title, color: d.color };
        }),
    };
    setDicts(obj);
  }, [dbDicts]);

  /**
   * 登录成功后数据数据提取初始化
   */
  const datasInit = useCallback(() => {
    //字典初始化
    all().then((res) => {
      if (res.data) {
        setDbDicts(res.data);
      }
    });
    //同步拉取全量资源信息
    asyncResources({}).then((d) => {
      setAllResources(d.data);
    });
    //角色组全量提取
    listAll().then((t) => {
      let obj: { [id: string]: SysGroup } = {};
      t.data?.forEach((d) => {
        obj[d.id] = d;
      });
      setGroups({ ...obj });
    });
  }, [groups]);

  //不刷新则只加载一次
  useMount(() => {
    //拉取用户信息的同步拉拉取字典信息
    const token = window.localStorage.getItem(localStorageKey);
    //取到token情况下，加载缓存数据
    if (token) {
      currUser().then((res) => {
        setUser(res.data);
        datasInit();
      });
    }
  });

  /**
   * 获得后台Java内存里的所有模型原始信息
   * @param modelName
   */
  // async function getModelInfo(
  //   modelName: string
  // ): Promise<ModelInfo | undefined> {
  //   if (javaModels[modelName] === undefined) {
  //     //简写
  //     let model = await (await javaModel(modelName)).data;
  //     setJavaModels({ ...javaModel, modelName: model });
  //     // then的写法
  //     // await modelInfo(entityName,modelName).then(data=>{
  //     //   model=data.data;
  //     //   setModels({...models,modelName:model})
  //     // });
  //     // alert(JSON.stringify(model?.parentsName));
  //     return model;
  //   } else {
  //     return javaModels[modelName];
  //   }
  // }

  /**
   *
   * @param modelName 清除model缓存信息
   */
  function clearModelInfo(modelName?: string) {
    if (modelName === undefined) {
      setModels({});
    } else if (models[modelName]) {
      setModels({ ...models, [modelName]: undefined });
    }
  }
  //从缓存里取模型信息
  async function getFormInfo(params: formPageReq): Promise<FormVo | undefined> {
    if (params.type) {
      if (models[params.type] === undefined) {
        //简写(promise形式返回数据出去)
        let form = await (await model(params)).data;
        // console.log("form", form);
        setModels({
          ...models,
          [params.type]: { ...form },
        });
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
        return models[params.type];
      }
    }
    return undefined;
  }

  /**
   * @param codes 多条字典信息
   * @returns
   */
  const getDict = useCallback(
    ({
      emptyLabel = "全部",
      codes,
    }: {
      emptyLabel?: string;
      codes?: string[];
    }): TranDict[] => {
      let tranDicts: TranDict[] = [];
      if (dbDicts) {
        if (codes) {
          //指定的字典
          codes.forEach((code) => {
            const codeDicts: Pick<SysDict, "title" | "val">[] = [];
            codeDicts.push({ val: undefined, title: emptyLabel });
            codeDicts.push(
              ...dbDicts.filter((sysDict) => {
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
            ...dbDicts.filter((sysDict) => {
              return sysDict.val === undefined || sysDict.val === null;
            })
          );
          tranDicts.push({ column: "", sysDict: codeDicts });
        }
      }
      return tranDicts;
    },
    [dbDicts]
  );

  //giteelogin 方式登录】
  const giteeLogin = useCallback(
    (code: string): Promise<ThirdAccountDto | undefined> => {
      return gitToken(code, "gitee").then((result) => {
        // alert(JSON.stringify(result));
        if (result.code == "200" && result.data) {
          window.localStorage.setItem(localStorageKey, result.data.token);
          currUser().then((res) => {
            setUser(res.data);
            datasInit();
          });
        } else {
          setError(result.msg);
        }
        return result.data;
      });
    },
    []
  );

  const login = useCallback((from: { username: string; password: string }) => {
    userLogin(from).then((result) => {
      if (result.code == "200" && result.data) {
        window.localStorage.setItem(localStorageKey, result.data);
        window.localStorage.setItem(
          localHistoryLoginUserName,
          from.username || ""
        );
        currUser().then((res) => {
          setUser(res.data);
          datasInit();
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
      //超级管理员
      if (user?.sysGroupId === "super") {
        return true;
      }
      //按钮有code,且code是权限范围内的
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
          models,
          screenSize,
          dicts,
          error,
          groups,
          // getModelInfo,
          getFormInfo,
          clearModelInfo,
          login,
          giteeLogin,
          loginOut,
          getDict,
          checkBtnPermission,
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
