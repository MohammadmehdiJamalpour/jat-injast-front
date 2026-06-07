"use client";

import dynamic from "next/dynamic";
import RouteLoading from "./RouteLoading";

export const HomeClient = dynamic(() => import("@/routes/clients/HomeClient"), {
  ssr: false,
  loading: () => <RouteLoading />,
});
export const SearchClient = dynamic(() => import("@/routes/clients/SearchClient"), {
  ssr: false,
  loading: () => <RouteLoading />,
});
export const AboutClient = dynamic(() => import("@/routes/clients/AboutClient"), {
  ssr: false,
  loading: () => <RouteLoading />,
});
export const HowBecomeHostClient = dynamic(
  () => import("@/routes/clients/HowBecomeHostClient"),
  {
    ssr: false,
    loading: () => <RouteLoading />,
  },
);
export const TermsClient = dynamic(
  () => import("@/routes/clients/TermsClient"),
  {
    ssr: false,
    loading: () => <RouteLoading />,
  },
);
export const AuthClient = dynamic(() => import("@/routes/clients/AuthClient"), {
  ssr: false,
  loading: () => <RouteLoading />,
});
export const DashboardClient = dynamic(
  () => import("@/features/dashboard/DashboardContainer"),
  {
    ssr: false,
    loading: () => <RouteLoading />,
  },
);
export const AdminPanelClient = dynamic(
  () => import("@/features/admin/AdminPanelContainer"),
  {
    ssr: false,
    loading: () => <RouteLoading />,
  },
);
export const EditHouseClient = dynamic(
  () => import("@/features/dashboard/edithouse/EditHouseContainer"),
  {
    ssr: false,
    loading: () => <RouteLoading />,
  },
);
export const LoginWithTokenClient = dynamic(
  () => import("@/features/authentication/LoginWithToken"),
  {
    ssr: false,
    loading: () => <RouteLoading />,
  },
);
export const HeaderClient = dynamic(() => import("@/ui/Header"), {
  ssr: false,
});
export const FooterClient = dynamic(() => import("@/components/Footer"), {
  ssr: false,
});
export const HomeHeroClient = dynamic(
  () => import("@/components/home/HeroOnlyOnHome"),
  {
    ssr: false,
    loading: () => <RouteLoading />,
  },
);
