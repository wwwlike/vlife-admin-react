import { PageComponent, PageComponentDto } from "@src/mvc/PageComponent";
import { PageComponentProp } from "@src/mvc/PageComponentProp";
import { ApiInfo } from "@src/pages/design/fieldSetting/apiData";
import {
  getDataType,
  PropInfo,
} from "@src/pages/design/fieldSetting/componentData";
import { val } from "dom7";
import React, { useEffect, useMemo, useState } from "react";
import SelectIcon from "../vlifeComponent/SelectIcon";
import { ViewComponents } from "./ViewComponentsData";

/**
 * 单个组件渲染
 */
interface ViewsProps {
  pageComponentDto: PageComponentDto;
}

const Views = ({ pageComponentDto }: ViewsProps) => {
  /** 组件 */
  const comp = useMemo(() => {
    return ViewComponents[pageComponentDto.component];
  }, [pageComponentDto]);

  /** 组件属性 */
  const [pps, setPps] = useState<any>();

  /**
   *
   * @param p 组件属性
   * @param props  组件值对象
   * @param value 属性值
   * @returns
   */
  const valueAdd = (p: PageComponentProp, props: any, value: any): any => {
    const dt = getDataType(comp, p.propName, p.subName);
    // alert(dataType);
    if (dt === "Icon") {
      value = <SelectIcon read={true} value={value} />;
    }

    if (p.subName) {
      //对象是数组
      if (p.listNo) {
        if (!props[p.propName + ""]) {
          props[p.propName + ""] = [];
        }
        while (props[p.propName + ""].length < p.listNo) {
          props[p.propName + ""].push({});
        }
        props[p.propName + ""][p.listNo - 1][p.subName] = value;
      } else {
        //一般对象
        if (!props[p.propName + ""]) {
          props[p.propName + ""] = {};
        }
        props[p.propName + ""][p.subName] = value[p.subName]
          ? value[p.subName]
          : value;
      }
    } else {
      props[p.propName + ""] = value;
    }
    return props;
  };

  useEffect(() => {
    (async () => {
      let props: any = {};
      //视图组件传值组装
      // 1.组装fixed的简单对象
      pageComponentDto?.props
        ?.filter((p) => p.propName && p.propVal && p.sourceType === "fixed")
        .forEach((p) => {
          props = valueAdd(p, props, p.propVal);
        });

      // 1.组装fixed的简单对象
      Promise.all(
        pageComponentDto?.props
          ?.filter((p) => p.propName && p.propVal && p.sourceType === "api")
          .map(async (prop) => {
            if (prop.propVal) {
              // 接口参数没有先不去请求数据
              const paramNames: string[] = ApiInfo[prop.propVal].params
                ? Object.keys(ApiInfo[prop.propVal].params)
                : [];
              let load: boolean = true;
              const paramObj: any = {};
              if (paramNames.length > 0) {
                paramNames.forEach((name) => {
                  const db = prop.params?.filter((p) => p.paramName === name);
                  if (db?.length > 0 && db[0].paramVal) {
                    paramObj[name] = db[0].paramVal;
                  } else {
                    load = false;
                  }
                });
              }
              if (load) {
                props = await ApiInfo[prop.propVal].api(paramObj).then((d) => {
                  // alert(JSON.stringify(d));
                  props = valueAdd(prop, props, d.data);
                  return props;
                });
              }
              return props;
            }
          })
      ).then((d) => {
        if (d.length > 0) {
          // alert(JSON.stringify(d[d.length - 1]));
          setPps({ ...d[d.length - 1] });
        }
      });
      // alert(JSON.stringify(props)));
      setPps(props);
    })();
  }, [pageComponentDto]);

  return <comp.component {...pps}></comp.component>;
};

export default Views;
