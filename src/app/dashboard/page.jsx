import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SiteChrome from "../_components/SiteChrome";
import { DashboardClient } from "../_components/ClientRoutes";
import { routeModes } from "../route-modes";
import { hasDashboardAuthCookie } from "./auth";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "داشبورد",
  description: routeModes.dashboard.reason,
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  if (!hasDashboardAuthCookie(cookieStore)) {
    redirect("/login");
  }

  return (
    <SiteChrome>
      <DashboardClient />
    </SiteChrome>
  );
}
