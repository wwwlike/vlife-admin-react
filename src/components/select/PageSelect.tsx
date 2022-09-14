import { CheckboxGroup, Divider } from '@douyinfe/semi-ui';
import React from 'react'
/**
 实现效果如下
标题1
---------------
[] 标题1的选自内容1
[] 标题1的选自内容2
------------------------
标题2
---------------
[] 标题2的选自内容1
[] 标题2的选自内容2
.......
后端返回的数据，应该是如下结构
[
  {
    <label>:标题1,
    <detail>:[
      <label>:选择的明细
      <id>:hehe
    ]
  }
]
 */


interface PageSelectProps{
  //能否多选
  datas:{name:string,detailList:{label:string,value:string}[]}[],//接收数据格式
  value:string[],//表单的值
  selectType:'typeOne'|'one'|'more' //每个分类选一个|全局选一个|多选
  // onSelect?:(selectedKeys: string, selected: boolean, selectedNode: TreeNodeData)=>void;
  onChange:(value:string[])=>void
}
/**
 * 页面平铺选择组件
 */
export default ({datas,value,onChange,selectType='typeOne',...props}:PageSelectProps)=>{
  return <>
  {/* vertical horizontal */}
  {
    datas?
      datas.map(d=>{
        return  d.detailList&&d.detailList.length>0?
       (
   
      <div  key={'div_'+d.name}>
        <h3  style={{"marginTop":"20px"}}><b>{d.name}</b></h3>
        <Divider margin='8px'/>
      <CheckboxGroup
        value={value} 
        onChange={onChange}
        options={d.detailList} direction='vertical'/>
      </div>
      
      ):"";
    }):""
    }
  </>
}


