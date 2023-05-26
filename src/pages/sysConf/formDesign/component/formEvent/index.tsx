// import { FormEventDto } from "@src/api/FormEvent";
// import React from "react";

// const FormEvent = (events: FormEventDto[]) => {
//   return <div></div>;
// };

// export default FormEvent;

import { useState } from "react";

function RecordList() {
  const [records, setRecords] = useState([
    { id: 1, text: "Record 1" },
    { id: 2, text: "Record 2" },
    { id: 3, text: "Record 3" },
  ]);
  const [text, setText] = useState("");

  const handleAddRecord = () => {
    const newRecord = { id: records.length + 1, text: text };
    setRecords([...records, newRecord]);
    setText("");
  };

  const handleDeleteRecord = (id) => {
    const newRecords = records.filter((record) => record.id !== id);
    setRecords(newRecords);
  };

  const handleEditRecord = (id, text) => {
    const newRecords = records.map((record) => {
      if (record.id === id) {
        return { ...record, text: text };
      } else {
        return record;
      }
    });
    setRecords(newRecords);
  };

  return (
    <div className="container mx-auto px-4 py-4 bg-gray-100">
      <div>
        {records.map((record) => (
          <div
            key={record.id}
            className="flex items-center py-2 border-b border-gray-400"
          >
            <div className="w-1/6 text-gray-700">{record.id}</div>
            <div className="w-4/6">
              <input
                type="text"
                className="bg-white w-full px-4 py-2 text-gray-700 rounded border border-gray-400 focus:outline-none focus:border-blue-500"
                value={record.text}
                onChange={(e) => handleEditRecord(record.id, e.target.value)}
              />
            </div>
            <div className="w-1/6 text-right">
              <button
                className="bg-red-500 hover:bg-red-600 px-2 py-1 text-white rounded-lg mr-2"
                onClick={() => handleDeleteRecord(record.id)}
              >
                Delete
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 px-2 py-1 text-white rounded-lg"
                onClick={() => alert("Edit record " + record.id)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center py-2">
        <input
          type="text"
          className="bg-white w-4/6 px-4 py-2 text-gray-700 rounded border border-gray-400 focus:outline-none focus:border-blue-500"
          placeholder="New record"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="bg-green-500 hover:bg-green-600 px-2 py-1 text-white rounded-lg ml-2"
          onClick={handleAddRecord}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default RecordList;
