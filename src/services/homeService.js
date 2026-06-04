
import http from "./httpService";

/**
 * Fetch home content from /content/homepage
 */
export function getHomeContent() {
  return http
    .get("/content/homepage")
    .then(({ data }) => data.data);
}

/**
 * Fetch information from /content/information
 */
export function getInformation() {
  return http
    .get("/content/information")
    .then(({ data }) => data.data);
}

/**
 * Fetch footer content from /content/footer
 */
export function getFooterContent() {
  return http
    .get("/content/footer")
    .then(({ data }) => data.data);
}
