// utils/toPersianNumber.js
const PERSIAN_DIGITS = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];

/**
 * Convert any number-like value to Persian digits.
 * • If the value is purely numeric, commas are inserted every 3 digits.  
 * • If it already contains non-digit chars (e.g. “1234-5678”), the string
 *   is left intact except for the digit substitution.
 */
export default function toPersianNumber(value) {
  if (value === null || value === undefined) return "";
  const s = value.toString();
  const withComma = /^\d+$/.test(s)     // plain digits only?
    ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : s;
  return withComma.replace(/\d/g, d => PERSIAN_DIGITS[d]);
}
