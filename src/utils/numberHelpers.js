const PERSIAN_DIGIT_OFFSET = "۰".charCodeAt(0);
const ARABIC_DIGIT_OFFSET = "٠".charCodeAt(0);

export function persianToEnglishDigits(value) {
  if (value === null || value === undefined) return value;

  return value.toString().replace(/[۰-۹٠-٩]/g, (digit) => {
    const code = digit.charCodeAt(0);
    const offset = code >= ARABIC_DIGIT_OFFSET && code <= ARABIC_DIGIT_OFFSET + 9
      ? ARABIC_DIGIT_OFFSET
      : PERSIAN_DIGIT_OFFSET;

    return String(code - offset);
  });
}
