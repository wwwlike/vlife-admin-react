
import {PageVo,DbEntity,PageQuery,Result} from '@src/api/base'
import apiClient from '@src/api/base/apiClient'
// 图片信息表
export interface BankImgData extends DbEntity{
  currencyType: string;  // 币种
  ocrFailList: string;  // OCR识别列表
  otherNeedDate: string;  // 重点监督日期
  lengthOfImage: number;  // 黑白图像长度
  unitNo: string;  // 联号
  iaCode: string;  // 扫描仪IA码
  occurTime: string;  // 发生时间
  memo: string;  // 备注
  errorFlag: string;  // 是否差错图像
  cardNo: string;  // 卡号
  compressFlag: string;  // 压缩标志
  copyRec: number;  // 拷贝标志
  isVerify: string;  // 是否校验
  auditClass: string;  // 重点监督分类
  formGroup: string;  // 版面组
  lastModTime: string;  // 上次修改时间
  psLevel: string;  // 主附件状态
  selfDelete: string;  // 删除表
  balance: string;  // 余额
  ocrRectList: string;  // OCR区域列表
  newBatchId: string;  // 新批次号
  offsetOfClearImg: number;  // 彩色图像偏移位置
  accountFlag: string;  // 账号类型
  dataFlag: string;  // 
  resuperviseTime: string;  // 再监督具体时间
  newAccount: string;  // 新账号
  inccodeinBatch: number;  // 序号
  checkFlag: string;  // 勾对标志
  serialNo: number;  // 图像唯一序号
  errorNo: string;  // 差错编号
  ocrWorker: string;  // 补录人员
  account2: string;  // 第二账号
  oriPoint: string;  // 原点位置
  txCode: string;  // 交易码
  offsetOfImage: number;  // 黑白图像偏移位置
  vouhNo: string;  // 凭证号
  imgId: string;  // 图像归档ID
  processState: string;  // 图像处理状态
  clientName: string;  // 客户端名称
  insterest: number;  // 利息
  cliSerialNo: string;  // 网点流水号
  ocrDate: string;  // OCR补录日期
  batchId: string;  // 批次号
  especialTrdDesc: string;  // 重点监督提示信息
  updFlag: string;  // 更新标志
  formName: string;  // 版面名称
  archiveDate: string;  // 归档日期
  dayendChkWorker: string;  // 日终轧帐人员
  oppAcct: string;  // 对方账号
  lengthOfClearImg: number;  // 彩色图像长度
  ocrpreWorker: string;  // OCR预处理人员
  otherNeedWorker: string;  // 重点监督人员
  groupNo: string;  // 重点监督分组
  spFlag: string;  // 特别处理标志
  resume: string;  // 摘要
  cityNo: string;  // 城市编号
  amount: number;  // 金额
  subjectNo: string;  // 科目号
  verifyWorker: string;  // 校验用户
  bankFlowId: string;  // 流水
  primaryWorker: string;  // 主附件人员
  correctAng: string;  // 识别倾斜矫正角度
  slaveCount: number;  // 附件数目
  resupervisor: string;  // 再监督人员
  contractId: string;  // 合同号
  isPass: string;  // 是否通过
  account: string;  // 账号
  cdFlag: string;  // 借贷标志
  formFailCause: string;  // 版面识别失败原因
}
// 图像查询
export interface BankImgDataPageReq extends PageQuery{
  bankBatchId: string;  // 批次
}
/** 
   * 分页查询图片信息表;
   * @param req 图像查询;
   * @return 图片信息表;
   */
export const page=(req: BankImgDataPageReq): Promise<Result<PageVo<BankImgData>>>=>{
  return apiClient.get(`/bankImgData/page`,{params:req}  );
};
/** 
   * 保存图片信息表;
   * @param dto 图片信息表;
   * @return 图片信息表;
   */
export const save=(dto: BankImgData): Promise<Result<BankImgData>>=>{
  return apiClient.post(`/bankImgData/save`  ,dto  );
};
/** 
   * 明细查询图片信息表;
   * @param id 主键id;
   * @return 图片信息表;
   */
export const detail=(id: string): Promise<Result<BankImgData>>=>{
  return apiClient.get(`/bankImgData/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/bankImgData/remove/${id}`  );
};