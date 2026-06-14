import jalaali from "jalaali-js";
import { getDayDateValue, parseDayString } from "./calendarUtils";

export const VENDOR_CALENDAR_PRELOAD_MONTH_COUNT = 5;

const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const pad2 = (value) => String(value).padStart(2, "0");

function normalizeMonthNumber(value) {
  const month = Number(value);
  return Number.isInteger(month) && month >= 1 && month <= 12 ? month : null;
}

function normalizeYear(value) {
  const year = Number(value);
  return Number.isInteger(year) && year > 0 ? year : null;
}

export function getCalendarMonthKey(monthData) {
  const year = normalizeYear(monthData?.year);
  const month = normalizeMonthNumber(monthData?.month);
  return year && month ? `${year}-${month}` : null;
}

function getMonthMetaFromDays(monthData) {
  const dayWithDate = monthData?.days?.find((day) => getDayDateValue(day));
  const date = parseDayString(getDayDateValue(dayWithDate));
  if (!date) return null;

  const { jy, jm } = jalaali.toJalaali(date);
  return { year: jy, month: jm };
}

export function getCalendarMonthMeta(monthData) {
  const year = normalizeYear(monthData?.year);
  const month = normalizeMonthNumber(monthData?.month);
  if (year && month) return { year, month };

  const metaFromDays = getMonthMetaFromDays(monthData);
  if (metaFromDays) return metaFromDays;

  const today = jalaali.toJalaali(new Date());
  return { year: today.jy, month: today.jm };
}

export function getNextCalendarMonthMeta(monthData) {
  const { year, month } = getCalendarMonthMeta(monthData);
  return month === 12
    ? { year: year + 1, month: 1 }
    : { year, month: month + 1 };
}

function buildLockedDay({ year, month, day, monthName }) {
  const { gy, gm, gd } = jalaali.toGregorian(year, month, day);
  const gregorian = `${gy}-${pad2(gm)}-${pad2(gd)}`;
  const jalali = `${year}/${pad2(month)}/${pad2(day)}`;

  return {
    date: gregorian,
    gregorianDate: gregorian,
    date_info: {
      gregorian,
      jalali,
      label: `${day} ${monthName} ${year}`,
    },
    readAbleDate: `${day} ${monthName} ${year}`,
    day,
    price: null,
    specialPrice: null,
    effective_price: null,
    original_price: null,
    isLock: true,
    isDisable: true,
    isGeneratedPlaceholderDay: true,
  };
}

export function createLockedVendorCalendarMonth({ year, month }) {
  const monthName = PERSIAN_MONTHS[month - 1] || "";
  const monthLength = jalaali.jalaaliMonthLength(year, month);
  const firstGregorian = jalaali.toGregorian(year, month, 1);
  const firstWeekday = new Date(
    firstGregorian.gy,
    firstGregorian.gm - 1,
    firstGregorian.gd,
  ).getDay();
  const leadingBlanks = (firstWeekday + 1) % 7;

  const days = [];
  for (let index = 0; index < leadingBlanks; index += 1) {
    days.push({ isBlank: true, isGeneratedPlaceholderDay: true });
  }

  for (let day = 1; day <= monthLength; day += 1) {
    days.push(buildLockedDay({ year, month, day, monthName }));
  }

  while (days.length % 7 !== 0) {
    days.push({ isBlank: true, isGeneratedPlaceholderDay: true });
  }

  return {
    year,
    month,
    month_name: monthName,
    days,
    next_month: null,
    isGeneratedPlaceholderMonth: true,
  };
}

function appendUniqueMonth(result, seenKeys, monthData) {
  if (!monthData) return false;

  const key = getCalendarMonthKey(monthData);
  if (key && seenKeys.has(key)) return false;

  result.push(monthData);
  if (key) seenKeys.add(key);
  return true;
}

export async function preloadVendorCalendarMonths({
  months = [],
  fetchMonthByLink,
  minimumMonths = VENDOR_CALENDAR_PRELOAD_MONTH_COUNT,
}) {
  const result = [];
  const seenKeys = new Set();

  months.forEach((monthData) => {
    appendUniqueMonth(result, seenKeys, monthData);
  });

  while (result.length > 0 && result.length < minimumMonths) {
    const lastMonth = result[result.length - 1];
    const nextLink = lastMonth?.next_month?.link;

    if (nextLink && typeof fetchMonthByLink === "function") {
      try {
        const fetchedMonth = await fetchMonthByLink(nextLink);
        if (appendUniqueMonth(result, seenKeys, fetchedMonth)) {
          continue;
        }
      } catch {
        // A failed follow-up month becomes a locked placeholder below.
      }
    }

    const nextMeta = getNextCalendarMonthMeta(lastMonth);
    appendUniqueMonth(
      result,
      seenKeys,
      createLockedVendorCalendarMonth(nextMeta),
    );
  }

  return result;
}
