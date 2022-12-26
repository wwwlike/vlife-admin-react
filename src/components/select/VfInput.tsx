import React from "react";
import { useNiceModal } from "@src/store";
import { useSelector } from "react-redux";
import { VfBaseProps } from "..";
import { TagInput } from "@douyinfe/semi-ui";

interface RelationDatas {
  id: string;
  name: string;
}

/**
 * input属性
 */
interface RelationSelectProps extends VfBaseProps<string, RelationDatas[]> {
  /**
   * 多选标志
   */
  selectMore?: boolean;
  /**
   * table里选中的值
   */
  valField: string;
  onFocus: (datas: RelationDatas[]) => void;
}

/**
 * 关系选择组件
 */
const RelationSelect: React.FC<RelationSelectProps> = ({
  selectMore,
  onDataChange,
  datas,
  ...prop
}) => {
  //待弹出列表
  const { show, hide, activeModalId, showAsSub, hideAndOpenParent } =
    useNiceModal("tableModal");
  //上一个modal的参数
  const args = useSelector((state: any) => state[activeModalId]);
  //全局store
  const gloable = useSelector((state) => state);
  //写成useCallback不在modal时会不弹出来

  return (
    <TagInput
      showClear
      value={datas?.map((m) => m.name)}
      defaultValue={datas?.map((m) => m?.id)}
    />
  );
  return <div>{prop.valField}</div>;
};

export default RelationSelect;
