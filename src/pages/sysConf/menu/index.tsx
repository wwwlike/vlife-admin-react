import React from "react";
import { SysMenu } from "@src/api/SysMenu";
import Content from "../../template/content";
import { Field, Form, GeneralField } from "@formily/core";
import { FormVo } from "@src/api/Form";

export default () => {
  return (
    <Content<SysMenu>
      filterType="sysMenuPageReq"
      entityType="sysMenu"
      showOrder={false}
      formEvents={{
        placeholderUrl: (field: Field, form: Form, formVo: FormVo) => {
          const url = form.getValuesIn("url");
          field.display = url && url.endsWith("*") ? "visible" : "hide";
          field.required = url && url.endsWith("*") ? true : false;
        },
        app: (field: GeneralField, form: Form, formVo: FormVo) => {
          const display = form.getValuesIn("app") ? "hide" : "visible";
          field.query("url").take()?.setDisplay(display);
          field.query("entityType").take()?.setDisplay(display);
          field.query("placeholderUrl").take()?.setDisplay(display);
          field.query("pcode").take()?.setDisplay(display);
        },
      }}
    />
  );
};
