import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import VendorCalendarContainer from "./VendorCalendarContainer";

const futureMonth = {
  month_name: "تیر",
  year: 1405,
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
  });

  it("renders an empty state when no calendar data is available", () => {
    const html = renderToStaticMarkup(
      React.createElement(VendorCalendarContainer, {
        calendarData: [],
      }),
    );

    expect(html).toContain("text-center");
  });
});
