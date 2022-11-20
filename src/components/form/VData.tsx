import { Input } from "@douyinfe/semi-ui";
import React, { useEffect } from "react";

export interface vvvProps {
  name: string;
  id: string;
}

export default ({
  data,
  data1,
  name,
  value,
  onDataChange,
}: {
  data: vvvProps[];
  data1: vvvProps[];
  name: string;
  value: string;
  onDataChange: (a: any) => void;
}) => {
  useEffect(() => {
    // alert(JSON.stringify(data));
  }, []);
  return (
    <div>
      <Input
        onChange={(d) => onDataChange(d)}
        value={value}
        // data
        //   ? JSON.stringify(data.length) +
        //     (data1 ? JSON.stringify(data1.length) : "") +
        //     name
        //   : ""
      />
    </div>
  );
};
