import Modal from "./../../../ui/Modal";
import { classNames } from "./../../../utils/classNames";

import BeatLoader from "react-spinners/BeatLoader";
import toPersianNumber from "../../../utils/toPersianNumber";
import { persianToEnglishDigits } from "../../../utils/numberHelpers";

function formatDate(value) {
  if (!value) return "—";
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
  if (!showOperationModal || !operationGroup) return null;

  const title =
    operationGroup === "peak"
      ? "تغییر ایام پیک"
      : operationGroup === "offsite"
      ? "رزرو خارج از سایت"
      : "تغییر قیمت ویژه";

  return (
    <Modal isOpen={showOperationModal} onClose={onClose} title={title} maxWidth="max-w-3xl">
      <div dir="rtl" className="flex w-full flex-col space-y-4 p-4 text-right">
        {/* Display from/to dates */}
        <div className="grid gap-2 rounded-2xl border border-primary-100 bg-primary-50/40 p-3 text-sm text-gray-700 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-200 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 dark:bg-slate-900">
            <span className="font-bold text-gray-900 dark:text-slate-100">تاریخ از:</span>
            <span className="font-medium">{formatDate(reserveDateFrom?.readAbleDate)}</span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 dark:bg-slate-900">
            <span className="font-bold text-gray-900 dark:text-slate-100">تاریخ تا:</span>
            <span className="font-medium">{formatDate(reserveDateTo?.readAbleDate)}</span>
          </div>
        </div>

        {/* PRICE BLOCK */}
        {operationGroup === "price" && (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-700 dark:text-slate-300 sm:text-sm md:text-md">
              لطفا برای تغییر قیمت، قیمت مورد نظر را وارد کنید
            </span>
            <div className="flex w-full max-w-xs items-center overflow-hidden rounded-2xl border border-primary-500 bg-white shadow-sm transition focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-100 dark:border-primary-400/50 dark:bg-slate-950 dark:focus-within:ring-primary-900/40">
              <input
                type="text"
                inputMode="numeric"
                dir="rtl"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-right text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                value={formatMoneyInput(price)}
                onChange={(e) => setPrice(cleanNumberInput(e.target.value))}
                placeholder="۰"
              />
              <span className="shrink-0 border-r border-primary-100 bg-primary-50 px-3 py-2 text-xs font-bold text-primary-800 dark:border-slate-700 dark:bg-slate-900 dark:text-primary-200">
                تومان
              </span>
            </div>
          </div>
        )}

        {/* QUANTITY for RENT ROOM + OFFSITE */}
        {operationGroup === "offsite" && isRentRoom && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="quantity"
              className="text-xs sm:text-sm md:text-md font-medium text-gray-700"
            >
              تعداد:
            </label>
            <input
              id="quantity"
              type="text"
              inputMode="numeric"
              className="w-20 rounded-md border border-gray-300 px-2 py-1 text-right text-xs sm:text-sm md:text-md focus:border-primary-500 focus:outline-none"
              value={toPersianNumber(quantity)}
              onChange={(e) => setQuantity(cleanNumberInput(e.target.value) || 1)}
              min={1}
            />
          </div>
        )}

        {/* PEAK BLOCK */}
        {operationGroup === "peak" && (
          <div className="flex flex-col md:flex-row justify-end gap-2">
            <button
              onClick={handleAddPeak}
              disabled={pendingRequest}
              className="bg-primary-500
                         text-white
                         w-full
                         md:w-56
                         max-w-56
                         rounded-3xl
                         px-4
                         py-2
                         flex
                         items-center
                         justify-center
                         text-xs
                         sm:text-sm"
            >
              {pendingRequest ? (
                <BeatLoader size={6} color="#fff" />
              ) : (
                "اضافه کردن ایام پیک"
              )}
            </button>

            <button
              onClick={handleRemovePeak}
              disabled={pendingRequest}
              className="bg-primary-600
                         text-white
                         w-full
                         md:w-56
                         max-w-56
                         rounded-3xl
                         px-4
                         py-2
                         flex
                         items-center
                         justify-center
                         text-xs
                         sm:text-sm"
            >
              {pendingRequest ? (
                <BeatLoader size={6} color="#fff" />
              ) : (
                "حذف کردن ایام پیک"
              )}
            </button>

            <button
              onClick={onClose}
              disabled={pendingRequest}
              className="border-red-500
                         border-2
                         text-red-700
                         w-full
                         md:w-56
                         max-w-56
                         rounded-3xl
                         px-4
                         py-2
                         flex
                         items-center
                         justify-center
                         text-xs
                         sm:text-sm"
            >
              لغو
            </button>
          </div>
        )}

        {/* OFFSITE BLOCK */}
        {operationGroup === "offsite" && (
          <div className="flex flex-col md:flex-row justify-end gap-2">
            <button
              onClick={handleAddOffsite}
              disabled={pendingRequest}
              className="bg-primary-500
                         text-white
                         w-full
                         md:w-56
                         max-w-56
                         rounded-3xl
                         px-4
                         py-2
                         flex
                         items-center
                         justify-center
                         text-xs
                         sm:text-sm"
            >
              {pendingRequest ? (
                <BeatLoader size={6} color="#fff" />
              ) : (
                "اضافه کردن رزرو خارج از سایت"
              )}
            </button>

            <button
              onClick={handleRemoveOffsite}
              disabled={pendingRequest}
              className="bg-primary-600
                         text-white
                         w-full
                         md:w-56
                         max-w-56
                         rounded-3xl
                         px-4
                         py-2
                         flex
                         items-center
                         justify-center
                         text-xs
                         sm:text-sm"
            >
              {pendingRequest ? (
                <BeatLoader size={6} color="#fff" />
              ) : (
                "حذف کردن رزرو خارج از سایت"
              )}
            </button>

            <button
              onClick={onClose}
              disabled={pendingRequest}
              className="border-red-500
                         border-2
                         text-red-700
                         w-full
                         md:w-56
                         max-w-56
                         rounded-3xl
                         px-4
                         py-2
                         flex
                         items-center
                         justify-center
                         text-xs
                         sm:text-sm"
            >
              لغو
            </button>
          </div>
        )}

        {/* PRICE BLOCK (Buttons) */}
        {operationGroup === "price" && (
          <div className="flex flex-col md:flex-row justify-end gap-2">
            <button
              onClick={handleChangePrice}
              disabled={pendingRequest || !price}
              className={classNames(
                "bg-primary-600 text-white w-full md:w-56 max-w-56 rounded-3xl px-4 py-2 flex items-center justify-center text-xs sm:text-sm",
                !price ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              {pendingRequest ? (
                <BeatLoader size={6} color="#fff" />
              ) : (
                "تغییر قیمت"
              )}
            </button>

            <button
              onClick={handleRemovePrice}
              disabled={pendingRequest}
              className="bg-primary-500
                         text-white
                         w-full
                         md:w-56
                         max-w-56
                         rounded-3xl
                         px-4
                         py-2
                         flex
                         items-center
                         justify-center
                         text-xs
                         sm:text-sm"
            >
              {pendingRequest ? (
                <BeatLoader size={6} color="#fff" />
              ) : (
                "حذف قیمت ویژه"
              )}
            </button>

            <button
              onClick={onClose}
              disabled={pendingRequest}
              className="border-red-500
                         border-2
                         text-red-700
                         w-full
                         md:w-56
                         max-w-56
                         rounded-3xl
                         px-4
                         py-2
                         flex
                         items-center
                         justify-center
                         text-xs
                         sm:text-sm"
            >
              لغو
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
