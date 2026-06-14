"use client";

import { useReportWebVitals } from "next/web-vitals";
import { sendWebVitalMetric } from "../instrumentation-client";

export default function WebVitalsReporter() {
  useReportWebVitals(sendWebVitalMetric);
  return null;
}
