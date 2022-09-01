import { Card } from '@douyinfe/semi-ui';
import { BtnMemoProp, VfButton } from '@src/components/table';
import { useAuth } from '@src/context/auth-context';
import { listAll } from '@src/mvc/SysArea';
import { SysUserPageReq } from '@src/mvc/SysUser';
import FormPage from '@src/pages/common/formPage';
import TablePage from '@src/pages/common/tablePage';
import { removeEnds0 } from '@src/utils/utils';
import React, {useMemo, useState} from 'react';

/**
 * 在封装一层
 * 1. entityName
 * 2. reqName
 * 3. voName
 */
export default ()=>{
  const {user}= useAuth();
  //2页面模块需要共享的查询条件状态
  const [formData,setFormData]=useState<Partial<SysUserPageReq>>({});
  const stateCheck=(...objs:any):BtnMemoProp=> {
    const length0=objs.filter((obj: { state: string; })=>obj.state==='0').length;
    const length1=objs.filter((obj: { state: string; })=>obj.state==='1').length;
    const length=objs.length;
    return {
      title:length0===length?'启用':'停用',
      disable:(length===0||(length!=length1&&length!=length0)),
      prompt:length===0?"请选择一个":"请选择相同启用状态的数据操作"}
  }

  const customBtns=useMemo(():VfButton[]=>{
    return [{title:'启用',key:'open',entityName:'sysUser',tableBtn:true,attr:stateCheck}]},[])

  return (
  
    <div className='h-full overscroll-auto'>
    <div  className='h-full w-72 float-left ' >
          <Card  title='用户管理'  bordered={true} className='h-full' headerLine={false} headerStyle={{fontSize:'small'}}>
            <FormPage type='queryForm' 
              maxColumns={[1,1,1]} 
              formData={formData} 
              onDataChange={setFormData} 
              entityName='sysUser'  
              modelName='sysUserPageReq'
              fieldsCover={[
                {
                dataIndex:'area',//字段
                component:'TreeQuery',//组件替换
                props:{ //组件需要的属性
                  loadData:listAll, //请求数据的方法
                  valField:'code',
                  rootCode:'420000',//待改成用户的地区信息
                }
              }]}
              />
          </Card>
      </div>
      <div className='h-full md:min-w-3/4'>
           <Card title='用户列表'
              headerLine={false}
              bordered={false} className='h-full'>
             <TablePage
                req={{...formData,area:removeEnds0(formData.area||'')}} //去除字符串结尾的0
                entityName='sysUser'
                editModel={
                  {
                    name:'sysUser',
                    hideCols:['password'],
                    requiredCols:['username','name','sysGroupId']
                    
                  }} 
                hideColumns={['createDate','password','modifyDate','status','id','createId','modifyId']}
                // hideColumns={['createDate','modifyDate']}
                listModel='sysUser'
                viewModel='sysUser'
                select_more={true}
                customBtns={customBtns}
                />
          </Card>
      </div> 
    </div>
  )
  }


