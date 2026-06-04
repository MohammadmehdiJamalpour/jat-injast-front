// src/services/reserveService.js

import http from "./httpService";
import { reportClientError } from "../utils/reportClientError";

export function getReservationDateValue(date) {
  return date?.date_info?.gregorian || date?.date || date?.gregorianDate || null;
}

export function buildReservationPayload({
  houseUuid,
  checkIn,
  checkOut,
  numGuests,
  roomUuid,
}) {
  const payload = {
    house_uuid: houseUuid,
    check_in: getReservationDateValue(checkIn),
    check_out: getReservationDateValue(checkOut),
    num_guests: numGuests,
  };

  if (roomUuid) payload.room_uuid = roomUuid;
  return payload;
}

export function preInvoiceReserve(body) {
  return http
    .post("/reserve/pre-invoice", body)
    .then((response) => response.data?.data ?? response.data)
    .catch((error) => {
      reportClientError("preInvoiceReserve", error);
      throw error;
    });
}

export function reserveHouse(body) {
  return http
    .post("/client/reserve", body)
    .then((response) => response.data?.data ?? response.data)
    .catch((error) => {
      reportClientError("reserveHouse", error);
      throw error;
    });
}

export function getActiveReserves() {
  return http
    .get("/client/reserve/list/active")
    .then((response) => response.data)
    .catch((error) => {
      reportClientError("getActiveReserves", error);
      throw error;
    });
}

export function getPreviousReserves() {
  return http
    .get("/client/reserve/list/previous")
    .then((response) => response.data)
    .catch((error) => {
      reportClientError("getPreviousReserves", error);
      throw error;
    });
}

export function getReserveByUuid(uuid) {
  return http
    .get(`/client/reserve/${uuid}`)
    .then((response) => response.data)
    .catch((error) => {
      reportClientError("getReserveByUuid", error);
      throw error;
    });
}

export function getVendorActiveReserves() {
  return http
    .get("/client/reserve/list/active")
    .then((response) => response.data)
    .catch((error) => {
      reportClientError("getVendorActiveReserves", error);
      throw error;
    });
}

export function getVendorPreviousReserves() {
  return http
    .get("/client/reserve/list/previous")
    .then((response) => response.data)
    .catch((error) => {
      reportClientError("getVendorPreviousReserves", error);
      throw error;
    });
}

export function getVendorReserveByUuid(uuid) {
  return http
    .get(`/client/reserve/${uuid}`)
    .then((response) => response.data)
    .catch((error) => {
      reportClientError("getVendorReserveByUuid", error);
      throw error;
    });
}

export function getReserveMessages(uuid) {
  return http
    .get(`/client/reserve/${uuid}/message`)
    .then((response) => response.data)
    .catch((error) => {
      reportClientError("getReserveMessages", error);
      throw error;
    });
}

export function sendReserveMessage(uuid, payload) {
  const isMultipart = typeof FormData !== "undefined" && payload instanceof FormData;
  const body = isMultipart ? payload : { message: payload };

  return http
    .post(`/client/reserve/${uuid}/message`, body)
    .then((response) => response.data)
    .catch((error) => {
      reportClientError("sendReserveMessage", error);
      throw error;
    });
}

export function updateReserveStatus(uuid, status) {
  return http
    .put(`/client/reserve/${uuid}`, { status })
    .then((response) => response.data)
    .catch((error) => {
      reportClientError("updateReserveStatus", error);
      throw error;
    });
}
