"use client";

import dynamic from "next/dynamic";
import RouteLoading from "../../_components/RouteLoading";

const HousePageClient = dynamic(() => import("./HousePageClient"), {
  ssr: false,
  loading: () => <RouteLoading />,
});

export default function HouseRoute({ uuid }) {
  return <HousePageClient uuid={uuid} />;
}
