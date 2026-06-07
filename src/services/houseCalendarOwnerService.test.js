import { beforeEach, describe, expect, it, vi } from "vitest";
import http from "./httpService";
import {
  addOffSiteBooking,
  addPeakDays,
  addSpecialPrice,
  removeSpecialPrice,
  VendorHouseCalendarByHouse,
} from "./houseCalendarOwnerService";

vi.mock("./httpService", () => ({
  default: {
    delete: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("../utils/reportClientError", () => ({
  reportClientError: vi.fn(),
}));

describe("houseCalendarOwnerService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    http.delete.mockResolvedValue({ data: { data: { ok: true } } });
    http.get.mockResolvedValue({ data: { data: { ok: true } } });
    http.post.mockResolvedValue({ data: { data: { ok: true } } });
  });

  it("normalizes client calendar links to public calendar reads", async () => {
    await VendorHouseCalendarByHouse(
      null,
      null,
      "https://api.jat-injast.local/api/client/house/H12/calendar?year=1405&month=3"
    );

    expect(http.get).toHaveBeenCalledWith("/house/H12/calendar?year=1405&month=3");
  });

  it("reads the house calendar with year and month params", async () => {
    await VendorHouseCalendarByHouse("H12", 1405, 3);

    expect(http.get).toHaveBeenCalledWith("/house/H12/calendar", {
      params: { year: 1405, month: 3 },
    });
  });

  it("creates peak days with the expected owner payload", async () => {
    await addPeakDays("H12", "2026-06-10", "2026-06-12");

    expect(http.post).toHaveBeenCalledWith("/client/house/H12/calendar/peaks", {
      from_date: "2026-06-10",
      to_date: "2026-06-12",
    });
  });

  it("adds off-site bookings with optional room quantity", async () => {
    await addOffSiteBooking("H12", "2026-06-10", "2026-06-12", 2, "R9");

    expect(http.post).toHaveBeenCalledWith(
      "/client/house/H12/calendar/book/off-site",
      {
        from_date: "2026-06-10",
        quantity: 2,
        room_uuid: "R9",
        to_date: "2026-06-12",
      }
    );
  });

  it("adds and removes special prices with stable date payloads", async () => {
    await addSpecialPrice("H12", "2026-06-10", "2026-06-12", "3200000", "R9");
    await removeSpecialPrice("H12", "2026-06-10", "2026-06-12", "R9");

    expect(http.post).toHaveBeenCalledWith(
      "/client/house/H12/calendar/book/special-price",
      {
        from_date: "2026-06-10",
        price: "3200000",
        room_uuid: "R9",
        to_date: "2026-06-12",
      }
    );
    expect(http.delete).toHaveBeenCalledWith(
      "/client/house/H12/calendar/book/special-price",
      {
        data: {
          from_date: "2026-06-10",
          room_uuid: "R9",
          to_date: "2026-06-12",
        },
      }
    );
  });
});
