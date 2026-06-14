import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import JalaliSingleDatePicker from "./JalaliSingleDatePicker";
import { gregorianIsoToJalaliDate } from "./jalaliDateUtils";

describe("JalaliSingleDatePicker", () => {
  it("renders an existing Gregorian profile date as a Persian Jalali picker value", () => {
    const value = gregorianIsoToJalaliDate("1990-05-12");
    const html = renderToStaticMarkup(
      <JalaliSingleDatePicker
        value={value}
        onChange={() => {}}
        initialMonth={value}
        yearRange={{ start: 1300, end: 1405 }}
      />,
    );

    expect(html).toContain(value.display);
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain('type="text"');
    expect(html).not.toContain('name="birthDay"');
    expect(html).not.toContain('name="birthMonth"');
    expect(html).not.toContain('name="birthYear"');
  });

  it("renders an empty birthday without crashing", () => {
    const html = renderToStaticMarkup(
      <JalaliSingleDatePicker
        value={null}
        onChange={() => {}}
        initialMonth="1375-01-01"
        yearRange={{ start: 1300, end: 1405 }}
      />,
    );

    expect(html).toContain('value=""');
    expect(html).toContain('aria-expanded="false"');
  });
});
