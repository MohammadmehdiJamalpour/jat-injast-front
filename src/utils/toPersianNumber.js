import { toPersian } from "./toPersianDigits";

export default function toPersianNumber(value) {
  if (value === null || value === undefined) return "";

  const text = value.toString();
  const formatted = /^\d+$/.test(text)
    ? text.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : text;

  return toPersian(formatted);
}
