/**
 * evnet事件响应列表index页面
 */

import { Modal } from "@douyinfe/semi-ui";
import { FormVo } from "@src/mvc/model/Form";
import { FormEventDto, saveFormEventDto } from "@src/mvc/model/FormEvent";
import TablePage from "@src/pages/common/tablePage";
import { useDetail } from "@src/provider/baseProvider";
import React, { useState } from "react";
import Event from "./event";
interface eventPageProp {
  currModel: FormVo;
}
export default ({ currModel }: eventPageProp) => {
  const { runAsync: getDetail } = useDetail({ entityName: "formEvent" });
  const [modalState, setModelState] = useState<boolean>(false);
  const [data, setData] = useState<Partial<FormEventDto>>();

  function cancel() {
    setModelState(false);
  }
  return (
    <div>
      <Modal
        title="事件响应"
        visible={modalState}
        onOk={() => {
          saveFormEventDto(data as FormEventDto).then((data) => {
            cancel();
          });
        }}
        onCancel={cancel}
        centered
        width={1000}
        bodyStyle={{ overflow: "auto" }}
      >
        <Event
          dto={data}
          model={currModel}
          onValueChange={(changeData) => {
            setData({ ...changeData });
          }}
        />
      </Modal>
      <TablePage
        req={{ formId: currModel.id }} //查询条件
        entityName="formEvent"
        listModel="formEvent"
        btnEnable={{
          edit: false,
          add: false,
          rm: true,
          batchRm: true,
          view: false,
        }} //table的按钮都不要
        showColumns={["name"]} //只显示的字段,
        customBtns={[
          {
            click: (btn, datas) => {
              setData(undefined);
              setModelState(true);
            },
            title: "新增",
            tableBtn: true,
            key: "formEvent:save:formEventDto",
          },
          {
            click: (btn, datas) => {
              getDetail(datas.id, "formEventDto").then((data) => {
                setData(data.data);
                setModelState(true);
              });
            },
            title: "编辑",
            tableBtn: false,
            key: "formEvent:save:formEventDto",
          },
        ]}
        editModel="formEventDto"
        select_more={true}
      />
    </div>
  );
};
