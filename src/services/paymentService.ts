import http from "./httpService";
import type { Payment, PaymentMethod, PaymentScenario } from "../types/api";

type ApiResponse<T> = { data?: T } | T;

const dataOf = <T>({ data }: { data: ApiResponse<T> }): T =>
  ((data && typeof data === "object" && "data" in data ? data.data : data) ?? null) as T;

export function getReservationPayment(reservationUuid: string): Promise<Payment | null> {
  return http
    .get(`/client/reserve/${reservationUuid}/payment`)
    .then((response) => dataOf<Payment | null>(response));
}

export function startReservationPayment(
  reservationUuid: string,
  method: PaymentMethod = "sandbox_card",
): Promise<Payment> {
  return http
    .post(`/client/reserve/${reservationUuid}/payment/start`, { method })
    .then((response) => dataOf<Payment>(response));
}

export function confirmReservationPayment(
  reservationUuid: string,
  paymentUuid: string,
  scenario: PaymentScenario,
): Promise<Payment> {
  return http
    .post(`/client/reserve/${reservationUuid}/payment/confirm`, {
      payment_uuid: paymentUuid,
      scenario,
    })
    .then((response) => dataOf<Payment>(response));
}
