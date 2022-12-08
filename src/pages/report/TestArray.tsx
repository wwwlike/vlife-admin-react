import { Button } from "@douyinfe/semi-ui";
import { useUpdateEffect } from "ahooks";
import { hostname } from "os";
import { useCallback, useEffect, useState } from "react";

export default () => {
  const [a, setA] = useState<string[]>();

  const [b, setB] = useState<string>();

  useUpdateEffect(() => {
    setA([...(a ? a : []), "aaaaaaa"]);
  }, [b]);

  return (
    <>
      b:{b}
      <br />
      a:{JSON.stringify(a)}
      <Button onClick={() => setB("1111")}>add</Button>
    </>
  );
};
