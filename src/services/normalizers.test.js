import { describe, expect, it } from "vitest";
import {
  normalizeCalendarMonth,
  normalizeChatMessage,
  normalizeHouseSummary,
  normalizeReservation,
  normalizeTicket,
  normalizeWalletTransaction,
} from "./normalizers";

describe("service normalizers", () => {
  it("normalizes house summary across known backend shapes", () => {
    const house = normalizeHouseSummary({
      uuid: "A12BC",
      title: "کلبه جنگلی",
      city_name: "رامسر",
      price_per_night: "3200000",
      images: [{ image: "/media/house.jpg" }],
      structure: { label: "کلبه چوبی" },
      favorite: true,
    });

    expect(house).toMatchObject({
      uuid: "A12BC",
      name: "کلبه جنگلی",
      city: "رامسر",
      price: 3200000,
      image: "/media/house.jpg",
      structure: "کلبه چوبی",
      is_favorite: true,
    });
  });

  it("normalizes reservation payment and date fields", () => {
    const reservation = normalizeReservation({
      code: "RES-1",
      house: { uuid: "H1", name: "سوئیت ساحلی" },
      payment: { status: "success" },
      check_in: "2026-06-10",
      check_out: "2026-06-12",
      amount: "4500000",
    });

    expect(reservation.uuid).toBe("RES-1");
    expect(reservation.payment_status).toBe("success");
    expect(reservation.date_from).toBe("2026-06-10");
    expect(reservation.total_price).toBe(4500000);
    expect(reservation.house.name).toBe("سوئیت ساحلی");
  });

  it("normalizes ticket metadata", () => {
    const ticket = normalizeTicket({
      id: 8,
      title: "پیگیری پرداخت",
      department: { title: "مالی" },
      messages: [{ id: 1 }, { id: 2 }],
    });

    expect(ticket.id).toBe(8);
    expect(ticket.subject).toBe("پیگیری پرداخت");
    expect(ticket.department).toBe("مالی");
    expect(ticket.messages_count).toBe(2);
  });

  it("normalizes chat message attachments", () => {
    const message = normalizeChatMessage({
      uuid: "m1",
      text: "سلام",
      sender: { full_name: "میزبان", role: "host" },
      files: [{ file: "/media/a.jpg", kind: "image", filename: "a.jpg" }],
    });

    expect(message.body).toBe("سلام");
    expect(message.sender.name).toBe("میزبان");
    expect(message.attachments[0]).toMatchObject({
      url: "/media/a.jpg",
      type: "image",
      name: "a.jpg",
    });
  });

  it("normalizes wallet transaction values", () => {
    const tx = normalizeWalletTransaction({
      uuid: "tx1",
      price: "900000",
      type: "برداشت",
      ref_uuid: "pay1",
    });

    expect(tx.id).toBe("tx1");
    expect(tx.amount).toBe(900000);
    expect(tx.label).toBe("برداشت");
    expect(tx.reference_uuid).toBe("pay1");
  });

  it("normalizes calendar months and day states", () => {
    const month = normalizeCalendarMonth({
      jalali_year: 1405,
      jalali_month: 3,
      name: "خرداد",
      days: [{ date: "2026-06-10", number: 20, locked: true, price: "3000000" }],
    });

    expect(month.year).toBe(1405);
    expect(month.month).toBe(3);
    expect(month.title).toBe("خرداد");
    expect(month.days[0]).toMatchObject({
      date: "2026-06-10",
      day: 20,
      price: 3000000,
      is_locked: true,
    });
  });
});
