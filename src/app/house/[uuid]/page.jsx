import SiteChrome from "../../_components/SiteChrome";
import HouseRoute from "./HouseRoute";
import { routeModes } from "../../route-modes";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "http://127.0.0.1:8000";

async function getHouseMetadata(uuid) {
  try {
    const response = await fetch(`${backendUrl}/house/${uuid}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;

    const payload = await response.json();
    return payload?.data || null;
  } catch {
    return null;
  }
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { uuid } = await params;
  const house = await getHouseMetadata(uuid);

  return {
    title: house?.name || "اقامتگاه",
    description: house?.description || routeModes.house.reason,
  };
}

export default async function HousePage({ params }) {
  const { uuid } = await params;

  return (
    <SiteChrome>
      <HouseRoute uuid={uuid} />
    </SiteChrome>
  );
}
