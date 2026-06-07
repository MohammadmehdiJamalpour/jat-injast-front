import { describe, expect, it, vi } from "vitest";

import {
  canSelectCalendarDay,
  getDayDateValue,
  getVendorDayStyles,
  parseDayString,
} from "./calendarUtils";

const makeDay = (date, extra = {}) => ({
  date,
  day: Number(date?.split("-").at(-1) || 1),
  price: 3000,
  ...extra,
});

describe("calendar utilities", () => {
  it("reads supported backend date field variants", () => {
    expect(getDayDateValue({ date: "2026-06-14" })).toBe("2026-06-14");
    expect(getDayDateValue({ gregorianDate: "2026-06-15" })).toBe("2026-06-15");
    expect(getDayDateValue({ date_info: { gregorian: "2026-06-16" } })).toBe("2026-06-16");
    expect(getDayDateValue({ dateInfo: { gregorian: "2026-06-17" } })).toBe("2026-06-17");
    expect(getDayDateValue(null)).toBeNull();
  });

  it("parses valid day strings and rejects unsafe values", () => {
    expect(parseDayString("2026-06-14")).toEqual(new Date(2026, 5, 14));
    expect(parseDayString(undefined)).toBeNull();
    expect(parseDayString("2026/06/14")).toBeNull();
    expect(parseDayString("invalid")).toBeNull();
  });

  it("prevents selecting blank, locked, disabled, and past days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 10, 12));

    expect(canSelectCalendarDay(makeDay("2026-06-14"))).toBe(true);
    expect(canSelectCalendarDay(makeDay("2026-06-09"))).toBe(false);
    expect(canSelectCalendarDay(makeDay("2026-06-14", { isBlank: true }))).toBe(false);
    expect(canSelectCalendarDay(makeDay("2026-06-14", { isLock: true }))).toBe(false);
    expect(canSelectCalendarDay(makeDay("2026-06-14", { isDisable: true }))).toBe(false);

    vi.useRealTimers();
  });

  it("marks selected endpoints and the middle of a selected range distinctly", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 10, 12));

    const range = {
      reserveDateFrom: { date: "2026-06-14" },
      reserveDateTo: { date: "2026-06-18" },
    };

    const start = getVendorDayStyles({ day: makeDay("2026-06-14"), ...range });
    const middle = getVendorDayStyles({ day: makeDay("2026-06-16"), ...range });

    expect(start).toContain("bg-primary-action");
    expect(start).toContain("text-primary-contrast");
    expect(middle).toContain("bg-primary-200");
    expect(middle).toContain("text-white");

    vi.useRealTimers();
  });
});
