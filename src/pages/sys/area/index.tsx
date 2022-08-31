import React, { useState } from 'react';
import { Card } from '@douyinfe/semi-ui';
import FormPage from '@src/pages/common/formPage';
import TablePage from '@src/pages/common/tablePage';

 export default ()=>{
  const [formData,setFormData]=useState<any>();
  return (
    <div className='h-full overscroll-auto'>
    <div  className='h-full w-72 float-left ' >
          <Card  title='地区管理'  bordered={true} className='h-full' headerLine={false} headerStyle={{fontSize:'small'}}>
            <FormPage 
            type='queryForm' 
            maxColumns={[1,1,1]} 
            formData={formData} 
            onDataChange={setFormData} 
            entityName='sysArea'  
            modelName='sysAreaPageReq'
             />
          </Card>
      </div>
      <div className='h-full md:min-w-3/4'>
           <Card title='地区列表'
              headerLine={false}
              bordered={false} className='h-full'>
             <TablePage
                req={formData}
                entityName='sysArea' 
                hideColumns={['createDate','modifyDate','sysRoleId','status','createId','modifyId']}
                select_more={true}
                />
          </Card>
      </div> 
    </div>
  )
  }


