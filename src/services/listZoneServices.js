// src/services/listZoneService.js
import http from "./httpService";
import { reportClientError } from "../utils/reportClientError";

export function listZones() {
  return http
    .get("/assets/zone")
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("listZones", error);
      throw error;
    });
}
