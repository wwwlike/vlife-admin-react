import { Component, ReactNode } from 'react';

/**
 * 视图单个元素现实的属性信息
 */
export type ViewBasicProp = {
  /**
   * 标题
   */
  title?: string;
  /**
   * 数量
   */
  total?: number;
  /**
   * 说明
   */
  remark?: string;
  /**
   * 连接路由
   */
  router?: string;
  /**
   * 图标
   */
  icon?:ReactNode;
};