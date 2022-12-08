import React, { useEffect } from "react";

export interface vvvProps {
  name: string;
  id: string;
}

export default (data: vvvProps) => {
  useEffect(() => {
    console.log("tttttttttt", data);
    // alert(data);
    // alert(JSON.stringify(data.id));
  }, [data]);
  return <div>333{JSON.stringify(data.name)}</div>;
};
