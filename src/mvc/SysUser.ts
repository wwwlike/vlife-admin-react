import { Project } from "./Project";
import apiClient from "./apiClient";
import { SysOrg } from "./SysOrg";
import { GroupVo } from "./SysGroup";
import { PageVo, DbEntity, PageQuery, VoBean, Result } from "./base";
// 用户表
export interface SysUser extends DbEntity {
  idno: string; // 证件号
  password: string; // 密码
  sysOrgId: string; // 单位
  name: string; // 姓名
  tel: string; // 电话
  state: string; // 启用状态
  usetype: string; // 用户类型
  sysGroupId: string; // 权限组
  username: string; // 用户名
}


// 第三方账户信息
export interface ThirdAccountDto {
  id: string; //三方账号id
  name: string; // 中文密码
  username: string; // 账号
  email: string; // 邮箱
  from:"gitee"; //来源
  thirdToken:string; //三方账号临时token
  token:string; //本系统token
  avatar:string;//头像url
}

// 用户列表查询
export interface SysUserPageReq extends PageQuery {
  area: string; // 区划编码
  search: string; // 姓名/手机/证件
  sysOrgId: string; // 单位
  sysGroupId: string; // 权限组
}
// 用户详细信息
export interface UserDetailVo extends VoBean {
  groupName: string; // 权限组外键，权限组名称
  sysOrg_sysArea_code: string; // 地区编码
  sysOrg_name: string; // 机构外键表字段打平
  name: string; // 用户名
  menus: string[]; // menus
  sysOrg_sysArea_name: string; // 间隔外键表字段打平
  resourceCodes: string[]; // 用户有的权限资源代码 权限组->角色权限->角色->资源——资源编码
  username: string; // 账号
  codeArea: string;
  codeDept: string;
  codeOrg: string;
  sysDeptId: string;
  sysAreaId: string;
}
// 用户列表信息
export interface UserVo extends VoBean {
  groupName: string; // 角色组名称
  name: string; // 用户名
  tel: string; // 联系电话
  state: string; // 启用状态
  idno: string; // 证件号码
  usetype: string; // 用户类型
  username: string; // 账号
}
// sysUser详情信息
export interface UserInfoVo extends VoBean {
  sysGroupName: string; // sysGroup_name
  projects: Project[]; // 负责的项目
  orgName: string[]; // 甲方单位名称
  groupVo: GroupVo; // ------------5 外键封装对象 嵌套注入 ----------------
  name: string; // 负责人姓名
  orgs: SysOrg[]; // 关联负责项目的甲方信息sysUser->project(sysUserId,sysOrgId)<-sysOrg
}

/**
 * 注册数据
 */
export interface RegisterDto {
  email: string;//邮箱
  password: string; //密码
  checkCode: string; // 验证码
}

/**
 * 分页查询用户表(视图);
 * @param req 用户表(视图);
 * @return 用户表(视图);
 */
export const pageUser = (
  req: SysUserPageReq
): Promise<Result<PageVo<UserVo>>> => {
  return apiClient.get(`/sysUser/page/userVo`, { params: req });
};
/** 用户列表分页 */
export const page = (req: SysUserPageReq): Promise<Result<PageVo<SysUser>>> => {
  return apiClient.get(`/sysUser/page`, { params: req });
};

/** 用户列表不分页*/
export const list = (
  req: Partial<SysUserPageReq>
): Promise<Result<SysUser[]>> => {
  return apiClient.get(`/sysUser/list`, { params: req });
};

/** 邮件唯一性检查*/
export const checkEmail = (
  email:string
): Promise<Result<number>> => {
  return apiClient.get(`/sysUser/checkEmail?email=${email}`);
};


/** 邮件唯一性检查*/
export const sendEmail = (
  email:string
): Promise<Result<string>> => {
  return apiClient.get(`/sysUser/sendEmail?email=${email}`);
};


/** 注册*/
export const register = (
  data:RegisterDto
): Promise<Result<string>> => {
  return apiClient.post(`/sysUser/register`,data);
};



/**
 * 保存用户表;
 * @param dto 用户表;
 * @return 用户表;
 */
export const save = (dto: SysUser): Promise<Result<SysUser>> => {
  return apiClient.post(`/sysUser/save`, { params: dto });
};
/**
 * 明细查询用户表(视图);
 * @param id 主键id;
 * @return 用户表(视图);
 */
export const detail = (id: string): Promise<Result<SysUser>> => {
  return apiClient.get(`/sysUser/detail/${id}`);
};
/** */
export const usesrDetailVoDetail = (
  id: string
): Promise<Result<UserDetailVo>> => {
  return apiClient.get(`/sysUser/detail/userDetailVo/${id}`);
};
/**
 * 逻辑删除;
 * @param id 主键id;
 * @return 已删除数量;
 */
export const remove = (id: string): Promise<Result<number>> => {
  return apiClient.delete(`/sysUser/remove/${id}`);
};
/**
 * 返回当前用户信息
 * @return
 */
export const currUser = (): Promise<Result<UserDetailVo>> => {
  return apiClient.get(`/sysUser/currUser`);
};
/**
 * 单个用户信息视图
 * @param id
 * @return
 */
export const userInfoVoDetail = (id: string): Promise<Result<UserInfoVo>> => {
  return apiClient.get(`/sysUserTest/detail/userInfoVo/${id}`);
};



/**
 * 单个用户信息视图
 * @param id
 * @return
 */
export const gitToken = (code: string,from:string): Promise<Result<ThirdAccountDto>> => {
  return apiClient.get(`/git/token/${from}?code=${code}`);
};



/**
 * gitee访问入口地址
 * @return
 */
 export const giteeUrl = (): Promise<Result<string>> => {
  return apiClient.get(`/git/giteeUrl`);
};

/**
 * 邮箱校验
 * @return
 */
 export const openCheckCode = (): Promise<Result<boolean>> => {
  return apiClient.get(`/git/openCheckCode`);
};



