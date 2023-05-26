import VfTour from "@src/components/VfTour";
import React from "react";

/**
 * vlife的模型设计器
 */
export default () => {
  return (
    <VfTour
      code="4444"
      // every={true}
      steps={[
        {
          selector: ".fieldSelectTour",
          content: "选择表单需要的字段，并且进行排序",
        },
        {
          selector: ".formSettingTour",
          content: "对表单布局进行整体设置",
        },
        {
          selector: ".compSetting",
          content: "对单个字段进行设置",
        },
      ]}
    >
      <div className="fieldSelectTour">1111111111</div>
      <div className="formSettingTour">222222</div>
      <div className="compSetting">22222233</div>
    </VfTour>
  );
};
