import { Modal, Space, TagInput } from "@douyinfe/semi-ui";
import { FormFieldVo } from "@src/mvc/model/FormField";
import TablePage from "@src/pages/common/tablePage";
import { useUpdateEffect } from "ahooks";
import { useEffect, useState } from "react";
import { VfBaseProps, VfRelation, VfType } from "..";
import { find } from "@src/provider/baseProvider";
interface RelationInputProps
  extends VfBaseProps<string | string[], VfRelation[]> {}

// 从path里取下划线最后一个单词然后干掉Id结尾剩下的就是 实际字段对应的entityName
function realEntityName(path: string): string {
  const paths = path.split("_");
  return paths[paths.length - 1].substring(
    0,
    paths[paths.length - 1].length - 2
  );
}

function queryData(
  value: string[],
  f: FormFieldVo
): Promise<VfRelation[] | undefined> {
  return find(
    f.entityFieldName.endsWith("Id")
      ? f.entityFieldName.substring(0, f.entityFieldName.length - 2) //字段是ID结尾则去掉ID提取entityName
      : f.entityType, //非id结尾直接使用entityType
    "id",
    value
  ).then((data) => {
    return data.data;
  });
}
/**
 * 外键关系的tagInput组件
 */
const RelationTagInput = ({
  datas, //选中的数据，已经将value里封装在里面了
  fieldInfo,
  read,
  value,
  onDataChange,
}: RelationInputProps) => {
  // tag里最新的数据
  const [tagData, setTagData] = useState<VfRelation[]>([]);

  useEffect(() => {
    if (value) {
      queryData(typeof value === "string" ? [value] : value, fieldInfo).then(
        (d) => {
          if (d) setTagData(d);
        }
      );
    } else {
      setTagData([]);
    }
  }, []);

  /**
   * 列表选中的数据
   */
  const [tableSelectData, setTableSelectData] = useState<VfRelation[]>();

  useUpdateEffect(() => {
    onDataChange(tagData.map((d) => d.id));
  }, [tagData]);

  const [modalState, setModalState] = useState(false);

  return read ? (
    <Space>
      {tagData?.map((d) => {
        return <div className="formily-semi-text">{d.name}</div>;
      })}
    </Space>
  ) : (
    <>
      <Modal
        title="关联选择"
        visible={modalState}
        onOk={() => {
          setModalState(false);
          setTagData([...(tableSelectData ? tableSelectData : [])]);
          // onDataChange(tagData.map((d) => d.id));
        }}
        centered
        onCancel={() => {
          setModalState(false);
        }}
        width={900}
      >
        <TablePage
          entityName={realEntityName(fieldInfo.pathName)}
          selected={tagData}
          onSelected={(data) => {
            setTableSelectData(data);
          }} //table的选择事件
          btnEnable={{ disable: true }}
          select_more={fieldInfo.fieldType === VfType.ARRAY ? true : false}
          select_show_field={"name"}
        ></TablePage>
      </Modal>
      <>
        {/* {JSON.stringify(value)} */}
        <TagInput
          // showClear
          placeholder={fieldInfo.title}
          value={tagData?.map((m) => m.name)}
          defaultValue={tagData?.map((m) => m?.id)}
          onFocus={() => setModalState(true)}
          onRemove={(v, i) => {
            const obj = [
              ...tagData.filter((d, index) => {
                return i !== index;
              }),
            ];
            // alert(obj.length);
            setTagData([...obj]);
          }}
        />
      </>
    </>
  );
};
export default RelationTagInput;
