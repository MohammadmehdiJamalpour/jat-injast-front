// src/services/walletService.js

import http from "./httpService";
import { reportClientError } from "../utils/reportClientError";

const normalizeTransactions = (payload) => {
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.transactions)
      ? payload.transactions
      : [];

  return rows.map((tx) => ({
    ...tx,
    price: tx.price ?? tx.amount ?? 0,
  }));
};

export function getBanksList() {
  return http
    .get("/client/wallet/cards/banks")
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("getBanksList", error);
      throw error;
    });
}

export function getCardsList() {
  return http
    .get("/client/wallet/cards")
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("getCardsList", error);
      throw error;
    });
}

export function addCard(payload) {
  return http
    .post("/client/wallet/cards", payload)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("addCard", error);
      throw error;
    });
}

export function getWithdrawsList() {
  return http
    .get("/client/wallet/withdraw")
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("getWithdrawsList", error);
      throw error;
    });
}

export function showWithdraw(id) {
  return http
    .get(`/client/wallet/withdraw/${id}`)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("showWithdraw", error);
      throw error;
    });
}

export function addWithdraw(payload) {
  return http
    .post("/client/wallet/withdraw", payload)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("addWithdraw", error);
      throw error;
    });
}

export function getDefaultTransactions() {
  return http
    .get("/client/wallet/transactions/default")
    .then(({ data }) => normalizeTransactions(data.data))
    .catch((error) => {
      reportClientError("getDefaultTransactions", error);
      throw error;
    });
}

export function getBlockedTransactions() {
  return http
    .get("/client/wallet/transactions/blocked")
    .then(({ data }) => normalizeTransactions(data.data))
    .catch((error) => {
      reportClientError("getBlockedTransactions", error);
      throw error;
    });
}

export function chargeWallet(payload) {
  return http
    .post("/client/wallet/charge", payload)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("chargeWallet", error);
      throw error;
    });
}
