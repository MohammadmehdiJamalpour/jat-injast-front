import http from "./httpService";
import type { ApiId, Ticket, TicketDepartment } from "../types/api";

type TicketFormPayload = FormData | Record<string, unknown>;

const seedSubjectPrefixPattern = /^\s*\[(?:سندباکس|sandbox)\]\s*/i;
const seedMessagePrefixPattern = /^\s*(?:پاسخ\s+سندباکس|sandbox\s+reply)\s*:\s*/i;

function normalizeTicketSubject(subject: string) {
  return subject.replace(seedSubjectPrefixPattern, "").trim();
}

function normalizeTicketMessageText(value?: string) {
  if (!value) return value;
  return value
    .replace(seedMessagePrefixPattern, "پاسخ پشتیبانی: ")
    .replaceAll(" سندباکس", "")
    .replaceAll("sandbox", "")
    .trim();
}

function normalizeTicket(ticket: Ticket): Ticket {
  return {
    ...ticket,
    subject: normalizeTicketSubject(ticket.subject || ""),
    messages: ticket.messages?.map((message) => ({
      ...message,
      body: normalizeTicketMessageText(message.body),
      message: normalizeTicketMessageText(message.message),
      text: normalizeTicketMessageText(message.text),
    })),
  };
}

/**
 * GET /client/ticket/departments
 */
export function getTicketDepartments(): Promise<TicketDepartment[]> {
  return http
    .get("/client/ticket/departments")
    .then(({ data }) => data.data)
    .catch((error: unknown) => {
      return Promise.reject(error);
    });
}

/**
 * GET /client/ticket
 * Retrieves a list of all tickets for the client
 */
export function getTickets(): Promise<Ticket[]> {
  return http
    .get("/client/ticket")
    .then(({ data }) => data.data.map(normalizeTicket))
    .catch((error: unknown) => {
      return Promise.reject(error);
    });
}

/**
 * GET /client/ticket/:id
 * Retrieves a single ticket by ID
 */
export function getTicketById(id: ApiId): Promise<Ticket> {
  return http
    .get(`/client/ticket/${id}`)
    .then(({ data }) => normalizeTicket(data.data))
    .catch((error: unknown) => {
      return Promise.reject(error);
    });
}

/**
 * POST /client/ticket
 * Creates a new ticket
 */
export function createTicket(formData: TicketFormPayload): Promise<Ticket> {
  return http
    .post("/client/ticket", formData)
    .then(({ data }) => normalizeTicket(data.data))
    .catch((error: unknown) => {
      return Promise.reject(error);
    });
}

/**
 * POST /client/ticket/:id
 */
export function updateTicket(id: ApiId, formData: TicketFormPayload): Promise<Ticket> {
  // formData must include _method=PUT
  return http
    .post(`/client/ticket/${id}`, formData)
    .then(({ data }) => normalizeTicket(data.data))
    .catch((error: unknown) => {
      return Promise.reject(error);
    });
}

/**
 * DELETE /client/ticket/:id
 */
export function deleteTicket(id: ApiId): Promise<unknown> {
  return http
    .delete(`/client/ticket/${id}`)
    .then(({ data }) => data.data)
    .catch((error: unknown) => {
      return Promise.reject(error);
    });
}
