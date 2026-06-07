import http from "./httpService";

export function getUser() {
  return http
    .get("/client/profile")
    .then(({ data }) => data.data)
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function editUser(data) {
  return http
    .put("/client/profile", data)
    .then(({ data }) => data.data)
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function logOutUser() {
  return http
    .delete("/client/profile/logout")
    .then(({ data }) => data.data)
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function becomeVendor(data) {
  return http
    .put("/client/profile/vendor", data)
    .then(({ data }) => data.data)
    .catch((error) => {
      return Promise.reject(error);
    });
}

/**
 * Add a house to favorites.
 * @param {string} uuid - The unique house UUID.
 * @returns {Promise<any>}
 */
export function favoriteHouse(uuid) {
  return http
    .put(`/client/house/${uuid}/favorite`)
    .then(({ data }) => data.data)
    .catch((error) => {
      return Promise.reject(error);
    });
}

/**
 * Get the list of all favorite houses for the user.
 * @returns {Promise<any>}
 */
export function getFavoriteHouses() {
  return http
    .get("/client/house/favorites")
    .then(({ data }) => data.data)
    .catch((error) => {
      return Promise.reject(error);
    });
}
