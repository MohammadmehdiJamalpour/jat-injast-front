import { useMemo } from "react";

import SearchHouseCard from "../../features/search/components/SearchHouseCard";
import { normalizeHouseCardData } from "../../utils/houseCardData";

function HouseCard({ house }) {
  const cardHouse = useMemo(() => normalizeHouseCardData(house), [house]);

  if (!cardHouse) return null;

  return <SearchHouseCard house={cardHouse} size="compact" />;
}

export default HouseCard;
