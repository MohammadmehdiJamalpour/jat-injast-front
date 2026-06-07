import http from "./httpService";

export function getHomeContent() {
  return http.get("/content/homepage").then(({ data }) => data.data);
}

export function getInformation() {
  return http.get("/content/information").then(({ data }) => data.data);
}

export function getFooterContent() {
  return http.get("/content/footer").then(({ data }) => data.data);
}
