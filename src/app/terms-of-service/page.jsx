import SiteChrome from "../_components/SiteChrome";
import { TermsPageContent } from "../../components/public/PublicStaticPages";
import { createPageMetadata } from "../seo";
import { routeModes } from "../route-modes";
import { getPublicFooterContent } from "../../components/public/publicDataServer";

export const dynamic = "force-static";
export const metadata = createPageMetadata({
  path: "/terms-of-service",
  title: "قوانین و مقررات",
  description: routeModes.staticContent.reason,
});

export default async function TermsOfServicePage() {
  const footerContent = await getPublicFooterContent();

  return (
    <SiteChrome>
      <h1 className="sr-only">{"\u0642\u0648\u0627\u0646\u06cc\u0646 \u0648 \u0645\u0642\u0631\u0631\u0627\u062a \u062c\u0627\u062a \u0627\u06cc\u0646\u062c\u0627\u0633\u062a"}</h1>
      <TermsPageContent initialFooterContent={footerContent} />
    </SiteChrome>
  );
}
