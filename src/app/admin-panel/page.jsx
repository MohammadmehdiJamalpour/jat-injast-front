import SiteChrome from "../_components/SiteChrome";
import { AdminPanelClient } from "../_components/ClientRoutes";
import { routeModes } from "../route-modes";

export const dynamic = "force-static";
export const metadata = {
  title: "Admin Panel",
  description: routeModes.adminPanel.reason,
};

export default function AdminPanelPage() {
  return (
    <SiteChrome>
      <AdminPanelClient />
    </SiteChrome>
  );
}
