import React, { useCallback, useMemo } from 'react';
import { Tree } from '@douyinfe/semi-ui';
import { TreeNodeData } from '@douyinfe/semi-ui/lib/es/tree';
import { checkSubData } from '@src/utils/utils';

interface treeProps{
  treeCode?:string, //上下级关系的字段
  valField?:string, //提交给后台的字段
  labelField?:string, //树型显示的字段
  rootCode?:string, //节点
  datas:any[], //所有树的数据
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
  treeCode='code',// 42_
  labelField='name',
  valField='id',//传给后端的值的字段
  rootCode='42',
  datas,
  onSelect,
...props}:treeProps
)=>{
    /**
     * 使用递归调用的方式组装数据
     * @sub 是否是查children,那么就不是eq,是startWith
     * @code 查询的编码
     */
    const treeData=useCallback((code:string,sub:boolean):treeElementProps[]=>{
      if(datas===null||datas===undefined||datas.length===0){
        return [];
      }


      //遍历全部，效率值得商榷找到开发头的
      return  datas.filter(d=>sub?(
        checkSubData(code,d[treeCode]))
        :d[treeCode]===code
      ).map(dd=>{
        return {
        'value':dd[valField],
        'label':dd[labelField],
        'key':dd[valField],
        'children':treeData(dd[treeCode],true)
        }
      })
    },[datas])


    // const treeData = [
    //     {
    //         label: '亚洲',
    //         value: 'Asia',
    //         key: '0',
    //         children: [
    //             {
    //                 label: '中国',
    //                 value: 'China',
    //                 key: '0-0',
    //                 children: [
    //                     {
    //                         label: '北京',
    //                         value: 'Beijing',
    //                         key: '0-0-0',
    //                     },
    //                     {
    //                         label: '上海',
    //                         value: 'Shanghai',
    //                         key: '0-0-1',
    //                     },
    //                 ],
    //             },
    //         ],
    //     },
    //     {
    //         label: '北美洲',
    //         value: 'North America',
    //         key: '1',
    //     }
    // ];
    const style = {
        width: 260,
        // height: 420,
        border: '1px solid var(--semi-color-border)'
    };
    return (
      <div>
        {/* {JSON.stringify(datas)} */}
        <Tree
            treeData={treeData(rootCode,false)}
            defaultExpandAll
            onSelect={onSelect}
            style={style}
        />
        </div>
    );

}