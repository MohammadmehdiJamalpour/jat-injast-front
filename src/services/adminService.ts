import http from "./httpService";
import { unwrapData } from "./normalizers";
import type { AdminResource, ApiId, Payment, Reservation } from "../types/api";

type AdminParams = Record<string, unknown>;
type AdminPayload = Record<string, unknown>;

export function getAdminOverview(): Promise<AdminResource> {
  return http.get("/web-admin/overview").then(unwrapData<AdminResource>);
}

export function listAdminUsers(params: AdminParams = {}): Promise<AdminResource[]> {
  return http
    .get("/web-admin/users", { params })
    .then(unwrapData<AdminResource[]>);
}

export function createAdminUser(payload: AdminPayload): Promise<AdminResource> {
  return http
    .post("/web-admin/users", payload)
    .then(unwrapData<AdminResource>);
}

export function updateAdminUser(
  id: ApiId,
  payload: AdminPayload,
): Promise<AdminResource> {
  return http
    .put(`/web-admin/users/${id}`, payload)
    .then(unwrapData<AdminResource>);
}

export function deleteAdminUser(id: ApiId): Promise<unknown> {
  return http.delete(`/web-admin/users/${id}`).then(unwrapData<unknown>);
}

export function listAdminHouses(params: AdminParams = {}): Promise<AdminResource[]> {
  return http
    .get("/web-admin/houses", { params })
    .then(unwrapData<AdminResource[]>);
}

export function createAdminHouse(payload: AdminPayload): Promise<AdminResource> {
  return http
    .post("/web-admin/houses", payload)
    .then(unwrapData<AdminResource>);
}

export function updateAdminHouse(
  uuid: ApiId,
  payload: AdminPayload,
): Promise<AdminResource> {
  return http
    .put(`/web-admin/houses/${uuid}`, payload)
    .then(unwrapData<AdminResource>);
}

export function deleteAdminHouse(uuid: ApiId): Promise<unknown> {
  return http.delete(`/web-admin/houses/${uuid}`).then(unwrapData<unknown>);
}

export function listAdminReservations(
  params: AdminParams = {},
): Promise<Reservation[]> {
  return http
    .get("/web-admin/reservations", { params })
    .then(unwrapData<Reservation[]>);
}

export function listAdminPayments(params: AdminParams = {}): Promise<Payment[]> {
  return http
    .get("/web-admin/payments", { params })
    .then(unwrapData<Payment[]>);
}

export function updateAdminReservation(
  uuid: ApiId,
  payload: AdminPayload,
): Promise<Reservation> {
  return http
    .put(`/web-admin/reservations/${uuid}`, payload)
    .then(unwrapData<Reservation>);
}

export function listAdminTypeItems(
  params: AdminParams = {},
): Promise<AdminResource[]> {
  return http
    .get("/web-admin/type-items", { params })
    .then(unwrapData<AdminResource[]>);
}

export function createAdminTypeItem(payload: AdminPayload): Promise<AdminResource> {
  return http
    .post("/web-admin/type-items", payload)
    .then(unwrapData<AdminResource>);
}

export function updateAdminTypeItem(
  id: ApiId,
  payload: AdminPayload,
): Promise<AdminResource> {
  return http
    .put(`/web-admin/type-items/${id}`, payload)
    .then(unwrapData<AdminResource>);
}

export function deleteAdminTypeItem(id: ApiId): Promise<unknown> {
  return http.delete(`/web-admin/type-items/${id}`).then(unwrapData<unknown>);
}
