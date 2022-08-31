import { Input } from '@douyinfe/semi-ui'
import { connect,mapProps,mapReadPretty,Field, observer } from '@formily/react'
import TabSelect from '@src/components/select/TabSelect'
import TreeQuery from '@src/components/tree/TreeQuery';
import { useCallback } from 'react';

export default connect(
    TreeQuery,
    mapProps(
      {
        required: true,
        validateStatus: true,
      },
      (props, field:any) => {
      return {
            ...props,
            ...field['componentProps'][field.props.name],
            onSelect(selectedKeys, selected, selectedNode) {
              field.value=selectedKeys;
            }
        }
      }
      ),
    // mapReadPretty(PreviewText.Input)
  )

