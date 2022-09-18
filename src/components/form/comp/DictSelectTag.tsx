import { connect,mapProps} from '@formily/react'
import { Input } from '@formily/semi';
import DictSelectTag from '@src/components/select/DictSelectTag';
import PageSelect from '@src/components/select/PageSelect';

export default connect(
  DictSelectTag,
    mapProps(
      {
        required: true,
        validateStatus: true,
      },
      (props, field:any) => {
      return {
            ...props,
            selectMore:!(field.componentProps['type']==='string'&&field.componentProps['fieldType']==='basic'),
            datas:field.dataSource,
            onSelected:(ids:(string|number|undefined)[])=>{
              field.value=(ids&&ids.length===0)?undefined:ids
           }
        }
      }
      ),
  )

