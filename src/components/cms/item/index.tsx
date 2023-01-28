interface itemInfo {
  title: string; //标题
  desc?: string; //副标题和描述
  img: string; //图标
}

export interface itemProps {
  size?: number; //每一行数量
  infos?: itemInfo[]; //信息
}
const defInfos: itemInfo[] = [
  {
    title: "全栈开源",
    desc: "前后端、C端B端全部开源",
    img: "https://tailwindui.com/img/ecommerce/icons/icon-returns-light.svg",
  },
  {
    title: "研发平台",
    desc: "提供完成的快速开发解决方案",
    img: "https://tailwindui.com/img/ecommerce/icons/icon-calendar-light.svg",
  },
  {
    title: "面向研发",
    desc: "可速倍提升研发效能",
    img: "https://tailwindui.com/img/ecommerce/icons/icon-gift-card-light.svg",
  },
  {
    title: "高效稳定",
    desc: "低代码开发",
    img: "https://tailwindui.com/img/ecommerce/icons/icon-planet-light.svg",
  },
];

const VfItem = ({ infos = defInfos, size = 4 }: itemProps) => {
  return (
    <section
      aria-labelledby="perks-heading"
      className="bg-gray-50 border-t border-gray-200"
    >
      <div className="max-w-7xl mx-auto py-12 px-6 ">
        <div className={`grid gap-y-12 grid-cols-${size} gap-x-8`}>
          {infos.map((info) => (
            <div className="text-center md:flex md:items-start md:text-left lg:block lg:text-center">
              <div className="md:flex-shrink-0">
                <div className="flow-root">
                  <img
                    className="-my-1 h-24 w-auto mx-auto"
                    src={info.img}
                    alt=""
                  />
                </div>
              </div>
              <div className="mt-6 md:mt-0 md:ml-4 lg:mt-6 lg:ml-0">
                <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-900">
                  {info.title}
                </h3>
                <p className="mt-3 text-sm text-gray-500">{info.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VfItem;
