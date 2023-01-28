import { Banner } from "@douyinfe/semi-ui";
import { listAll, PageLayout } from "@src/mvc/PageLayout";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const apiUrl = import.meta.env.VITE_APP_API_URL;
export default () => {
  const [list, setList] = useState<PageLayout[]>();
  const [pageType, setPageType] = useState<"page" | "module">("page");
  useEffect(() => {
    listAll().then((d) => {
      setList(d.data);
    });
  }, []);
  return (
    <div className="flex-1 flex items-stretch overflow-hidden bg-white rounded-md ">
      <main className="flex-1 overflow-y-auto">
        {/* max-w-7xl */}
        <div className="pt-2  mx-auto px-2 ">
          <div className="flex">
            <h1 className="flex-1 text-base font-bold m-3 text-gray-900">
              {pageType === "page" ? "页面" : "模块"}设计
            </h1>
            <div>
              <Banner
                type="success"
                className=" w-full ml-0 text-left justify-between z-10"
                description={`${
                  pageType === "page"
                    ? "【页面】可配置路由地址，但不能被其他页面和模块引用"
                    : "【模块】不能单独访问，可以被其他页面/模块引用，实现功能模块的复用"
                }`}
              />
            </div>

            <div className="ml-6 bg-gray-100 p-0.5 rounded-lg flex items-center sm:hidden">
              <button
                type="button"
                className="p-1.5 rounded-md text-gray-400 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Use list view</span>
              </button>
              <button
                type="button"
                className="ml-0.5 bg-white p-1.5 rounded-md shadow-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="sr-only">Use grid view</span>
              </button>
            </div>
          </div>

          <div className="mt-3 sm:mt-2">
            <div className="hidden sm:block">
              <div className="flex items-center border-b border-gray-200">
                <nav
                  className="flex-1 -mb-px flex space-x-6 xl:space-x-8"
                  aria-label="Tabs"
                >
                  <a
                    href="#"
                    aria-current="page"
                    className={`${
                      pageType === "page"
                        ? "border-indigo-500 text-indigo-600"
                        : "text-gray-500  hover:text-gray-700 hover:border-gray-300"
                    }  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    onClick={() => setPageType("page")}
                  >
                    页面
                  </a>
                  <a
                    href="#"
                    onClick={() => setPageType("module")}
                    className={`border-transparent ${
                      pageType === "module"
                        ? "border-indigo-500 text-indigo-600"
                        : "text-gray-500  hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    模块
                  </a>
                </nav>
                <div className="hidden ml-6 bg-gray-100 p-0.5 rounded-lg items-center sm:flex">
                  <button
                    type="button"
                    className="p-1.5 rounded-md text-gray-400 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  >
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="sr-only">Use list view</span>
                  </button>
                  <button
                    type="button"
                    className="ml-0.5 bg-white p-1.5 rounded-md shadow-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  >
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span className="sr-only">Use grid view</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-4 pb-8" aria-labelledby="gallery-heading">
            <ul
              role="list"
              className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-8 xl:gap-x-8"
            >
              <Link to={`/conf/layout/new`}>
                <li className="relative">
                  <button
                    type="button"
                    className="relative block w-full  h-48 border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                      />
                    </svg>
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      创建一个新{pageType === "page" ? "页面" : "模块"}
                    </span>
                  </button>
                </li>
              </Link>

              {list
                ?.filter((m) =>
                  pageType === "page"
                    ? m.module === false ||
                      m.module === undefined ||
                      m.module === null
                    : m.module === true
                )
                .map((d) => (
                  <div key={d.id}>
                    <Link to={`/conf/layout/${d.id}`}>
                      <li
                        className="relative"
                        style={{
                          backgroundSize: "cover",
                          backgroundImage: `url(${apiUrl}/sysFile/image/${d.img})`,
                        }}
                      >
                        <button
                          type="button"
                          className="relative block w-full h-48 border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          {d.img === undefined || d.img === null ? (
                            <>
                              <svg
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="2857"
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                aria-hidden="true"
                              >
                                <path
                                  d="M841.71335 65.290005 182.285626 65.290005c-64.511269 0-116.995621 52.484352-116.995621 116.995621L65.290005 841.71335c0 64.511269 52.484352 116.995621 116.995621 116.995621l659.427724 0c64.511269 0 116.995621-52.484352 116.995621-116.995621L958.708971 182.285626C958.708971 117.774357 906.225643 65.290005 841.71335 65.290005zM182.285626 107.833961l659.427724 0c41.051975 0 74.451666 33.398668 74.451666 74.451666l0 136.557142c-150.09446 5.26184-290.370297 66.084091-396.978337 172.692131-49.960879 49.961902-89.841168 107.331517-118.694309 169.625282-83.496669-70.835302-204.372667-75.376735-292.65841-13.617136L107.833961 182.285626C107.833961 141.232628 141.232628 107.833961 182.285626 107.833961zM107.833961 841.71335 107.833961 702.627618c76.54228-74.311473 198.833511-74.234725 275.272437 0.24457-24.303522 65.298192-37.026288 135.112234-37.026288 206.91149 0 2.223644 0.343831 4.366448 0.977257 6.381337L182.285626 916.165016C141.232628 916.165016 107.833961 882.766348 107.833961 841.71335zM841.71335 916.165016 387.646807 916.165016c0.633427-2.01489 0.977257-4.157693 0.977257-6.381337 0-146.71755 57.053414-284.572244 160.647817-388.166647 98.570993-98.570993 228.166583-154.963351 366.894158-160.204725L916.166039 841.71335C916.165016 882.766348 882.766348 916.165016 841.71335 916.165016z"
                                  fill="#272636"
                                  p-id="2858"
                                ></path>
                                <path
                                  d="M312.397986 413.458683c60.8376 0 110.332874-49.494251 110.332874-110.332874s-49.494251-110.332874-110.332874-110.332874-110.332874 49.494251-110.332874 110.332874S251.559363 413.458683 312.397986 413.458683zM312.397986 235.337913c37.378306 0 67.788919 30.40959 67.788919 67.788919s-30.40959 67.788919-67.788919 67.788919-67.788919-30.40959-67.788919-67.788919S275.018657 235.337913 312.397986 235.337913z"
                                  fill="#272636"
                                  p-id="2859"
                                ></path>
                              </svg>
                              <span className="mt-2 block text-sm font-medium text-gray-900">
                                {d.name}
                              </span>
                            </>
                          ) : (
                            <></>
                          )}
                        </button>
                      </li>
                      <span className="mt-2 block text-sm text-center font-medium text-gray-900">
                        {d.name}
                      </span>
                    </Link>
                  </div>
                ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};
