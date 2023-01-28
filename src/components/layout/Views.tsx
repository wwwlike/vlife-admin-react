import { useAuth } from "@src/context/auth-context";
import { PageComponentDto } from "@src/mvc/PageComponent";
import {
  PageComponentProp,
  PageComponentPropDto,
} from "@src/mvc/PageComponentProp";
import React, { useEffect, useMemo, useState } from "react";
import SelectIcon from "../vlifeComponent/SelectIcon";
import { listAll } from "@src/provider/baseProvider";
import { Field } from "@formily/core";
import { FormFieldVo } from "@src/mvc/model/FormField";
import Arrow from "@douyinfe/semi-ui/lib/es/popover/Arrow";
const apiUrl = import.meta.env.VITE_APP_API_URL;
import {
  ComponentInfo,
  dataType,
  getDataType,
  PropInfo,
} from "@src/pages/design/data/componentData";
import { ApiInfo } from "@src/mvc/apis";
import { ViewComponents } from "../components_view";
/**
 * 单个组件渲染的包装组件
 * 相关函数可以给到formindex使用，form里存在联动比这里复杂
 * 这里的vueadd，和异步数据提取可以做成hooks
 */
interface ViewsProps {
  pageComponentDto: PageComponentDto;
  className?: string;
  h?: number;
}

/**
 * 将所有组件属性组装到一个对象（propObj）上面
 * @param p 组件属性DB数据
 * @param propObj  组件prop的传参值数据
 * @param value 属性值，[p]存的非fixed的需要进行转换后的值
 * @returns
 */
export const valueAdd = (
  p: Partial<PageComponentProp>,
  propObj: any,
  value: any
): any => {
  // console.log(JSON.stringify(value));
  if (p.subName || p.listNo) {
    //对象是数组
    if (p.listNo) {
      if (!propObj[p.propName + ""]) {
        propObj[p.propName + ""] = [];
      }
      while (propObj[p.propName + ""].length < p.listNo) {
        propObj[p.propName + ""].push({});
      }
      if (p.subName) {
        propObj[p.propName + ""][p.listNo - 1][p.subName] = value;
      } else {
        propObj[p.propName + ""][p.listNo - 1] = value;
      }
    } else if (p.subName) {
      //一般对象
      if (!propObj[p.propName + ""]) {
        propObj[p.propName + ""] = {};
      }
      propObj[p.propName + ""][p.subName] = value[p.subName]
        ? value[p.subName]
        : value;
    }
  } else {
    propObj[p.propName + ""] = value;
  }
  return propObj;
};

/**
 *
 * @param props 事件属性组装生成
 * @param componentInfo
 */
export const fetchEventPropObj = (
  props: Partial<PageComponentPropDto>[],
  componentInfo: ComponentInfo,
  propObj: any, //传入到组件的属性
  setEventChangeData: (prop: any) => void
): any => {
  if (propObj === undefined) propObj = {};
  for (let eventName in componentInfo.propInfo) {
    const filterPorp = props.filter((p) => p.propName === eventName);
    const propVal =
      filterPorp && filterPorp.length > 0 && filterPorp[0].propVal
        ? filterPorp[0].propVal
        : undefined;
    if (
      typeof componentInfo.propInfo[eventName] !== "string" &&
      (componentInfo.propInfo[eventName] as PropInfo).dataType ===
        dataType.event &&
      propVal
    ) {
      const propInfo: PropInfo = componentInfo.propInfo[eventName] as PropInfo;
      propObj[eventName] = function (val: any) {
        // alert(val);
        ApiInfo[propVal].api(val).then((d) => {
          if (propInfo.event?.propName) {
            setEventChangeData({ [propInfo.event?.propName]: d.data });
            // propObj[propInfo.event?.propName] = d.data;
          }
        });
      };
    }
  }
  return propObj;
};

/**
 * 静态数据请求
 * 1固定2字典3field类数据提取
 */
