import React, { useState } from "react";
import { Range, getTrackBackground } from "react-range";
import { toPersian, toLatin } from "../../../utils/toPersianDigits";

const MIN  = 0;
const MAX  = 20_000_000;      // ۲۰ میلیون تومان
const STEP = 50_000;          // گام ۵۰ هزار تومانی

/* 1234567  →  ۱,۲۳۴,۵۶۷  (Persian digits + ASCII commas) */
const fmt = (n) =>
  toPersian(n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));  // add commas first, then localise digits

export default function PriceRangeFilter({ onChange }) {
  const [values, setValues] = useState([MIN, MAX]); // [min , max]

  const handle = (vals) => {
    setValues(vals);
    onChange?.({ min: vals[0], max: vals[1] });
  };

  /* convert user-typed Persian/Latin digits → JS number */
  const parseInput = (value, fallback) => {
    const cleaned = toLatin(value)      // Persian → Latin
      .replace(/[,\u066C\s\u200c\u200f\u202a-\u202e]|تومان/g, ""); // strip commas, RTL marks, “تومان”, spaces
    const num = +cleaned;
    return Number.isFinite(num) && num >= MIN ? num : fallback;
  };

  return (
    <div className="space-y-4 px-2" dir="rtl">
      <h3 className="text-sm font-medium">محدوده اجاره‌بها (تومان)</h3>

      {/* ─── Slider (RTL) ─── */}
      <Range
        rtl
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={handle}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-2 rounded-md overflow-visible"
            style={{
              ...props.style,
              background: getTrackBackground({
                values,
                colors: ["#d1d5db", "#006f8c", "#d1d5db"],
                min: MIN,
                max: MAX,
                rtl: true,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, index, isDragged }) => (
          <div
            {...props}
            className={`w-5 h-5 rounded-full border-2 border-white shadow z-10
                        transition-transform duration-150
                        ${isDragged ? "scale-110 bg-primary-600"
                                     : "bg-primary-500"}`}
          >
            <span className="sr-only">
              {index === 0 ? "حداقل" : "حداکثر"} {fmt(values[index])} تومان
            </span>
          </div>
        )}
      />

      {/* ─── Numeric inputs (min right, max left) ─── */}
      <div className="flex flex-row-reverse gap-2">
        {/* max */}
        <input
          type="text"
          inputMode="numeric"
          value={`${fmt(values[1])} تومان`}
          onChange={(e) =>
            handle([values[0], parseInput(e.target.value, MAX)])
          }
          className="border border-primary-300 focus:border-primary-500 outline-none rounded-3xl p-2 w-full placeholder-primary-600"
          placeholder="حداکثر"
        />
        {/* min */}
        <input
          type="text"
          inputMode="numeric"
          value={`${fmt(values[0])} تومان`}
          onChange={(e) =>
            handle([parseInput(e.target.value, MIN), values[1]])
          }
          className="border border-primary-300 focus:border-primary-500 outline-none rounded-3xl p-2 w-full placeholder-primary-600"
          placeholder="حداقل"
        />
      </div>

      {/* ─── Text summary ─── */}
      <p className="text-xs text-primary-600">
        از&nbsp;{fmt(values[0])}&nbsp;تا&nbsp;{fmt(values[1])}&nbsp;تومان
      </p>
    </div>
  );
}
