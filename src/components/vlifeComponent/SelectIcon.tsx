import {
  IconAlarm,
  IconAbsoluteStroked,
  IconAlignBottom,
  IconImage,
  IconScan,
  IconAlignCenterVertical,
  IconHome,
  IconTick,
  IconSearch,
  IconExpand,
  IconClose,
  IconDelete,
  IconSetting,
  IconHandle,
  IconRefresh,
  IconStar,
  IconMore,
  IconBrackets,
} from "@douyinfe/semi-icons";
import { Button, Dropdown } from "@douyinfe/semi-ui";
import { useUpdateEffect } from "ahooks";
import React, {
  lazy,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { VfBaseProps } from "..";
interface SelectIconProps extends VfBaseProps<string, ReactNode[]> {
  size:
    | "inherit"
    | "extra-small"
    | "small"
    | "default"
    | "large"
    | "extra-large";
}

/**
 * 图标选择组件
 */
const SelectIcon = ({
  value,
  datas,
  size = "default",
  onDataChange,
  read,
  ...props
}: Partial<SelectIconProps>) => {
  const [selected, setSelected] = useState(value);

  useUpdateEffect(() => {
    if (onDataChange) {
      // alert(selected);
      onDataChange(selected);
    }
  }, [selected]);

  const icons: { [key: string]: ReactNode } = {
    IconAlignBottom: (
      <IconAlignBottom className={`cursor-pointer`} size={size} />
    ),
    IconImage: <IconImage className={`cursor-pointer`} size={size} />,
    IconScan: <IconScan className={`cursor-pointer`} size={size} />,
    IconTick: <IconTick className={`cursor-pointer`} size={size} />,
    IconSearch: <IconSearch className={`cursor-pointer`} size={size} />,
    IconExpand: <IconExpand className={`cursor-pointer`} size={size} />,
    IconClose: <IconClose className={`cursor-pointer`} size={size} />,
    IconDelete: <IconDelete className={`cursor-pointer`} size={size} />,
    IconSetting: <IconSetting className={`cursor-pointer`} size={size} />,
    IconHandle: <IconHandle className={`cursor-pointer`} size={size} />,
    IconRefresh: <IconRefresh className={`cursor-pointer`} size={size} />,
    IconStar: <IconStar className={`cursor-pointer`} size={size} />,
    IconMore: <IconMore className={`cursor-pointer`} size={size} />,
    IconBrackets: <IconBrackets className={`cursor-pointer`} size={size} />,
    IconHome: <IconHome className={`cursor-pointer`} size={size} />,
    IconAbsoluteStroked: (
      <IconAbsoluteStroked className={`cursor-pointer`} size={size} />
    ),
  };

  const VfIcon = useCallback(() => {
    if (selected) {
      return <>{icons[selected]}</>;
    } else {
      return <>请选择</>;
    }
  }, [selected]);

  return read ? (
    <div>{value && icons[value] ? icons[value] : ""}</div>
  ) : (
    <Dropdown
      trigger={"click"} //点击触发
      clickToHide={true}
      className={`${props.className} border-2  items-center justify-center`}
      render={
        <ul className=" w60 h60 bg-slate-100 p-4  grid grid-cols-8 space-x-2 space-y-2">
          {Object.keys(icons).map((key) => {
            return (
              <li
                key={key}
                className=" hover:text-blue-500"
                onClick={() => {
                  setSelected(key);
                }}
              >
                {icons[key]}
              </li>
            );
          })}
        </ul>
      }
    >
      {selected && icons[selected] ? (
        icons[selected]
      ) : (
        <Button icon={<SelectIcon value="IconSearch" />}>选择{value}</Button>
      )}
    </Dropdown>
  );
};

export default SelectIcon;
