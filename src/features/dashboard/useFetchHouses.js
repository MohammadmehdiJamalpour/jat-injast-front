// src/hooks/useFetchHouses.js
import { useQuery } from "@tanstack/react-query";
import { getHouses } from "../../services/houseService";

export default function useFetchHouses() {
  return useQuery({
    queryKey: ["get-houses"],
    queryFn: getHouses,
    retry: false,
    refetchOnWindowFocus: false,   // Disable refetching on window focus
    refetchOnMount: false,         // Disable refetching when component remounts
    refetchOnReconnect: false,     // Disable refetching when network reconnects
    staleTime: 1000 * 60 * 5,      // (Optional) Data stays fresh for 5 minutes
  });
}