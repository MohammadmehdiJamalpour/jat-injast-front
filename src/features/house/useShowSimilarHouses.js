// src/hooks/useShowSimilarHouses.js

import { useQuery } from "@tanstack/react-query";
import { getSimilarHouses } from "../../services/houseService";

export default function useShowSimilarHouses(houseUuid) {
  return useQuery({
    queryKey: ["similar-houses", houseUuid],
    queryFn: () => getSimilarHouses(houseUuid),
    enabled: !!houseUuid, // Only fetch if we have a houseUuid
    retry: false,         // You can enable or disable retries as you wish
  });
}
