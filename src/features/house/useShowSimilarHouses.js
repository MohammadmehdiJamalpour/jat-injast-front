
import { useQuery } from "@tanstack/react-query";
import { getSimilarHouses } from "../../services/houseService";

export default function useShowSimilarHouses(houseUuid, options = {}) {
  return useQuery({
    queryKey: ["similar-houses", houseUuid],
    queryFn: () => getSimilarHouses(houseUuid),
    enabled: !!houseUuid, // Only fetch if we have a houseUuid
    retry: false,         // You can enable or disable retries as you wish
    staleTime: 5 * 60 * 1000,
    initialData: options.initialData,
  });
}
