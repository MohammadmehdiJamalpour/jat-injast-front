// src/services/ticketService.js
import http from "./httpService";

/**
 * GET /client/ticket/departments
 */
export function getTicketDepartments() {
  return http
    .get("/client/ticket/departments")
    .then(({ data }) => data.data)
    .catch((error) => {
      return Promise.reject(error);
    });
}

/**
 * GET /client/ticket
 * Retrieves a list of all tickets for the client
 */
export function getTickets() {
  return http
    .get("/client/ticket")
    .then(({ data }) => data.data)
    .catch((error) => {
      return Promise.reject(error);
    });
}

/**
 * GET /client/ticket/:id
 * Retrieves a single ticket by ID
 */
export function getTicketById(id) {
  return http
    .get(`/client/ticket/${id}`)
    .then(({ data }) => data.data)
    .catch((error) => {
      return Promise.reject(error);
    });
}

/**
 * POST /client/ticket
 * Creates a new ticket
 */
export function createTicket(formData) {
  // Make sure you're passing a FormData object if you have attachments.
  return http
    .post("/client/ticket", formData)
    .then(({ data }) => data.data)
    .catch((error) => {
      return Promise.reject(error);
    });
}

/**
 * POST /client/ticket/:id
 */
export function updateTicket(id, formData) {
  // formData must include _method=PUT
  return http
    .post(`/client/ticket/${id}`, formData)
    .then(({ data }) => data.data)
    .catch((error) => {
      return Promise.reject(error);
    });
}

/**
 * DELETE /client/ticket/:id
 */
export function deleteTicket(id) {
  return http
    .delete(`/client/ticket/${id}`)
    .then(({ data }) => data.data)
    .catch((error) => {
      return Promise.reject(error);
    });
}
