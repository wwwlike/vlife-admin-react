/**
 * 桌面
 */

import { Avatar, Banner, Card, Empty, Image, Steps } from "@douyinfe/semi-ui";
import Meta from "@douyinfe/semi-ui/lib/es/card/meta";
import { SysMenu, listAll } from "@src/api/SysMenu";
import { useAuth } from "@src/context/auth-context";
import logo from "@src/logo.png";
import { useEffect, useState } from "react";

export default () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<SysMenu[]>([]);
  useEffect(() => {
    listAll().then((datas) => {
      setApps(datas.data?.filter((d) => d.app) || []);
    });
  }, []);

  interface IUser {
    id: number;
    name: string;
    age: number;
    address: IAddress;
  }

  interface IAddress {
    city: string;
    country: string;
    zipcode: number;
  }

  function parseInterface<T>(obj: { [key: string]: T }, prefix: string = "") {
    for (const [key, value] of Object.entries(obj)) {
      const type = typeof value;
      console.log(`${prefix}${key}: ${type}`);
      if (type === "object") {
        parseInterface(value, `${prefix}${key}.`);
      }
    }
  }

  const featureList1 = [
    {
      title: "全面提效",
      description:
        "自动对模型、字典、菜单、资源的解析和生成；前后端代码可根据模型类型动态生成；数据封装完善，可不写一行Sql;",
    },
    {
      title: "模型驱动",
      description: "设计模型(Javabean)和添加注释就能渲染出复杂关系的模块功能",
    },
    {
      title: "业务配置",
      description:
        "在可视化设计器里完成对各类模型的命名、布局、样式、校验、联动等方面的配置，实现复杂逻辑",
    },
    {
      title: "低码开发",
      description:
        "在服务端编写复杂逻辑接口，在客户端模版组件里插入生命周期钩子函数即可满足个性化需求",
    },
  ];

  const featureList = [
    {
      title: "学习成本最低",
      description:
        "是最贴近原生企业级研发平台，与传统前后端分离开发一致，上手简单",
    },
    {
      title: "模型驱动",
      description: "设计模型(Javabean)和添加注释就能渲染出复杂关系的模块功能",
    },
    {
      title: "开发流程与原生开发一致",
      description:
        "提供与原生企业级开发一致的开发体验。并配合图形化配置+低码开发，让开发专注于业务逻辑的编写",
    },
    {
      title: "低码开发",
      description:
        "在服务端编写复杂逻辑接口，在客户端模版组件里插入生命周期钩子函数即可满足个性化需求",
    },
  ];

  const minCard = (menu: SysMenu) => {
    return (
      <Card key={menu.code} style={{ maxWidth: 360 }}>
        <Meta
          title={menu.name}
          description={menu.name}
          avatar={
            <Avatar
              size="default"
              src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/card-meta-avatar-docs-demo.jpg"
            />
          }
        />
      </Card>
    );
  };

  return (
    <div className="w-full ">
      <Banner
        fullMode={false}
        type="success"
        className="border-2 border-dashed border-blue-500  p-4"
        icon={null}
        closeIcon={null}
        title={
          <div
            style={{
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "30px",
            }}
            className=" text-neutral-950"
          >
            <span className=" text-red-600">{user && user.name}</span>
            ,你好,欢迎使用微徕低代码研发平台
          </div>
        }
        description={
          <ul>
            <li className=" font-bold "></li>
            <li></li>
          </ul>
        }
      />

      {/* <div className=" flex space-x-8 rounded-lg shadow-md">
           {apps.map((menu, index) => {
             return minCard(menu);
           })}
         </div> */}
      <div className="flex bg-white">
        <div className="container mx-auto py-10 w-1/3 p-4  rounded-2xl shadow-md">
          <div className="flex flex-col md:flex-row gap-8">
            {/* <div className=" w-1/6">
                 
               </div> */}
            <div className="">
              <div className=" flex justify-between">
                <div className="text-2xl flex font-bold mb-4 items-start">
                  {/* <img src={logo} style={{ width: 30, height: 30 }} /> */}
                  <div>微徕(V-LIFE)低代码研发平台</div>
                </div>
                <div className="items-end">
                  <a
                    href="http://vlife.cc"
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-1 rounded-md shadow-md inline-block"
                    target={"_blank"}
                  >
                    开发指南
                  </a>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                一款模型驱动的低代码平台，如果你有以下需求，Vlife
                就是为你设计的。
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>提升研发效能，优化开发流程，聚焦业务能力,沉淀研发资产</li>
                <li>
                  开发组织内部管理系统 通过模型驱动开发，满足大部分业务需求
                </li>
                <li>协助沉淀公司级研发资产,能几倍提升研发效能</li>
                <li>可以非常方便的进行扩展开发 私有部署，掌控全部代码和数据</li>
                <li>可免费使用，也可以付费获得更多技术支持</li>
              </ul>
            </div>
          </div>
        </div>
        <div className=" w-2/3">
          <div className="bg-gray-100 py-4">
            <div className="container px-4 mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featureList.map((feature, index) => (
                  <div
                    className="bg-white rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg hover:bg-gray-50"
                    key={index}
                  >
                    <div className="p-3">
                      <h3 className="text-xl font-semibold mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full  bg-white">
        <div className=" w-1/3 p-4  bg-white space-y-4">
          <Banner
            fullMode={false}
            type="danger"
            bordered
            icon={null}
            closeIcon={null}
            title={
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "30px",
                }}
              >
                建设理念
              </div>
            }
            description={
              <ul>
                <li className=" font-bold ">
                  我们在寻找全职、远程的产品设计、开发、测试的新同事加入团队，如果你对
                  vlife 有强烈的兴趣，欢迎给我们发邮件：vlifelowcode@163.com
                </li>
                <li></li>
              </ul>
            }
          />
          <Banner
            fullMode={false}
            type="warning"
            bordered
            icon={null}
            closeIcon={null}
            title={
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "30px",
                }}
              >
                团队招聘
              </div>
            }
            description={
              <ul>
                <li className=" font-bold ">
                  我们在寻找全职、远程的产品设计、开发、测试的新同事加入团队，如果你对
                  vlife 有强烈的兴趣，欢迎给我们发邮件：vlifelowcode@163.com
                </li>
                <li></li>
              </ul>
            }
          />
        </div>
        <div className=" w-1/3 p-4">
          <Banner
            fullMode={false}
            type="success"
            bordered
            icon={null}
            closeIcon={null}
            title={
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "30px",
                }}
              >
                助力有礼
              </div>
            }
            description={
              <div>
                <div className=" font-bold">
                  在
                  <a target={"_blank"} href="https://gitee.com/wwwlike/vlife">
                    Gitee
                  </a>
                  /
                  <a target={"_blank"} href="https://github.com/wwwlike/vlife">
                    Github
                  </a>
                  支持我们<span className=" text-red-500">(star/fork)</span>
                  ,可领取“
                  <span className=" text-red-500">报表组件</span>”源码
                </div>
                <div>
                  <Image
                    className={" w-48 top-4"}
                    src="https://wwwlike.gitee.io/vlife-img/wx.jpg"
                  />
                  <span className=" font-bold text-xl">
                    加微信`vlifeboot`领取仓库地址
                  </span>
                </div>
              </div>
            }
          />
        </div>
        <div className=" w-1/3 p-4 bg-white">
          <Banner
            fullMode={false}
            type="warning"
            bordered
            icon={null}
            closeIcon={null}
            title={
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "30px",
                }}
              >
                技术支持
              </div>
            }
            description={
              <div className="flex">
                <div className=" w-1/2">
                  <div className=" font-bold">QQ群</div>
                  <Image
                    className={" w-48 h-48 top-4"}
                    src="https://wwwlike.gitee.io/vlife-img/qqq.png"
                  />
                </div>
                <div className=" w-1/2">
                  <div className=" font-bold">微信群</div>
                  <Image
                    className={" w-44  h-44 top-4"}
                    src="https://wwwlike.gitee.io/vlife-img/wxq.jpg"
                  />
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};
