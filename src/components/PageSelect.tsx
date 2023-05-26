import { Checkbox, Divider } from "@douyinfe/semi-ui";
import { Section } from "@formily/semi";
import { VfBaseProps } from "@src/dsl/schema/component";
import React from "react";
import DesignFormItem from "./form/component/DesignFormItem";
import GroupLabel from "./form/component/GroupLabel";

export interface PageSelectData {
  groupName: string;
  details: { label: string; value: string }[];
}

/**
 * 页面多选组件
 */
interface PageSelectProps extends VfBaseProps<string[], PageSelectData[]> {
  datas: PageSelectData[];
}

const PageSelect = ({
  datas = [],
  value = [],
  onDataChange,
}: PageSelectProps) => {
  return (
    <div>
      {datas
        ?.filter((d) => d.details && d.details.length > 0)
        .map((d) => {
          return (
            <div className=" ">
              {/* <Divider align="left">{d.groupName}</Divider> */}
              {/* <GroupLabel text={d.groupName}></GroupLabel> */}

              <div className="flex items-center border-b border-gray-200">
                <a
                  href="#"
                  aria-current="page"
                  className={`border-indigo-500 text-indigo-600 whitespace-nowrap py-2 px-1 border-b-0 font-medium text-sm`}
                >
                  {d.groupName}
                </a>
              </div>
              {/* <DesignFormItem></DesignFormItem> */}
              <div>
                <ul role="list" className="grid p-2 gap-4 grid-cols-6">
                  {d.details?.map((dd) => {
                    return (
                      <li className="flex">
                        {/* {JSON.stringify(value?.includes(dd.value))} */}
                        <Checkbox
                          // type="card"
                          checked={value?.includes(dd.value)}
                          onChange={(v) => {
                            if (v.target.checked && value === null) {
                              // alert(dd.value);
                              onDataChange([dd.value]);
                            } else if (
                              v.target.checked &&
                              !value?.includes(dd.value)
                            ) {
                              // alert(dd.value);
                              onDataChange([...value, dd.value]);
                            }

                            if (
                              v.target.checked === false &&
                              value?.includes(dd.value)
                            ) {
                              onDataChange(
                                value?.filter((v) => v !== dd.value)
                              );
                            }
                          }}
                        >
                          {dd.label}
                        </Checkbox>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default PageSelect;
