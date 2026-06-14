import { afterEach, describe, expect, it, vi } from "vitest";

import {
  sendWebVitalMetric,
  serializeWebVitalMetric,
} from "./instrumentation-client";

const lcpMetric = {
  id: "v3-1",
  name: "LCP",
  value: 1234.56,
  delta: 1234.56,
  rating: "good",
  navigationType: "navigate",
};

describe("web vitals reporting", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("serializes only stable metric fields", () => {
    vi.stubGlobal("location", { pathname: "/search" });

    expect(serializeWebVitalMetric(lcpMetric)).toEqual({
      id: "v3-1",
      name: "LCP",
      value: 1234.56,
      delta: 1234.56,
      rating: "good",
      navigationType: "navigate",
      pathname: "/search",
    });
  });

  it("ignores empty metrics", () => {
    expect(sendWebVitalMetric({})).toBe(false);
  });

  it("uses sendBeacon when an endpoint is configured", () => {
    const sendBeacon = vi.fn(() => true);
    vi.stubGlobal("window", {});
    vi.stubGlobal("navigator", { sendBeacon });

    expect(sendWebVitalMetric(lcpMetric, { endpoint: "/vitals" })).toBe(true);
    expect(sendBeacon).toHaveBeenCalledWith("/vitals", expect.any(Blob));
  });

  it("falls back to fetch keepalive when sendBeacon declines", () => {
    const sendBeacon = vi.fn(() => false);
    const fetchVitals = vi.fn(() => Promise.resolve(new Response(null)));
    vi.stubGlobal("window", {});
    vi.stubGlobal("navigator", { sendBeacon });
    vi.stubGlobal("fetch", fetchVitals);

    expect(sendWebVitalMetric(lcpMetric, { endpoint: "/vitals" })).toBe(true);
    expect(fetchVitals).toHaveBeenCalledWith(
      "/vitals",
      expect.objectContaining({
        cache: "no-store",
        keepalive: true,
        method: "POST",
      }),
    );
  });
});
