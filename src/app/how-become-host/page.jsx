import SiteChrome from "../_components/SiteChrome";
import { HostPageContent } from "../../components/public/PublicStaticPages";
import { createPageMetadata } from "../seo";
import { routeModes } from "../route-modes";

export const dynamic = "force-static";
export const metadata = createPageMetadata({
  path: "/how-become-host",
  title: "میزبان شوید",
  description: routeModes.staticContent.reason,
});

export default function HowBecomeHostPage() {
  return (
    <SiteChrome>
      <h1 className="sr-only">{"\u0645\u06cc\u0632\u0628\u0627\u0646 \u062c\u0627\u062a \u0627\u06cc\u0646\u062c\u0627\u0633\u062a \u0634\u0648\u06cc\u062f"}</h1>
      <HostPageContent />
    </SiteChrome>
  );
}
