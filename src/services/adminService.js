import http from "./httpService";

const dataOf = ({ data }) => data.data;

export function getAdminOverview() {
  return http.get("/web-admin/overview").then(dataOf);
}

export function listAdminUsers(params = {}) {
  return http.get("/web-admin/users", { params }).then(dataOf);
}

export function createAdminUser(payload) {
  return http.post("/web-admin/users", payload).then(dataOf);
}

export function updateAdminUser(id, payload) {
  return http.put(`/web-admin/users/${id}`, payload).then(dataOf);
}

export function deleteAdminUser(id) {
  return http.delete(`/web-admin/users/${id}`).then(dataOf);
}

export function listAdminHouses(params = {}) {
  return http.get("/web-admin/houses", { params }).then(dataOf);
}

export function createAdminHouse(payload) {
  return http.post("/web-admin/houses", payload).then(dataOf);
}

export function updateAdminHouse(uuid, payload) {
  return http.put(`/web-admin/houses/${uuid}`, payload).then(dataOf);
}

export function deleteAdminHouse(uuid) {
  return http.delete(`/web-admin/houses/${uuid}`).then(dataOf);
}

export function listAdminReservations(params = {}) {
  return http.get("/web-admin/reservations", { params }).then(dataOf);
}

export function listAdminPayments(params = {}) {
  return http.get("/web-admin/payments", { params }).then(dataOf);
}

export function updateAdminReservation(uuid, payload) {
  return http.put(`/web-admin/reservations/${uuid}`, payload).then(dataOf);
}

export function listAdminTypeItems(params = {}) {
  return http.get("/web-admin/type-items", { params }).then(dataOf);
}

export function createAdminTypeItem(payload) {
  return http.post("/web-admin/type-items", payload).then(dataOf);
}

export function updateAdminTypeItem(id, payload) {
  return http.put(`/web-admin/type-items/${id}`, payload).then(dataOf);
}

export function deleteAdminTypeItem(id) {
  return http.delete(`/web-admin/type-items/${id}`).then(dataOf);
}
