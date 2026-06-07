
import http from "./httpService";
import { reportClientError } from "../utils/reportClientError";
import type {
  WalletBank,
  WalletCard,
  WalletCardPayload,
  WalletChargePayload,
  WalletTransaction,
  WalletWithdraw,
  WalletWithdrawPayload,
} from "../types/api";

type TransactionPayload = WalletTransaction[] | { transactions?: WalletTransaction[] };

export const normalizeTransactions = (
  payload: TransactionPayload | null | undefined,
): WalletTransaction[] => {
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

export function getBanksList(): Promise<WalletBank[]> {
  return http
    .get("/client/wallet/cards/banks")
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("getBanksList", error);
      throw error;
    });
}

export function getCardsList(): Promise<WalletCard[]> {
  return http
    .get("/client/wallet/cards")
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("getCardsList", error);
      throw error;
    });
}

export function addCard(payload: WalletCardPayload): Promise<WalletCard> {
  return http
    .post("/client/wallet/cards", payload)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("addCard", error);
      throw error;
    });
}

export function getWithdrawsList(): Promise<WalletWithdraw[]> {
  return http
    .get("/client/wallet/withdraw")
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("getWithdrawsList", error);
      throw error;
    });
}

export function showWithdraw(id: string | number): Promise<WalletWithdraw> {
  return http
    .get(`/client/wallet/withdraw/${id}`)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("showWithdraw", error);
      throw error;
    });
}

export function addWithdraw(payload: WalletWithdrawPayload): Promise<WalletWithdraw> {
  return http
    .post("/client/wallet/withdraw", payload)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("addWithdraw", error);
      throw error;
    });
}

export function getDefaultTransactions(): Promise<WalletTransaction[]> {
  return http
    .get("/client/wallet/transactions/default")
    .then(({ data }) => normalizeTransactions(data.data))
    .catch((error) => {
      reportClientError("getDefaultTransactions", error);
      throw error;
    });
}

export function getBlockedTransactions(): Promise<WalletTransaction[]> {
  return http
    .get("/client/wallet/transactions/blocked")
    .then(({ data }) => normalizeTransactions(data.data))
    .catch((error) => {
      reportClientError("getBlockedTransactions", error);
      throw error;
    });
}

export function chargeWallet(payload: WalletChargePayload): Promise<unknown> {
  return http
    .post("/client/wallet/charge", payload)
    .then(({ data }) => data.data)
    .catch((error) => {
      reportClientError("chargeWallet", error);
      throw error;
    });
}
