/**
 * 菜单header组件
 */
import defaultLogo from "@src/logo.png";
import React from "react";
import { Link, useLocation } from "react-router-dom";

export interface HeaderProps {
  /**
   * 图标地址
   */
  logo?: string;
  title?: string;
  className?: string;
  /**
   * 菜单名称/路由地址/是否主页
   */
  menu?: {
    name: string;
    url: string;
    index?: boolean;
  }[];
}

const CmsHeader = ({
  logo,
  title,
  menu = [
    { name: "首页", url: "" },
    { name: "产品介绍", url: "" },
    { name: "公司简介", url: "" },
    { name: "新闻中心", url: "" },
  ],
}: HeaderProps) => {
  const local = useLocation();

  return (
    <div
    // style={{ position: "fixed", top: "0px" }}
    >
      <nav className="bg-white shadow w-full ">
        <div className=" mx-auto px-8">
          <div className="flex justify-between h-20">
            <div className="flex space-x-3">
              {/* 图标 */}
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="block h-8 w-auto"
                  src={logo === undefined || logo === "" ? defaultLogo : logo}
                  alt="Workflow"
                />
              </div>
              <div className="flex items-center text-3xl leading-none font-medium font-mono	 text-gray-900 tracking-tight">
                {title || "应用名称"}
              </div>
              <div className=" pl-80 ml-6 flex space-x-12 ">
                {menu.map((m, index) => (
                  <Link
                    key={"menu_" + index}
                    to={`/page/${m.url}`}
                    className={`${
                      local.pathname.endsWith(m.url) ? "border-indigo-400" : ""
                    } text-gray-900 inline-flex items-center px-2 pt-1 border-b-2 text-lg`}
                  >
                    {/* <a href="#">  </a> */}
                    {m.url && m.url !== "" && m.url !== null ? (
                      <> {m.name}</>
                    ) : (
                      <>{m.name}</>
                    )}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>

              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default CmsHeader;
