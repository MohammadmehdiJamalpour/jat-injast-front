
import { useQuery } from "@tanstack/react-query";
import { showHouse } from "../../services/houseService";

export default function useFetchHouse(uuid, options = {}) {
  return useQuery({
    queryKey: ["show-house", uuid],
    queryFn: () => showHouse(uuid),
    retry: false,
    enabled: !!uuid, // Only fetch when uuid is provided
    staleTime: 10 * 60 * 1000, // Data remains fresh for 10 minutes
    cacheTime: 10 * 60 * 1000, // Data stays in cache for 10 minutes
    initialData: options.initialData,
  });
}
