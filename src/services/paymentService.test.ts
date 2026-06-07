import { beforeEach, describe, expect, it, vi } from "vitest";

import http from "./httpService";
import {
  confirmReservationPayment,
  getReservationPayment,
  startReservationPayment,
} from "./paymentService";

vi.mock("./httpService", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("paymentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reads reservation payment from backend envelopes", async () => {
    vi.mocked(http.get).mockResolvedValueOnce({
      data: { data: { uuid: "PAY-1", amount: 1000, method: "sandbox_card", status: "created" } },
    });

    await expect(getReservationPayment("RES-1")).resolves.toEqual(
      expect.objectContaining({ uuid: "PAY-1" }),
    );
  });

  it("starts payments with sandbox card by default", async () => {
    vi.mocked(http.post).mockResolvedValueOnce({
      data: { data: { uuid: "PAY-2", amount: 1000, method: "sandbox_card", status: "created" } },
    });

    await startReservationPayment("RES-2");

    expect(http.post).toHaveBeenCalledWith("/client/reserve/RES-2/payment/start", {
      method: "sandbox_card",
    });
  });

  it("confirms payments with an explicit scenario", async () => {
    vi.mocked(http.post).mockResolvedValueOnce({
      data: { data: { uuid: "PAY-3", amount: 1000, method: "sandbox_card", status: "success" } },
    });

    await confirmReservationPayment("RES-3", "PAY-3", "success");

    expect(http.post).toHaveBeenCalledWith("/client/reserve/RES-3/payment/confirm", {
      payment_uuid: "PAY-3",
      scenario: "success",
    });
  });
});
