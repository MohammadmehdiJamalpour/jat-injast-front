const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const PERSIAN_DIGIT_PATTERN = /[۰-۹]/g;

export const toPersian = (value = "") =>
  value.toString().replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);

export const toLatin = (value = "") =>
  value
    .toString()
    .replace(PERSIAN_DIGIT_PATTERN, (digit) => PERSIAN_DIGITS.indexOf(digit));
