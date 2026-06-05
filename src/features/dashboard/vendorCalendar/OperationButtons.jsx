import React, { useEffect, useRef } from "react";
import classNames from "classnames";

function OperationButtons({ handleReset, openOperationFlow, operationGroup }) {
  // Ref to the “مشاهده” button
  const viewButtonRef = useRef(null);

  // Focus “مشاهده” on first mount if no active operation
  useEffect(() => {
    if (!operationGroup && viewButtonRef.current) {
      viewButtonRef.current.focus();
    }
  }, []);

  // Re-focus “مشاهده” if operationGroup becomes falsy (canceled)
  useEffect(() => {
    if (!operationGroup && viewButtonRef.current) {
      viewButtonRef.current.focus();
    }
  }, [operationGroup]);

  return (
    <div dir="rtl" className="flex w-full flex-col items-center justify-center gap-2 lg:w-3/4">
      {/* Container for all 5 buttons */}
      <div
        className={classNames(
          // 2×2 grid on small screens
          "grid w-full max-w-3xl grid-cols-2 gap-1.5",
          // Becomes a flex row on md+
          "md:flex md:flex-row md:flex-wrap md:items-stretch md:justify-center"
        )}
      >
        {/* 1) مشاهده */}
        <button
          ref={viewButtonRef}
          onClick={handleReset}
          className={classNames(
            "inline-flex h-8 w-full items-center justify-center md:w-auto",
            "rounded-xl border border-primary-600 bg-primary-600",
            "px-2 text-[11px] font-medium text-white sm:text-xs",
            "transition-all duration-300 hover:bg-primary-600 hover:text-white",
            "outline-none active:bg-primary-700",
            // Show focus ring if no operation is active
            !operationGroup
              ? "focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
              : "focus:ring-0 focus:ring-transparent"
          )}
        >
          مشاهده
        </button>

        {/* 2) تغییر ایام پیک */}
        <button
          onClick={() => openOperationFlow("peak")}
          className={classNames(
            "inline-flex h-8 w-full items-center justify-center md:w-auto",
            "rounded-xl px-2 text-[11px] font-medium sm:text-xs",
            "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
            "border border-transparent bg-primary-500 text-white",
            "hover:bg-primary-600 focus:ring-primary-600 active:bg-primary-700",
            operationGroup && operationGroup !== "peak"
              ? "opacity-50 cursor-not-allowed"
              : "",
            operationGroup === "peak" ? "z-20 relative" : ""
          )}
          disabled={operationGroup && operationGroup !== "peak"}
        >
          تغییر ایام پیک
        </button>

        {/* 3) رزرو خارج از سایت */}
        <button
          onClick={() => openOperationFlow("offsite")}
          className={classNames(
            "inline-flex h-8 w-full items-center justify-center truncate md:w-auto",
            "rounded-xl px-2 text-[11px] font-medium sm:text-xs",
            "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
            "border border-transparent bg-primary-600 text-white",
            "hover:bg-primary-700 focus:ring-primary-700 active:bg-primary-800",
            operationGroup && operationGroup !== "offsite"
              ? "opacity-50 cursor-not-allowed"
              : "",
            operationGroup === "offsite" ? "z-20 relative" : ""
          )}
          disabled={operationGroup && operationGroup !== "offsite"}
        >
          رزرو خارج از سایت
        </button>

        {/* 4) تغییر قیمت ویژه */}
        <button
          onClick={() => openOperationFlow("price")}
          className={classNames(
            "inline-flex h-8 w-full items-center justify-center truncate md:w-auto",
            "rounded-xl px-2 text-[11px] font-medium sm:text-xs",
            "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
            "border border-transparent bg-primary-700 text-white",
            "hover:bg-primary-800 focus:ring-primary-800 active:bg-primary-900",
            operationGroup && operationGroup !== "price"
              ? "opacity-50 cursor-not-allowed"
              : "",
            operationGroup === "price" ? "z-20 relative" : ""
          )}
          disabled={operationGroup && operationGroup !== "price"}
        >
          تغییر قیمت ویژه
        </button>

        {/* 5) لغو تغییرات */}
        <button
          onClick={handleReset}
          className={classNames(
            // Match the size of other buttons on all breakpoints:
            "inline-flex h-8 w-full items-center justify-center md:w-auto",
            "rounded-xl px-2 text-[11px] font-medium sm:text-xs",
            "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
            "border border-red-600 bg-red-600 text-white",
            "hover:bg-white hover:text-red-600 focus:ring-red-600 active:bg-red-700 dark:hover:bg-red-500/10 dark:hover:text-red-300",
            // Show/hide logic
            operationGroup
              ? "max-h-12 opacity-100 z-30" // Visible if operation is active
              : "max-h-0 opacity-0 pointer-events-none" // Hidden if none
          )}
        >
          لغو تغییرات
        </button>
      </div>
    </div>
  );
}

export default OperationButtons;
