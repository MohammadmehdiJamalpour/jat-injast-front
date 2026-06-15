import SiteChrome from "../../_components/SiteChrome";
import HouseRoute from "./HouseRoute";
import { routeModes } from "../../route-modes";
import { createPageMetadata, jsonLdScript } from "../../seo";
import {
  HOUSE_TITLE_FALLBACK,
  createHouseJsonLd,
  getHouseData,
  getHouseMetadataFields,
} from "./house-seo";
import {
  getPublicFooterContent,
  getPublicSimilarHouses,
} from "../../../components/public/publicDataServer";

export const dynamicParams = true;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { uuid } = await params;
  const house = await getHouseData(uuid);
  const fields = getHouseMetadataFields(house, uuid);

  return createPageMetadata({
    path: fields.path,
    title: fields.title || HOUSE_TITLE_FALLBACK,
    description: fields.description || routeModes.house.reason,
    image: fields.images[0]?.url,
    type: "article",
  });
}

export default async function HousePage({ params }) {
  const { uuid } = await params;
  const [house, similarHouses, footerContent] = await Promise.all([
    getHouseData(uuid),
    getPublicSimilarHouses(uuid),
    getPublicFooterContent(),
  ]);
  const jsonLd = house ? createHouseJsonLd(house, uuid) : null;

  return (
    <SiteChrome>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(jsonLd)}
        />
      )}
      <HouseRoute
        uuid={uuid}
        initialHouseData={house}
        initialSimilarHouses={similarHouses}
        initialFooterContent={footerContent}
      />
    </SiteChrome>
  );
}
