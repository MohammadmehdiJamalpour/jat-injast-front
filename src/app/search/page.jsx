import SiteChrome from "../_components/SiteChrome";
import { SearchClient } from "../_components/ClientRoutes";
import HydratedOnly from "../../components/public/HydratedOnly";
import { createPageMetadata } from "../seo";
import { routeModes } from "../route-modes";
import { getPublicSearchHouses } from "../../components/public/publicDataServer";

export const dynamic = "force-static";
export const metadata = createPageMetadata({
  path: "/search",
  title: "جستجوی اقامتگاه",
  description: routeModes.search.reason,
});

export default async function SearchPage() {
  const initialFilters = {
    city_id: null,
    province_id: null,
    zone_id: null,
    city: "",
    province: "",
    place: "",
  };
  const initialSearchItems = await getPublicSearchHouses(initialFilters);

  return (
    <SiteChrome>
      <HydratedOnly>
        <SearchClient
          initialSearchData={{
            filtersKey: JSON.stringify(initialFilters),
            rawItems: initialSearchItems,
          }}
        />
      </HydratedOnly>
    </SiteChrome>
  );
}
