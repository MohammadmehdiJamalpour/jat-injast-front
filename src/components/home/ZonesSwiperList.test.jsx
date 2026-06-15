import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ZonesSwiperList from "./ZonesSwiperList";

describe("ZonesSwiperList", () => {
  it("renders the loading state when server zones are null", () => {
    const html = renderToStaticMarkup(<ZonesSwiperList initialZones={null} />);

    expect(html).toContain("animate-pulse");
  });
});
