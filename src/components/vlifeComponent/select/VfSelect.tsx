/**
 *
 */

import { Select } from "@douyinfe/semi-ui";
import { VfBaseProps } from "@src/components";
import React from "react";

/**
 * 只支持单选的
 */
export interface VfSelectProps extends VfBaseProps<string, any[]> {
  valField: string;
  labelField: string;
}

const VfSelect = ({ ...props }: VfSelectProps) => {
  return <Select />;
};
