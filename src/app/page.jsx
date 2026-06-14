import SiteChrome from "./_components/SiteChrome";
import { HomeClient, HomeHeroClient } from "./_components/ClientRoutes";
import { createPageMetadata, jsonLdScript, absoluteUrl, siteName } from "./seo";
import { routeModes } from "./route-modes";
import { HomeStaticBody } from "../components/public/HomeSeoContent";
import HydratedOnly from "../components/public/HydratedOnly";
import {
  getPublicFooterContent,
  getPublicHomeContent,
  getPublicZones,
} from "../components/public/publicDataServer";

export const dynamic = "force-static";
export const metadata = createPageMetadata({
  path: "/",
  title: { absolute: "جات اینجاست" },
  description: routeModes.home.reason,
});

export default async function HomePage() {
  const [homeContent, zones, footerContent] = await Promise.all([
    getPublicHomeContent(),
    getPublicZones(),
    getPublicFooterContent(),
  ]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: absoluteUrl("/"),
    description: routeModes.home.reason,
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/search")}?city={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <SiteChrome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
      />
      <HomeHeroClient initialContent={homeContent} />
      <HydratedOnly>
        <HomeClient
          initialContent={homeContent}
          initialZones={zones}
          initialFooterContent={footerContent}
        />
      </HydratedOnly>
      <noscript>
        <HomeStaticBody />
      </noscript>
    </SiteChrome>
  );
}
