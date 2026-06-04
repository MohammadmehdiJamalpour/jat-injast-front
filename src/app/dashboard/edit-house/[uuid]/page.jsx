import SiteChrome from "../../../_components/SiteChrome";
import { EditHouseClient } from "../../../_components/ClientRoutes";
import { routeModes } from "../../../route-modes";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Edit House",
  description: routeModes.editHouse.reason,
};

export default function EditHousePage() {
  return (
    <SiteChrome>
      <EditHouseClient />
    </SiteChrome>
  );
}
