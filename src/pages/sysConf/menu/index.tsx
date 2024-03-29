import React from "react";
import { SysMenu } from "@src/api/SysMenu";
import Content from "../../template/content";
import { Field, Form } from "@formily/core";
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
        app: (field: Field, form: Form, formVo: FormVo) => {
          const display = form.getValuesIn("app") ? "hide" : "visible";
          const display2 = form.getValuesIn("app") ? "visible" : "bide";
          field.query("url").take()?.setDisplay(display);
          field.query("entityType").take()?.setDisplay(display);
          field.query("placeholderUrl").take()?.setDisplay(display);
          field.query("pcode").take()?.setDisplay(display);
          field.query("entityPrefix").take()?.setDisplay(display2);
        },
      }}
    />
  );
};
