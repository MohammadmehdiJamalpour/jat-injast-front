import { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

import Modal from "./../../../ui/Modal";
import { classNames } from "./../../../utils/classNames";
import toPersianNumber from "../../../utils/toPersianNumber";
import { persianToEnglishDigits } from "../../../utils/numberHelpers";

const COMPACT_OPERATION_MODAL_MAX_WIDTH = "max-w-md";

function formatDate(value) {
  if (!value) return "-";
  const normalized = persianToEnglishDigits(String(value));
  const match = normalized.match(/^(\d{4})\s+(.+?)\s+(\d{1,2})$/);
  if (match) {
    return `${toPersianNumber(match[3])} ${match[2]} ${toPersianNumber(match[1])}`;
  }
  return toPersianNumber(value);
}

function cleanNumberInput(value) {
  return persianToEnglishDigits(String(value || "")).replace(/[^\d]/g, "");
}

function formatMoneyInput(value) {
  const cleaned = cleanNumberInput(value);
  if (!cleaned) return "";
  return toPersianNumber(Number(cleaned).toLocaleString("en-US"));
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 dark:bg-slate-900">
      <dt className="shrink-0 text-xs font-bold text-gray-700 dark:text-slate-300">
        {label}
      </dt>
      <dd className="min-w-0 truncate text-left text-sm font-semibold text-gray-950 dark:text-slate-100">
        {value}
      </dd>
    </div>
  );
}

function ActionButton({
  children,
  className,
  disabled,
  loading,
  onClick,
  tone = "primary",
}) {
  const tones = {
    primary:
      "border-primary-600 bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-300",
    danger:
      "border-red-600 bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-300",
    neutral:
      "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        "btn-press inline-flex min-h-10 w-full items-center justify-center rounded-full border px-4 py-2 text-center text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 sm:text-sm",
        tones[tone],
        disabled ? "cursor-not-allowed opacity-60" : "",
        className,
      )}
    >
      {loading ? <BeatLoader size={6} color="#fff" /> : children}
    </button>
  );
}

