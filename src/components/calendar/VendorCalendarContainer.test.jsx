import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { toPersian } from "../../utils/toPersianDigits";
import toPersianNumber from "../../utils/toPersianNumber";
import { canSelectCalendarDay } from "./calendarUtils";
import VendorCalendarContainer, {
  formatCellPrice,
  TWO_MONTHS_BREAKPOINT_PX,
} from "./VendorCalendarContainer";
import {
  createLockedVendorCalendarMonth,
  preloadVendorCalendarMonths,
  VENDOR_CALENDAR_PRELOAD_MONTH_COUNT,
} from "./vendorCalendarMonthData";

const futureMonth = {
  month_name: "تیر",
  year: 1405,
  month: 4,
  days: [
    { date: "2026-07-09", day: 19, price: 3000000 },
    { date: "2026-07-10", day: 20, price: 3000000 },
    { date: "2026-07-11", day: 21, price: 3000000 },
  ],
};

describe("VendorCalendarContainer", () => {
  it("renders selected start/end and in-range day styles distinctly", () => {
    const html = renderToStaticMarkup(
      React.createElement(VendorCalendarContainer, {
        calendarData: [futureMonth],
        reserveDateFrom: { date: "2026-07-09" },
        reserveDateTo: { date: "2026-07-11" },
        viewOnly: true,
      }),
    );

    expect(html).toContain("bg-primary-action");
    expect(html).toContain("bg-primary-200");
    expect(html).toContain("aspect-square");
    expect(html).toContain("lg:justify-items-center");
    expect(html).toContain("lg:max-w-16");
  });

  it("renders calendar years without thousands separators", () => {
    const html = renderToStaticMarkup(
      React.createElement(VendorCalendarContainer, {
        calendarData: [futureMonth],
        viewOnly: true,
      }),
    );

    expect(html).toContain(toPersian(1405));
    expect(html).not.toContain(toPersianNumber(1405));
  });

  it("formats vendor cell prices in compact thousands for display only", () => {
    const sourcePrice = 2500000;

    expect(formatCellPrice(sourcePrice)).toBe(toPersianNumber("2,500"));
    expect(formatCellPrice(2500500)).toBe(toPersianNumber("2,501"));
    expect(sourcePrice).toBe(2500000);
  });

  it("renders compact cell prices without the full trailing thousands", () => {
    const html = renderToStaticMarkup(
      React.createElement(VendorCalendarContainer, {
        calendarData: [futureMonth],
        viewOnly: true,
      }),
    );

    expect(html).toContain(toPersianNumber("3,000"));
    expect(html).not.toContain(toPersianNumber("3,000,000"));
  });

  it("places previous and next navigation controls inside the month header", () => {
    const html = renderToStaticMarkup(
      React.createElement(VendorCalendarContainer, {
        calendarData: [futureMonth],
        fetchNextMonth: () => Promise.resolve(2),
        viewOnly: true,
      }),
    );

    expect(html.match(/aria-label=/g)).toHaveLength(2);
    expect(html).toContain("max-w-5xl");
    expect(html).toContain("xl:max-w-6xl");
    expect(html).not.toContain("max-w-4xl");
  });

  it("switches vendor calendar to two visible months at the sm breakpoint", () => {
    const html = renderToStaticMarkup(
      React.createElement(VendorCalendarContainer, {
        calendarData: [futureMonth],
        viewOnly: true,
      }),
    );

    expect(TWO_MONTHS_BREAKPOINT_PX).toBe(640);
    expect(html).toContain("sm:w-1/2");
    expect(html).not.toContain("lg:w-1/2");
  });

  it("renders an empty state when no calendar data is available", () => {
    const html = renderToStaticMarkup(
      React.createElement(VendorCalendarContainer, {
        calendarData: [],
      }),
    );

    expect(html).toContain("text-center");
  });

  it("preloads five consecutive months and fills missing backend months with locked placeholders", async () => {
    const fetchMonthByLink = vi.fn().mockResolvedValue({
      month_name: "مرداد",
      year: 1405,
      month: 5,
      days: [],
      next_month: null,
    });

    const months = await preloadVendorCalendarMonths({
      months: [
        {
          ...futureMonth,
          next_month: { link: "/calendar?year=1405&month=5" },
        },
      ],
      fetchMonthByLink,
    });

    expect(fetchMonthByLink).toHaveBeenCalledTimes(1);
    expect(months).toHaveLength(VENDOR_CALENDAR_PRELOAD_MONTH_COUNT);
    expect(months.map((month) => `${month.year}-${month.month}`)).toEqual([
      "1405-4",
      "1405-5",
      "1405-6",
      "1405-7",
      "1405-8",
    ]);
    expect(
      months.slice(2).every((month) => month.isGeneratedPlaceholderMonth),
    ).toBe(true);
  });

  it("creates locked placeholder days that are not selectable and do not show fake prices", () => {
    const month = createLockedVendorCalendarMonth({ year: 1405, month: 6 });
    const realDays = month.days.filter((day) => !day.isBlank);

    expect(month.days.length % 7).toBe(0);
    expect(realDays.length).toBeGreaterThan(0);
    expect(realDays.every((day) => day.isLock && day.isDisable)).toBe(true);
    expect(
      realDays.every((day) => day.price == null && day.specialPrice == null),
    ).toBe(true);
    expect(canSelectCalendarDay(realDays[0])).toBe(false);
  });
});
