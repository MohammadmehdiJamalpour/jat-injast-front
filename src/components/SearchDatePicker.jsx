import React from "react";
import { Calendar, utils } from "react-modern-calendar-datepicker";

/**
 * SearchDatePicker – شمسی (Jalālī) range selector
 *
 * Props
 * ─────
 * • value:    { from: {year, month, day}|null, to: {…}|null }
 * • onChange: (value) => void
 */
export default function SearchDatePicker({ value, onChange }) {
  return (
    <Calendar
      locale="fa"                       // Persian labels + Jalālī numbers
      value={value}
      onChange={onChange}
      minimumDate={utils().getToday()}  // block past days
      shouldHighlightWeekends
      colorPrimary="#006f8c"
      calendarClassName="rtl-calendar rounded-3xl shadow-centered"
      wrapperClassName="w-full"
    />
  );
}
