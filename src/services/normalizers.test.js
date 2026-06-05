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
  it("normalizes house summaries across known backend shapes", () => {
    const house = normalizeHouseSummary({
      uuid: "A12BC",
      title: "کلبه جنگلی",
      city_name: "رامسر",
      price_per_night: "3200000",
      images: [{ image: "/media/house.jpg" }],
      structure: { label: "کلبه چوبی" },
      favorite: "true",
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

  it("falls back to stable house values when optional media and labels are missing", () => {
    const house = normalizeHouseSummary({
      id: 9,
      base_price: "2500000",
      mainImage: { url: "/media/main.jpg" },
      location: { city: { name: "یزد" }, province: { title: "یزد" } },
      is_favorite: "false",
    });

    expect(house.uuid).toBe("9");
    expect(house.name).toBe("نامشخص");
    expect(house.city).toBe("یزد");
    expect(house.province).toBe("یزد");
    expect(house.image).toBe("/media/main.jpg");
    expect(house.is_favorite).toBe(false);
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
    expect(reservation.date_to).toBe("2026-06-12");
    expect(reservation.total_price).toBe(4500000);
    expect(reservation.house.name).toBe("سوئیت ساحلی");
  });

  it("normalizes reservation aliases from older responses", () => {
    const reservation = normalizeReservation({
      uuid: "RES-2",
      payment_status: "pending",
      from_date: "2026-06-01",
      to_date: "2026-06-03",
      price: "1800000",
    });

    expect(reservation).toMatchObject({
      uuid: "RES-2",
      payment_status: "pending",
      date_from: "2026-06-01",
      date_to: "2026-06-03",
      total_price: 1800000,
    });
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

  it("normalizes ticket aliases and direct department labels", () => {
    const ticket = normalizeTicket({
      uuid: "T-9",
      subject: "تغییر تاریخ ورود",
      department: "پشتیبانی رزرو",
      message_count: "3",
      created: "2026-06-04",
    });

    expect(ticket.id).toBe("T-9");
    expect(ticket.subject).toBe("تغییر تاریخ ورود");
    expect(ticket.department).toBe("پشتیبانی رزرو");
    expect(ticket.messages_count).toBe(3);
    expect(ticket.created_at).toBe("2026-06-04");
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
    expect(message.sender.type).toBe("host");
    expect(message.attachments[0]).toMatchObject({
      url: "/media/a.jpg",
      type: "image",
      name: "a.jpg",
    });
  });

  it("normalizes chat messages from compact ticket responses", () => {
    const message = normalizeChatMessage({
      id: 10,
      message: "درخواست شما ثبت شد",
      sender_name: "پشتیبانی",
      sender_type: "support",
      attachments: [{ url: "/media/file.pdf" }],
    });

    expect(message.id).toBe(10);
    expect(message.body).toBe("درخواست شما ثبت شد");
    expect(message.sender.name).toBe("پشتیبانی");
    expect(message.attachments[0]).toMatchObject({
      url: "/media/file.pdf",
      type: "file",
      name: "فایل",
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

  it("normalizes wallet transaction aliases", () => {
    const tx = normalizeWalletTransaction({
      id: 4,
      value: "120000",
      title: "شارژ کیف پول",
      detail: "پرداخت آزمایشی",
      ref_type: "payment",
      created: "2026-06-04",
    });

    expect(tx).toMatchObject({
      id: 4,
      amount: 120000,
      label: "شارژ کیف پول",
      description: "پرداخت آزمایشی",
      reference_type: "payment",
      created_at: "2026-06-04",
    });
  });

  it("normalizes calendar months and day states", () => {
    const month = normalizeCalendarMonth({
      jalali_year: 1405,
      jalali_month: 3,
      name: "خرداد",
      days: [{ date: "2026-06-10", number: 20, locked: "true", price: "3000000" }],
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

  it("normalizes calendar day aliases without treating false strings as locked", () => {
    const month = normalizeCalendarMonth({
      year: "1405",
      month: "4",
      title: "تیر",
      days: [{ value: "2026-07-01", day_number: "11", disabled: "false", reserved: "1" }],
    });

    expect(month.days[0]).toMatchObject({
      date: "2026-07-01",
      day: 11,
      is_locked: false,
      is_reserved: true,
    });
  });
});
