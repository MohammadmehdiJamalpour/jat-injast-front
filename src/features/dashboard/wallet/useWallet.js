
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getBanksList,
  getCardsList,
  addCard,
  getWithdrawsList,
  showWithdraw,
  addWithdraw,
  getDefaultTransactions,
  getBlockedTransactions,
  chargeWallet,
} from "../../../services/walletService";

/** 
 * Fetch banks list
 */
export function useBanksList() {
  return useQuery({
    queryKey: ["wallet", "banksList"],
    queryFn: getBanksList,
  });
}

/** 
 * Fetch cards list
 */
export function useCardsList() {
  return useQuery({
    queryKey: ["wallet", "cardsList"],
    queryFn: getCardsList,
  });
}

/** 
 * Add card (mutation)
 */
export function useAddCard() {
  return useMutation(addCard);
}

/** 
 * Fetch withdraws list
 */
export function useWithdrawsList() {
  return useQuery({
    queryKey: ["wallet", "withdrawsList"],
    queryFn: getWithdrawsList,
  });
}

/** 
 * Show a single withdraw
 */
export function useShowWithdraw(withdrawId, enabled = true) {
  return useQuery({
    queryKey: ["wallet", "withdraw", withdrawId],
    queryFn: () => showWithdraw(withdrawId),
    enabled: !!withdrawId && enabled,
  });
}

/** 
 * Add new withdraw
 */
export function useAddWithdraw() {
  return useMutation(addWithdraw);
}

/** 
 * Get default transactions
 */
export function useDefaultTransactions() {
  return useQuery({
    queryKey: ["wallet", "defaultTransactions"],
    queryFn: getDefaultTransactions,
  });
}

/** 
 * Get blocked transactions
 */
export function useBlockedTransactions() {
  return useQuery({
    queryKey: ["wallet", "blockedTransactions"],
    queryFn: getBlockedTransactions,
  });
}

/** 
 * Charge wallet
 */
export function useChargeWallet() {
  return useMutation(chargeWallet);
}
