import { Pagination } from "@douyinfe/semi-ui";
import { PageVo } from "@src/mvc/base";
import { OaNews } from "@src/mvc/OaNews";
import { formatDate } from "@src/utils/utils";
import newsPng from "@src/image/news.png";
import React from "react";
const apiUrl = import.meta.env.VITE_APP_API_URL;
export interface listPageProps {
  /**
   * 标题
   */
  title: string;
  /**
   * 分页信息
   */
  data?: PageVo<OaNews>;
  /**
   * 翻页触发事件
   */
  onDataChange: (req: any) => void;
}

// const defInfo: listPageProps = {};= defInfo.data
const ListPage = ({ data, onDataChange }: listPageProps) => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {data?.result.map((info) => (
            <a key={info.id} href="#" className="group">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                {info.img ? (
                  info.img.indexOf("http") !== -1 ? (
                    <img
                      src={`${info.img}`}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                  ) : (
                    <img
                      src={`${apiUrl}/sysFile/image/${info.img}`}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                  )
                ) : (
                  <img
                    src={newsPng}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                )}
              </div>
              <p className="mt-2 text-lg font-medium text-gray-900 text-left">
                {info.title}
              </p>
              <div className="mt-1 flex text-sm text-gray-700 justify-between ">
                <div></div>
                <div>{formatDate(info.createDate, "yyyy-MM-dd")}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between">
          <div>
            {data ? (
              <p className="text-sm text-gray-700">
                显示
                <span className="font-medium">
                  {((data.page || 1) - 1) * (data.size || 5) + 1}
                </span>
                至
                <span className="font-medium">
                  {(data.page || 1) * (data.size || 5) > data.total
                    ? data.total
                    : (data.page || 1) * (data.size || 5)}
                </span>
                共<span className="font-medium">{data?.total}</span> 条
              </p>
            ) : (
              ""
            )}
          </div>
          <Pagination
            total={data?.total}
            pageSize={data?.size}
            currentPage={data?.page}
            onPageChange={(pageNum) =>
              onDataChange({
                pager: { page: pageNum, size: data?.size },
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ListPage;
