import { DbEntity, IdBean, Pager, PageReq } from "./vlife";

interface SysResources extends DbEntity {
  /**
   * 接口地址
   */
  url: string;
  /**
   * 资源编码
   */
  code: string;
  /**
   * 资源名称
   */
  name: string;
  /**
   * 图标s
   */
  icon: string;
  /**
   * 资源类型  1菜单 2接口
   */
  type: "1" | "2"; // 1菜单 ，2 接口;
  /**
   * 请求方式
   */
  requestType: string;
  /**
   * 所属角色ID
   */
  sysRoleId: string;
  /**
   * 上级资源code(一级菜单没有上级资源)
   */
  pcode: string;
  /**
   * 归属菜单
   */
  menuCode: string;
}

interface ResourcesPageReq extends Pager {
  /**
   * 资源类型
   */
  type: string;
  /**
   * 资源归属角色
   */
  sysRoleId: string;
  /**
   * 模糊搜索条件
   */
  search: string;
}
