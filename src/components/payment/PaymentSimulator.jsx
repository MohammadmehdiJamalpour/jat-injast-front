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
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4" dir="rtl">
        <div className="rounded-3xl border border-primary-100 bg-primary-50/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-primary-700">محیط Sandbox</p>
              <h2 className="mt-1 text-lg font-bold text-gray-900">
                این پرداخت فقط در محیط آزمایشی انجام می‌شود
              </h2>
            </div>
            <CreditCardIcon className="h-9 w-9 text-primary-700" />
          </div>
          <p className="mt-2 text-sm leading-7 text-gray-600">
            هیچ شماره کارت واقعی دریافت یا ذخیره نمی‌شود. یکی از سناریوهای تست را انتخاب کنید تا وضعیت رزرو و کیف پول به شکل نمایشی تغییر کند.
          </p>
          <p className="mt-3 text-sm font-bold text-primary-800">
            مبلغ قابل پرداخت: {formatMoney(reservation?.total_price || reservation?.invoice?.total)}
          </p>
        </div>

        {payment && <PaymentReceipt payment={payment} reservation={reservation} />}

        {canPay ? (
          <div className="grid gap-3 md:grid-cols-3">
            {scenarios.map((item) => {
              const Icon = item.icon;
              const isActive = loading && activeScenario === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleScenario(item.key)}
                  disabled={loading}
                  className={`btn-press rounded-3xl border p-4 text-right transition disabled:opacity-60 ${item.className}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Icon className="h-7 w-7" />
                    {isActive && <Loading type="beat" size={5} />}
                  </div>
                  <h3 className="mt-3 font-bold">{item.title}</h3>
                  <p className="mt-2 text-xs leading-6">{item.description}</p>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
            این رزرو در وضعیت فعلی امکان پرداخت آزمایشی ندارد.
          </div>
        )}
      </div>
    </Modal>
  );
}
