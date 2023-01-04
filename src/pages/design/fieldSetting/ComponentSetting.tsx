/**
 * 组件属性设置
 */
import { Button, Collapse } from "@douyinfe/semi-ui";
import Text from "@douyinfe/semi-ui/lib/es/typography/text";
import { FormFieldVo } from "@src/mvc/model/FormField";
import { PageComponentPropDto } from "@src/mvc/PageComponentProp";
import React, { useCallback, useMemo } from "react";
import ComponentArrayPropSetting from "./ComponentArrayPropSetting";
import ComponentArraySignlePropSetting from "./ComponentArraySignlePropSetting";
import { ComponentInfo, dataType, PropInfo } from "./componentData";
import ComponentObjectPropSetting from "./ComponentObjectPropSetting";
import ComponentPropSetting from "./ComponentPropSetting";

interface CompontentSettingProps {
  pageKey: string;
  /** 组件定义信息 */
  componentInfo: ComponentInfo;
  /** 组件属性db配置信息 */
  // pageComponentDto: PageComponentDto;
  pageComponentPropDtos: Partial<PageComponentPropDto>[] | undefined;
  onDataChange: (
    pageComponentPropDtos: Partial<PageComponentPropDto>[]
  ) => void;
  fields?: FormFieldVo[];
}

const PropsSetting = ({
  pageKey,
  componentInfo,
  pageComponentPropDtos,
  onDataChange,
  fields,
}: CompontentSettingProps) => {
  // 非string类型的组件对象信息
  const propInfos = useMemo((): { [key: string]: PropInfo } => {
    const propInfoObj: { [key: string]: PropInfo } = {};
    if (componentInfo && componentInfo.propInfo) {
      Object.keys(componentInfo.propInfo).forEach((key) => {
        if (
          componentInfo.propInfo &&
          typeof componentInfo.propInfo[key] !== "string"
        ) {
          propInfoObj[key] = componentInfo.propInfo[key] as PropInfo;
        }
      });
    }
    return propInfoObj;
  }, [componentInfo]);

  const replace = useCallback(
    (propName: string, propsSetting: Partial<PageComponentPropDto>[]) => {
      if (pageComponentPropDtos) {
        const existOther: Partial<PageComponentPropDto>[] =
          pageComponentPropDtos.filter((p) => p.propName !== propName);
        const replaceObj: Partial<PageComponentPropDto>[] = [
          ...(existOther ? existOther : []),
          ...propsSetting,
        ];

        onDataChange([...replaceObj]);
      } else {
        onDataChange([...propsSetting]);
      }
    },
    [{ ...pageComponentPropDtos }] //数组必须这样才能监听的到
  );
  const findProp = useCallback(
    (propName: string): any => {
      if (pageComponentPropDtos) {
        return pageComponentPropDtos.filter((f) => f.propName === propName);
      }
      return undefined;
    },
    [pageComponentPropDtos]
  );

  return (
    <div>
      {/* 一、 简单属性，一行一个 */}
      {Object.keys(propInfos)
        .filter(
          (key) =>
            propInfos[key].dataType !== dataType.object &&
            propInfos[key].dataType !== dataType.list
        )
        .map((key) => (
          <div key={"div_" + key}>
            <ComponentPropSetting
              key={"componentProp_" + key}
              pageKey={pageKey}
              propName={key}
              propInfo={propInfos[key]}
              propObj={
                findProp(key) && findProp(key).length > 0
                  ? findProp(key)[0]
                  : undefined
              }
              onDataChange={(d: Partial<PageComponentPropDto>) => {
                replace(key, [d]);
              }}
              fields={fields}
            />
          </div>
        ))}
      <Collapse>
        {Object.keys(propInfos)
          .filter(
            (key) =>
              propInfos[key].dataType === dataType.object ||
              propInfos[key].dataType == dataType.list
          )
          .map((key) => (
            <Collapse.Panel
              key={`panel` + key}
              header={key + propInfos[key].label}
              itemKey={"collapse" + key}
            >
              {/* 对象属性*/}
              {propInfos[key].dataType === dataType.object &&
              propInfos[key].dataSub ? (
                <div>
                  <ComponentObjectPropSetting
                    pageKey={pageKey}
                    propName={key}
                    propInfo={propInfos[key]}
                    pageComponentPropDtos={findProp(key)}
                    onDataChange={(d) => {
                      replace(key, d);
                    }}
                    fields={fields}
                  />
                </div>
              ) : propInfos[key].dataType === dataType.list &&
                propInfos[key].dataSub ? ( //数组对象
                <ComponentArrayPropSetting
                  pageKey={pageKey}
                  propName={key}
                  value={findProp(key)}
                  data={propInfos[key]}
                  onDataChange={(d) => {
                    replace(key, d);
                  }}
                  fields={fields}
                />
              ) : propInfos[key].dataType === dataType.list &&
                propInfos[key].dataSub === undefined ? ( // 数组简单对象
                <ComponentArraySignlePropSetting
                  pageKey={pageKey}
                  propName={key}
                  pageComponentPropDtos={findProp(key)}
                  data={propInfos[key]}
                  onDataChange={(d) => {
                    replace(key, d);
                  }}
                  fields={fields}
                />
              ) : (
                <Text className="text-red-400" strong>
                  组件配置信息有误，请检查
                </Text>
              )}
              {/* 2. 对象属性 3. 数组对象属性  */}
            </Collapse.Panel>
          ))}
      </Collapse>
    </div>
  );
};

export default PropsSetting;
