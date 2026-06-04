import SiteChrome from "../_components/SiteChrome";
import { SearchClient } from "../_components/ClientRoutes";
import { routeModes } from "../route-modes";

export const dynamic = "force-static";
export const metadata = {
  title: "Search",
  description: routeModes.search.reason,
};

export default function SearchPage() {
  return (
    <SiteChrome>
      <SearchClient />
    </SiteChrome>
  );
}
