const configuredEndpoint = process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT || "";
const debugEnabled = process.env.NEXT_PUBLIC_WEB_VITALS_DEBUG === "true";

export function serializeWebVitalMetric(metric) {
  return {
    id: String(metric.id || ""),
    name: String(metric.name || ""),
    value: Number(metric.value || 0),
    delta: Number(metric.delta || 0),
    rating: metric.rating || "unknown",
    navigationType: metric.navigationType || "unknown",
    pathname: globalThis.location?.pathname || "",
  };
}

export function sendWebVitalMetric(
  metric,
  { endpoint = configuredEndpoint, debug = debugEnabled } = {},
) {
  if (!metric?.name) return false;

  const payload = serializeWebVitalMetric(metric);
  const body = JSON.stringify(payload);

  if (debug) {
    globalThis.console?.info?.("[web-vitals]", payload);
  }

  if (!endpoint || typeof window === "undefined") {
    return false;
  }

  try {
    if (globalThis.navigator?.sendBeacon) {
      const beaconPayload = new Blob([body], {
        type: "application/json; charset=utf-8",
      });
      if (globalThis.navigator.sendBeacon(endpoint, beaconPayload)) {
        return true;
      }
    }

    if (typeof globalThis.fetch === "function") {
      void globalThis
        .fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          cache: "no-store",
          keepalive: true,
        })
        .catch(() => {});
      return true;
    }
  } catch (_error) {
    if (debug) {
      globalThis.console?.warn?.("[web-vitals] delivery failed");
    }
  }

  return false;
}
