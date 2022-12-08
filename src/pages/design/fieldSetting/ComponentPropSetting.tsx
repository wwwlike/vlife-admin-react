/**
 * 组件属性设置
 */
import {
  Input,
  Select,
  Typography,
  Dropdown,
  Button,
  Card,
} from "@douyinfe/semi-ui";
import Label from "@douyinfe/semi-ui/lib/es/form/label";
import Title from "@douyinfe/semi-ui/lib/es/typography/title";
import {
  PageComponentProp,
  PageComponentPropDto,
} from "@src/mvc/PageComponentProp";
import { isBasic } from "@src/utils/utils";
import {
  IconHome,
  IconBox,
  IconCalendar,
  IconUserGroup,
  IconSearch,
  IconUserAdd,
  IconPhone,
  IconAlertCircle,
} from "@douyinfe/semi-icons";
import { useUpdateEffect } from "ahooks";
import React, { useMemo, useState } from "react";
import { ApiInfo, ApiProp } from "./apiData";
import ApiParamSetting from "./ApiParamSetting";
import { PropInfo } from "./componentData";
import SelectIcon from "@src/components/vlifeComponent/SelectIcon";

const { Text } = Typography;
interface PropSettingProps {
  /** 属性名称 */
  title?: string;
  /** 属性 */
  propName: string;
  /** 子属性 */
  subName?: string;
  /** 所在数组序号 */
  listNo?: number;
  /** 属性定义信息 */
  propInfo: PropInfo;
  /** 属性录入信息 */
  propObj?: PageComponentPropDto;
  onDataChange: (propObj: PageComponentPropDto) => void;
}

const ComponentPropSetting = ({
  title,
  propName,
  subName,
  listNo,
  propInfo,
  propObj,
  onDataChange,
}: PropSettingProps) => {
  const sourceTypes = useMemo((): any[] => {
    if (isBasic(propInfo.dataType)) {
      return [
        { label: "常量值", value: "fixed" },
        { label: "接口取值", value: "api" },
      ];
    } else {
      return [{ label: "接口取值", value: "api" }];
    }
  }, [propInfo]);
  const [info, setInfo] = useState<Partial<PageComponentPropDto>>(
    propObj
      ? propObj
      : { propName, subName, listNo, sourceType: sourceTypes[0].value }
  );
  useUpdateEffect(() => {
    if (onDataChange && info) {
      onDataChange(info);
    }
  }, [info]);

  return (
    <div>
      <div className="flex space-x-1 mb-2">
        <Title heading={6} className=" w-20">
          {title ? title : "取值方式"}:
        </Title>
        <Select
          className=" w-32"
          optionList={sourceTypes}
          value={info.sourceType}
          onChange={(v) => {
            setInfo({ ...info, sourceType: v, propVal: undefined });
          }}
        />

        {info.sourceType === "fixed" ? (
          propInfo.dataType === "Icon" ? (
            <SelectIcon
              value={info.propVal}
              onDataChange={(icon) => {
                setInfo({
                  ...info,
                  propVal: icon,
                });
              }}
            />
          ) : (
            <Input
              value={info.propVal}
              onChange={(v) => {
                setInfo({
                  ...info,
                  propVal: v,
                });
              }}
            />
          )
        ) : (
          <Select
            value={info.propVal}
            optionList={Object.keys(ApiInfo)
              .map((k) => ({
                label: ApiInfo[k].label,
                value: k,
              }))
              .filter((f) => ApiInfo[f.value].dataType === propInfo.dataType)}
            onChange={(v) => {
              setInfo({
                ...info,
                propVal: v as string,
              });
            }}
          />
        )}
      </div>

      {info && info.sourceType === "api" && info.propVal && propInfo ? (
        <>
          {propInfo.dataType !== ApiInfo[info.propVal].dataType ? (
            <div>转换方法入参设置，有转换的就查找转换方法，否则就</div>
          ) : (
            ""
          )}
          {info.propVal && ApiInfo[info.propVal].params ? (
            Object.keys(ApiInfo[info.propVal].params).map((k) => {
              return (
                <ApiParamSetting
                  data={ApiInfo[info.propVal].params[k]} //参数定义信息
                  paramName={k} //参数名
                  value={info.params?.filter((obj) => obj.paramName === k)[0]}
                  onDataChange={(d) => {
                    // alert(JSON.stringify(d));
                    setInfo({
                      ...info,
                      params: [
                        ...(info.params
                          ? info.params.filter((p) => p.paramName !== k)
                          : []),
                        d,
                      ],
                    });
                  }} //参数回写
                />
              );
            })
          ) : (
            <></>
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default ComponentPropSetting;
