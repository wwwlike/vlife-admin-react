// 树的查询组件

import React, { useCallback, useMemo } from 'react';
import { Tree } from '@douyinfe/semi-ui';
import { TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree';

interface treeProps{
  pcodeField?:string,
  codeField?:string,
  valField?:string,
  labelField?:string,
  rootCode:string,
  datas:any[],
  onSelect?:(selectedKeys: string, selected: boolean, selectedNode: TreeNodeData)=>void;
}

interface treeElementProps{
  label: string,
  value: string,
  key: string,
  children?:treeElementProps[],
}
export default (
  {
  pcodeField='pcode',
  codeField='code',
  labelField='name',
  valField='id',
  rootCode='420000',
  datas,
  onSelect,
...props}:treeProps
)=>{

    const treeData1=useCallback((code:string,sub:boolean):treeElementProps[]=>{
      // alert(datas.filter(d=>d[sub?pcodeField:codeField]===code).length)
      if(datas===null||datas===undefined||datas.length===0){
        return [];
      }
      return  datas.filter(d=>d[sub?pcodeField:codeField]===code).map(dd=>{
        return {
        'value':dd[valField],
        'label':dd[labelField],
        'key':dd[valField],
        'children':treeData1(dd[codeField],true)
        }
      })
    },[datas])


    const treeData = [
        {
            label: '亚洲',
            value: 'Asia',
            key: '0',
            children: [
                {
                    label: '中国',
                    value: 'China',
                    key: '0-0',
                    children: [
                        {
                            label: '北京',
                            value: 'Beijing',
                            key: '0-0-0',
                        },
                        {
                            label: '上海',
                            value: 'Shanghai',
                            key: '0-0-1',
                        },
                    ],
                },
            ],
        },
        {
            label: '北美洲',
            value: 'North America',
            key: '1',
        }
    ];
    const style = {
        width: 260,
        // height: 420,
        border: '1px solid var(--semi-color-border)'
    };
    return (
      <div>
        {/* {JSON.stringify(datas)} */}
        <Tree
            treeData={treeData1(rootCode,false)}
            defaultExpandAll
            onSelect={onSelect}
            style={style}
        />
        </div>
    );

}