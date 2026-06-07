import SiteChrome from "./_components/SiteChrome";
import { HomeClient, HomeHeroClient } from "./_components/ClientRoutes";
import { routeModes } from "./route-modes";

export const dynamic = "force-static";
export const metadata = {
  title: { absolute: "جات اینجاست" },
  description: routeModes.home.reason,
};

export default function HomePage() {
  return (
    <SiteChrome>
      <HomeHeroClient />
      <HomeClient />
    </SiteChrome>
  );
}
