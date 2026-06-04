import SiteChrome from "../_components/SiteChrome";
import { TermsClient } from "../_components/ClientRoutes";
import { routeModes } from "../route-modes";

export const dynamic = "force-static";
export const metadata = {
  title: "Terms",
  description: routeModes.staticContent.reason,
};

export default function TermsOfServicePage() {
  return (
    <SiteChrome>
      <TermsClient />
    </SiteChrome>
  );
}
