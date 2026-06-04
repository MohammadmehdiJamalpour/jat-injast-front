import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const emptyValue = "نامشخص";

function formatMoney(value) {
  if (value == null || value === "") return "ندارد";
  return `${Number(value).toLocaleString("fa-IR")} تومان`;
}

function yesNo(value) {
  return value ? "بله" : "خیر";
}

export default function DayDetailModal({
  showDayModal,
  setShowDayModal,
  selectedDayDetails,
}) {
  if (!showDayModal) return null;

  const rows = selectedDayDetails
    ? [
        ["تاریخ", selectedDayDetails.readAbleDate || selectedDayDetails.date || emptyValue],
        ["قیمت", selectedDayDetails.price != null ? `${Number(selectedDayDetails.price).toLocaleString("fa-IR")} تومان` : emptyValue],
        ["قیمت ویژه", formatMoney(selectedDayDetails.specialPrice)],
        ["روز پیک", yesNo(selectedDayDetails.isPeakDay)],
        ["خارج از سایت", yesNo(selectedDayDetails.isBookingOffSite)],
        ["توضیحات", selectedDayDetails.HolidayText || "-"],
        ["اتاق های آزاد", selectedDayDetails.numberFreeRoom ?? emptyValue],
        ["نوع قیمت", selectedDayDetails.priceFrom || emptyValue],
        ["تعطیل", yesNo(selectedDayDetails.isHoliday)],
        ["آخر هفته", yesNo(selectedDayDetails.isWeekend)],
      ]
    : [];

  return ReactDOM.createPortal(
    <Transition show={showDayModal} as={Fragment}>
      <Dialog
        as="div"
        dir="rtl"
        className="relative z-[9999]"
        onClose={() => setShowDayModal(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/15 backdrop-blur-md dark:bg-white/5" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="translate-y-2 scale-95 opacity-0"
            enterTo="translate-y-0 scale-100 opacity-100"
            leave="transition ease-in duration-150"
            leaveFrom="translate-y-0 scale-100 opacity-100"
            leaveTo="translate-y-2 scale-95 opacity-0"
          >
            <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-3xl border border-primary-100 bg-white text-right shadow-xl shadow-primary-100/40 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30">
              <div className="flex items-center justify-between border-b border-primary-100 px-4 py-3 dark:border-slate-700">
                <Dialog.Title className="text-sm font-bold text-gray-900 dark:text-slate-100">
                  جزئیات روز
                </Dialog.Title>
                <button
                  type="button"
                  onClick={() => setShowDayModal(false)}
                  className="btn-press grid h-8 w-8 place-items-center rounded-full bg-primary-action text-primary-contrast transition hover:bg-primary-action-hover"
                  aria-label="بستن"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-3 scrollbar-thin">
                <dl className="grid gap-2">
                  {rows.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[7rem_minmax(0,1fr)] items-start gap-2 rounded-2xl bg-gray-50 px-3 py-2 text-xs dark:bg-slate-950/60"
                    >
                      <dt className="font-bold text-gray-800 dark:text-slate-200">
                        {label}
                      </dt>
                      <dd className="min-w-0 break-words text-gray-700 dark:text-slate-300">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>,
    document.body
  );
}
