import http from "./httpService";
import { useQuery } from "@tanstack/react-query";

export function getProvinces(data) {
  return http.get("/assets/province", data).then(({ data }) => data.data);
}

export function getTextures() {
  return http.get("/assets/types/area/detail").then(({ data }) => data.data);
}

export function getHouseViews() {
  return http
    .get("/assets/types/houseView/detail")
    .then(({ data }) => data.data);
}

export function getNeighbours() {
  return http
    .get("/assets/types/neighbour/detail")
    .then(({ data }) => data.data);
}

export function getRoutes() {
  return http.get("/assets/types/arrival/detail").then(({ data }) => data.data);
}

export function getHouseFloors() {
  return http.get("/assets/types/tip/detail").then(({ data }) => data.data);
}

export function getPrivacyOptions() {
  return http.get("/assets/types/privacy/detail").then(({ data }) => data.data);
}

export function getSanitaryOptions() {
  return http
    .get("/assets/types/sanitaryFacilities/detail")
    .then(({ data }) => data.data);
}
export function getPropertyTypes() {
  return http
    .get("/assets/types/structure/detail")
    .then(({ data }) => data.data);
}
export function getFacilities() {
  return http
    .get("/assets/types/houseFacilities/detail")
    .then(({ data }) => data.data);
}

export function getRules() {
  return http.get("/assets/types/rules/detail").then(({ data }) => data.data);
}

export function getWeekendOptions() {
  return http
    .get("/assets/types/weekendHoliday/detail")
    .then(({ data }) => data.data);
}

export function getRoomFacilities() {
  return http
    .get("/assets/types/roomFacilities/detail")
    .then(({ data }) => data.data);
}

export function getCoolingAndHeatingOptions() {
  return http
    .get("/assets/types/coolingAndHeating/detail")
    .then(({ data }) => data.data);
}

export function getCancellationRules() {
  return http
    .get("/client/house/cancellation/rules")
    .then(({ data }) => data.data);
}

// Custom hooks for each fetch function
export function useFetchCancellationRules() {
  return useQuery({
    queryKey: ["get-cancellation-rules"],
    queryFn: getCancellationRules,
    retry: false,
  });
}

export function useFetchRoomFacilities() {
  return useQuery({
    queryKey: ["get-room-facilities"],
    queryFn: getRoomFacilities,
    retry: false,
  });
}

export function useFetchCoolingAndHeatingOptions() {
  return useQuery({
    queryKey: ["get-cooling-and-heating-options"],
    queryFn: getCoolingAndHeatingOptions,
    retry: false,
  });
}

export function useFetchWeekendOptions() {
  return useQuery({
    queryKey: ["get-weekend-options"],
    queryFn: getWeekendOptions,
    retry: false,
  });
}

export function useFetchRules() {
  return useQuery({
    queryKey: ["get-rules"],
    queryFn: getRules,
    retry: false,
  });
}

export function useFetchFacilities() {
  return useQuery({
    queryKey: ["get-facilities"],
    queryFn: getFacilities,
    retry: false,
  });
}

export function useFetchTextures() {
  return useQuery({
    queryKey: ["get-textures"],
    queryFn: getTextures,
    retry: false,
  });
}

export function useFetchHouseViews() {
  return useQuery({
    queryKey: ["get-house-views"],
    queryFn: getHouseViews,
    retry: false,
  });
}

export function useFetchNeighbours() {
  return useQuery({
    queryKey: ["get-neighbours"],
    queryFn: getNeighbours,
    retry: false,
  });
}
export const useFetchPropertyTypes       = () =>
  useQuery({
    queryKey: ["property-types"],
    queryFn : getPropertyTypes,
    staleTime: 5 * 60 * 1000,   
  });
export function useFetchRoutes() {
  return useQuery({
    queryKey: ["get-routes"],
    queryFn: getRoutes,
    retry: false,
  });
}

export function useFetchHouseFloors() {
  return useQuery({
    queryKey: ["get-house-floors"],
    queryFn: getHouseFloors,
    retry: false,
  });
}

export function useFetchPrivacyOptions() {
  return useQuery({
    queryKey: ["get-privacy-options"],
    queryFn: getPrivacyOptions,
    retry: false,
  });
}

export function useFetchSanitaryOptions() {
  return useQuery({
    queryKey: ["get-sanitary-options"],
    queryFn: getSanitaryOptions,
    retry: false,
  });
}
