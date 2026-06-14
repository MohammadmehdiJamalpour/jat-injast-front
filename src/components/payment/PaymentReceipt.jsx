
import toPersianNumber from "@/utils/toPersianNumber";
import PaymentStatusBadge from "./PaymentStatusBadge";

const formatMoney = (value) =>
  value ? `${toPersianNumber(Number(value).toLocaleString("fa-IR"))} تومان` : "۰ تومان";

export default function PaymentReceipt({ payment, reservation }) {
  if (!payment) return null;

  return (
    <div
      data-testid="payment-receipt"
      className="rounded-2xl border border-primary-100 bg-primary-50/50 p-3 sm:rounded-3xl sm:p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] text-gray-500 sm:text-xs">رسید پرداخت آزمایشی</p>
          <h3 className="mt-0.5 truncate text-sm font-bold text-gray-900 sm:mt-1 sm:text-lg">
            {reservation?.house?.name || "رزرو اقامتگاه"}
          </h3>
        </div>
        <PaymentStatusBadge status={payment.status} />
      </div>

      <div className="mt-3 grid gap-2 text-xs sm:mt-4 sm:grid-cols-2 sm:gap-3 sm:text-sm">
        <Info label="شماره رزرو" value={reservation?.uuid || payment.reservation_uuid} />
        <Info label="کد پیگیری" value={payment.tracking_code} />
        <Info label="روش پرداخت" value={payment.method_label || "پرداخت آزمایشی"} />
        <Info label="مبلغ" value={formatMoney(payment.amount)} />
      </div>

      {payment.failure_reason && (
        <p className="mt-2 rounded-2xl bg-red-50 p-2.5 text-xs text-red-700 sm:mt-3 sm:p-3 sm:text-sm">
          {payment.failure_reason}
        </p>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-white px-2.5 py-1.5 sm:rounded-2xl sm:px-3 sm:py-2">
      <p className="text-[11px] text-gray-500 sm:text-xs">{label}</p>
      <p className="mt-0.5 break-words font-semibold text-gray-800 sm:mt-1">
        {toPersianNumber(value || "-")}
      </p>
    </div>
  );
}
