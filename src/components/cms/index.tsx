import React from "react";
import "./index.less"; // 引入 css
import CmsHeader from "./header";
import { Carousel, Typography, Space } from "@douyinfe/semi-ui";
import logo from "@src/logo.png";
import VfCarousel from "./carousel";
import VfItem from "./item";
import VfImgList from "./product/ImgList";
const Cms = () => {
  return (
    <div>
      {/* 菜单栏 */}
      <CmsHeader />
      {/* 轮播图 */}
      <VfCarousel className=" h-72 mt-1" />
      {/* 特色能力 */}
      <VfItem />
      {/* 产品列表 */}
      <VfImgList title="解决方案" more="查看全部" />
      <div className="bg-white">
        <div className="max-w-2xl mx-auto py-24 px-4 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Protect your device
            </h2>
            <p className="mt-4 text-gray-500">
              As a digital creative, your laptop or tablet is at the center of
              your work. Keep your device safe with a fabric sleeve that matches
              in quality and looks.
            </p>
          </div>

          <div className="mt-16 space-y-16">
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 lg:gap-x-8 lg:items-center">
              <div className="mt-6 lg:mt-0 lg:row-start-1 lg:col-span-5 xl:col-span-4 lg:col-start-1">
                <h3 className="text-lg font-medium text-gray-900">
                  Minimal and thoughtful
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Our laptop sleeve is compact and precisely fits 13&quot;
                  devices. The zipper allows you to access the interior with
                  ease, and the front pouch provides a convenient place for your
                  charger cable.
                </p>
              </div>
              <div className="flex-auto lg:row-start-1 lg:col-span-7 xl:col-span-8 lg:col-start-6 xl:col-start-5">
                <div className="aspect-w-5 aspect-h-2 rounded-lg bg-gray-100 overflow-hidden">
                  <img
                    src="https://tailwindui.com/img/ecommerce-images/product-feature-07-detail-01.jpg"
                    alt="White canvas laptop sleeve with gray felt interior, silver zipper, and tan leather zipper pull."
                    className="object-center object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 lg:gap-x-8 lg:items-center">
              <div className="mt-6 lg:mt-0 lg:row-start-1 lg:col-span-5 xl:col-span-4 lg:col-start-8 xl:col-start-9">
                <h3 className="text-lg font-medium text-gray-900">
                  Refined details
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  We design every detail with the best materials and finishes.
                  This laptop sleeve features durable canvas with
                  double-stitched construction, a felt interior, and a high
                  quality zipper that hold up to daily use.
                </p>
              </div>
              <div className="flex-auto lg:row-start-1 lg:col-span-7 xl:col-span-8 lg:col-start-1">
                <div className="aspect-w-5 aspect-h-2 rounded-lg bg-gray-100 overflow-hidden">
                  <img
                    src="https://tailwindui.com/img/ecommerce-images/product-feature-07-detail-02.jpg"
                    alt="Detail of zipper pull with tan leather and silver rivet."
                    className="object-center object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section aria-labelledby="trending-heading">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 sm:py-32 lg:pt-12 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <h2
              id="favorites-heading"
              className="text-2xl font-extrabold tracking-tight text-gray-900"
            >
              公司新闻
            </h2>
            <a
              href="#"
              className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block"
            >
              更多新闻消息<span aria-hidden="true"> &rarr;</span>
            </a>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
            <div className="group relative">
              <div className="w-full h-56 rounded-md overflow-hidden group-hover:opacity-75 lg:h-72 xl:h-80">
                <img
                  src="https://www.ymtc.com/cn/resources/image/20220727/1560784719956306cb0b79888a9e7480.png"
                  alt="Hand stitched, orange leather long wallet."
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">
                <a href="#">
                  <span className="absolute inset-0"></span>
                  新产品横空出世
                </a>
              </h3>
              <p className="mt-1 text-sm text-gray-500">2022-10-11</p>
              <p className="mt-1 text-sm font-medium text-gray-900">硬盘</p>
            </div>

            <div className="group relative">
              <div className="w-full h-56 rounded-md overflow-hidden group-hover:opacity-75 lg:h-72 xl:h-80">
                <img
                  src="https://www.ymtc.com/cn/resources/image/20220726/0baacee7f0622d9e9d722a47bd98d0c9.jpg"
                  alt="Hand stitched, orange leather long wallet."
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">
                <a href="#">
                  <span className="absolute inset-0"></span>
                  Leather Long Wallet
                </a>
              </h3>
              <p className="mt-1 text-sm text-gray-500">Natural</p>
              <p className="mt-1 text-sm font-medium text-gray-900">$75</p>
            </div>

            <div className="group relative">
              <div className="w-full h-56 rounded-md overflow-hidden group-hover:opacity-75 lg:h-72 xl:h-80">
                <img
                  src="https://www.ymtc.com/cn/1ca/image/20210629/25529734118fcb7ff581be200187bc2b.png"
                  alt="Hand stitched, orange leather long wallet."
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">
                <a href="#">
                  <span className="absolute inset-0"></span>
                  Leather Long Wallet
                </a>
              </h3>
              <p className="mt-1 text-sm text-gray-500">Natural</p>
              <p className="mt-1 text-sm font-medium text-gray-900">$75</p>
            </div>

            <div className="group relative">
              <div className="w-full h-56 rounded-md overflow-hidden group-hover:opacity-75 lg:h-72 xl:h-80">
                <img
                  src="https://www.ymtc.com/cn/1ca/image/20210629/17e9e18a6cfc31cf5eadc531c946e94d.gif"
                  alt="Hand stitched, orange leather long wallet."
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">
                <a href="#">
                  <span className="absolute inset-0"></span>
                  Leather Long Wallet
                </a>
              </h3>
              <p className="mt-1 text-sm text-gray-500">Natural</p>
              <p className="mt-1 text-sm font-medium text-gray-900">$75</p>
            </div>
          </div>

          <div className="mt-8 text-sm md:hidden">
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Shop the collection<span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
        </div>
      </section>

      <footer aria-labelledby="footer-heading" className="bg-gray-50">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 py-20">
            <div className="grid grid-cols-1 md:grid-cols-12 md:grid-flow-col md:gap-x-8 md:gap-y-16 md:auto-rows-min">
              <div className="col-span-1 md:col-span-2 lg:row-start-1 lg:col-start-1">
                <img
                  src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
                  alt=""
                  className="h-8 w-auto"
                />
              </div>

              <div className="mt-10 col-span-6 grid grid-cols-2 gap-8 sm:grid-cols-3 md:mt-0 md:row-start-1 md:col-start-3 md:col-span-8 lg:col-start-2 lg:col-span-6">
                <div className="grid grid-cols-1 gap-y-12 sm:col-span-2 sm:grid-cols-2 sm:gap-x-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Products
                    </h3>
                    <ul role="list" className="mt-6 space-y-6">
                      <li className="text-sm">
                        <a
                          href="#"
                          className="text-gray-500 hover:text-gray-600"
                        >
                          {" "}
                          Bags{" "}
                        </a>
                      </li>

                      <li className="text-sm">
                        <a
                          href="#"
                          className="text-gray-500 hover:text-gray-600"
                        >
                          {" "}
                          Tees{" "}
                        </a>
                      </li>

                      <li className="text-sm">
                        <a
                          href="#"
                          className="text-gray-500 hover:text-gray-600"
                        >
                          {" "}
                          Objects{" "}
                        </a>
                      </li>

                      <li className="text-sm">
                        <a
                          href="#"
                          className="text-gray-500 hover:text-gray-600"
                        >
                          {" "}
                          Home Goods{" "}
                        </a>
                      </li>

                      <li className="text-sm">
                        <a
                          href="#"
                          className="text-gray-500 hover:text-gray-600"
                        >
                          {" "}
                          Accessories{" "}
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Company
                    </h3>
                    <ul role="list" className="mt-6 space-y-6">
                      <li className="text-sm">
                        <a
                          href="#"
                          className="text-gray-500 hover:text-gray-600"
                        >
                          Who we are
                        </a>
                      </li>

                      <li className="text-sm">
                        <a
                          href="#"
                          className="text-gray-500 hover:text-gray-600"
                        >
                          Sustainability
                        </a>
                      </li>

                      <li className="text-sm">
                        <a
                          href="#"
                          className="text-gray-500 hover:text-gray-600"
                        >
                          Press
                        </a>
                      </li>

                      <li className="text-sm">
                        <a
                          href="#"
                          className="text-gray-500 hover:text-gray-600"
                        >
                          Careers
                        </a>
                      </li>

                      <li className="text-sm">
                        <a
                          href="#"
                          className="text-gray-500 hover:text-gray-600"
                        >
                          Terms &amp; Conditions
                        </a>
                      </li>

                      <li className="text-sm">
                        <a
                          href="#"
                          className="text-gray-500 hover:text-gray-600"
                        >
                          Privacy
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Customer Service
                  </h3>
                  <ul role="list" className="mt-6 space-y-6">
                    <li className="text-sm">
                      <a href="#" className="text-gray-500 hover:text-gray-600">
                        Contact
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-500 hover:text-gray-600">
                        Shipping
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-500 hover:text-gray-600">
                        Returns
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-500 hover:text-gray-600">
                        Warranty
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-500 hover:text-gray-600">
                        Secure Payments
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-500 hover:text-gray-600">
                        FAQ
                      </a>
                    </li>

                    <li className="text-sm">
                      <a href="#" className="text-gray-500 hover:text-gray-600">
                        Find a store
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 md:mt-0 md:row-start-2 md:col-start-3 md:col-span-8 lg:row-start-1 lg:col-start-9 lg:col-span-4">
                <h3 className="text-sm font-medium text-gray-900">
                  Sign up for our newsletter
                </h3>
                <p className="mt-6 text-sm text-gray-500">
                  The latest deals and savings, sent to your inbox weekly.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 py-10 text-center">
            <p className="text-sm text-gray-500">
              &copy; 2021 Workflow, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default Cms;
