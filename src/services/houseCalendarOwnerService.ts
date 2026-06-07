import http from "./httpService";
import { reportClientError } from "../utils/reportClientError";
import type { ApiId, CalendarOperationResponse } from "../types/api";

type CalendarId = ApiId | null | undefined;
type CalendarDate = string | null | undefined;
type CalendarMonthInput = number | string | null | undefined;
type CalendarRequestBody = {
  from_date: string;
  to_date: string;
  quantity?: number;
  room_uuid?: ApiId;
  price?: number | string;
};

function requireRange(
  context: string,
  houseId: CalendarId,
  fromDate: CalendarDate,
  toDate: CalendarDate,
): asserts houseId is ApiId {
  if (!houseId || !fromDate || !toDate) {
    reportClientError(`${context} - missing parameters:`, {
      houseId,
      fromDate,
      toDate,
    });
    throw new Error("House ID, fromDate, and toDate are required.");
  }
}

function normalizeCalendarReadPath(link: string): string {
  const parsed = new URL(link, "http://jat-injast.local");
  let path = parsed.pathname;

  if (path.startsWith("/api/")) {
    path = path.slice(4);
  }

  path = path.replace(/^\/client\/house\//, "/house/");
  path = path.replace(/\/$/, "");

  return `${path}${parsed.search}`;
}

export function addPeakDays(
  houseId: ApiId,
  fromDate: string,
  toDate: string,
): Promise<CalendarOperationResponse> {
  requireRange("addPeakDays", houseId, fromDate, toDate);

  return http
    .post(`/client/house/${houseId}/calendar/peaks`, {
      from_date: fromDate,
      to_date: toDate,
    })
    .then(({ data }) => data.data)
    .catch((error: unknown) => {
      reportClientError("addPeakDays - Error:", error);
      throw error;
    });
}

export function removePeakDays(
  houseId: ApiId,
  fromDate: string,
  toDate: string,
): Promise<CalendarOperationResponse> {
  requireRange("removePeakDays", houseId, fromDate, toDate);

  return http
    .delete(`/client/house/${houseId}/calendar/peaks`, {
      data: { from_date: fromDate, to_date: toDate },
    })
    .then(({ data }) => data.data)
    .catch((error: unknown) => {
      reportClientError("removePeakDays - Error:", error);
      throw error;
    });
}

export async function VendorHouseCalendarByHouse(
  houseId: CalendarId,
  year: number | null | undefined,
  monthOrLink: CalendarMonthInput,
): Promise<CalendarOperationResponse> {
  if (typeof monthOrLink === "string") {
    return http
      .get(normalizeCalendarReadPath(monthOrLink))
      .then(({ data }) => data.data)
      .catch((error: unknown) => {
        reportClientError("VendorHouseCalendarByHouse (link) - Error:", error);
        throw error;
      });
  }

  if (!houseId) {
    throw new Error("House ID is missing for VendorHouseCalendarByHouse");
  }

  const params: { year?: number; month?: number } = {};
  if (year && monthOrLink) {
    params.year = year;
    params.month = Number(monthOrLink);
  }

  return http
    .get(`/house/${houseId}/calendar`, { params })
    .then(({ data }) => data.data)
    .catch((error: unknown) => {
      reportClientError("VendorHouseCalendarByHouse - Error:", error);
      throw error;
    });
}

export async function VendorHouseCalendarByRoom(
  houseId: CalendarId,
  roomId: CalendarId,
  year: number | null | undefined,
  monthOrLink: CalendarMonthInput = null,
): Promise<CalendarOperationResponse> {
  if (typeof monthOrLink === "string") {
    return http
      .get(normalizeCalendarReadPath(monthOrLink))
      .then(({ data }) => data.data)
      .catch((error: unknown) => {
        reportClientError("VendorHouseCalendarByRoom (link) - Error:", error);
        throw error;
      });
  }

  if (!houseId || !roomId) {
    reportClientError("VendorHouseCalendarByRoom - Missing houseId or roomId:", {
      houseId,
      roomId,
    });
    throw new Error("House ID or room ID is missing.");
  }

  const params: { year?: number; month?: number } = {};
  if (year && monthOrLink) {
    params.year = year;
    params.month = Number(monthOrLink);
  }

  return http
    .get(`/house/${houseId}/calendar/${roomId}`, { params })
    .then(({ data }) => data.data)
    .catch((error: unknown) => {
      reportClientError("VendorHouseCalendarByRoom - Error:", error);
      throw error;
    });
}

export function addOffSiteBooking(
  houseId: ApiId,
  fromDate: string,
  toDate: string,
  quantity?: number,
  roomUuid?: ApiId,
): Promise<CalendarOperationResponse> {
  requireRange("addOffSiteBooking", houseId, fromDate, toDate);

  const body: CalendarRequestBody = {
    from_date: fromDate,
    to_date: toDate,
  };
  if (quantity) body.quantity = quantity;
  if (roomUuid) body.room_uuid = roomUuid;

  return http
    .post(`/client/house/${houseId}/calendar/book/off-site`, body)
    .then(({ data }) => data.data)
    .catch((error: unknown) => {
      reportClientError("addOffSiteBooking - Error:", error);
      throw error;
    });
}

export function removeOffSiteBooking(
  houseId: ApiId,
  fromDate: string,
  toDate: string,
  roomUuid?: ApiId,
): Promise<CalendarOperationResponse> {
  requireRange("removeOffSiteBooking", houseId, fromDate, toDate);

  const body: CalendarRequestBody = {
    from_date: fromDate,
    to_date: toDate,
  };
  if (roomUuid) body.room_uuid = roomUuid;

  return http
    .delete(`/client/house/${houseId}/calendar/book/off-site`, { data: body })
    .then(({ data }) => data.data)
    .catch((error: unknown) => {
      reportClientError("removeOffSiteBooking - Error:", error);
      throw error;
    });
}

export function addSpecialPrice(
  houseId: ApiId,
  fromDate: string,
  toDate: string,
  price?: number | string,
  roomUuid?: ApiId,
): Promise<CalendarOperationResponse> {
  requireRange("addSpecialPrice", houseId, fromDate, toDate);

  const body: CalendarRequestBody = {
    from_date: fromDate,
    to_date: toDate,
  };
  if (price) body.price = price;
  if (roomUuid) body.room_uuid = roomUuid;

  return http
    .post(`/client/house/${houseId}/calendar/book/special-price`, body)
    .then(({ data }) => data.data)
    .catch((error: unknown) => {
      reportClientError("addSpecialPrice - Error:", error);
      throw error;
    });
}

export function removeSpecialPrice(
  houseId: ApiId,
  fromDate: string,
  toDate: string,
  roomUuid?: ApiId,
): Promise<CalendarOperationResponse> {
  requireRange("removeSpecialPrice", houseId, fromDate, toDate);

  const body: CalendarRequestBody = {
    from_date: fromDate,
    to_date: toDate,
  };
  if (roomUuid) body.room_uuid = roomUuid;

  return http
    .delete(`/client/house/${houseId}/calendar/book/special-price`, {
      data: body,
    })
    .then(({ data }) => data.data)
    .catch((error: unknown) => {
      reportClientError("removeSpecialPrice - Error:", error);
      throw error;
    });
}
