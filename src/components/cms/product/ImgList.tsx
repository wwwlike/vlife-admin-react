/**
 * 产品图片列表
 */

interface ImgListInfo {
  img: string;
  title: string;
}
export interface ProductListProps {
  title: string; //列表标题
  more: string; //更多的说明
  moreUrl?: string; //更多的跳转地址
  infos?: ImgListInfo[];
}

const defInfos: ProductListProps = {
  title: "产品方案",
  more: "查看所有",
  infos: [
    {
      img: "https://tailwindui.com/img/ecommerce-images/home-page-01-category-01.jpg",
      title: "研发平台",
    },
    {
      img: "https://tailwindui.com/img/ecommerce-images/home-page-01-category-02.jpg",
      title: "组件库搭建",
    },
    {
      img: "https://tailwindui.com/img/ecommerce-images/home-page-01-category-03.jpg",
      title: "代码插件库",
    },
    {
      img: "https://tailwindui.com/img/ecommerce-images/home-page-01-category-04.jpg",
      title: "权限体系",
    },
    {
      img: "https://tailwindui.com/img/ecommerce-images/home-page-01-category-05.jpg",
      title: "xxxx",
    },
    {
      img: "https://tailwindui.com/img/ecommerce-images/home-page-01-category-05.jpg",
      title: "xxxxx",
    },
  ],
};

const VfImgList = ({
  title = defInfos.title,
  more = defInfos.more,
  moreUrl,
  infos = defInfos.infos,
}: ProductListProps) => {
  return (
    <section
      aria-labelledby="category-heading"
      className="p-12  max-w-7xl mx-auto px-8"
    >
      <div className="px-4 sm:px-6 sm:flex sm:items-center sm:justify-between lg:px-8 xl:px-0">
        <h2
          id="category-heading"
          className="text-2xl font-extrabold tracking-tight text-gray-900"
        >
          {title}
        </h2>
        <a
          href="#"
          className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block"
        >
          {more}
          <span aria-hidden="true"> &rarr;</span>
        </a>
      </div>

      <div className="mt-4 flow-root">
        <div className="-my-2">
          <div className="box-content py-2 relative h-80 overflow-x-auto xl:overflow-visible">
            <div className="absolute min-w-screen-xl px-4 flex space-x-8 sm:px-6 lg:px-8 xl:relative xl:px-0 xl:space-x-0 xl:grid xl:grid-cols-5 xl:gap-x-8">
              {infos?.map((info) => (
                <a
                  href="#"
                  className="relative w-56 h-80 rounded-lg p-6 flex flex-col overflow-hidden hover:opacity-75 xl:w-auto"
                >
                  <span aria-hidden="true" className="absolute inset-0">
                    <img
                      src={info.img}
                      alt=""
                      className="w-full h-full object-center object-cover"
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                  ></span>
                  <span className="relative mt-auto text-center text-xl font-bold text-white">
                    {info.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 px-4 sm:hidden">
        <a
          href="#"
          className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Browse all categories<span aria-hidden="true"> &rarr;</span>
        </a>
      </div>
    </section>
  );
};

export default VfImgList;
