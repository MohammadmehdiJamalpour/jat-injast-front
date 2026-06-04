import SiteChrome from "../_components/SiteChrome";
import { HowBecomeHostClient } from "../_components/ClientRoutes";
import { routeModes } from "../route-modes";

export const dynamic = "force-static";
export const metadata = {
  title: "Become a Host",
  description: routeModes.staticContent.reason,
};

export default function HowBecomeHostPage() {
  return (
    <SiteChrome>
      <HowBecomeHostClient />
    </SiteChrome>
  );
}
