import { connect, mapProps } from "@formily/react";
import React from "react";
import RoleResourcesSelect from ".";

export default connect(
  RoleResourcesSelect,
  mapProps(
    {
      required: true,
      validateStatus: true,
    },
    (props, field: any) => {
      return {
        ...props,
        ...field["componentProps"][field.props.name],
        onChange(selectedKeys: any) {
          field.value = selectedKeys;
        },
      };
    }
  )
  // mapReadPretty(PreviewText.Input)
);
