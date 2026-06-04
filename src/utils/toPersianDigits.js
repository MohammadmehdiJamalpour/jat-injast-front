const PERSIAN_DIGITS = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];

/** Latin → Persian */
export const toPersian = (value = "") =>
  value.toString().replace(/\d/g, d => PERSIAN_DIGITS[d]);

/** Persian → Latin */
export const toLatin = (value = "") =>
  value.toString().replace(/[۰-۹]/g, d => PERSIAN_DIGITS.indexOf(d));
