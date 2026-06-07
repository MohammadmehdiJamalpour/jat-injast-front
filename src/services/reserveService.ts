import http from "./httpService";
import { unwrapData } from "./normalizers";
import { reportClientError } from "../utils/reportClientError";
import type {
  ApiId,
  ChatMessage,
  DateLike,
  Reservation,
  ReservationPayload,
  ReservationPreInvoice,
} from "../types/api";

type ReservationDateValue =
  | DateLike
  | {
      date_info?: { gregorian?: string };
      date?: string;
      gregorianDate?: string | Date;
    }
  | null
  | undefined;

type BuildReservationPayloadInput = {
  houseUuid?: string;
  checkIn?: ReservationDateValue;
  checkOut?: ReservationDateValue;
  numGuests?: number;
  roomUuid?: string;
};

export function getReservationDateValue(
  date: ReservationDateValue,
): string | Date | null {
  if (!date) return null;
  if (typeof date === "string" || date instanceof Date) return date;
  const gregorian =
    "date_info" in date ? date.date_info?.gregorian : undefined;
  const dateValue = "date" in date ? date.date : undefined;

  return gregorian || dateValue || date.gregorianDate || null;
}

export function buildReservationPayload({
  houseUuid,
  checkIn,
  checkOut,
  numGuests,
  roomUuid,
}: BuildReservationPayloadInput): ReservationPayload {
  const payload: ReservationPayload = {
    house_uuid: houseUuid,
    check_in: getReservationDateValue(checkIn),
    check_out: getReservationDateValue(checkOut),
    num_guests: numGuests,
  };

  if (roomUuid) payload.room_uuid = roomUuid;
  return payload;
}

export function preInvoiceReserve(
  body: ReservationPayload | Record<string, unknown>,
): Promise<ReservationPreInvoice> {
  return http
    .post("/reserve/pre-invoice", body)
    .then(unwrapData<ReservationPreInvoice>)
    .catch((error: unknown) => {
      reportClientError("preInvoiceReserve", error);
      throw error;
    });
}

export function reserveHouse(
  body: ReservationPayload | Record<string, unknown>,
): Promise<Reservation> {
  return http
    .post("/client/reserve", body)
    .then(unwrapData<Reservation>)
    .catch((error: unknown) => {
      reportClientError("reserveHouse", error);
      throw error;
    });
}

export function getActiveReserves(): Promise<Reservation[]> {
  return http
    .get("/client/reserve/list/active")
    .then(unwrapData<Reservation[]>)
    .catch((error: unknown) => {
      reportClientError("getActiveReserves", error);
      throw error;
    });
}

export function getPreviousReserves(): Promise<Reservation[]> {
  return http
    .get("/client/reserve/list/previous")
    .then(unwrapData<Reservation[]>)
    .catch((error: unknown) => {
      reportClientError("getPreviousReserves", error);
      throw error;
    });
}

export function getReserveByUuid(uuid: ApiId): Promise<Reservation> {
  return http
    .get(`/client/reserve/${uuid}`)
    .then(unwrapData<Reservation>)
    .catch((error: unknown) => {
      reportClientError("getReserveByUuid", error);
      throw error;
    });
}

export function getVendorActiveReserves(): Promise<Reservation[]> {
  return http
    .get("/client/reserve/list/active")
    .then(unwrapData<Reservation[]>)
    .catch((error: unknown) => {
      reportClientError("getVendorActiveReserves", error);
      throw error;
    });
}

export function getVendorPreviousReserves(): Promise<Reservation[]> {
  return http
    .get("/client/reserve/list/previous")
    .then(unwrapData<Reservation[]>)
    .catch((error: unknown) => {
      reportClientError("getVendorPreviousReserves", error);
      throw error;
    });
}

export function getVendorReserveByUuid(uuid: ApiId): Promise<Reservation> {
  return http
    .get(`/client/reserve/${uuid}`)
    .then(unwrapData<Reservation>)
    .catch((error: unknown) => {
      reportClientError("getVendorReserveByUuid", error);
      throw error;
    });
}

export function getReserveMessages(uuid: ApiId): Promise<ChatMessage[]> {
  return http
    .get(`/client/reserve/${uuid}/message`)
    .then(unwrapData<ChatMessage[]>)
    .catch((error: unknown) => {
      reportClientError("getReserveMessages", error);
      throw error;
    });
}

export function sendReserveMessage(
  uuid: ApiId,
  payload: FormData | string,
): Promise<ChatMessage> {
  const isMultipart = typeof FormData !== "undefined" && payload instanceof FormData;
  const body = isMultipart ? payload : { message: payload };

  return http
    .post(`/client/reserve/${uuid}/message`, body)
    .then(unwrapData<ChatMessage>)
    .catch((error: unknown) => {
      reportClientError("sendReserveMessage", error);
      throw error;
    });
}

export function updateReserveStatus(
  uuid: ApiId,
  status: string,
): Promise<Reservation> {
  return http
    .put(`/client/reserve/${uuid}`, { status })
    .then(unwrapData<Reservation>)
    .catch((error: unknown) => {
      reportClientError("updateReserveStatus", error);
      throw error;
    });
}
