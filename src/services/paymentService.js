import http from "./httpService";

const dataOf = ({ data }) => data?.data ?? data;

export function getReservationPayment(reservationUuid) {
  return http.get(`/client/reserve/${reservationUuid}/payment`).then(dataOf);
}

export function startReservationPayment(reservationUuid, method = "demo_card") {
  return http
    .post(`/client/reserve/${reservationUuid}/payment/start`, { method })
    .then(dataOf);
}

export function confirmReservationPayment(reservationUuid, paymentUuid, scenario) {
  return http
    .post(`/client/reserve/${reservationUuid}/payment/confirm`, {
      payment_uuid: paymentUuid,
      scenario,
    })
    .then(dataOf);
}
