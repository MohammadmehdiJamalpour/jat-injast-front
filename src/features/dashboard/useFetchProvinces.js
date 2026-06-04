import { useQuery } from "@tanstack/react-query";
import { getProvinces } from "../../services/fetchDataService";

export default function useFetchProvinces() {
  return useQuery({
    queryKey: ["get-provinces"],
    queryFn: getProvinces,
    retry: false,
  });
}
