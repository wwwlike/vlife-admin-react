
import {PageVo,DbEntity,PageQuery,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 批次
export interface BankBatch extends DbEntity{
  fsMachineIp: string;  // 文件服务IP
  batchTotalPage: number;  // 批次扫描图像总数
  sysDeptId: string;  // 网点机构
  imageStatus: string;  // 图像状态
  isInvalId: string;  // 批次是否有效
  fsMachinePort: string;  // 文件服务端口
  largeFileName: string;  // 图像大文件路径
  sysUserId: string;  // 柜员
}
// 批次查询
export interface BankBatchPageReq extends PageQuery{
  sysDept_code: string;  // 编码
}
/** 
   * 分页查询批次;
   * @param req 批次查询;
   * @return 批次;
   */
export const page=(req: BankBatchPageReq): Promise<Result<PageVo<BankBatch>>>=>{
  return apiClient.get(`/bankBatch/page`,{params:req}  );
};
/** 
   * 保存批次;
   * @param dto 批次;
   * @return 批次;
   */
export const save=(dto: BankBatch): Promise<Result<BankBatch>>=>{
  return apiClient.post(`/bankBatch/save`  ,dto  );
};
/** 
   * 明细查询批次;
   * @param id 主键id;
   * @return 批次;
   */
export const detail=(id: string): Promise<Result<BankBatch>>=>{
  return apiClient.get(`/bankBatch/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/bankBatch/remove/${id}`  );
};