import { IconSave, IconCart } from "@douyinfe/semi-icons";
import { ReactChild, ReactFC } from "@formily/react";
import { VfBaseViewProps } from "@src/components";
import React, { ReactComponentElement, ReactElement, ReactNode } from "react";

// icon title展示型组件

type VfCardObject = {
  icon?: any;
  title: string;
};

export interface VfCardProps extends VfBaseViewProps<VfCardObject> {
  /** 鼠标经过div现实效果 */
  hover?: boolean;
  onClick?: () => void;
}
const VfCard = ({ data, onClick }: VfCardProps) => {
  return (
    <a
      href="#"
      onClick={onClick}
      className="hover:bg-blue-500 hover:border-transparent hover:shadow-lg group rounded-lg p-4 border border-gray-200"
    >
      <div className=" items-center justify-center space-x-1">
        <div className="">
          <data.icon></data.icon>
        </div>
        <div className=" group-hover:text-white leading-6 font-medium text-black">
          {data.title}
        </div>
      </div>
    </a>
  );
};
export default VfCard;
