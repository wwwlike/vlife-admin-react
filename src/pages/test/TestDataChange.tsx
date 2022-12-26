import { Button } from "@douyinfe/semi-ui";
import { useCallback, useRef } from "react";
import React from "react";
import TestBtn from "./TestBtn";
export interface Family {
  address: string;
  people: { first: string; last: string }[];
}

export interface TestDataChangeProps {
  family?: Family[];
  onDataChange: (family: Family[]) => void;
}

const TestDataChange = ({ family, onDataChange }: TestDataChangeProps) => {
  const add = useCallback(
    (name: string, name2: string) => {
      alert(JSON.stringify(family));
      if (family) {
        onDataChange([
          ...family,
          { address: "234", people: [{ first: name, last: name2 }] },
        ]);
      } else {
        onDataChange([
          { address: "123", people: [{ first: name, last: name2 }] },
        ]);
      }
    },
    [family]
  );
  const a = useRef(["a", "b"]);

  return (
    <>
      <br></br>
      {JSON.stringify(family)}
      <br></br>
      {a.current.map((n) => {
        return (
          <TestBtn
            key={n}
            onChange={() => {
              alert(JSON.stringify(family?.length));
              add(n, n);
            }}
            data={undefined}
          />
        );
      })}
    </>
  );
};

export default TestDataChange;
