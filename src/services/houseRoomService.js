import http from "./httpService";
import { reportClientError } from "../utils/reportClientError";

export function createRoom(houseId, roomData) {
  if (!houseId || !roomData) {
    reportClientError("Missing houseId or roomData:", { houseId, roomData });
    throw new Error("House ID or room data is missing.");
  }
  return http
    .post(`/client/house/${houseId}/room`, roomData)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("createRoom - Error:", error);
      throw error;
    });
}

export function editRoom(houseId, roomId, roomData) {
  if (!houseId || !roomId || !roomData) {
    reportClientError("Missing houseId, roomId, or roomData:", {
      houseId,
      roomId,
      roomData,
    });
    throw new Error("House ID, room ID, or room data is missing.");
  }
  return http
    .put(`/client/house/${houseId}/room/${roomId}`, roomData)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("editRoom - Error:", error);
      throw error;
    });
}

export function deleteRoom(houseId, roomId) {
  if (!houseId || !roomId) {
    reportClientError("Missing houseId or roomId:", { houseId, roomId });
    throw new Error("House ID or room ID is missing.");
  }
  return http
    .delete(`/client/house/${houseId}/room/${roomId}`)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("deleteRoom - Error:", error);
      throw error;
    });
}