export const fetchStaticPropObj = (
  props: Partial<PageComponentPropDto>[],
  componentInfo: ComponentInfo,
  allDict: {
    [key: string]: {
      data: { value: string; label: string }[];
      label: string;
    };
  },
  field?: FormFieldVo,
  formData?: any //表单数据
): any => {
  let propsObj: any = {};
  // 1.组装fixed的简单对象,不需要转换直接从数据库里提取即可
  props
    ?.filter((p) => p.propName && p.propVal && p.sourceType === "fixed")
    .forEach((p) => {
      //图表类型，需要转换成组件形式
      if (p.propName) {
        const dt = getDataType(componentInfo, p.propName, p.subName);
        valueAdd(
          p,
          propsObj,
          dt === dataType.icon ? ( //图标
            <SelectIcon read={true} value={p.propVal} />
          ) : dt === dataType.image && p.propVal && p.propVal !== "" ? ( //图片
            `${apiUrl}/sysFile/image/${p.propVal}`
          ) : (
            p.propVal
          )
        );
      }
    });
  //2.  dataSource ===dict 方式取值
  props
    ?.filter((p) => p.propName && p.sourceType === "dict")
    .forEach((p) => {
      if (p.propName) {
        const dt = getDataType(componentInfo, p.propName, p.subName);
        if (dt === dataType.dictList) {
          if (
            componentInfo &&
            componentInfo.propInfo &&
            p.propName &&
            typeof componentInfo.propInfo[p.propName] !== "string"
          ) {
            valueAdd(
              p,
              propsObj,
              allDict[p.propVal || "vlife"].data.map((d) => {
                return {
                  label: d.label,
                  value: field?.type === "integer" ? Number(d.value) : d.value,
                };
              })
            );
          }
        }
      }
    });

  //3 sys
  props
    ?.filter((p) => p.propName && p.propVal && p.sourceType === "sys")
    .forEach((p) => {
      if (
        p.propName &&
        componentInfo.propInfo &&
        typeof componentInfo.propInfo[p.propName] !== "string"
      ) {
        const propInfo: PropInfo = componentInfo.propInfo[
          p.propName
        ] as PropInfo;

        if (propInfo.sourceType === "sys" && field && p.propVal) {
          // alert(field["type"]);
          valueAdd(p, propsObj, field[p.propVal]);
        }
      }
    });

  //3.  dataSource ===field 方式取值
  // props
  //   ?.filter((p) => p.propName && p.propVal && p.sourceType === "field")
  //   .forEach((p) => {
  //     if (p.propName) {
  //       valueAdd(p, propsObj, p.propVal ? formData[p.propVal] : null);
  //     }
  //   });
  return propsObj;
};

/**
 * 请求远程数据
 * @param props
 * @param componentInfo
 * @param commonParams //通用api入参
 */
export const fetchPropObj = (
  props: Partial<PageComponentPropDto>[],
  componentInfo: ComponentInfo,
  commonParams: any,
  field?: Field
): Promise<any> => {
  let propsObj: any = {};
  return Promise.all(
    props
      ?.filter(
        (p) =>
          p.propName &&
          p.propVal &&
          (p.sourceType === "api" ||
            // p.sourceType === "table" ||
            p.sourceType === "field")
      )
      .map(async (prop) => {
        // console.log(prop.propName);
        if (prop.propVal) {
          if (prop.sourceType === "api") {
            // 接口参数没有先不去请求数据
            const allParam = ApiInfo[prop.propVal]?.params;
            const paramNames: string[] =
              allParam !== undefined ? Object.keys(allParam) : [];
            let load: boolean = true;
            const paramObj: any = {};
            if (paramNames.length > 0) {
              paramNames.forEach((name) => {
                const db = prop.params?.filter((p) => p.paramName === name);
                if (db && db?.length > 0 && db[0].paramVal) {
                  if (db[0].sourceType === "fixed") {
                    paramObj[name] = db[0].paramVal; //当前是固定的，会从字段取计算动态的
                  }
                  if (db[0].sourceType === "field" && field) {
                    paramObj[name] = field.query(db[0].paramVal).get("value");
                  }
                } else {
                  load = false;
                }
              });
            }
            if (load) {
              propsObj = await ApiInfo[prop.propVal]
                .api({ ...paramObj, ...commonParams })
                .then((d) => {
                  // componentInfo.propInfo[prop.propName]
                  if (
                    prop.propName &&
                    componentInfo &&
                    prop.propVal &&
                    componentInfo.propInfo &&
                    typeof componentInfo.propInfo !== "string" &&
                    (componentInfo.propInfo[prop.propName] as PropInfo)
                      .otherData !== undefined
                  ) {
                    const propInfo = componentInfo.propInfo[
                      prop.propName
                    ] as PropInfo;
                    const otherData: any = propInfo.otherData;

                    if (otherData[ApiInfo[prop.propVal].dataType]) {
                      propsObj = valueAdd(
                        prop,
                        propsObj,
                        otherData[ApiInfo[prop.propVal].dataType](d.data)
                      );
                    } else {
                      propsObj = valueAdd(prop, propsObj, d.data);
                    }
                  } else {
                    propsObj = valueAdd(prop, propsObj, d.data);
                  }
                  // 接口出参类型和属性要求的类型是否一致，不一致则使用tran转换函数
                  return propsObj;
                });
            }
            // return propsObj;
          }
          // else if (
          //   prop.propName &&
          //   componentInfo.propInfo &&
          //   typeof (componentInfo.propInfo[prop.propName] !== "string") &&
          //   (componentInfo.propInfo[prop.propName] as PropInfo).table !==
          //     undefined
          // ) {
          //   // table 方式
          //   const table = (componentInfo.propInfo[prop.propName] as PropInfo)
          //     .table;
          //   const entityName = prop.propVal;
          //   const labelField = table?.labelField || "name";
          //   const valField = table?.valField || "id";

          //   // table方式
          //   propsObj = await listAll({ entityName: entityName || "form" }).then(
          //     (d) => {
          //       propsObj = valueAdd(
          //         prop,
          //         propsObj,
          //         d.data?.map((d) => {
          //           return { label: d[labelField], value: d[valField] };
          //         })
          //       );
          //       return propsObj;
          //     }
          //   );
          // }
          else if (prop.sourceType === "field" && field) {
            Arrow;
            valueAdd(prop, propsObj, field.query(prop.propVal).get("value"));
          }
          return propsObj;
        }
      })
  ).then((d) => {
    if (d.length > 0) {
      return { ...d[d.length - 1] };
      // setComponentPropFunc({ ...d[d.length - 1] }); //执行回调函数
    }
  });
  // const promiseTest = new Promise((resolve, reject) => {
  //   if (4 > 2) {
  //     resolve("a");
  //   } else {
  //     reject("error");
  //   }
  // });

  // return promiseTest.then(
  //   (data) => {
  //     console.log(data);
  //     return {
  //       optionList: [
  //         { label: "2123", value: "123" },
  //         { label: "234", value: "123" },
  //       ],
  //     };
  //   },
  //   (error) => {
  //     console.log(error);
  //     return "thenError";
  //   }
  // );

  // .then(data=>{
  //   console.log(data)
  //     return "then2";
  // }
};

