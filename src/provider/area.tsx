import { DbEntity, Result } from '@src/types/vlife';
import apiClient from '@src/utils/apiClient';
import { useRequest } from 'ahooks';
import { Options } from "ahooks/lib/useRequest/src/types";

export interface sysArea extends DbEntity{
  name:string,// 区划名称
  code:string,//区划编码
  pcode:string,//上级编码
  level:string,//区划类型来源于字典
}

export const listAll=():Promise<Result<sysArea[]>>=>{
  return apiClient.get(`/sysArea/list/all`);
}

export const useListAll = (
  options: Options<Result<sysArea[]>, any> = { manual: true }
) =>
  useRequest(listAll, options);

