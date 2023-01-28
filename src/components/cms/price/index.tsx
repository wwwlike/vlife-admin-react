import React from "react";
import VfBanner from "../banner";

const Price = () => {
  const Support = (): any => {
    return (
      <svg
        className="h-5 w-5 text-green-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    );
  };
  return (
    <div className="bg-white">
      <VfBanner />
      <div className="max-w-2xl mx-auto bg-white py-16 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="">
          <table className="w-full h-px table-fixed">
            <thead>
              <tr>
                <th
                  className="pb-4 pl-6 pr-6 text-sm font-medium text-gray-900 text-left"
                  scope="col"
                >
                  <span className="sr-only">Feature by</span>
                  <span>版本</span>
                </th>

                <th
                  className="w-1/4 pb-4 px-6 text-lg leading-6 font-medium text-gray-900 text-left"
                  scope="col"
                >
                  开源版
                </th>

                <th
                  className="w-1/4 pb-4 px-6 text-lg leading-6 font-medium text-gray-900 text-left"
                  scope="col"
                >
                  组件版
                </th>

                <th
                  className="w-1/4 pb-4 px-6 text-lg leading-6 font-medium text-gray-900 text-left"
                  scope="col"
                >
                  高级版
                </th>
              </tr>
            </thead>
            <tbody className="border-t border-gray-200 divide-y divide-gray-200">
              <tr>
                <th
                  className="py-8 pl-6 pr-6 align-top text-sm font-medium text-gray-900 text-left"
                  scope="row"
                >
                  价格
                </th>

                <td className="h-full py-8 px-6 align-top">
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <p>
                        <span className="text-4xl font-extrabold text-gray-900">
                          开源免费
                        </span>
                      </p>
                      <p className="mt-4 text-sm text-gray-500">
                        遵守开源协议的基础之上免费使用
                      </p>
                    </div>
                    <a
                      href="#"
                      className="mt-6 block w-full bg-gradient-to-r from-orange-500 to-pink-500 border border-transparent rounded-md shadow py-2 text-sm font-semibold text-white text-center hover:to-pink-600"
                    >
                      开源版本免费
                    </a>
                  </div>
                </td>

                <td className="h-full py-8 px-6 align-top">
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <p>
                        <span className="text-4xl font-extrabold text-gray-900">
                          $29
                        </span>
                        <span className="text-base font-medium text-gray-500">
                          /mo
                        </span>
                      </p>
                      <p className="mt-4 text-sm text-gray-500">
                        Quis eleifend a tincidunt pellentesque. A tempor in sed.
                      </p>
                    </div>
                    <a
                      href="#"
                      className="mt-6 block w-full bg-gradient-to-r from-orange-500 to-pink-500 border border-transparent rounded-md shadow py-2 text-sm font-semibold text-white text-center hover:to-pink-600"
                    >
                      Buy Essential
                    </a>
                  </div>
                </td>

                <td className="h-full py-8 px-6 align-top">
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <p>
                        <span className="text-4xl font-extrabold text-gray-900">
                          $59
                        </span>
                        <span className="text-base font-medium text-gray-500">
                          /mo
                        </span>
                      </p>
                      <p className="mt-4 text-sm text-gray-500">
                        Orci volutpat ut sed sed neque, dui eget. Quis tristique
                        non.
                      </p>
                    </div>
                    <a
                      href="#"
                      className="mt-6 block w-full bg-gradient-to-r from-orange-500 to-pink-500 border border-transparent rounded-md shadow py-2 text-sm font-semibold text-white text-center hover:to-pink-600"
                    >
                      Buy Premium
                    </a>
                  </div>
                </td>
              </tr>

              <tr>
                <th
                  className="py-3 pl-6 bg-gray-50 text-sm font-medium text-gray-900 text-left"
                  colSpan={4}
                  scope="colgroup"
                >
                  功能点
                </th>
              </tr>

              <tr>
                <th
                  className="py-5 pl-6 pr-6 text-sm font-normal text-gray-500 text-left"
                  scope="row"
                >
                  全开源.
                </th>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <Support />
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <Support />
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Premium</span>
                </td>
              </tr>

              <tr>
                <th
                  className="py-5 pl-6 pr-6 text-sm font-normal text-gray-500 text-left"
                  scope="row"
                >
                  Urna purus felis.
                </th>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Basic</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Essential</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Premium</span>
                </td>
              </tr>

              <tr>
                <th
                  className="py-5 pl-6 pr-6 text-sm font-normal text-gray-500 text-left"
                  scope="row"
                >
                  Tellus pulvinar sit dictum.
                </th>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/minus --> */}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Not included in Basic</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Essential</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Premium</span>
                </td>
              </tr>

              <tr>
                <th
                  className="py-5 pl-6 pr-6 text-sm font-normal text-gray-500 text-left"
                  scope="row"
                >
                  Convallis.
                </th>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/minus --> */}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Not included in Basic</span>
                </td>

                <td className="py-5 px-6">
                  <span className="block text-sm text-gray-700">
                    Up to 20 users
                  </span>
                </td>

                <td className="py-5 px-6">
                  <span className="block text-sm text-gray-700">
                    Up to 50 users
                  </span>
                </td>
              </tr>

              <tr>
                <th
                  className="py-3 pl-6 bg-gray-50 text-sm font-medium text-gray-900 text-left"
                  colSpan={4}
                  scope="colgroup"
                >
                  Reporting
                </th>
              </tr>

              <tr>
                <th
                  className="py-5 pl-6 pr-6 text-sm font-normal text-gray-500 text-left"
                  scope="row"
                >
                  Adipiscing.
                </th>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Basic</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Essential</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Premium</span>
                </td>
              </tr>

              <tr>
                <th
                  className="py-5 pl-6 pr-6 text-sm font-normal text-gray-500 text-left"
                  scope="row"
                >
                  Eget risus integer.
                </th>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/minus --> */}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Not included in Basic</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Essential</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Premium</span>
                </td>
              </tr>

              <tr>
                <th
                  className="py-5 pl-6 pr-6 text-sm font-normal text-gray-500 text-left"
                  scope="row"
                >
                  Gravida leo urna velit.
                </th>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/minus --> */}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Not included in Basic</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/minus --> */}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Not included in Essential</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Premium</span>
                </td>
              </tr>

              <tr>
                <th
                  className="py-5 pl-6 pr-6 text-sm font-normal text-gray-500 text-left"
                  scope="row"
                >
                  Elementum ut dapibus mi feugiat cras nisl.
                </th>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/minus --> */}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Not included in Basic</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/minus --> */}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Not included in Essential</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Premium</span>
                </td>
              </tr>

              <tr>
                <th
                  className="py-3 pl-6 bg-gray-50 text-sm font-medium text-gray-900 text-left"
                  colSpan={4}
                  scope="colgroup"
                >
                  Support
                </th>
              </tr>

              <tr>
                <th
                  className="py-5 pl-6 pr-6 text-sm font-normal text-gray-500 text-left"
                  scope="row"
                >
                  Sit dignissim.
                </th>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Basic</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Essential</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Premium</span>
                </td>
              </tr>

              <tr>
                <th
                  className="py-5 pl-6 pr-6 text-sm font-normal text-gray-500 text-left"
                  scope="row"
                >
                  Congue at nibh et.
                </th>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/minus --> */}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Not included in Basic</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Essential</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Premium</span>
                </td>
              </tr>

              <tr>
                <th
                  className="py-5 pl-6 pr-6 text-sm font-normal text-gray-500 text-left"
                  scope="row"
                >
                  Volutpat feugiat mattis.
                </th>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/minus --> */}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Not included in Basic</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Essential</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Premium</span>
                </td>
              </tr>

              <tr>
                <th
                  className="py-5 pl-6 pr-6 text-sm font-normal text-gray-500 text-left"
                  scope="row"
                >
                  Tristique pellentesque ornare diam sapien.
                </th>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/minus --> */}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Not included in Basic</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/minus --> */}
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Not included in Essential</span>
                </td>

                <td className="py-5 px-6">
                  {/* <!-- Heroicon name: solid/check --> */}
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Included in Premium</span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200">
                <th className="sr-only" scope="row">
                  Choose your plan
                </th>

                <td className="pt-5 px-6">
                  <a
                    href="#"
                    className="block w-full bg-gradient-to-r from-orange-500 to-pink-500 border border-transparent rounded-md shadow py-2 text-sm font-semibold text-white text-center hover:to-pink-600"
                  >
                    Buy Basic
                  </a>
                </td>

                <td className="pt-5 px-6">
                  <a
                    href="#"
                    className="block w-full bg-gradient-to-r from-orange-500 to-pink-500 border border-transparent rounded-md shadow py-2 text-sm font-semibold text-white text-center hover:to-pink-600"
                  >
                    Buy Essential
                  </a>
                </td>

                <td className="pt-5 px-6">
                  <a
                    href="#"
                    className="block w-full bg-gradient-to-r from-orange-500 to-pink-500 border border-transparent rounded-md shadow py-2 text-sm font-semibold text-white text-center hover:to-pink-600"
                  >
                    Buy Premium
                  </a>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      {/* 
  
      <div className="max-w-7xl mx-auto border-t border-gray-200 py-12 px-4 sm:px-6 lg:py-20 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <img
              className="h-12"
              src="https://tailwindui.com/img/logos/tuple-logo-gray-400.svg"
              alt="Tuple"
            />
          </div>
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <img
              className="h-12"
              src="https://tailwindui.com/img/logos/mirage-logo-gray-400.svg"
              alt="Mirage"
            />
          </div>
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <img
              className="h-12"
              src="https://tailwindui.com/img/logos/statickit-logo-gray-400.svg"
              alt="StaticKit"
            />
          </div>
          <div className="col-span-1 flex justify-center md:col-span-3 lg:col-span-1">
            <img
              className="h-12"
              src="https://tailwindui.com/img/logos/transistor-logo-gray-400.svg"
              alt="Transistor"
            />
          </div>
          <div className="col-span-2 flex justify-center md:col-span-3 lg:col-span-1">
            <img
              className="h-12"
              src="https://tailwindui.com/img/logos/workcation-logo-gray-400.svg"
              alt="Workcation"
            />
          </div>
        </div>
      </div> */}
    </div>
  );
};
export default Price;
