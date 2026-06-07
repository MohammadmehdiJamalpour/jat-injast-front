import type { AxiosRequestConfig } from "axios";
import http from "./httpService";
import { unwrapData } from "./normalizers";
import { reportClientError } from "../utils/reportClientError";
import type {
  ApiId,
  CalendarMonth,
  ChatMessage,
  HouseDetail,
  HouseDocumentPayload,
  HouseRoom,
  HouseSummary,
  LabelValue,
  MediaAsset,
} from "../types/api";

export { createRoom, deleteRoom, editRoom } from "./houseRoomService";
export {
  addOffSiteBooking,
  addPeakDays,
  addSpecialPrice,
  removeOffSiteBooking,
  removePeakDays,
  removeSpecialPrice,
  VendorHouseCalendarByHouse,
  VendorHouseCalendarByRoom,
} from "./houseCalendarOwnerService";

type HousePayload = Record<string, unknown> | FormData;
type PricePayload = Record<string, unknown>;
type FacilityPayload = unknown[];
type HouseType = LabelValue & { id?: ApiId };

export function getHouses(config?: AxiosRequestConfig): Promise<HouseSummary[]> {
  return http.get("/client/house", config).then(unwrapData<HouseSummary[]>);
}

export function createHouse(payload: HousePayload): Promise<HouseDetail> {
  return http.post("/client/house", payload).then(unwrapData<HouseDetail>);
}

export function deleteHouse(houseId: ApiId): Promise<unknown> {
  return http.delete(`/client/house/${houseId}`).then(unwrapData<unknown>);
}

export function getHouse(houseId: ApiId): Promise<HouseDetail> {
  return http.get(`/client/house/${houseId}`).then(unwrapData<HouseDetail>);
}

export function showHouse(houseId: ApiId): Promise<HouseDetail> {
  return http.get(`/house/${houseId}`).then(unwrapData<HouseDetail>);
}

export function getSimilarHouses(houseId: ApiId): Promise<HouseSummary[]> {
  if (!houseId) {
    reportClientError("getSimilarHouses - Missing houseId:", { houseId });
    throw new Error("House ID is missing for similar houses.");
  }

  return http
    .get(`/house/${houseId}/similar`)
    .then(unwrapData<HouseSummary[]>)
    .catch((error: unknown) => {
      reportClientError("getSimilarHouses - Error:", error);
      throw error;
    });
}

export async function getRoomCalendar(
  houseId: ApiId,
  roomId: ApiId,
): Promise<CalendarMonth> {
  const response = await http.get(`/house/${houseId}/calendar/${roomId}`);
  return unwrapData<CalendarMonth>(response);
}

export async function getRoomCalendarByMonth(
  houseId: ApiId,
  roomId: ApiId,
  year: number,
  month: number,
): Promise<CalendarMonth> {
  const response = await http.get(
    `/house/${houseId}/calendar/${roomId}?year=${year}&month=${month}`,
  );
  return unwrapData<CalendarMonth>(response);
}

export async function getHouseCalendar(houseId: ApiId): Promise<CalendarMonth> {
  const response = await http.get(`/house/${houseId}/calendar`);
  return unwrapData<CalendarMonth>(response);
}

export async function getHouseCalendarByMonth(
  houseId: ApiId,
  year: number,
  month: number,
): Promise<CalendarMonth> {
  const response = await http.get(`/house/${houseId}/calendar?year=${year}&month=${month}`);
  return unwrapData<CalendarMonth>(response);
}

export function editHouse(houseId: ApiId, houseData: HousePayload): Promise<HouseDetail> {
  if (!houseId || !houseData) {
    reportClientError("Missing houseId or houseData:", { houseId, houseData });
    throw new Error("House ID or data is missing.");
  }

  return http
    .post(`/client/house/${houseId}`, houseData)
    .then(unwrapData<HouseDetail>)
    .catch((error: unknown) => {
      reportClientError("editHouse - Error:", error);
      throw error;
    });
}

export function editHouseFacilities(
  houseId: ApiId,
  facilitiesData: FacilityPayload,
): Promise<HouseDetail> {
  if (!houseId || !facilitiesData) {
    reportClientError("Missing houseId or facilitiesData:", {
      houseId,
      facilitiesData,
    });
    throw new Error("House ID or facilities data is missing.");
  }

  return http
    .put(`/client/house/${houseId}/facility`, { facilities: facilitiesData })
    .then(unwrapData<HouseDetail>)
    .catch((error: unknown) => {
      reportClientError("editHouseFacilities - Error:", error);
      throw error;
    });
}

