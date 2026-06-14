import { useMemo } from "react";

import SearchHouseCard from "../../search/components/SearchHouseCard";
import { normalizeHouseCardData } from "../../../utils/houseCardData";

function SimilarHouseCard({ house }) {
  const cardHouse = useMemo(() => normalizeHouseCardData(house), [house]);

  if (!cardHouse) return null;

  return <SearchHouseCard house={cardHouse} />;
}

export default SimilarHouseCard;
