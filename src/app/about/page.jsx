import SiteChrome from "../_components/SiteChrome";
import { AboutClient } from "../_components/ClientRoutes";
import { routeModes } from "../route-modes";

export const dynamic = "force-static";
export const metadata = {
  title: "درباره ما",
  description: routeModes.staticContent.reason,
};

export default function AboutPage() {
  return (
    <SiteChrome>
      <AboutClient />
    </SiteChrome>
  );
}
