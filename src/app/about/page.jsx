import SiteChrome from "../_components/SiteChrome";
import { AboutPageContent } from "../../components/public/PublicStaticPages";
import { createPageMetadata } from "../seo";
import { routeModes } from "../route-modes";
import { getPublicFooterContent } from "../../components/public/publicDataServer";

export const dynamic = "force-static";
export const metadata = createPageMetadata({
  path: "/about",
  title: "درباره ما",
  description: routeModes.staticContent.reason,
});

export default async function AboutPage() {
  const footerContent = await getPublicFooterContent();

  return (
    <SiteChrome>
      <h1 className="sr-only">{"\u062f\u0631\u0628\u0627\u0631\u0647 \u062c\u0627\u062a \u0627\u06cc\u0646\u062c\u0627\u0633\u062a"}</h1>
      <AboutPageContent initialFooterContent={footerContent} />
    </SiteChrome>
  );
}
