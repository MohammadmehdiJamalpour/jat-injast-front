import { useQuery } from "@tanstack/react-query";
import http from "../../services/httpService";

// Service to fetch cities based on province ID
export function getCities(provinceId) {
  return http
    .get(`/assets/province/${provinceId}/cities`)
    .then(({ data }) => data.data);
}

// Custom hook to fetch cities
export default function useFetchCities(provinceId) {
  return useQuery({
    queryKey: ["get-cities", provinceId], // Unique key for caching
    queryFn: () => getCities(provinceId),
    enabled: !!provinceId, // Only run the query if provinceId is provided
    retry: false,
  });
}
