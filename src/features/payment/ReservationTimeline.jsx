import React from "react";

import PaymentStatusBadge from "./PaymentStatusBadge";

export default function ReservationTimeline({ reservation }) {
  const reservationStatus = reservation?.status;
  const paymentStatus = reservation?.payment_status || reservation?.payment?.status;
  const steps = [
    { key: "reserve", label: "ثبت رزرو", active: true },
    {
      key: "accept",
      label: "تایید میزبان",
      active: ["accepted", "paid", "done"].includes(reservationStatus?.key),
    },
    {
      key: "pay",
      label: "پرداخت آزمایشی",
      active: paymentStatus?.key === "success" || reservationStatus?.key === "paid",
    },
    { key: "done", label: "تکمیل اقامت", active: reservationStatus?.key === "done" },
  ];

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-bold text-gray-800">مسیر رزرو</h3>
        <PaymentStatusBadge status={paymentStatus} />
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step.key}
            className={`rounded-2xl border px-3 py-2 text-center text-xs transition ${
              step.active
                ? "border-primary-300 bg-primary-50 text-primary-800"
                : "border-gray-100 bg-gray-50 text-gray-500"
            }`}
          >
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px]">
              {index + 1}
            </span>
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}

