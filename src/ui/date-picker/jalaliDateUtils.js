import * as jalaaliNamespace from "jalaali-js";

const jalaali = jalaaliNamespace.default ?? jalaaliNamespace;
const { jalaaliMonthLength, toGregorian, toJalaali } = jalaali;

const JALALI_ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const GREGORIAN_ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const PERSIAN_DIGITS = [
  "\u06f0",
  "\u06f1",
  "\u06f2",
  "\u06f3",
  "\u06f4",
  "\u06f5",
  "\u06f6",
  "\u06f7",
  "\u06f8",
  "\u06f9",
];

export const JALALI_MONTH_NAMES = [
  "\u0641\u0631\u0648\u0631\u062f\u06cc\u0646",
  "\u0627\u0631\u062f\u06cc\u0628\u0647\u0634\u062a",
  "\u062e\u0631\u062f\u0627\u062f",
  "\u062a\u06cc\u0631",
  "\u0645\u0631\u062f\u0627\u062f",
  "\u0634\u0647\u0631\u06cc\u0648\u0631",
  "\u0645\u0647\u0631",
  "\u0622\u0628\u0627\u0646",
  "\u0622\u0630\u0631",
  "\u062f\u06cc",
  "\u0628\u0647\u0645\u0646",
  "\u0627\u0633\u0641\u0646\u062f",
];

export const JALALI_WEEK_DAYS = [
  "\u0634",
  "\u06cc",
  "\u062f",
  "\u0633",
  "\u0686",
  "\u067e",
  "\u062c",
];

