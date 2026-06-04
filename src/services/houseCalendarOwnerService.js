import http from "./httpService";
import { reportClientError } from "../utils/reportClientError";

function requireRange(context, houseId, fromDate, toDate) {
  if (!houseId || !fromDate || !toDate) {
    reportClientError(`${context} - missing parameters:`, {
      houseId,
      fromDate,
      toDate,
    });
    throw new Error("House ID, fromDate, and toDate are required.");
  }
}

function normalizeCalendarReadPath(link) {
  if (typeof link !== "string") return link;

  const parsed = new URL(link, "http://local.test");
  let path = parsed.pathname;

  if (path.startsWith("/api/")) {
    path = path.slice(4);
  }

  path = path.replace(/^\/client\/house\//, "/house/");
  path = path.replace(/\/$/, "");

  return `${path}${parsed.search}`;
}

export function addPeakDays(houseId, fromDate, toDate) {
  requireRange("addPeakDays", houseId, fromDate, toDate);

  return http
    .post(`/client/house/${houseId}/calendar/peaks`, {
      from_date: fromDate,
      to_date: toDate,
    })
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("addPeakDays - Error:", error);
      throw error;
    });
}

export function removePeakDays(houseId, fromDate, toDate) {
  requireRange("removePeakDays", houseId, fromDate, toDate);

  return http
    .delete(`/client/house/${houseId}/calendar/peaks`, {
      data: { from_date: fromDate, to_date: toDate },
    })
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("removePeakDays - Error:", error);
      throw error;
    });
}

export async function VendorHouseCalendarByHouse(houseId, year, monthOrLink) {
  if (typeof monthOrLink === "string") {
    return http
      .get(normalizeCalendarReadPath(monthOrLink))
      .then(({ data }) => data.data)
      .catch((error) => {
        reportClientError("VendorHouseCalendarByHouse (link) - Error:", error);
        throw error;
      });
  }

  if (!houseId) {
    throw new Error("House ID is missing for VendorHouseCalendarByHouse");
  }

  const params = {};
  if (year && monthOrLink) {
    params.year = year;
    params.month = monthOrLink;
  }

  return http
    .get(`/house/${houseId}/calendar`, { params })
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("VendorHouseCalendarByHouse - Error:", error);
      throw error;
    });
}

export async function VendorHouseCalendarByRoom(
  houseId,
  roomId,
  year,
  monthOrLink = null
) {
  if (typeof monthOrLink === "string") {
    return http
      .get(normalizeCalendarReadPath(monthOrLink))
      .then(({ data }) => data.data)
      .catch((error) => {
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

  const params = {};
  if (year && monthOrLink) {
    params.year = year;
    params.month = monthOrLink;
  }

  return http
    .get(`/house/${houseId}/calendar/${roomId}`, { params })
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("VendorHouseCalendarByRoom - Error:", error);
      throw error;
    });
}

export function addOffSiteBooking(houseId, fromDate, toDate, quantity, roomUuid) {
  requireRange("addOffSiteBooking", houseId, fromDate, toDate);

  const body = {
    from_date: fromDate,
    to_date: toDate,
  };
  if (quantity) body.quantity = quantity;
  if (roomUuid) body.room_uuid = roomUuid;

  return http
    .post(`/client/house/${houseId}/calendar/book/off-site`, body)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("addOffSiteBooking - Error:", error);
      throw error;
    });
}

export function removeOffSiteBooking(houseId, fromDate, toDate, roomUuid) {
  requireRange("removeOffSiteBooking", houseId, fromDate, toDate);

  const body = {
    from_date: fromDate,
    to_date: toDate,
  };
  if (roomUuid) body.room_uuid = roomUuid;

  return http
    .delete(`/client/house/${houseId}/calendar/book/off-site`, { data: body })
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("removeOffSiteBooking - Error:", error);
      throw error;
    });
}

export function addSpecialPrice(houseId, fromDate, toDate, price, roomUuid) {
  requireRange("addSpecialPrice", houseId, fromDate, toDate);

  const body = {
    from_date: fromDate,
    to_date: toDate,
  };
  if (price) body.price = price;
  if (roomUuid) body.room_uuid = roomUuid;

  return http
    .post(`/client/house/${houseId}/calendar/book/special-price`, body)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("addSpecialPrice - Error:", error);
      throw error;
    });
}

export function removeSpecialPrice(houseId, fromDate, toDate, roomUuid) {
  requireRange("removeSpecialPrice", houseId, fromDate, toDate);

  const body = {
    from_date: fromDate,
    to_date: toDate,
  };
  if (roomUuid) body.room_uuid = roomUuid;

  return http
    .delete(`/client/house/${houseId}/calendar/book/special-price`, {
      data: body,
    })
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("removeSpecialPrice - Error:", error);
      throw error;
    });
}
