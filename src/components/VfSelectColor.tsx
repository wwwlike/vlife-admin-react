import React, { useState } from "react";
// import colors from "tailwindcss/colors";
import cx from "classnames";

const ColorPicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("gray-500");

  const colors = ["blue"];
  const colorTypes = [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ];
  const toggleOpen = () => setIsOpen((open) => !open);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className={`w-8 h-8 rounded-full ${
          selectedColor ? `bg-${selectedColor}` : ""
        } focus:outline-none`}
        onClick={toggleOpen}
      />
      {isOpen && (
        <div className="absolute top-8 right-0 z-50 grid grid-cols-9 gap-2 p-2 bg-white shadow-md rounded-md">
          {colors.map((colorName) => {
            return colorTypes.map((number) => {
              const aaa = `bg-${colorName}-${number}`;
              // alert(className);
              return (
                <button
                  key={`${colorName}-${number}`}
                  //`w-8 h-8 rounded-full ${`bg-gray-800`}`
                  className={`w-8 h-8 rounded-full ${aaa}`}
                  onClick={() => handleColorChange(`${colorName}-${number}`)}
                />
              );
            });
          })}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
