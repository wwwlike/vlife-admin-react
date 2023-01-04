/**
 * 显示数量的组件
 */

import { ViewBasicProp } from "./dataType";
import { IconAlarm } from "@douyinfe/semi-icons";

interface TotalProps {
  title: string;
  infos: ViewBasicProp[];
  info?: ViewBasicProp;
}

const mock: TotalProps = {
  title: "汇总数据组件",
  infos: [
    { title: "总人数", total: 120, icon: <IconAlarm /> },
    { title: "新增人数", total: 132, icon: <IconAlarm /> },
    { title: "服务人数", total: 112, icon: <IconAlarm /> },
  ],
};

export default function Total({
  title = mock.title,
  infos = mock.infos,
  info,
  ...aa
}: Partial<TotalProps>) {
  return (
    <div>
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        {/* {JSON.stringify(infos)} */}
        {title}_ {info?.title}_{info?.total}
      </h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {infos?.map((item, index) => (
          <div
            key={`div_total_${index}`}
            className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
          >
            {item.icon}
            <dt className="text-sm font-medium text-gray-500 truncate">
              {item.title}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {item.total}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
