import { Select } from '@douyinfe/semi-ui';
import { stringify } from 'querystring';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// code,pcode,name,menuCode

export interface tabSelectProps{
  pcodeField?:string, //datas里 父code的字段名称
  codeField?:string, //datas 本级code的字段名称
  labelField?:string, //datas 本label字段名称
  valField?:string,//datas 本label字段名称
  selectMore?:boolean,//能否多选
  // value:{value:string,label:string}
  value:string,
  onChange:(data:string)=>void,
  datas:any[]
}

/**
 * 两级下拉选项，第一级菜单，第二级选项
 */
export default ({pcodeField='menuCode',
  codeField='code',
  labelField='name',
  valField='id',
  selectMore=false,
  datas,
  value,
  onChange,
...props}:tabSelectProps)=>{

  const tabOptions = useMemo(()=>{
    if(datas){
      return datas.filter(d=>d[pcodeField]===null).map(d=>{
          return {itemKey:d[codeField],label:d[labelField]}
        })
    }
    return [];
  },[datas]);


  useEffect(()=>{
    if(value&&datas){ 
      const selected:any=datas.filter(d=>d[codeField]===value)[0];
      const menu=datas.filter(d=>selected[pcodeField]&&selected[pcodeField]===d[codeField])[0];
      setKey(menu[codeField])
      setObj( {value:selected[codeField],'label':menu[labelField]+'/'+selected[labelField]})
    }else if(tabOptions&& tabOptions.length>0){
       setKey(tabOptions[0].itemKey)
    }
  },[value,datas,tabOptions])

  const [key, setKey] = useState<string>();
  const getSub=(key?:string)=>{
    if(!key)
      return []
      const pName=datas.filter(d=>d[codeField]===key)[0][labelField];
    return datas.filter(d=>d[pcodeField]===key).map(d=>{
      return {value:d[codeField],label:pName+"/"+d[labelField]}
    })
  }
  // const subs= useMemo(()=>{
  //   return datas.filter(d=>d[pcodeField]===key).map(d=>{
  //     return {value:d[valField],label:d[labelField]+d[valField],pLabel:'aaa'}
  //   })
  // },[key,datas])

  const [obj, setObj] = useState<{label:string,value:string}>(); //{ value: 'faq', label: '常见问题' },
  const tabStyle = {
    cursor: 'pointer',
    marginRight: 12,
    paddingBottom: 4,
  };
  const tabActiveStyle = {
      ...tabStyle,
      borderBottom: '1px solid var(--semi-color-primary)',
      fontWeight: 700,
  };
  const tabWrapper = {
      display: 'flex',
      paddingTop: 8,
      paddingLeft: 32,
      borderBottom: '0.5px solid var(--semi-color-border)'
  };

  const outerTopSlotNode = (
    <div style={tabWrapper}>
        {
            tabOptions.map((item, index) => {
               const style = item.itemKey === key ? tabActiveStyle : tabStyle;
                return (
                    <div style={style}
                     key={item.itemKey} 
                      onClick={() => setKey(item.itemKey)}>{item.label}
                    </div>
                );
            })
        }
    </div>
);
return (
  <div>
    <Select
        // defaultOpen 进入打开
        autoAdjustOverflow={false}
        value={obj}
        onChangeWithObject
        onChange={obj => {
          setObj(obj as {label:string,value:string})
          onChange((obj as {label:string,value:string}).value)
        }}
        // style={{ width: 200 }}
        outerTopSlot={outerTopSlotNode} //插槽内容
        optionList={getSub(key)} //第一页的内容
    />
    </div>
);

}