import { connect,mapProps,  mapReadPretty,} from '@formily/react'
import { getTreeData } from './utils';
import { Cascader,TreeSelect} from '@formily/semi';


export default connect(
  TreeSelect,
    mapProps(
      // {
      //   required: true,
      //   validateStatus: true,
      // },
      (props, field:any) => {
        console.log("datas",field['componentProps'])

        const datas=field['componentProps'][field.props.name].datas;
      return {
           autoAdjustOverflow:true,
           ...props,//组件上的属性
           style:{ width: '100%' },
           changeOnSelect:true,
           //只管显示的值
          //  displayRender:(selected:[]) => selected[selected.length-1],
          ...field['componentProps'][field.props.name],
          treeData:datas&&datas.length>0?getTreeData(datas,null):[],            //该字段上上fieldCover解构开
            // onChange(values:[]) {
            //    field.value=values[values.length-1];
            // }
            // onSelect(selectedKeys, selected, selectedNode) {
            //   field.value=selectedKeys;
            // }
        }
      }
      ), mapReadPretty((d:any) => <>{d.props.datas.filter((dd:any)=>dd.code===d.value)[0].name}</>),
  )

