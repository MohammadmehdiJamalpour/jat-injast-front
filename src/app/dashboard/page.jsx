import SiteChrome from "../_components/SiteChrome";
import { DashboardClient } from "../_components/ClientRoutes";
import { routeModes } from "../route-modes";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "داشبورد",
  description: routeModes.dashboard.reason,
};

export default function DashboardPage() {
  return (
    <SiteChrome>
      <DashboardClient />
    </SiteChrome>
  );
}
