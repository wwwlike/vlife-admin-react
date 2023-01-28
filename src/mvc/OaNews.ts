
import qs from 'qs';
import apiClient from './apiClient'
import {PageVo,DbEntity,Result, PageQuery} from './base'
export interface OaNews extends DbEntity{
  titleSub: string;  // 副标题
  img: string;  // 封面
  sort: number;  // 优先级
  title: string;  // 标题
  content: string;  // 新闻内容
  newsType: string;  // 新闻分类
  videoUrl: string;  // 视频地址URL
  sysOrgId: string;  // 发布单位
  state: string;  // 新闻状态
}

// 查询条件
export interface OaNewsPageReq extends PageQuery {
  title:string;
  newsType:string;  
}
/** 
   * 保存null;
   * @param dto null;
   * @return null;
   */
export const save=(dto: OaNews): Promise<Result<OaNews>>=>{
  return apiClient.post(`/oaNews/save`  ,dto  );
};
/** 
   * 明细查询null;
   * @param id 主键id;
   * @return null;
   */
export const detail=(id: string): Promise<Result<OaNews>>=>{
  return apiClient.get(`/oaNews/detail/${id}`  );
};
/** 
   * 逻辑删除;
   * @param id 主键id;
   * @return 已删除数量;
   */
export const remove=(id: string): Promise<Result<number>>=>{
  return apiClient.delete(`/oaNews/remove/${id}`  );
};


/**
 * 分页查询
 */
export const page = (req: OaNewsPageReq): Promise<Result<PageVo<OaNews>>> => {
  // alert(JSON.stringify(req))
  return apiClient.get(`/oaNews/page?${qs.stringify(req, {
    allowDots: true, //多级对象转str中间加点
    arrayFormat: "comma", //数组采用逗号分隔 ,这里转换不通用，get查询都需要这样转换
  })}`);
};

