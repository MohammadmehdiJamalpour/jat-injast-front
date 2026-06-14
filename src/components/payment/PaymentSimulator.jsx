"use client";

import { useEffect, useState } from "react";
import { CheckCircleIcon, ClockIcon, CreditCardIcon, XCircleIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

import Modal from "@/ui/Modal";
import Loading from "@/ui/Loading";
import toPersianNumber from "@/utils/toPersianNumber";
import {
  confirmReservationPayment,
  getReservationPayment,
  startReservationPayment,
} from "@/services/paymentService";
import PaymentReceipt from "./PaymentReceipt";

const scenarios = [
  {
    key: "success",
    title: "پرداخت آزمایشی موفق",
    description: "رزرو پرداخت شده و رسید آزمایشی صادر می‌شود.",
    icon: CheckCircleIcon,
    className: "border-green-200 bg-green-50 text-green-700",
  },
  {
    key: "failed",
    title: "پرداخت آزمایشی ناموفق",
    description: "پرداخت رد می‌شود و امکان تلاش دوباره می‌ماند.",
    icon: XCircleIcon,
    className: "border-red-200 bg-red-50 text-red-700",
  },
  {
    key: "pending",
    title: "پرداخت آزمایشی در انتظار",
    description: "پرداخت برای نمایش وضعیت بررسی، معلق می‌ماند.",
    icon: ClockIcon,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
];

const formatMoney = (value) =>
  value ? `${toPersianNumber(Number(value).toLocaleString("fa-IR"))} تومان` : "۰ تومان";

export default function PaymentSimulator({ isOpen, onClose, reservation, onCompleted }) {
  const [payment, setPayment] = useState(reservation?.payment || null);
  const [loading, setLoading] = useState(false);
  const [activeScenario, setActiveScenario] = useState(null);

  useEffect(() => {
    setPayment(reservation?.payment || null);
  }, [reservation?.payment, reservation?.uuid]);

  useEffect(() => {
    if (!isOpen || !reservation?.uuid) return;
    let cancelled = false;
    getReservationPayment(reservation.uuid)
      .then((data) => {
        if (!cancelled && data) setPayment(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isOpen, reservation?.uuid]);

  const handleScenario = async (scenario) => {
    if (!reservation?.uuid) return;
    try {
      setLoading(true);
      setActiveScenario(scenario);
      const started = await startReservationPayment(reservation.uuid, "sandbox_card");
      const confirmed = await confirmReservationPayment(reservation.uuid, started.uuid, scenario);
      setPayment(confirmed);
      if (scenario === "success") toast.success("پرداخت آزمایشی با موفقیت انجام شد.");
      if (scenario === "failed") toast.error("پرداخت آزمایشی ناموفق ثبت شد.");
      if (scenario === "pending") toast("پرداخت آزمایشی در انتظار بررسی ثبت شد.");
      onCompleted?.(confirmed);
    } catch (error) {
      toast.error(error?.response?.data?.message || "خطا در پرداخت آزمایشی");
    } finally {
      setLoading(false);
      setActiveScenario(null);
    }
  };

  const canPay = ["pending", "accepted"].includes(reservation?.status?.key || reservation?.status);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="پرداخت آزمایشی رزرو"
      size="rich"
      zIndexClassName="z-[1100]"
      viewportClassName="items-start justify-center px-3 pb-3 pt-20 sm:items-center sm:px-6 sm:py-6"
      maxHeightClassName="max-h-[calc(100dvh-5.75rem)] sm:max-h-[95vh]"
      bodyClassName="px-3 pb-3 pt-2 sm:px-5 sm:pb-5 sm:pt-4"
      testId="payment-simulator-modal"
    >
      <div className="space-y-2.5 sm:space-y-4" dir="rtl">
        <div className="rounded-2xl border border-primary-100 bg-primary-50/60 p-3 sm:rounded-3xl sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-primary-700 sm:text-xs">محیط Sandbox</p>
              <h2 className="mt-0.5 text-sm font-bold leading-6 text-gray-900 sm:mt-1 sm:text-lg sm:leading-7">
                این پرداخت فقط در محیط آزمایشی انجام می‌شود
              </h2>
            </div>
            <CreditCardIcon className="h-7 w-7 shrink-0 text-primary-700 sm:h-9 sm:w-9" />
          </div>
          <p className="mt-2 hidden text-sm leading-7 text-gray-600 sm:block">
            هیچ شماره کارت واقعی دریافت یا ذخیره نمی‌شود. یکی از سناریوهای تست را انتخاب کنید تا وضعیت رزرو و کیف پول به شکل نمایشی تغییر کند.
          </p>
          <p className="mt-1.5 text-xs leading-5 text-gray-600 sm:hidden">
            یکی از سناریوهای تست را انتخاب کنید؛ کارت واقعی دریافت نمی‌شود.
          </p>
          <p className="mt-2 rounded-2xl bg-white/70 px-3 py-2 text-xs font-bold text-primary-800 sm:mt-3 sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm">
            مبلغ قابل پرداخت: {formatMoney(reservation?.total_price || reservation?.invoice?.total)}
          </p>
        </div>

        {payment && <PaymentReceipt payment={payment} reservation={reservation} />}

        {canPay ? (
          <div className="grid gap-2 md:grid-cols-3 md:gap-3">
            {scenarios.map((item) => {
              const Icon = item.icon;
              const isActive = loading && activeScenario === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  data-testid={`payment-scenario-${item.key}`}
                  onClick={() => handleScenario(item.key)}
                  disabled={loading}
                  className={`btn-press flex min-h-[3.5rem] items-center gap-3 rounded-2xl border p-3 text-right transition disabled:opacity-60 md:block md:min-h-0 md:rounded-3xl md:p-4 ${item.className}`}
                >
                  <div className="flex shrink-0 items-center justify-center md:justify-between">
                    <Icon className="h-6 w-6 md:h-7 md:w-7" />
                    {isActive && (
                      <span className="hidden md:inline-flex">
                        <Loading type="beat" size={5} />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 md:mt-3">
                    <h3 className="text-sm font-bold leading-5 md:text-base">{item.title}</h3>
                    <p className="hidden text-xs leading-6 md:mt-2 md:block">{item.description}</p>
                  </div>
                  {isActive && (
                    <span className="shrink-0 md:hidden">
                      <Loading type="beat" size={5} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-gray-50 p-3 text-sm text-gray-600 sm:p-4">
            این رزرو در وضعیت فعلی امکان پرداخت آزمایشی ندارد.
          </div>
        )}
      </div>
    </Modal>
  );
}
