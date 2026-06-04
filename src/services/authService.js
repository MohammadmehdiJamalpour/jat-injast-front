import http from "./httpService";

export function passwordLogin(credentials) {
  return http.post("/auth/login/password", credentials).then(({ data }) => data.data);
}

export function loginWithToken(data) {
  return http.post("/auth/login/token", data).then(({ data }) => data.data);
}
