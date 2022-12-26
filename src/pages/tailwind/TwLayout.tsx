import React from "react";
import Draggable from "react-draggable";

/**
 * 布局
 */

const TwLayout = () => {
  return (
    <div className="relative border-blue-600 border-2">
      <div className=" absolute bottom-0 bg-slate-400  border-blue-600 border-2 w-full h-12">
        <Draggable>
          <div>1111111111</div>
        </Draggable>
      </div>
      <div className="  border-blue-600 border-2 bg-slate-400 ">
        <Draggable>
          <div>22222222222</div>
        </Draggable>
      </div>
      <div className="  border-blue-600 border-2 bg-slate-400 ">
        <Draggable>
          <div>33333333</div>
        </Draggable>
      </div>
    </div>
  );
};
export default TwLayout;
