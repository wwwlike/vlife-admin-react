/**
 * 属性级联选择器
 */

import React from 'react'

type treeData={
  label: string,
  value: object,
  children:treeData[]
}

export interface TreeSelectProps{
  datas:treeData[],//接收数据格式
  value:string,//表单的值
}
export default ({...props}:TreeSelectProps)=>{

  return <>123432432</>
}