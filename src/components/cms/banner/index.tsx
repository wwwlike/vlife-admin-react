import React from "react";
import banner from "@src/image/banner.png";
/**
 * 广告横幅
 */
export interface BannerProps {
  title?: string; //标题
  desc?: string; //说明
  bgColor?: string; //背景色
  bgImg?: string; //背景图片
}
const defBannerProp: BannerProps = {
  title: "vlife低代码研发平台",
  desc: "全开源的低代码",
  bgColor: "bg-indigo-900",
  bgImg: "",
};
const VfBanner = ({
  title = defBannerProp.title,
  desc = defBannerProp.desc,
  bgColor = defBannerProp.bgColor,
  bgImg,
}: BannerProps) => {
  return (
    <div
      className={`${bgColor}`}
      style={{
        backgroundSize: "cover",
        backgroundImage: `url(${banner})`,
      }}
    >
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="px-0 sm:px-4 lg:px-0 lg:flex lg:justify-between lg:items-center">
          <div className="max-w-xl">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              {title}
            </h2>
            <p className="mt-5 text-xl text-indigo-300">{desc}</p>
          </div>
          {/* <div className="mt-10 w-full max-w-xs lg:mt-0">
            <label className="block text-base font-medium text-indigo-300">
              Currency
            </label>
            <div className="mt-1.5 relative"></div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
export default VfBanner;
