/**
 * 组件属性设置
 */
import { Collapse } from "@douyinfe/semi-ui";
import { PageComponentDto } from "@src/mvc/PageComponent";
import {
  PageComponentProp,
  PageComponentPropDto,
} from "@src/mvc/PageComponentProp";
import { useUpdateEffect } from "ahooks";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ComponentArrayPropSetting from "./ComponentArrayPropSetting";
import { ComponentInfo, PropInfo } from "./componentData";
import ComponentObjectPropSetting from "./ComponentObjectPropSetting";
import ComponentPropSetting from "./ComponentPropSetting";

interface CompontentSettingProps {
  /** 组件定义信息 */
  componentInfo: ComponentInfo;
  /** 组件属性db配置信息 */
  settings: PageComponentDto;
  onDataChange: (comp: PageComponentDto) => void;
}

const PropsSetting = ({
  componentInfo,
  settings,
  onDataChange,
}: CompontentSettingProps) => {
  const [info, setInfo] = useState<PageComponentDto>();
  // 所有非string类型的组件对象信息
  const propInfos = useMemo((): { [key: string]: PropInfo } => {
    const pp: { [key: string]: PropInfo } = {};
    if (componentInfo && componentInfo.propInfo) {
      Object.keys(componentInfo.propInfo).forEach((key) => {
        if (typeof componentInfo.propInfo[key] !== "string") {
          pp[key] = componentInfo.propInfo[key];
        }
      });
    }
    return pp;
  }, [componentInfo]);

  const replace = useCallback(
    (propName: string, propsSetting: PageComponentPropDto[]) => {
      const existOther: PageComponentProp = info.props?.filter(
        (p) => p.propName !== propName
      );

      const replaceObj: PageComponentDto = {
        ...info,
        props: [...(existOther ? existOther : []), ...propsSetting],
      };
      setInfo(replaceObj);
    },
    [info]
  );

  useEffect(() => {
    setInfo(settings);
  }, [settings.pageKey]);

  useUpdateEffect(() => {
    if (onDataChange && info) {
      onDataChange(info);
    }
  }, [info]);

  const findProp = useCallback(
    (propName: string): any => {
      if (info && info.props) {
        return info.props.filter((f) => f.propName === propName);
      }
      return undefined;
    },
    [info]
  );
  return (
    <Collapse>
      {Object.keys(propInfos).map((key) => (
        <Collapse.Panel
          header={key + propInfos[key].label}
          itemKey={"collapse" + key}
        >
          {/* 1. 简单属性(无dataSub都看做简单类型)*/}
          {propInfos[key].dataSub === undefined ? (
            <ComponentPropSetting
              propName={key}
              propInfo={propInfos[key]}
              propObj={
                findProp(key) && findProp(key).length > 0
                  ? findProp(key)[0]
                  : undefined
              }
              onDataChange={(d) => {
                // key都干掉
                // 然后把都加入进来
                // alert(JSON.stringify(d));
                replace(key, [d]);
              }}
            />
          ) : propInfos[key].dataType === Object ? (
            <div>
              <ComponentObjectPropSetting
                propName={key}
                propInfo={propInfos[key]}
                propObjs={findProp(key)}
                onDataChange={(d) => {
                  replace(key, d);
                }}
              />
            </div>
          ) : (
            <ComponentArrayPropSetting
              propName={key}
              value={findProp(key)}
              data={propInfos[key]}
              onDataChange={(d) => {
                replace(key, d);
              }}
            />
          )}
          {/* 2. 对象属性 3. 数组对象属性  */}
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};

export default PropsSetting;
