import { useState, useCallback } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import toPersianNumber from "../../../utils/toPersianNumber";

function Counter({ label, value, setValue, min = 0, max = 12 }) {
  const inc = useCallback(() => value < max && setValue((n) => n + 1), [value, max, setValue]);
  const dec = useCallback(() => value > min && setValue((n) => n - 1), [value, min, setValue]);

  return (
    <div className="flex items-center justify-between px-2 py-1 text-primary-800">
      {/* decrement */}
      <button
        onClick={dec}
        disabled={value <= min}
        className={`flex items-center justify-center px-2 py-1 ${
          value <= min
            ? "cursor-not-allowed text-primary-50"
            : "cursor-pointer text-primary-700"
        }`}
      >
        <MinusIcon className="w-8 h-8 bg-primary-500 text-primary-50 p-1 rounded-full shadow-centered shadow-primary-100/90" />
      </button>

      {/* value + label */}
      <span className="font-semibold whitespace-nowrap">
        {toPersianNumber(value)} {label}
      </span>

      {/* increment */}
      <button
        onClick={inc}
        disabled={value >= max}
        className={`flex items-center justify-center px-2 py-1 ${
          value >= max ? "cursor-not-allowed text-gray-400" : "cursor-pointer"
        }`}
      >
        <PlusIcon className="w-8 h-8 bg-primary-500 text-primary-50 p-1 rounded-full shadow-centered shadow-primary-100/90" />
      </button>
    </div>
  );
}

export default function BedsRoomsFilter() {
  const [beds, setBeds]   = useState(0);
  const [rooms, setRooms] = useState(0);

  return (
    <div className="space-y-3 md:w-52">
      {/* title */}
      <div className="flex items-center h-7 justify-between">
        <span className="font-medium text-primary-800">تعداد تخت و اتاق</span>
      </div>

      {/* counters box */}
      <div className="rounded-3xl border border-primary-600 shadow-centered shadow-primary-50/90 overflow-hidden divide-y divide-primary-100/60">
        <Counter label="تخت"  value={beds}  setValue={setBeds}  min={0} max={12} />
        <Counter label="اتاق" value={rooms} setValue={setRooms} min={0} max={12} />
      </div>
    </div>
  );
}
