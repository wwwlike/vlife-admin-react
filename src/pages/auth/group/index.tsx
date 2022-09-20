import { Button, Card, Typography } from '@douyinfe/semi-ui';
import { listSysFilterVo } from '@src/mvc/SysGroup';
import FormPage from '@src/pages/common/formPage';
import TablePage from '@src/pages/common/tablePage';
import React, { useState} from 'react';
import { IconAlertCircle } from '@douyinfe/semi-icons';
import { useNiceModal } from '@src/store';

/**
 * 在封装一层
 * 1. entityName
 * 2. reqName
 * 3. voName
 */
export default ()=>{
  const mp4Modal = useNiceModal("mp4Modal");
  const { Text } = Typography;
  //2页面模块需要共享的查询条件状态
  //搜索条件，可以由url转换来
  const [formData,setFormData]=useState<any>({});
  const entityName="sysGroup";
  return (
    <div className='h-full overscroll-auto'>
    <div  className='h-full w-72 float-left ' >
          <Card  title='权限组管理'  bordered={true} className='h-full' headerLine={false} headerStyle={{fontSize:'small'}}>
            { <FormPage type='queryForm' 
              maxColumns={[1,1,1]} 
              formData={formData} 
              onDataChange={setFormData} //相应事件。
              entityName={entityName}  
              modelName='sysGroupPageReq' /> }
          </Card>
      </div>
      <div className='h-full md:min-w-3/4'>
           <Card title='权限组列表' 
              headerExtraContent={
                <Button type="primary" icon={<IconAlertCircle />} onClick={()=>mp4Modal.show({title:'123'})}>本节教程</Button>
              }
              headerLine={false}
              bordered={false} className='h-full'>
             <TablePage
                req={formData} //搜索条件
                entityName={entityName} 
                viewModel='sysGroupDetailVo'
                editModel='groupDto'
                customBtns={[
                    {
                      model:{
                        name:'groupFilterDto',
                        fieldsCover:[
                          {
                            dataIndex:'filterDetailIds',
                            component:'PageSelect',//固定一个范围去取
                            labelProps:{gridSpan:2},
                            props:{
                              loadData:listSysFilterVo,
                              params:['id']// 需要id去取
                            }
                          }
                        ]
                      },
                      // okFun:saveGroupFilterDto, //如不给就用baseProditer里的 save
                      title:'数据权限',
                      entityName,
                      tableBtn:false
                    }
                  ]}
                select_more={true}
               >
                </TablePage>
          </Card>
      </div> 
    </div>
  )
  }


