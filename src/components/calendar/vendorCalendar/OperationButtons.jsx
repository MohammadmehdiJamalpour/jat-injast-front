import { useEffect, useRef } from "react";
import classNames from "classnames";

function OperationButtons({ handleReset, openOperationFlow, operationGroup }) {
  const viewButtonRef = useRef(null);

  useEffect(() => {
    if (!operationGroup && viewButtonRef.current) {
      viewButtonRef.current.focus();
    }
  }, [operationGroup]);

  return (
    <div
      dir="rtl"
      className="flex h-full w-full flex-col items-stretch gap-2 transition duration-300 ease-out motion-safe:[@starting-style]:blur-sm"
    >
      <div
        key={operationGroup || "view"}
        className={classNames(
          "grid w-full max-w-full grid-cols-2 gap-1.5 sm:gap-2 md:grid-cols-2 lg:h-full lg:grid-rows-2",
          "transition-all duration-300 ease-out motion-safe:animate-[vendorToolbarBlurIn_220ms_ease-out]",
        )}
      >
        <button
          ref={viewButtonRef}
          onClick={handleReset}
          className={classNames(
            "inline-flex h-8 w-full min-w-0 items-center justify-center truncate lg:h-full lg:min-h-8 xl:h-11 xl:max-h-11 xl:max-w-48 xl:justify-self-center",
            operationGroup
              ? "rounded-2xl border border-red-600 bg-transparent text-red-700 lg:rounded-3xl dark:text-red-300"
              : "rounded-2xl border border-primary-600 bg-primary-600 lg:rounded-3xl",
            "truncate px-2 text-[11px] font-medium sm:text-xs md:text-[10px] lg:text-xs",
            operationGroup
              ? "transition-all duration-300 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white"
              : "text-white transition-all duration-300 hover:bg-primary-600 hover:text-white",
            "outline-none",
            operationGroup ? "active:bg-red-700" : "active:bg-primary-700",
            !operationGroup
              ? "focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
              : "z-30 focus:ring-2 focus:ring-red-600 focus:ring-offset-2",
          )}
        >
          {operationGroup ? "لغو تغییرات" : "مشاهده"}
        </button>

        <button
          onClick={() => openOperationFlow("peak")}
          className={classNames(
            "inline-flex h-8 w-full min-w-0 items-center justify-center truncate lg:h-full lg:min-h-8 xl:h-11 xl:max-h-11 xl:max-w-48 xl:justify-self-center",
            "rounded-2xl px-2 text-[11px] font-medium sm:text-xs md:text-[10px] lg:rounded-3xl lg:text-xs",
            "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
            "border border-transparent bg-primary-500 text-white",
            "hover:bg-primary-600 focus:ring-primary-600 active:bg-primary-700",
            operationGroup && operationGroup !== "peak"
              ? "opacity-50 cursor-not-allowed"
              : "",
            operationGroup === "peak" ? "z-20 relative" : "",
          )}
          disabled={operationGroup && operationGroup !== "peak"}
        >
          تغییر ایام پیک
        </button>

        <button
          onClick={() => openOperationFlow("offsite")}
          className={classNames(
            "inline-flex h-8 w-full min-w-0 items-center justify-center truncate lg:h-full lg:min-h-8 xl:h-11 xl:max-h-11 xl:max-w-48 xl:justify-self-center",
            "rounded-2xl px-2 text-[11px] font-medium sm:text-xs md:text-[10px] lg:rounded-3xl lg:text-xs",
            "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
            "border border-transparent bg-primary-600 text-white",
            "hover:bg-primary-700 focus:ring-primary-700 active:bg-primary-800",
            operationGroup && operationGroup !== "offsite"
              ? "opacity-50 cursor-not-allowed"
              : "",
            operationGroup === "offsite" ? "z-20 relative" : "",
          )}
          disabled={operationGroup && operationGroup !== "offsite"}
        >
          رزرو خارج از سایت
        </button>

        <button
          onClick={() => openOperationFlow("price")}
          className={classNames(
            "inline-flex h-8 w-full min-w-0 items-center justify-center truncate lg:h-full lg:min-h-8 xl:h-11 xl:max-h-11 xl:max-w-48 xl:justify-self-center",
            "rounded-2xl px-2 text-[11px] font-medium sm:text-xs md:text-[10px] lg:rounded-3xl lg:text-xs",
            "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
            "border border-transparent bg-primary-700 text-white",
            "hover:bg-primary-800 focus:ring-primary-800 active:bg-primary-900",
            operationGroup && operationGroup !== "price"
              ? "opacity-50 cursor-not-allowed"
              : "",
            operationGroup === "price" ? "z-20 relative" : "",
          )}
          disabled={operationGroup && operationGroup !== "price"}
        >
          تغییر قیمت ویژه
        </button>
      </div>
    </div>
  );
}

export default OperationButtons;
