import { connect, mapProps } from "@formily/react";
import RelationSelect from "@src/components/select/RelationSelect";

export default connect(
  RelationSelect,
  mapProps(
    {
      required: true,
      validateStatus: true,
    },
    (props, field: any) => {
      return {
        ...props,
        ...field["componentProps"][field.props.name], //prop放入进来
        // onSelect(selectedKeys, selected, selectedNode) {
        //   field.value = selectedKeys;
        // },
      };
    }
  )
  // mapReadPretty(PreviewText.Input)
);
