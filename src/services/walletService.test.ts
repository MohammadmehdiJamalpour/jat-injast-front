import { describe, expect, it } from "vitest";

import { normalizeTransactions } from "./walletService";

describe("normalizeTransactions", () => {
  it("accepts arrays and fills price from amount", () => {
    expect(normalizeTransactions([{ id: 1, amount: 12000 }])).toEqual([
      { id: 1, amount: 12000, price: 12000 },
    ]);
  });

  it("accepts transaction envelope payloads", () => {
    expect(
      normalizeTransactions({
        transactions: [{ id: "tx-1", price: 9000, amount: 7000 }],
      }),
    ).toEqual([{ id: "tx-1", price: 9000, amount: 7000 }]);
  });
});
