import http from "./httpService";

/**
 * GET /house/:uuid/comments
 * Retrieves all comments for a given house by its UUID.
 */
export function getHouseComments(houseUuid) {
  return http
    .get(`/house/${houseUuid}/comments`)
    .then(({ data }) => data.data)
    .catch((error) => {
      return Promise.reject(error);
    });
}

/**
 * POST /client/comment
 * Guest sends a new comment.

 */
export function sendComment({ reserve_uuid, comment, vote }) {
  return http
    .post("/client/comment", { reserve_uuid, comment, vote })
    .then(({ data }) => data.data)
    .catch((error) => {
      return Promise.reject(error);
    });
}

/**
 * GET /client/comment
 * Host retrieves the list of comments.
 */
export function getComments(page = 1) {
  return http
    .get(`/client/comment?page=${page}`)
    .then(({ data }) => data)  // Return the full response (including pagination info)
    .catch((error) => {
      return Promise.reject(error);
    });
}

/**
 * PUT /client/comment/:uuid
 * Host sends a reply (host_replay) to a specific comment.
 */
export function replyToComment(uuid, host_replay) {
  return http
    .put(`/client/comment/${uuid}`, { host_replay })
    .then(({ data }) => data.data)
    .catch((error) => {
      return Promise.reject(error);
    });
}
