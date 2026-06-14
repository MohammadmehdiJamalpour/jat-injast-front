import { useQuery } from "@tanstack/react-query";
import { getHouse } from "../../services/houseService";

export default function useFetchHouse(uuid) {
  return useQuery({
    queryKey: ["get-house", uuid],
    queryFn: () => getHouse(uuid),
    enabled: !!uuid, 
    retry: false,

    staleTime: 10 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}
