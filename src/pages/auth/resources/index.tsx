import { Card } from '@douyinfe/semi-ui';
import { reactions } from '@src/components/form';
import FormPage from '@src/pages/common/formPage';
import TablePage from '@src/pages/common/tablePage';
import { listAll } from '@src/mvc/SysResources';
import React, { useMemo, useState} from 'react';


/**
 * 在封装一层
 * 1. entityName
 * 2. reqName
 * 3. voName
 */
export default ()=>{
  //2页面模块需要共享的查询条件状态
  const [formData,setFormData]=useState<any>();
  const reactions=useMemo(():Map<string,reactions>=>{
    const map=new Map<string,reactions>();
    map.set('resourcesCode',{
      dependencies:['.url'],
      when:'{{$deps[0]}}',
      fulfill:{
        state:{
          value:'{{($deps[0].startsWith("/")?$deps[0].substring(1):$deps[0]).split("/").join(":")}}',
        }
      }
    })
    map.set('menuCode',{
      dependencies:['.url'],
      when:'{{$deps[0]}}',
      fulfill:{
        state:{
          value:'{{$deps[0].split("/")[1]}}',
        }
      }
    })
    return map;
  },[])
  
  return (
    <div className='h-full overscroll-auto'>
    <div  className='h-full w-72 float-left ' >
          <Card  title='资源管理'  bordered={true} className='h-full' headerLine={false} headerStyle={{fontSize:'small'}}>
            <FormPage 
            type='queryForm' 
            maxColumns={[1,1,1]} 
            formData={formData} 
            onDataChange={setFormData} 
            entityName='sysResources'  
            modelName='sysResourcesPageReq'
             />
            {/* <Search paramName='search' params={pageReq} setParams={setPageReq} pageInit="pager.page"/> */}
            {/* <div> {JSON.stringify(formData)} </div>  */}
          </Card>
      </div>
      <div className='h-full md:min-w-3/4'>
           <Card title='资源列表'
              headerLine={false}
              bordered={false} className='h-full'>
             <TablePage
                req={formData}
                entityName='sysResources' 
                editModel={
                  {
                  name:'sysResources',
                  fieldsCover:[
                    {
                      dataIndex:'resourcesPcode',
                      component:'TabSelect',//固定一个范围去取
                      props:{
                        loadData:listAll,
                    
                      }
                    
                    },
                  ],
                  reactions //级联关系数据,应该整合到fieldsCover里
                  ,requiredCols:['resourcesCode','name','type']//必填字段,应该整合到fieldsCover里
                }}
                hideColumns={['createDate','modifyDate','sysRoleId','status','createId','modifyId']}
                select_more={true}
                />
          </Card>
      </div> 
    </div>
  )
  }


