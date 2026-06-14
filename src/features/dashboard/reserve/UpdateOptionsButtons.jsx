import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { updateReserveStatus } from "../../../services/reserveService";

export default function UpdateOptionsButtons({
  options = [],
  reserveUuid,
  payLink,
  onUpdateSuccess,
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);

  const openConfirmModal = (option) => {
    setSelectedOption(option);
    setIsConfirmOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmOpen(false);
    setSelectedOption(null);
  };

  const handleConfirm = async () => {
    if (!selectedOption) return;
    setLoading(true);
    try {
      await updateReserveStatus(reserveUuid, selectedOption.key);
      toast.success(`وضعیت به "${selectedOption.label}" تغییر یافت.`);
      closeConfirmModal();
      onUpdateSuccess?.();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "خطایی رخ داده است"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        {options.map((option) => (
          <button
            key={option.key}
            style={{ backgroundColor: `rgb(${option.color})` }}
            className="rounded-2xl px-4 py-2 text-sm text-white hover:opacity-90 transition"
            onClick={() => openConfirmModal(option)}
          >
            {option.label}
          </button>
        ))}

        {payLink && (
          <a
            href={payLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl px-4 py-2 text-sm bg-green-600 text-secondary-50 hover:bg-green-700 transition"
          >
            پرداخت نهایی
          </a>
        )}
      </div>

      <Transition appear show={isConfirmOpen} as={Fragment}>
        <Dialog as="div" dir="rtl" className="relative z-10 text-right" onClose={closeConfirmModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-white/15 backdrop-blur-md dark:bg-white/5" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border border-primary-100 bg-white p-6 text-right shadow-xl transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-slate-100">
                  تایید تغییر وضعیت
                </Dialog.Title>

                <div className="mt-2 text-sm text-gray-600 dark:text-slate-300">
                  آیا از تغییر وضعیت به{" "}
                  <span className="font-bold">{selectedOption?.label}</span>{" "}
                  مطمئن هستید؟
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-2xl bg-gray-300 px-4 py-2 text-gray-800 dark:bg-slate-800 dark:text-slate-100"
                    onClick={closeConfirmModal}
                    disabled={loading}
                  >
                    انصراف
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-primary-500 text-white rounded-2xl hover:bg-primary-600 transition disabled:opacity-50"
                    onClick={handleConfirm}
                    disabled={loading}
                  >
                    {loading ? "در حال انجام..." : "تایید"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
