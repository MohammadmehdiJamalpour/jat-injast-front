import React from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import toPersianNumber from "../../../utils/toPersianNumber";

const PeopleDropdown = ({ selectedPeople, setSelectedPeople }) => {
  const handleIncrement = () => {
    if (selectedPeople < 12) {
      setSelectedPeople((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (selectedPeople > 1) {
      setSelectedPeople((prev) => prev - 1);
    }
  };

  return (
    <div className="flex items-center justify-between text-primary-800 py-1 px-2 w-full">
      <button
        className={`flex items-center justify-center  px-2 py-1 ${
          selectedPeople > 1
            ? "cursor-pointer text-primary-700"
            : "cursor-not-allowed text-primary-50"
        }`}
        onClick={handleDecrement}
        disabled={selectedPeople <= 1}
      >
        <MinusIcon className="w-8 bg-primary-500 shadow-centered shadow-primary-100/90 text-primary-50 p-1 rounded-full h-8" />
      </button>

      <span className="font-semibold">
        {toPersianNumber(selectedPeople)} نفر
      </span>

      <button
        className={`flex items-center justify-center text-gray-700 px-2 py-1 ${
          selectedPeople < 12
            ? "cursor-pointer"
            : "cursor-not-allowed text-gray-400"
        }`}
        onClick={handleIncrement}
        disabled={selectedPeople >= 12}
      >
        <PlusIcon className="w-8 bg-primary-500 shadow-centered shadow-primary-100/90 text-primary-50 p-1 rounded-full h-8" />
      </button>
    </div>
  );
};

export default PeopleDropdown;
