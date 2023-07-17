import { ImagePreview } from "@douyinfe/semi-ui";
import { BankImgData, imgs } from "@src/api/bank/BankImgData";
import { useAuth } from "@src/context/auth-context";
import Content from "@src/pages/template/content";
import React, { useCallback, useState } from "react";
const apiUrl = import.meta.env.VITE_APP_API_URL;

function getFirstAndLastDayOfMonth(): { firstDay: Date; lastDay: Date } {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return { firstDay, lastDay };
}

const { firstDay, lastDay } = getFirstAndLastDayOfMonth();

export default () => {
  const { user } = useAuth();
  const [srcList, setSrcList] = useState<string[]>([]);
  const [visible2, setVisible2] = useState(false);
  const visibleChange2 = useCallback((v: boolean) => {
    setVisible2(v);
  }, []);

  const onButton2Click = useCallback((data: any) => {
    imgs(data.id).then((d) => {
      setSrcList(
        d.data?.map(
          (dd: any[]) => `${apiUrl}/bankBatch/image/${user?.id}/${dd[2]}`
        ) || []
      );
    });
    setVisible2(true);
  }, []);
  return (
    <>
      <Content<BankImgData>
        title="影像"
        req={{
          occurTime: [firstDay, lastDay],
          bankBatch_sysDeptId: user?.sysDeptId,
          amount: [0, 9999999],
        }}
        read={true}
        entityType="bankImgData"
        listType="bankImgDataVo"
        filterType="bankImgDataPageReq"
        btnHide={true}
        onLineClick={(selected) => onButton2Click(selected)}
        showOrder={false}
      ></Content>
      <ImagePreview
        src={srcList}
        visible={visible2}
        onVisibleChange={visibleChange2}
      />
    </>
  );
};
