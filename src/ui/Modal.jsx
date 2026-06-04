import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { fa } from "../i18n/fa";

const sizes = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-9xl",
};

const Modal = ({
  open,
  isOpen,
  onClose,
  title,
  children,
  size,
  maxWidth = "max-w-9xl",
}) => {
  const visible = open ?? isOpen;
  const panelWidth = size ? sizes[size] || maxWidth : maxWidth;

  return (
    <Transition show={Boolean(visible)} as={Fragment}>
      <Dialog
        as="div"
        dir="rtl"
        className="relative z-50 text-right"
        onClose={onClose || (() => {})}
      >
        <Transition.Child
          as={Fragment}
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-white/15 backdrop-blur-md dark:bg-white/5"
            aria-hidden="true"
          />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center px-3 py-4 sm:px-6">
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-4 scale-95"
          >
            {/* Modal Panel */}
            <Dialog.Panel
              dir="rtl"
              className={`
                w-full
                bg-white flex flex-col dark:bg-slate-900 dark:text-slate-100
                mx-2 sm:mx-10 md:mx-14
                rounded-3xl shadow-lg dark:border dark:border-slate-700 dark:shadow-black/30
                max-h-[95vh]
                overflow-hidden
                text-right
                ${panelWidth}
              `}
            >
              {/* The container that scrolls, so the header can remain sticky */}
              <div
                className="
                  flex flex-col 
                  max-h-[95vh] 
                  overflow-auto 
                  scrollbar-thin 
                  scrollbar-thumb-gray-300 
                  scrollbar-track-gray-100 
                  scrollbar-thumb-rounded-full 
                  scrollbar-track-rounded-full
                "
              >
                {/* Sticky Header (RTL: title on the right, close on the left) */}
                <div dir="rtl" className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-primary-100 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900 sm:px-6">
                  {title ? (
                    <Dialog.Title className="min-w-0 truncate text-right text-base font-bold text-gray-900 dark:text-slate-100 sm:text-lg">
                      {title}
                    </Dialog.Title>
                  ) : (
                    <span />
                  )}

                  {onClose && (
                    <div className="btn-press h-9 w-9 shrink-0 rounded-full bg-primary-action text-primary-contrast transition duration-150 ease-in-out hover:bg-primary-action-hover">
                      <button
                        onClick={onClose}
                        className="flex items-center w-full h-full justify-center"
                        aria-label={fa.common.actions.close}
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Scrollable content */}
                <div dir="rtl" className="w-full px-4 pb-4 pt-3 text-right sm:px-6 sm:pb-6">
                  {children}
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
