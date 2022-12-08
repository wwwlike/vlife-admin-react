import React from "react";
import logo from "@src/logo.png";

interface VfHeaderProps {}

const VfHeader = () => {
  return (
    <div>
    <div className='fixed w-full top-0 flex  bg-red-200 h-16'>
      <div className="">
        {/* h5显示 */}
        {/* <a href="#" classNameName="js-fh5co-nav-toggle fh5co-nav-toggle" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"><i></i></a> */}
        <a className="flex py-4 px-6 text-3xl leading-10 h-14" href="./"><img src={logo} />Vlife低代码</a>
      </div>
        <ul className='flex items-center justify-between h-16 md:h-20 space-x-24' >
          <li>网站首页</li>
          <li>产品介绍</li>
          <li>1</li>
          <li>1</li>
        </ul>

    {/* <div classNameNameName="p-6 hover:flex-col  max-w-sm my-24 mx-auto bg-white space-x-4 rounded-xl shadow-lg flex flex-col flex-nowrap md:flex-row  items-end space-y-8">
      <div classNameNameName=' w-96 bg-slate-400 hover:bg-white  border-red-200 border-4 border-collapse rounded-xl'>123</div>
      <div classNameNameName=' w-96 bg-slate-700 ' >2333333333333333333333333333333333333333333334</div>
    </div> */}
    </div>

    <div className={' h-3/4'}>122222222</div>
    <div className={' h-3/4'}>3333333333333</div>


    </div>
  //   <div className="bg-white">
  // <header>
  //   <div className="relative bg-white">
  //     <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-6 sm:px-6 md:justify-start md:space-x-10 lg:px-8">
  //       <div className="flex justify-start lg:w-0 lg:flex-1">
  //         <a href="#">
  //           <span className="sr-only">Workflow</span>
  //           <img className="h-8 w-auto sm:h-10" src={logo} alt="" />
  //         </a>
  //       </div>
  //       <div className="-mr-2 -my-2 md:hidden">
  //         <button type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-expanded="false">
  //           <span className="sr-only">Open menu</span>
  //           <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
  //             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
  //           </svg>
  //         </button>
  //       </div>
  //       <nav className="hidden md:flex space-x-10">
  //         <div className="relative">
  //           <button type="button" className="text-gray-500 group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-expanded="false">
  //             <span>Solutions</span>
            
  //             <svg className="text-gray-400 ml-2 h-5 w-5 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
  //               <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
  //             </svg>
  //           </button>

           
  //         </div>

  //         <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900"> 公司介绍 </a>
  //         <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900"> 发展历程 </a>
  //         <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900"> 发展历程 </a>
  //       </nav>
  //       <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
  //         <a href="#" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"> Sign in </a>
  //         <a href="#" className="ml-8 whitespace-nowrap inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:from-purple-700 hover:to-indigo-700"> Sign up </a>
  //       </div>
  //     </div>

     
  //     <div className="absolute z-30 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
  //       <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
  //         <div className="pt-5 pb-6 px-5">
  //           <div className="flex items-center justify-between">
  //             <div>
  //               <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-purple-600-to-indigo-600.svg" alt="Workflow" />
  //             </div>
  //             <div className="-mr-2">
  //               <button type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
  //                 <span className="sr-only">Close menu</span>
  //                 <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
  //                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
  //                 </svg>
  //               </button>
  //             </div>
  //           </div>
  //           <div className="mt-6">
  //             <nav className="grid grid-cols-1 gap-7">
  //               <a href="#" className="-m-3 p-3 flex items-center rounded-lg hover:bg-gray-50">
  //                 <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
  //                   <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
  //                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  //                   </svg>
  //                 </div>
  //                 <div className="ml-4 text-base font-medium text-gray-900">Inbox</div>
  //               </a>

  //               <a href="#" className="-m-3 p-3 flex items-center rounded-lg hover:bg-gray-50">
  //                 <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
  //                   <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
  //                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
  //                   </svg>
  //                 </div>
  //                 <div className="ml-4 text-base font-medium text-gray-900">Messaging</div>
  //               </a>

  //               <a href="#" className="-m-3 p-3 flex items-center rounded-lg hover:bg-gray-50">
  //                 <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
  //                   <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
  //                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
  //                   </svg>
  //                 </div>
  //                 <div className="ml-4 text-base font-medium text-gray-900">Live Chat</div>
  //               </a>

  //               <a href="#" className="-m-3 p-3 flex items-center rounded-lg hover:bg-gray-50">
  //                 <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
  //                   <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
  //                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  //                   </svg>
  //                 </div>
  //                 <div className="ml-4 text-base font-medium text-gray-900">Knowledge Base</div>
  //               </a>
  //             </nav>
  //           </div>
  //         </div>
  //         <div className="py-6 px-5">
  //           <div className="grid grid-cols-2 gap-4">
  //             <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-700"> Pricing </a>
  //             <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-700"> Partners </a>
  //             <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-700"> Company </a>
  //           </div>
  //           <div className="mt-6">
  //             <a href="#" className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:from-purple-700 hover:to-indigo-700"> Sign up </a>
  //             <p className="mt-6 text-center text-base font-medium text-gray-500">
  //               Existing customer?
  //               <a href="#" className="text-gray-900"> Sign in </a>
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // </header></div>
  );
};

export default VfHeader;