export function getHouseTypes(config?: AxiosRequestConfig): Promise<HouseType[]> {
  return http
    .get("/assets/types/structure/detail", config)
    .then(unwrapData<HouseType[]>);
}

export function createHousePicture(
  houseId: ApiId,
  payload: HousePayload,
): Promise<MediaAsset> {
  return http
    .post(`/client/house/${houseId}/media`, payload)
    .then(unwrapData<MediaAsset>);
}

export function deleteHousePicture(
  houseId: ApiId,
  imageToDelete: ApiId,
): Promise<unknown> {
  return http
    .delete(`/client/house/${houseId}/media/${imageToDelete}`)
    .then(unwrapData<unknown>);
}

export function changeHouseMainPicture(
  houseId: ApiId,
  imageId: ApiId,
  payload: Record<string, unknown>,
): Promise<MediaAsset> {
  return http
    .put(`/client/house/${houseId}/media/${imageId}`, payload)
    .then(unwrapData<MediaAsset>);
}

export function updateHousePrice(
  houseId: ApiId,
  prices: PricePayload,
): Promise<HouseDetail> {
  if (!houseId || !prices) {
    reportClientError("Missing houseId or prices:", { houseId, prices });
    throw new Error("House ID or prices data is missing.");
  }

  return http
    .put(`/client/house/${houseId}/prices`, prices)
    .then(unwrapData<HouseDetail>)
    .catch((error: unknown) => {
      reportClientError("updateHousePrice - Error:", error);
      throw error;
    });
}

export function updateRoomPrice(
  houseId: ApiId,
  roomId: ApiId,
  prices: PricePayload,
): Promise<HouseRoom> {
  if (!houseId || !roomId || !prices) {
    reportClientError("Missing houseId, roomId, or prices:", {
      houseId,
      roomId,
      prices,
    });
    throw new Error("House ID, room ID, or prices data is missing.");
  }

  return http
    .put(`/client/house/${houseId}/room/${roomId}/prices`, prices)
    .then(unwrapData<HouseRoom>)
    .catch((error: unknown) => {
      reportClientError("updateRoomPrice - Error:", error);
      throw error;
    });
}

export function uploadHouseDocument(
  houseId: ApiId,
  documentData: HouseDocumentPayload,
): Promise<unknown> {
  if (!houseId || !documentData) {
    reportClientError("Missing houseId or documentData:", {
      houseId,
      documentData,
    });
    throw new Error("House ID or document data is missing.");
  }

  const formData = new FormData();
  formData.append("document_type", documentData.document_type);
  formData.append("document", documentData.document);

  return http
    .post(`/client/house/${houseId}/document`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(unwrapData<unknown>)
    .catch((error: unknown) => {
      reportClientError("uploadHouseDocument - Error:", error);
      throw error;
    });
}

export function publishHouse(houseId: ApiId): Promise<HouseDetail> {
  if (!houseId) {
    reportClientError("Missing houseId:", { houseId });
    throw new Error("House ID is missing.");
  }

  return http
    .put(`/client/house/${houseId}/publish`)
    .then(unwrapData<HouseDetail>)
    .catch((error: unknown) => {
      reportClientError("publishHouse - Error:", error);
      throw error;
    });
}

export function favoriteHouse(houseId: ApiId): Promise<HouseDetail> {
  if (!houseId) {
    reportClientError("Missing houseId:", { houseId });
    throw new Error("House ID is missing.");
  }

  return http
    .put(`/client/house/${houseId}/favorite`)
    .then(unwrapData<HouseDetail>)
    .catch((error: unknown) => {
      reportClientError("favoriteHouse - Error:", error);
      throw error;
    });
}

export function getFavoriteHouses(): Promise<HouseSummary[]> {
  return http
    .get("/client/house/favorites")
    .then(unwrapData<HouseSummary[]>)
    .catch((error: unknown) => {
      reportClientError("getFavoriteHouses - Error:", error);
      throw error;
    });
}

export function fetchHouseComments(houseUuid: ApiId): Promise<ChatMessage[]> {
  if (!houseUuid) {
    reportClientError("fetchHouseComments - Missing house UUID");
    throw new Error("House UUID is required to fetch comments.");
  }

  return http
    .get(`/house/${houseUuid}/comments`)
    .then(unwrapData<ChatMessage[]>)
    .catch((error: unknown) => {
      reportClientError("fetchHouseComments - Error:", error);
      throw error;
    });
}
