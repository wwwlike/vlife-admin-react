import React, { useState } from 'react';
import { Card } from '@douyinfe/semi-ui';
import FormPage from '@src/pages/common/formPage';
import TablePage from '@src/pages/common/tablePage';
import { listAll } from '@src/mvc/SysArea';
import { useAuth } from '@src/context/auth-context';


 export default ()=>{
  const [formData,setFormData]=useState<any>();
  const {user}= useAuth();
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
            fieldsCover={[
              {
                dataIndex:'code',
                component:'TreeQuery',
                props: {
                  loadData: listAll, //异步取数据的方法
                  valField:'code',
                  // rootCode:user?.codeArea,
                }
              }
            ]}    
             />
             {JSON.stringify(formData)}
          </Card>
      </div>
      <div className='h-full md:min-w-3/4'>
           <Card title='地区列表'
              headerLine={false}
              bordered={false} className='h-full'>
             <TablePage
                req={formData}
                entityName='sysArea' 
                editModel ={{
                  name:'sysArea',
                  fieldsCover:[
                    {
                      dataIndex:'pcode',
                      component:'TreeSelect',
                      props: {
                         loadData: listAll //异步取数据的方法
                        // // any各组件独有的属性
                        // datas?: any[]; //元素单个加载时候给的数据
                        // syscParams?: string[]; //异步的参数名称集合
                        // syncDatas?: (obj: any) => Promise<Result<any>>; //组件提取时给的数据
                      } //
                    
                    }
                  ]
                }} 
                hideColumns={['createDate','modifyDate','sysRoleId','status','createId','modifyId']}
                select_more={true}
                />
          </Card>
      </div> 
    </div>
  )
  }


