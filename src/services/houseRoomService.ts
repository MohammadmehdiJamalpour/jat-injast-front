import http from "./httpService";
import { reportClientError } from "../utils/reportClientError";
import type { ApiId, HouseRoom, HouseRoomPayload } from "../types/api";

export function createRoom(houseId: ApiId, roomData: HouseRoomPayload): Promise<HouseRoom> {
  if (!houseId || !roomData) {
    reportClientError("Missing houseId or roomData:", { houseId, roomData });
    throw new Error("House ID or room data is missing.");
  }
  return http
    .post(`/client/house/${houseId}/room`, roomData)
    .then(({ data }) => data.data)
    .catch((error: unknown) => {
      reportClientError("createRoom - Error:", error);
      throw error;
    });
}

export function editRoom(
  houseId: ApiId,
  roomId: ApiId,
  roomData: HouseRoomPayload,
): Promise<HouseRoom> {
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
    .catch((error: unknown) => {
      reportClientError("editRoom - Error:", error);
      throw error;
    });
}

export function deleteRoom(houseId: ApiId, roomId: ApiId): Promise<unknown> {
  if (!houseId || !roomId) {
    reportClientError("Missing houseId or roomId:", { houseId, roomId });
    throw new Error("House ID or room ID is missing.");
  }
  return http
    .delete(`/client/house/${houseId}/room/${roomId}`)
    .then(({ data }) => data.data)
    .catch((error: unknown) => {
      reportClientError("deleteRoom - Error:", error);
      throw error;
    });
}
