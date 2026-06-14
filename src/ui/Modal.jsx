import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { fa } from "../i18n/fa";

const sizes = {
  content: "max-w-md",
  confirm: "max-w-md",
  form: "max-w-lg",
  rich: "max-w-xl",
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-9xl",
};

const DEFAULT_MODAL_SIZE = "form";

const Modal = ({
  open,
  isOpen,
  onClose,
  title,
  children,
  size = DEFAULT_MODAL_SIZE,
  maxWidth,
  zIndexClassName = "z-50",
  viewportClassName = "items-center justify-center px-3 py-4 sm:px-6",
  maxHeightClassName = "max-h-[95vh]",
  bodyClassName = "px-4 pb-4 pt-3 sm:px-6 sm:pb-6",
  testId,
}) => {
  const visible = open ?? isOpen;
  const panelWidth = maxWidth || sizes[size] || sizes[DEFAULT_MODAL_SIZE];

  return (
    <Transition show={Boolean(visible)} as={Fragment}>
      <Dialog
        as="div"
        dir="rtl"
        className={`relative ${zIndexClassName} text-right`}
        data-testid={testId}
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

        <div className={`fixed inset-0 flex ${viewportClassName}`}>
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
              data-testid={testId ? `${testId}-panel` : undefined}
              className={`
                w-full
                bg-white flex flex-col dark:bg-slate-900 dark:text-slate-100
                min-w-0
                rounded-3xl shadow-lg dark:border dark:border-slate-700 dark:shadow-black/30
                ${maxHeightClassName}
                overflow-hidden
                text-right
                ${panelWidth}
              `}
            >
              {/* The container that scrolls, so the header can remain sticky */}
              <div
                className={`
                  flex flex-col 
                  ${maxHeightClassName}
                  overflow-auto 
                  scrollbar-thin 
                  scrollbar-thumb-gray-300 
                  scrollbar-track-gray-100 
                  scrollbar-thumb-rounded-full 
                  scrollbar-track-rounded-full
                `}
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
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-press flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-action text-primary-contrast transition duration-150 ease-in-out hover:bg-primary-action-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                      aria-label={fa.common.actions.close}
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Scrollable content */}
                <div dir="rtl" className={`w-full text-right ${bodyClassName}`}>
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
