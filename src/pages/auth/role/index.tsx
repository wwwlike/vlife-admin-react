import { Card } from '@douyinfe/semi-ui';
import FormPage from '@src/pages/common/formPage';
import TablePage from '@src/pages/common/tablePage';
import React, { useState} from 'react';
import { roleAllResources } from '@src/mvc/SysResources';
/**
 * 在封装一层
 * 1. entityName
 * 2. reqName
 * 3. voName
 */
export default ()=>{
  //2页面模块需要共享的查询条件状态
  const [pageReq,setPageReq]=useState({});
  const entityName="sysRole";
  return (
    <div className='h-full overscroll-auto'>
    <div  className='h-full w-72 float-left ' >
          <Card  title='角色管理'  bordered={true} className='h-full' headerLine={false} headerStyle={{fontSize:'small'}}>
            <FormPage type='queryForm' 
              maxColumns={[1,1,1]} 
              formData={pageReq} 
              onDataChange={setPageReq} 
              entityName={entityName}  
              modelName='sysRolePageReq' />
          </Card>
      </div>
      <div className='h-full md:min-w-3/4'>
           <Card title='角色列表(角色，权限组变更后需要重启后端应用生效)'
              headerLine={false}
              bordered={false} className='h-full'>
             <TablePage
                req={pageReq}
                entityName={entityName} 
                editModel={{
                  name:'roleDto',
                  fieldsCover:[{
                    dataIndex:'sysResources_id',
                    component:'RoleResourcesSelect',//具体的业务组件
                    labelProps:{gridSpan:1},
                    props:{
                     loadData:roleAllResources, //需要的数据，如果组件复杂，那么后端一次封装好
                     params:['id']// 需要id去取
                    }
                  }]
                }}
                // onAddCallBack={()=>getResourcesData()}
                // onEditCallBack={(id)=>getResourcesData(id)} //获取橘色所有可操作资源数据
                select_more={true}
                />
          </Card>
      </div> 
    </div>
  )
  }