export default function OperationModal({
  showOperationModal,
  operationGroup,
  pendingRequest,
  price,
  quantity,
  reserveDateFrom,
  reserveDateTo,
  onClose,
  setPrice,
  setQuantity,
  handleAddPeak,
  handleRemovePeak,
  handleAddOffsite,
  handleRemoveOffsite,
  handleChangePrice,
  handleRemovePrice,
  isRentRoom,
}) {
  const [activeAction, setActiveAction] = useState(null);

  useEffect(() => {
    if (!pendingRequest) setActiveAction(null);
  }, [pendingRequest]);

  if (!showOperationModal || !operationGroup) return null;

  const isPeak = operationGroup === "peak";
  const isOffsite = operationGroup === "offsite";
  const isPrice = operationGroup === "price";

  const title = isPeak
    ? "تغییر ایام پیک"
    : isOffsite
      ? "رزرو خارج از سایت"
      : "تغییر قیمت ویژه";

  const description = isPeak
    ? "بازه انتخاب شده را به ایام پیک اضافه کنید یا از ایام پیک حذف کنید."
    : isOffsite
      ? "برای این بازه رزرو خارج از سایت را ثبت یا حذف کنید."
      : "برای این بازه قیمت ویژه را ثبت، تغییر یا حذف کنید.";

  async function handleAction(actionKey, action) {
    if (pendingRequest) return;
    setActiveAction(actionKey);
    try {
      await action();
    } finally {
      setActiveAction(null);
    }
  }

  return (
    <Modal
      isOpen={showOperationModal}
      onClose={onClose}
      title={title}
      maxWidth={COMPACT_OPERATION_MODAL_MAX_WIDTH}
      bodyClassName="px-4 pb-4 pt-3 sm:px-5 sm:pb-5"
    >
      <div
        dir="rtl"
        className="mx-auto flex w-full max-w-md flex-col gap-3 text-right"
      >
        <p className="text-sm leading-6 text-gray-600 dark:text-slate-300">
          {description}
        </p>

        <dl className="grid gap-2 rounded-2xl border border-primary-100 bg-primary-50/40 p-2 dark:border-slate-700 dark:bg-slate-950/50">
          <DetailRow
            label="تاریخ از"
            value={formatDate(reserveDateFrom?.readAbleDate)}
          />
          <DetailRow
            label="تاریخ تا"
            value={formatDate(reserveDateTo?.readAbleDate)}
          />
        </dl>

        {isPrice && (
          <label className="flex flex-col gap-1.5 text-xs font-bold text-gray-700 dark:text-slate-300">
            قیمت ویژه
            <div className="flex w-full items-center overflow-hidden rounded-2xl border border-primary-300 bg-white shadow-sm transition focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-100 dark:border-primary-400/50 dark:bg-slate-950 dark:focus-within:ring-primary-900/40">
              <input
                type="text"
                inputMode="numeric"
                dir="rtl"
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-right text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                value={formatMoneyInput(price)}
                onChange={(e) => setPrice(cleanNumberInput(e.target.value))}
                placeholder="۰"
              />
              <span className="shrink-0 border-r border-primary-100 bg-primary-50 px-3 py-2.5 text-xs font-bold text-primary-800 dark:border-slate-700 dark:bg-slate-900 dark:text-primary-200">
                تومان
              </span>
            </div>
          </label>
        )}

        {isOffsite && isRentRoom && (
          <label
            htmlFor="quantity"
            className="flex flex-col gap-1.5 text-xs font-bold text-gray-700 dark:text-slate-300"
          >
            تعداد
            <input
              id="quantity"
              type="text"
              inputMode="numeric"
              className="h-10 w-24 rounded-xl border border-gray-200 bg-white px-3 text-right text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-primary-900/40"
              value={toPersianNumber(quantity)}
              onChange={(e) =>
                setQuantity(cleanNumberInput(e.target.value) || 1)
              }
              min={1}
            />
          </label>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          {isPeak && (
            <>
              <ActionButton
                onClick={() => handleAction("add-peak", handleAddPeak)}
                disabled={pendingRequest}
                loading={pendingRequest && activeAction === "add-peak"}
              >
                افزودن ایام پیک
              </ActionButton>
              <ActionButton
                tone="danger"
                onClick={() => handleAction("remove-peak", handleRemovePeak)}
                disabled={pendingRequest}
                loading={pendingRequest && activeAction === "remove-peak"}
              >
                حذف ایام پیک
              </ActionButton>
            </>
          )}

          {isOffsite && (
            <>
              <ActionButton
                onClick={() => handleAction("add-offsite", handleAddOffsite)}
                disabled={pendingRequest}
                loading={pendingRequest && activeAction === "add-offsite"}
              >
                ثبت رزرو خارج از سایت
              </ActionButton>
              <ActionButton
                tone="danger"
                onClick={() =>
                  handleAction("remove-offsite", handleRemoveOffsite)
                }
                disabled={pendingRequest}
                loading={pendingRequest && activeAction === "remove-offsite"}
              >
                حذف رزرو خارج از سایت
              </ActionButton>
            </>
          )}

          {isPrice && (
            <>
              <ActionButton
                onClick={() => handleAction("change-price", handleChangePrice)}
                disabled={pendingRequest || !price}
                loading={pendingRequest && activeAction === "change-price"}
              >
                ثبت قیمت ویژه
              </ActionButton>
              <ActionButton
                tone="danger"
                onClick={() => handleAction("remove-price", handleRemovePrice)}
                disabled={pendingRequest}
                loading={pendingRequest && activeAction === "remove-price"}
              >
                حذف قیمت ویژه
              </ActionButton>
            </>
          )}

          <ActionButton
            tone="neutral"
            className="sm:col-span-2"
            onClick={onClose}
            disabled={pendingRequest}
          >
            انصراف
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
}
