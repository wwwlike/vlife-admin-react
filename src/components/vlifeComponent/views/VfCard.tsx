import { VfBaseViewProps } from "@src/components";
import React from "react";
const apiUrl = import.meta.env.VITE_APP_API_URL;
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
          {data.icon ? (
            typeof data.icon === "string" ? (
              <img src={`${apiUrl}/sysFile/image/${data.icon}`} />
            ) : (
              <data.icon></data.icon>
            )
          ) : (
            <svg
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4809"
              width="40"
              height="40"
            >
              <path
                d="M859.8 452.8h-46.5V308.1c0-51.7-41.3-98.2-98.2-98.2H570.5v-46.5c0-51.7-41.3-98.2-98.2-98.2-51.7 0-98.2 41.3-98.2 98.2v46.5H229.5c-51.7 0-98.2 41.3-98.2 98.2v144.7h46.5c51.7 0 98.2 41.3 98.2 98.2 0 51.7-41.3 98.2-98.2 98.2h-46.5v144.7c0 51.7 41.3 98.2 98.2 98.2h144.7v-46.5c0-51.7 41.3-98.2 98.2-98.2 51.7 0 98.2 41.3 98.2 98.2V892h144.7c51.7 0 98.2-41.3 98.2-98.2V649.1H860c51.7 0 98.2-41.3 98.2-98.2-0.2-56.8-46.7-98.1-98.4-98.1z"
                fill="#bfbfbf"
                p-id="4810"
              ></path>
            </svg>
          )}
        </div>
        <div className=" group-hover:text-white leading-6 font-medium text-black">
          {data.title}
        </div>
      </div>
    </a>
  );
};
export default VfCard;
