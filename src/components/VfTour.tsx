/**
 * 使用步骤引导组件封装
 * 1. 先记录是否引导内容到localStroge里（后期记录到数据库），避免每次提醒
 * 2. 一个包裹组件，定义
 */
import { Button } from "@douyinfe/semi-ui";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Tour from "reactour";

interface VfTourProps {
  children: any;
  every?: boolean; //是否
  steps: { selector: string; content: any }[];
}

const VfTour = ({ steps, every = false, children, ...props }: VfTourProps) => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (localStorage.getItem(`tour${pathname}`) === null || every) {
      setTimeout(() => {
        setOpen(true);
      }, 1000);
      localStorage.setItem(`tour${pathname}`, "tour");
    }
  }, []);
  return (
    <>
      {children}
      <Tour
        // maskSpace={200}
        // showButtons={false}
        showNavigationNumber={false}
        // showNavigation={false}
        steps={steps}
        isOpen={open}
        onRequestClose={() => {
          setOpen(false);
        }}
      />
      {/* <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        {" "}
        222222
      </Button> */}
    </>
  );
};

export default VfTour;
