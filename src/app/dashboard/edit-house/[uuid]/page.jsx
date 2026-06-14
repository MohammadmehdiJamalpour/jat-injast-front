import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SiteChrome from "../../../_components/SiteChrome";
import { EditHouseClient } from "../../../_components/ClientRoutes";
import { routeModes } from "../../../route-modes";
import { hasDashboardAuthCookie } from "../../auth";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "ویرایش اقامتگاه",
  description: routeModes.editHouse.reason,
};

export default async function EditHousePage() {
  const cookieStore = await cookies();
  if (!hasDashboardAuthCookie(cookieStore)) {
    redirect("/login");
  }

  return (
    <SiteChrome>
      <EditHouseClient />
    </SiteChrome>
  );
}
