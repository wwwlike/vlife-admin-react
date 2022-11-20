import React, { useEffect } from "react";

export interface vvvProps {
  name: string;
  id: string;
}

export default (data: vvvProps) => {
  useEffect(() => {
    // alert(JSON.stringify(data.id));
  }, [data]);
  return <div>{JSON.stringify(data.id)}</div>;
};
