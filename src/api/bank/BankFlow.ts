
import {PageVo,DbEntity,PageQuery,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 业务流水
export interface BankFlow extends DbEntity{
  termiMark: string;  // 终端标识号
  cityNo: string;  // 城市号
  cliSerialNo: string;  // 网点流水号
  ori_account: string;  // 付方账号
  operatorNo: string;  // 柜员号
  occurDate: string;  // 业务日期
  cardNo: string;  // 卡号
  siteNo: string;  // 网点机构
  flowTable: string;  // 业务流水表
  flowId: string;  // 业务流水号
  account: string;  // 账号
  checkerNo: string;  // 勾对人员
}
// 业务流水查询
export interface BankFlowPageReq extends PageQuery{
  operatorNo: string;  // 柜员号
  occurDate: string;  // 业务日期
  cardNo: string;  // 卡号
}
/** 
   * 分页查询业务流水;
   * @param req 业务流水(视图);
   * @return 业务流水;
   */
export const page=(req: BankFlowPageReq): Promise<Result<PageVo<BankFlow>>>=>{
  return apiClient.get(`/bankFlow/page`,{params:req}  );
};
/** 
   * 保存业务流水;
   * @param dto 业务流水;
   * @return 业务流水;
   */
export const save=(dto: BankFlow): Promise<Result<BankFlow>>=>{
  return apiClient.post(`/bankFlow/save`  ,dto  );
};
/** 
   * 明细查询业务流水;
   * @param id 主键id;
   * @return 业务流水;
   */
export const detail=(id: string): Promise<Result<BankFlow>>=>{
  return apiClient.get(`/bankFlow/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/bankFlow/remove/${id}`  );
};