/**
 * 组件属性创建
 * @param props  组件属性DB数据
 * @param componentInfo 组件信息
 * @param setComponentPropFunc set到指定对象里去
 */
export const componentPropCreate = (
  props: Partial<PageComponentPropDto>[],
  componentInfo: ComponentInfo,
  setComponentPropFunc: (prop: any) => void,
  setEventChangeData: (prop: any) => void,
  allDict: {
    [key: string]: {
      data: { value: string; label: string }[];
      label: string;
    };
  }
) => {
  (async () => {
    /**
     * 1. 本地属性prop静态数据提取
     */
    let propsObj: any = fetchStaticPropObj(props, componentInfo, allDict) || {};

    // 2. 事件属性，组装传入
    propsObj = fetchEventPropObj(
      props,
      componentInfo,
      propsObj,
      setEventChangeData
    );

    // alert(JSON.stringify(propsObj));
    // 3.远程数据提取 . api异步数据提取 (table是指定了api的异步取数据)
    if (
      props?.filter(
        (p) =>
          p.propName &&
          p.propVal &&
          (p.sourceType === "api" || p.sourceType === "table")
      ).length > 0
    ) {
      Promise.all(
        props
          ?.filter(
            (p) => p.propName && p.propVal && p.sourceType === "api" //|| p.sourceType === "table"
          )
          .map(async (prop) => {
            // console.log(prop.propName);
            if (prop.propVal) {
              if (prop.sourceType === "api") {
                // 接口参数没有先不去请求数据
                const allParam = ApiInfo[prop.propVal].params;
                const paramNames: string[] =
                  allParam !== undefined ? Object.keys(allParam) : [];
                let load: boolean = true;
                const paramObj: any = {};
                if (paramNames.length > 0) {
                  paramNames.forEach((name) => {
                    const db = prop.params?.filter((p) => p.paramName === name);
                    if (db && db?.length > 0 && db[0].paramVal) {
                      paramObj[name] = db[0].paramVal;
                    } else {
                      load = false;
                    }
                  });
                }
                if (load) {
                  propsObj = await ApiInfo[prop.propVal]
                    .api(paramObj)
                    .then((d) => {
                      // const dt = getDataType(
                      //   componentInfo,
                      //   prop.propName,
                      //   prop.subName
                      // );
                      propsObj = valueAdd(prop, propsObj, d.data);
                      return propsObj;
                    });
                }
                // return propsObj;
              } else {
                // table方式
                propsObj = await listAll({ entityName: "form" }).then((d) => {
                  propsObj = valueAdd(prop, propsObj, d.data);
                  return propsObj;
                });
              }
              return propsObj;
            }
          })
      ).then((d) => {
        if (d.length > 0) {
          setComponentPropFunc({ ...d[d.length - 1] }); //执行回调函数
        }
      });
    } else {
      setComponentPropFunc(propsObj);
    }
  })();
};
const Views = ({ pageComponentDto, className, h }: ViewsProps) => {
  const { dicts } = useAuth();

  /**
   * 组件事件改变指定属性值state
   */
  const [eventChangeData, setEventChangeData] = useState<any>();

  /** 组件 */
  const ComponentInfo = useMemo((): any => {
    if (pageComponentDto.component)
      return ViewComponents[pageComponentDto.component];
    return {};
  }, [pageComponentDto]);

  /** 组件属性 */
  const [componentProps, setComponentProps] = useState<any>();

  useEffect(() => {
    if (pageComponentDto.props) {
      componentPropCreate(
        pageComponentDto.props,
        ComponentInfo,
        setComponentProps,
        setEventChangeData,
        dicts
      );
    }
  }, [pageComponentDto]);

  return (
    <ComponentInfo.component
      className={className}
      {...componentProps}
      {...eventChangeData}
    />
  );
};

export default Views;
