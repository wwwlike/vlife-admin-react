/**
 * 多对多选择组件
 */
import { findName } from "@src/api/base/baseService";
import { DataType } from "@src/dsl/schema/base";
import { VfBaseProps } from "@src/dsl/schema/component";
import { useEffect, useState } from "react";
import RelationTagInput from "./RelationTagInput";

interface ManySelectProps extends VfBaseProps<any[], null> {
  fkTypeName: string; //外键模型名称
}
/**
 * @returns 多对多选择
 * 1. 选择后可以排序sort(设计的多对多表可能没有该字段)
 * 2.
 */
const ManySelect = ({
  read,
  value,
  fkTypeName,
  onDataChange,
  ...props
}: ManySelectProps) => {
  const [many, setMany] = useState<any[]>();

  useEffect(() => {
    if (value && value.length > 0 && fkTypeName) {
      findName({
        ids: value.map((v) => v[fkTypeName + "Id"]),
        entityType: fkTypeName,
      }).then((d) => {
        setMany(d.data || []);
      });
    } else {
      setMany([]);
    }
  }, [value, fkTypeName]);

  return (
    many && (
      <RelationTagInput
        value={many.map((m) => m.id)}
        datas={many}
        fieldInfo={{
          entityType: fkTypeName,
          dataType: DataType.array,
        }}
        read={read}
        onDataChange={(ids: any) => {
          // 准备返回的数据
          // const existData = value ? [...value] : [];
          //之前选择的
          // const existIds: string[] = value
          //   ? value.map((v) => {
          //       return v[fkTypeName + "Id"];
          //     })
          //   : [];
          if (ids.length === 0) {
            onDataChange([]); //没有选择数据
          } else {
            const entityFieldName = fkTypeName + "Id";
            const datas = ids.map((id: string, index: number) => {
              return { [entityFieldName]: id, sort: index + 1 };
            });
            //之前为空
            if (value === null || value === undefined || value.length === 0) {
              onDataChange(datas);
            } else {
              onDataChange(
                datas.map((d: any) => {
                  const existObj = value.filter(
                    (v) => v[entityFieldName] === d[entityFieldName]
                  );
                  if (existObj && existObj.length > 0) {
                    return existObj[0];
                  } else {
                    return d;
                  }
                })
              );
            }
          }
          // alert(JSON.stringify(d));
        }}
      />
    )
  );
};
export default ManySelect;
