/**
 * 相关设计器的字段模型
 */

import { Select } from "@douyinfe/semi-ui";

/**
 * 匹配方式
 */
export const OPT:any = {
  eq: { label: "等于", fieldType: ["string", "number"] },
  in: { label: "范围", fieldType: ["string", "date", "number"] },
  gt: { label: "大于", fieldType: ["date", "number"] },
  like: { label: "模糊匹配", fieldType: ["string"] },
  fix: { label: "固定匹配" },
};
/**
 * 固定值
 *     public String orgId;   //用户机构的id
    public String areaId;  //用户地区id
    public String deptId;  // 部门id
    public String codeOrg;// 机构编号
    public String codeDept; //部门编号
    public String codeArea;//地区编号
    和当前用户security相关得字段
 */
export const fixedVal:any = {
  id: { label: "当前用户" },
  deptId: { label: "当前部门" },
  areaId: { label: "当前地区" },
  orgId: { label: "当前机构" },
  codeOrg: { label: "本级和下级机构" },
  codeArea: { label: "本级和下级地区" },
  codeDept: { label: "本级和下级机构" },
};

/**
 * 数据转换
 */
export const tran = {
  year: { label: "按年查询", fieldType: ["date"] },
  month: { label: "按月查询", fieldType: ["date"] },
};
