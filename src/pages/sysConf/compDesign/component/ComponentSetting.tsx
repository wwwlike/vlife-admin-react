/**
 * 组件属性设置
 */
import { Collapse } from "@douyinfe/semi-ui";
import Text from "@douyinfe/semi-ui/lib/es/typography/text";
import { FormFieldVo } from "@src/api/FormField";
import { PageComponentPropDto } from "@src/api/PageComponentProp";
import { DataType } from "@src/dsl/schema/base";
import { ComponentInfo, PropInfo } from "@src/dsl/schema/component";
import React, { useCallback, useMemo } from "react";
import ComponentArrayPropSetting from "./ComponentArrayPropSetting";
import ComponentArraySignlePropSetting from "./ComponentArraySignlePropSetting";
import ComponenetEventSetting from "./ComponentEventSetting";
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
  //page方式设置组件需要设置的属性
  children?: any;
}

const ComponentSetting = ({
  pageKey,
  componentInfo,
  pageComponentPropDtos,
  onDataChange,
  fields,
  children,
}: CompontentSettingProps) => {
  // 非固定写死的组件属性过滤
  const propInfos = useMemo((): { [key: string]: PropInfo } => {
    const propInfoObj: { [key: string]: PropInfo } = {};
    if (componentInfo && componentInfo.propInfo) {
      Object.keys(componentInfo.propInfo).forEach((key) => {
        if (
          componentInfo.propInfo &&
          typeof componentInfo.propInfo[key] === "object" &&
          (componentInfo.propInfo[key] as PropInfo).dataType !== DataType.event
        ) {
          propInfoObj[key] = componentInfo.propInfo[key] as PropInfo;
        }
      });
    }
    return propInfoObj;
  }, [componentInfo]);

  //事件类型组件属性过滤
  const eventPropInfos = useMemo((): { [key: string]: PropInfo } => {
    const propInfoObj: { [key: string]: PropInfo } = {};
    if (componentInfo && componentInfo.propInfo) {
      Object.keys(componentInfo.propInfo).forEach((key) => {
        if (
          componentInfo.propInfo &&
          componentInfo.propInfo[key] !== "string" &&
          (componentInfo.propInfo[key] as PropInfo).dataType === DataType.event
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

  function convertArrayToObject(arr: Partial<PageComponentPropDto>[]): {
    [name: string]: any;
  } {
    const newObj: { [name: string]: any } = {};
    arr.forEach((obj: Partial<PageComponentPropDto>) => {
      if (obj.propName) newObj[obj.propName] = obj.propVal;
    });
    return newObj;
  }
  return (
    <div>
      {/* 一、 组件全局设置 (page方式会使用) */}
      {children}
      {/* 顺序遍历所有组件属性 */}
      {Object.keys(propInfos).map((key) => {
        if (
          (propInfos[key].dataType !== DataType.object &&
            propInfos[key].dataType !== DataType.array) ||
          propInfos[key].sourceType === "api"
        ) {
          /* 二、 简单属性或复杂属性且有api对应的 */
          return (
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
                componentProp={convertArrayToObject(
                  pageComponentPropDtos || []
                )}
              />
            </div>
          );
        } else if (
          (propInfos[key].dataType === DataType.object ||
            propInfos[key].dataType == DataType.array) &&
          propInfos[key].sourceType !== "api"
        ) {
          return (
            <div
              key={`panel` + key}
              // itemKey={"collapse" + key}
            >
              {/* 对象属性*/}
              {propInfos[key].dataType === DataType.object &&
                propInfos[key].dataSub && (
                  <ComponentObjectPropSetting
                    pageKey={pageKey}
                    propName={key}
                    propInfo={propInfos[key]}
                    pageComponentPropDtos={findProp(key)}
                    onDataChange={(d: any) => {
                      replace(key, d);
                    }}
                    fields={fields}
                    componentProp={convertArrayToObject(
                      pageComponentPropDtos || []
                    )}
                  />
                )}
              {/* 数组对象 */}
              {propInfos[key].dataType === DataType.array &&
                propInfos[key].dataSub && (
                  <ComponentArrayPropSetting
                    pageKey={pageKey}
                    propName={key}
                    value={findProp(key)}
                    data={propInfos[key]}
                    onDataChange={(d) => {
                      replace(key, d);
                    }}
                    fields={fields}
                    componentProp={convertArrayToObject(
                      pageComponentPropDtos || []
                    )}
                  />
                )}

              {/*数组简单对象 */}
              {propInfos[key].dataType === DataType.array &&
                propInfos[key].dataSub === undefined && (
                  <ComponentArraySignlePropSetting
                    pageKey={pageKey}
                    propName={key}
                    pageComponentPropDtos={findProp(key)}
                    data={propInfos[key]}
                    onDataChange={(d: any) => {
                      replace(key, d);
                    }}
                    fields={fields}
                    componentProp={convertArrayToObject(
                      pageComponentPropDtos || []
                    )}
                  />
                )}
            </div>
          );
        }
      })}

      {/* 事件设置 */}
      {eventPropInfos && Object.keys(eventPropInfos).length > 0 && (
        <div
          key={`panel_event`}

          // itemKey={"collapse_event"}
        >
          <label>事件设置</label>

          {Object.keys(eventPropInfos).map((key) => (
            <div className="flex space-x-2 mb-2 p-2">
              <div className=" w-24">{`${eventPropInfos[key].label}(${key})`}</div>
              <ComponenetEventSetting
                key={"event_" + key}
                propInfo={eventPropInfos[key]}
                pageKey={pageKey}
                eventName={key}
                targetPropInfo={
                  eventPropInfos[key] &&
                  eventPropInfos[key].event &&
                  eventPropInfos[key].event?.propName &&
                  componentInfo &&
                  componentInfo.propInfo &&
                  typeof componentInfo.propInfo !== "string"
                    ? (componentInfo.propInfo[
                        eventPropInfos[key].event?.propName || ""
                      ] as PropInfo)
                    : undefined
                }
                propObj={
                  findProp(key) && findProp(key).length > 0
                    ? findProp(key)[0]
                    : undefined
                }
                onDataChange={(d: Partial<PageComponentPropDto>) => {
                  replace(key, [d]);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComponentSetting;
