import { useQuery } from "@tanstack/react-query";
import { getHouseTypes } from "../../services/houseService";

export default function useFetchHouses() {
  return useQuery({
    queryKey: ["get-house-types"],
    queryFn: getHouseTypes,
    retry: false,
  });
}