export function toPersianDigits(value) {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

export function formatDigits(value, digits = "persian") {
  return digits === "persian" ? toPersianDigits(value) : String(value);
}

export function getJalaliMonthLength(jy, jm) {
  assertValidYearMonth(jy, jm);
  return jalaaliMonthLength(jy, jm);
}

export function createJalaliDate(jy, jm, jd, options = {}) {
  assertValidJalaliDate(jy, jm, jd);

  const gregorian = toGregorian(jy, jm, jd);
  const parts = {
    calendar: "jalali",
    iso: `${jy}-${pad2(jm)}-${pad2(jd)}`,
    gregorianIso: `${gregorian.gy}-${pad2(gregorian.gm)}-${pad2(gregorian.gd)}`,
    jy,
    jm,
    jd,
    gy: gregorian.gy,
    gm: gregorian.gm,
    gd: gregorian.gd,
    value: jy * 10000 + jm * 100 + jd,
  };

  return {
    ...parts,
    display: options.formatDate
      ? options.formatDate(parts)
      : formatJalaliDisplay(parts, options.digits ?? "persian"),
  };
}

export function parseJalaliDate(input, options = {}) {
  if (input === null || input === undefined || input === "") return null;

  if (typeof input === "string") {
    const match = JALALI_ISO_PATTERN.exec(input);
    if (!match) {
      throw new Error(
        `Expected a Jalali ISO date in YYYY-MM-DD format, received "${input}".`,
      );
    }

    return createJalaliDate(
      Number(match[1]),
      Number(match[2]),
      Number(match[3]),
      options,
    );
  }

  if (
    typeof input === "object" &&
    Number.isInteger(input.jy) &&
    Number.isInteger(input.jm) &&
    Number.isInteger(input.jd)
  ) {
    return createJalaliDate(input.jy, input.jm, input.jd, options);
  }

  return null;
}

export function gregorianIsoToJalaliDate(input, options = {}) {
  const gregorian = parseGregorianIsoDate(input);
  if (!gregorian) return null;

  const jalali = toJalaali(gregorian.gy, gregorian.gm, gregorian.gd);
  return createJalaliDate(jalali.jy, jalali.jm, jalali.jd, options);
}

export function getTodayJalali(options = {}) {
  const now = new Date();
  const jalali = toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  return createJalaliDate(jalali.jy, jalali.jm, jalali.jd, options);
}

export function getBirthdayInitialMonth(options = {}) {
  const today = getTodayJalali(options);
  const jy = today.jy - 30;
  const jm = today.jm;
  const jd = Math.min(today.jd, getJalaliMonthLength(jy, jm));

  return createJalaliDate(jy, jm, jd, options);
}

export function compareJalaliDates(a, b) {
  return Math.sign(a.value - b.value);
}

export function isSameJalaliDate(a, b) {
  return Boolean(a && b && a.value === b.value);
}

export function addJalaliDays(date, amount, options = {}) {
  const gregorianDate = new Date(Date.UTC(date.gy, date.gm - 1, date.gd + amount));
  const jalali = toJalaali(
    gregorianDate.getUTCFullYear(),
    gregorianDate.getUTCMonth() + 1,
    gregorianDate.getUTCDate(),
  );

  return createJalaliDate(jalali.jy, jalali.jm, jalali.jd, options);
}

export function addJalaliMonths(date, amount, options = {}) {
  const zeroBasedMonth = date.jm - 1 + amount;
  const jy = date.jy + Math.floor(zeroBasedMonth / 12);
  const jm = positiveModulo(zeroBasedMonth, 12) + 1;
  const jd = Math.min(date.jd, getJalaliMonthLength(jy, jm));

  return createJalaliDate(jy, jm, jd, options);
}

export function getJalaliWeekdayIndex(date) {
  const gregorianDate = new Date(Date.UTC(date.gy, date.gm - 1, date.gd));
  return (gregorianDate.getUTCDay() + 1) % 7;
}

export function buildJalaliMonth(jy, jm, options = {}) {
  const firstDay = createJalaliDate(jy, jm, 1, options);
  const offset = getJalaliWeekdayIndex(firstDay);
  const monthLength = getJalaliMonthLength(jy, jm);
  const cells = [];

  for (let index = 0; index < offset; index += 1) {
    cells.push({ date: null, isOutsideMonth: true, key: `empty-${jy}-${jm}-${index}` });
  }

  for (let day = 1; day <= monthLength; day += 1) {
    const date = createJalaliDate(jy, jm, day, options);
    cells.push({ date, isOutsideMonth: false, key: date.iso });
  }

  return cells;
}

export function getNextJalaliMonth(jy, jm) {
  return jm === 12 ? { jy: jy + 1, jm: 1 } : { jy, jm: jm + 1 };
}

export function getPreviousJalaliMonth(jy, jm) {
  return jm === 1 ? { jy: jy - 1, jm: 12 } : { jy, jm: jm - 1 };
}

export function resolveYearRange(yearRange, baseYear) {
  if (typeof yearRange === "number") {
    const distance = Math.max(0, Math.floor(yearRange));
    return { start: baseYear - distance, end: baseYear + distance };
  }

  if (yearRange) {
    return {
      start: Math.min(yearRange.start, yearRange.end),
      end: Math.max(yearRange.start, yearRange.end),
    };
  }

  return { start: baseYear - 50, end: baseYear + 50 };
}

function formatJalaliDisplay(date, digits) {
  return `${formatDigits(date.jd, digits)} ${JALALI_MONTH_NAMES[date.jm - 1]} ${formatDigits(date.jy, digits)}`;
}

function parseGregorianIsoDate(input) {
  if (!input) return null;

  const dateOnly = String(input).trim().split("T")[0];
  const match = GREGORIAN_ISO_PATTERN.exec(dateOnly);
  if (!match) return null;

  const gy = Number(match[1]);
  const gm = Number(match[2]);
  const gd = Number(match[3]);
  const date = new Date(Date.UTC(gy, gm - 1, gd));

  if (
    date.getUTCFullYear() !== gy ||
    date.getUTCMonth() + 1 !== gm ||
    date.getUTCDate() !== gd
  ) {
    return null;
  }

  return { gy, gm, gd };
}

function assertValidYearMonth(jy, jm) {
  if (!Number.isInteger(jy) || !Number.isInteger(jm) || jm < 1 || jm > 12) {
    throw new Error(`Invalid Jalali year/month: ${jy}-${jm}.`);
  }
}

function assertValidJalaliDate(jy, jm, jd) {
  assertValidYearMonth(jy, jm);

  const monthLength = jalaaliMonthLength(jy, jm);
  if (!Number.isInteger(jd) || jd < 1 || jd > monthLength) {
    throw new Error(`Invalid Jalali date: ${jy}-${jm}-${jd}.`);
  }
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}
