import { useQuery } from "@tanstack/react-query";
import { showHouse } from "../../services/houseService";

export default function useCalendarHouseDetails(uuid) {
  return useQuery({
    queryKey: ["calendar-house-details", uuid],
    queryFn: () => showHouse(uuid),
    retry: false,
    enabled: Boolean(uuid),
    staleTime: 10 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}
