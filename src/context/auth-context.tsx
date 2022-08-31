/**
 * 把用户信息放置到 context里去
 */
import {AuthForm, useCurrUser,useLogin}  from '@src/provider/userProvider';
import {useAllDict}  from '@src/provider/dictProvider';
import { TranDict } from '@src/mvc/base';
import { useMount } from 'ahooks';
import React, { ReactNode, useCallback, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { VfButton } from '@src/components/table';
import { SysDict } from '@src/mvc/SysDict';
import { UserDetailVo } from '@src/mvc/SysUser';


const localStorageKey = "__auth_provider_token__";
//全局状态类型定义，初始化为undefiend ,注意这里返回的是Pomise函数
const AuthContext = React.createContext<{
      user: UserDetailVo | undefined;
      login: (form: AuthForm) => void;
      loginOut:()=>void;
      getDict:(...dictCodes:string[])=>any[];//获得字典信息
      checkBtnPermission:(btn:VfButton)=>boolean,//检查按钮权限
      error:string|null|undefined;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext";


/**
 * AuthProvider 将 authContext页面层次进行了封装
 * 把 authContext需要的数据注入了进来
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,setUser]=useState<UserDetailVo>();
  const [dicts,setDicts]=useState<SysDict[]>([]);
  const [error,setError]=useState<string|null>();
  const navigate = useNavigate()
	const location = useLocation()
  const {pathname}=location;
  const {data:currUser,runAsync:runCurruser} =useCurrUser()
  const {runAsync:userLogin} = useLogin();
  const {data:allDict,runAsync}=useAllDict();
  //不刷新则只加载一次
  useMount(()=>{

    //拉取用户信息的同时拉取字典信息
    runCurruser().then((res)=>{
      setUser(res.data);
      runAsync().then(res=>{
        if(res.data){
         setDicts(res.data);
        }
      })
    })
  })


   /**
   * @param codes 多条字典信息
   * @returns
   */
    const getDict = (...codes: string[]): TranDict[] => {
      let tranDicts: TranDict[] = [];
      if(dicts){
        codes.forEach((code) => {
          const codeDicts: Pick<SysDict,'title'|'val'>[]=[];
           codeDicts.push({val:undefined,title:'全部'})
           codeDicts.push(...dicts.filter((sysDict) => {
            return sysDict.code === code&& sysDict.val;
          }));
          
          tranDicts.push({ column: code, sysDict: codeDicts });
        });
      }
      return tranDicts;
    };
   

  const login= useCallback((from:AuthForm)=>{
    userLogin(from).then(result=>{
        if(result.code=='200'&&result.data){
          window.localStorage.setItem(localStorageKey, result.data);
          runCurruser().then((res)=>{
            setUser(res.data);
            runAsync().then(res=>{
              if(res.data){
               setDicts(res.data);
              }
            })
          })
        }else{
          setError(result.msg)
        }
    });
  },[])

    /**
   * 
   * @param btnObj 检查按钮权限
   * @returns 
   */
     const checkBtnPermission=useCallback((btnObj:VfButton):boolean=>{
      //console.log("btnObj.entityName",btnObj)
      if(btnObj.entityName&&btnObj.key){//按钮有模块和key就校验权限
        if(user?.resourceCodes?.includes(btnObj.entityName+":"+btnObj.key)){
     
          return true;
        }
        return false;
      }
      return true
    },[user?.resourceCodes])
  

  const loginOut=useCallback(()=>{
    window.localStorage.removeItem(localStorageKey);
    setUser(undefined);
    navigate("/login")
  },[])


  return (
    <AuthContext.Provider
      children={children}
      value={{user,login,error,loginOut,getDict,checkBtnPermission}}
    />
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