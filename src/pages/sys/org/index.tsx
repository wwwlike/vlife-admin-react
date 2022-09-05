import React, { useState } from 'react';
import { Card } from '@douyinfe/semi-ui';
import FormPage from '@src/pages/common/formPage';
import TablePage from '@src/pages/common/tablePage';
import { listAll } from '@src/mvc/SysArea';
 export default ()=>{
  const [formData,setFormData]=useState<any>();
  return (
    <div className='h-full overscroll-auto'>
    <div  className='h-full w-72 float-left ' >
          <Card  title='机构管理'  bordered={true} className='h-full' headerLine={false} headerStyle={{fontSize:'small'}}>
            <FormPage 
            type='queryForm' 
            maxColumns={[1,1,1]} 
            formData={formData} 
            onDataChange={setFormData} 
            entityName='sysOrg'  
            modelName='sysOrgPageReq'
            fieldsCover={[
              {
              dataIndex:'sysAreaId',//字段
              component:'TreeQuery',//组件替换
              props:{ //组件需要的属性
                loadData:listAll, //请求数据的方法
                valField:'id',
                rootCode:'420000',//待改成用户的地区信息
              }
            }]}

             />
          </Card>
      </div>
      <div className='h-full md:min-w-3/4'>
           <Card title='机构列表'
              headerLine={false}
              bordered={false} className='h-full'>
             <TablePage
                req={formData}
                entityName='sysOrg' 
                hideColumns={['createDate','modifyDate','sysRoleId','status','createId','modifyId']}
                select_more={true}
                />
          </Card>
      </div> 
    </div>
  )
  }


