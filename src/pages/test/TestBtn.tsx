import { Input } from "@douyinfe/semi-ui";
import Button from "@douyinfe/semi-ui/lib/es/button/Button";
import React from "react";

export default ({
  data,
  onChange,
}: {
  data: any;
  onChange: (d: any) => void;
}) => {
  return (
    <div>
      <Input
        value={data}
        onChange={(d) => {
          onChange(d);
        }}
      />
    </div>
  );
};
