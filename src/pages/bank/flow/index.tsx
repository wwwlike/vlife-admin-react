import { ImagePreview } from "@douyinfe/semi-ui";
import { BankFlow } from "@src/api/bank/BankFlow";
import Content from "@src/pages/template/content";
import React, { useCallback, useMemo, useState } from "react";

export default () => {
  const srcList = useMemo(
    () => [
      "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/abstract.jpg",
      "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/sky.jpg",
      "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/greenleaf.jpg",
      "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/colorful.jpg",
    ],
    []
  );
  const [visible2, setVisible2] = useState(false);
  const visibleChange2 = useCallback((v: boolean) => {
    setVisible2(v);
  }, []);

  const onButton2Click = useCallback((v: boolean) => {
    setVisible2(true);
  }, []);
  return (
    <>
      <Content<BankFlow>
        entityType="bankFlow"
        filterType="bankFlowPageReq"
        onLineClick={() => onButton2Click(true)}
        btnHide={true}
        showOrder={false}
        column={[
          "name",
          "certCode",
          "account",
          "txCode",
          "amount",
          "subjectName",
          "occurDate",
          "sysUserId",
          "sysDeptId",
        ]}
      ></Content>
      <ImagePreview
        src={srcList}
        visible={visible2}
        onVisibleChange={visibleChange2}
      />
    </>
  );
};
