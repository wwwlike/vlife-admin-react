/**
 * 数组类型属性设置
 */
import { Button, TabPane, Tabs } from "@douyinfe/semi-ui";
import { PageComponentProp } from "@src/mvc/PageComponentProp";
import { useUpdateEffect } from "ahooks";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PropInfo } from "./componentData";
import ComponentObjectPropSetting from "./ComponentObjectPropSetting";

interface ArrayPropSettingProps {
  /** 属性名称 */
  propName: string;
  /** 属性定义信息 */
  data: PropInfo;
  /** 属性录入信息 */
  value?: PageComponentProp[];
  /** 属性值改变 */
  onDataChange: (propObj: PageComponentProp[]) => void;
}

const ComponentArrayPropSetting = ({
  propName,
  data,
  value,
  onDataChange,
}: ArrayPropSettingProps) => {
  /**
   * 数据数据
   */
  const [array, setArray] = useState<Partial<PageComponentProp[]>>(value);
  //存放listNo的序号数组

  const [num, setNum] = useState<number[]>([]);

  const remove = useCallback(() => {
    const lastNo = num[num.length - 1];
    setNum([...num.slice(0, num.length - 1)]);
    setArray(array.filter((a) => a?.listNo !== lastNo));
  }, [array, num]);

  useEffect(() => {
    const s: Set<number> = new Set(value?.map((v) => v.listNo));
    const t: number[] = [...s];
    setNum(t.sort((a, b) => a - b));
  }, [value]);

  const replace = useCallback(
    (listNo: number, propsSetting: PageComponentProp[]) => {
      //本次之外的属性值
      const existOther: PageComponentProp[] = array
        ? array.filter((p) => {
            const flag = p?.listNo !== listNo;
            return flag;
          })
        : undefined;

      const replaceObj: PageComponentDto[] = [
        ...(existOther ? existOther : []),
        ...propsSetting,
      ];

      setArray(replaceObj);
    },
    [array]
  );

  useUpdateEffect(() => {
    if (onDataChange && array) {
      onDataChange(array);
    }
  }, [array]);

  // const add = useCallback(() => {
  //   array.push;
  // }, [array]);

  return (
    <Tabs
      defaultActiveKey="1"
      tabBarExtraContent={
        <>
          <Button
            onClick={() =>
              num.length > 0 ? setNum([...num, num.length + 1]) : setNum([1])
            }
          >
            +
          </Button>
          {num.length > 0 ? <Button onClick={remove}>-</Button> : ""}
        </>
      }
    >
      {num.map((n, index) => {
        return (
          <TabPane
            key={propName + "tab" + n}
            tab={"第" + (index + 1) + "组"}
            itemKey={"1" + n}
          >
            <ComponentObjectPropSetting
              propName={propName}
              propInfo={data}
              listNo={n}
              propObjs={array?.filter((a) => a?.listNo === n)}
              onDataChange={(d) => {
                replace(n, d);
              }}
            />
          </TabPane>
        );
      })}
    </Tabs>
  );
};

export default ComponentArrayPropSetting;
