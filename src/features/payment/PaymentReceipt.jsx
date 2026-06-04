import React from "react";

import toPersianNumber from "@/utils/toPersianNumber";
import PaymentStatusBadge from "./PaymentStatusBadge";

const formatMoney = (value) =>
  value ? `${toPersianNumber(Number(value).toLocaleString("fa-IR"))} تومان` : "۰ تومان";

export default function PaymentReceipt({ payment, reservation }) {
  if (!payment) return null;

  return (
    <div className="rounded-3xl border border-primary-100 bg-primary-50/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500">رسید پرداخت آزمایشی</p>
          <h3 className="mt-1 text-lg font-bold text-gray-900">
            {reservation?.house?.name || "رزرو اقامتگاه"}
          </h3>
        </div>
        <PaymentStatusBadge status={payment.status} />
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <Info label="شماره رزرو" value={reservation?.uuid || payment.reservation_uuid} />
        <Info label="کد پیگیری" value={payment.tracking_code} />
        <Info label="روش پرداخت" value={payment.method_label || "کارت تست"} />
        <Info label="مبلغ" value={formatMoney(payment.amount)} />
      </div>

      {payment.failure_reason && (
        <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
          {payment.failure_reason}
        </p>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-white px-3 py-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 break-words font-semibold text-gray-800">{toPersianNumber(value || "-")}</p>
    </div>
  );
}

