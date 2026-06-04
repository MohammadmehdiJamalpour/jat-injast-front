import http from "./httpService";
import { reportClientError } from "../utils/reportClientError";

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

export function getHouses(data) {
  return http.get("/client/house", data).then(({ data }) => data.data);
}

export function createHouse(data) {
  return http.post("/client/house", data).then(({ data }) => data.data);
}

export function deleteHouse(houseId) {
  return http.delete(`/client/house/${houseId}`).then(({ data }) => data.data);
}

export function getHouse(houseId) {
  return http.get(`/client/house/${houseId}`).then(({ data }) => data.data);
}

export function showHouse(houseId) {
  return http.get(`/house/${houseId}`).then(({ data }) => data.data);
}

export function getSimilarHouses(houseId) {
  if (!houseId) {
    reportClientError("getSimilarHouses - Missing houseId:", { houseId });
    throw new Error("House ID is missing for similar houses.");
  }
  return http
    .get(`/house/${houseId}/similar`)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("getSimilarHouses - Error:", error);
      throw error;
    });
}

export async function getRoomCalendar(houseId, roomId) {
  const { data } = await http.get(`/house/${houseId}/calendar/${roomId}`);
  return data.data;
}

export async function getRoomCalendarByMonth(houseId, roomId, year, month) {
  const { data } = await http.get(`/house/${houseId}/calendar/${roomId}?year=${year}&month=${month}`);
  return data.data;
}

export async function getHouseCalendar(houseId) {
  const { data } = await http.get(`/house/${houseId}/calendar`);
  return data.data;
}

export async function getHouseCalendarByMonth(houseId, year, month) {
  const { data } = await http.get(`/house/${houseId}/calendar?year=${year}&month=${month}`);
  return data.data;
}

export function editHouse(houseId, houseData) {
  if (!houseId || !houseData) {
    reportClientError("Missing houseId or houseData:", { houseId, houseData });
    throw new Error("House ID or data is missing.");
  }
  return http
    .post(`/client/house/${houseId}`, houseData)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("editHouse - Error:", error);
      throw error;
    });
}

export function editHouseFacilities(houseId, facilitiesData) {
  if (!houseId || !facilitiesData) {
    reportClientError("Missing houseId or facilitiesData:", {
      houseId,
      facilitiesData,
    });
    throw new Error("House ID or facilities data is missing.");
  }
  return http
    .put(`/client/house/${houseId}/facility`, { facilities: facilitiesData })
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("editHouseFacilities - Error:", error);
      throw error;
    });
}

export function getHouseTypes(data) {
  return http
    .get("/assets/types/structure/detail", data)
    .then(({ data }) => data.data);
}

export function createHousePicture(houseId, data) {
  return http
    .post(`/client/house/${houseId}/media`, data)
    .then(({ data }) => data.data);
}

export function deleteHousePicture(houseId, imageToDelete) {
  return http
    .delete(`/client/house/${houseId}/media/${imageToDelete}`)
    .then(({ data }) => data.data);
}

export function changeHouseMainPicture(houseId, imageId, data) {
  return http
    .put(`/client/house/${houseId}/media/${imageId}`, data)
    .then(({ data }) => data.data);
}

export function updateHousePrice(houseId, prices) {
  if (!houseId || !prices) {
    reportClientError("Missing houseId or prices:", { houseId, prices });
    throw new Error("House ID or prices data is missing.");
  }

  return http
    .put(`/client/house/${houseId}/prices`, prices)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("updateHousePrice - Error:", error);
      throw error;
    });
}

export function updateRoomPrice(houseId, roomId, prices) {
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
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("updateRoomPrice - Error:", error);
      throw error;
    });
}

export function uploadHouseDocument(houseId, documentData) {
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
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("uploadHouseDocument - Error:", error);
      throw error;
    });
}

export function publishHouse(houseId) {
  if (!houseId) {
    reportClientError("Missing houseId:", { houseId });
    throw new Error("House ID is missing.");
  }

  return http
    .put(`/client/house/${houseId}/publish`)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("publishHouse - Error:", error);
      throw error;
    });
}

export function favoriteHouse(houseId) {
  if (!houseId) {
    reportClientError("Missing houseId:", { houseId });
    throw new Error("House ID is missing.");
  }

  return http
    .put(`/client/house/${houseId}/favorite`)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("favoriteHouse - Error:", error);
      throw error;
    });
}

export function getFavoriteHouses() {
  return http
    .get("/client/house/favorites")
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("getFavoriteHouses - Error:", error);
      throw error;
    });
}


export function fetchHouseComments(houseUuid) {
  if (!houseUuid) {
    reportClientError("fetchHouseComments - Missing house UUID");
    throw new Error("House UUID is required to fetch comments.");
  }
  return http
    .get(`/house/${houseUuid}/comments`)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("fetchHouseComments - Error:", error);
      throw error;
    });
}
