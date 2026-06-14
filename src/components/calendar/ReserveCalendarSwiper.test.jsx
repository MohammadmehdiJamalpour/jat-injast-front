import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { toPersian } from "../../utils/toPersianDigits";
import toPersianNumber from "../../utils/toPersianNumber";
import { canUseHoverPreview } from "./calendarUtils";
import ReserveCalendarSwiper from "./ReserveCalendarSwiper";

const makeWindow = (matches) => ({
  matchMedia: vi.fn(() => ({ matches })),
});

describe("ReserveCalendarSwiper hover preview", () => {
  it("allows hover preview for mouse pointers on fine-pointer devices", () => {
    expect(
      canUseHoverPreview({ pointerType: "mouse" }, makeWindow(true))
    ).toBe(true);
  });

  it("blocks hover preview for touch taps even if hover media query matches", () => {
    expect(
      canUseHoverPreview({ pointerType: "touch" }, makeWindow(true))
    ).toBe(false);
  });

  it("blocks mouse preview on coarse or non-hover devices", () => {
    expect(
      canUseHoverPreview({ pointerType: "mouse" }, makeWindow(false))
    ).toBe(false);
  });

  it("renders calendar years without thousands separators", () => {
    const html = renderToStaticMarkup(
      <ReserveCalendarSwiper
        calendarData={[
          {
            month_name: "تیر",
            year: 1405,
            month: 4,
            days: [{ day: 1, effective_price: 3000000 }],
          },
        ]}
        reserveDateFrom={null}
        reserveDateTo={null}
        setReserveDateFrom={() => {}}
        setReserveDateTo={() => {}}
        readOnly
        monthsPerViewOverride={1}
      />,
    );

    expect(html).toContain(toPersian(1405));
    expect(html).not.toContain(toPersianNumber(1405));
  });
});
