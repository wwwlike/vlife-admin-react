import React, { useState } from "react";
import TestDataChange, { Family, TestDataChangeProps } from "./TestDataChange";

const TestIndex = () => {
  const [data, setData] = useState<Family[]>();

  return (
    <div>
      {JSON.stringify(data)}
      <br></br>
      =--------------------------------=
      <br></br>
      <TestDataChange
        family={data}
        onDataChange={(d) => {
          setData(d);
        }}
      />
    </div>
  );
};

export default TestIndex;
