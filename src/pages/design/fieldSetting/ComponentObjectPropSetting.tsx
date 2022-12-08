/**
 * 对象类型属性设置
 */
import { Divider } from "@douyinfe/semi-ui";
import { PageComponentDto } from "@src/mvc/PageComponent";
import { PageComponentProp } from "@src/mvc/PageComponentProp";
import { useUpdateEffect } from "ahooks";
import React, { useCallback, useMemo, useState } from "react";
import { PropInfo } from "./componentData";
import ComponentPropSetting from "./ComponentPropSetting";

interface ObjectPropSettingProps {
  propName: string;
  /** 属性定义信息 */
  propInfo: PropInfo;

  listNo?: number;
  /** 对象属性录入信息 */
  propObjs?: PageComponentProp[];
  onDataChange: (propObj: PageComponentProp[]) => void;
}

const ComponentObjectPropSetting = ({
  propName,
  propInfo,
  listNo,
  propObjs,
  onDataChange,
}: ObjectPropSettingProps) => {
  //对象的所有属性数据信息
  const [info, setInfo] = useState<Partial<PageComponentProp>[]>(propObjs);

  // 所有非string类型的组件对象信息
  const propInfos = useMemo((): { [key: string]: PropInfo } => {
    const pp: { [key: string]: PropInfo } = {};
    if (propInfo.dataSub) {
      Object.keys(propInfo.dataSub).forEach((key) => {
        if (typeof propInfo.dataSub[key] !== "string") {
          pp[key] = propInfo.dataSub[key];
        }
      });
    }
    return pp;
  }, [info]);

  const replace = useCallback(
    (propName: string, subName: string, propsSetting: PageComponentProp) => {
      //本次之外的属性值
      const existOther: PageComponentProp[] = info
        ? info.filter((p) => p.propName === propName && p.subName !== subName)
        : undefined;
      const replaceObj: PageComponentDto[] = [
        ...(existOther ? existOther : []),
        propsSetting,
      ];

      setInfo(replaceObj);
    },
    [info]
  );

  useUpdateEffect(() => {
    if (onDataChange && info) {
      onDataChange(info);
    }
  }, [info]);

  return (
    <div>
      {Object.keys(propInfos).map((key) => (
        <>
          <ComponentPropSetting
            key={propName + key}
            title={propInfos[key].label}
            propName={propName}
            subName={key}
            listNo={listNo}
            propInfo={propInfos[key]}
            propObj={
              info && info.filter((f) => f.subName === key)
                ? info.filter((f) => f.subName === key)[0]
                : undefined
            }
            onDataChange={(d) => {
              // alert(JSON.stringify(d));
              replace(propName, key, d);
            }}
          />
        </>
      ))}
    </div>
  );
};

export default ComponentObjectPropSetting;
