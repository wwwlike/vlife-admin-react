/**
 * 首页
 */
import React, { useEffect, useState } from "react";
import { detail, PageConfDto } from "@src/mvc/PageLayout";
import { WidthProvider, Responsive } from "react-grid-layout";
import Views from "@src/components/layout/Views";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  /**
   * 页面整体配置
   */
  const [pageConf, setPageConf] = useState<PageConfDto>();

  /**
   * 数据请求
   */
  useEffect(() => {
    detail("desktop").then((data) => {
      setPageConf(data.data);
    });
  }, []);

  return (
    <ResponsiveReactGridLayout
      className="layout"
      // breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      // cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
      rowHeight={50}
    >
      {pageConf?.content?.map((pageComponent, index) => {
        return (
          <div
            key={pageComponent.pageKey || "comp" + index}
            data-grid={{ ...pageComponent, static: true }}
            className=""
          >
            <Views pageComponentDto={pageComponent} />
          </div>
        );
      })}
    </ResponsiveReactGridLayout>
  );
};

export default Dashboard;
