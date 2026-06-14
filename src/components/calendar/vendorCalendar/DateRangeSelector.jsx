import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { classNames } from "./../../../utils/classNames";

export default function DateRangeSelector({
  className,
  operationGroup,
  reserveDateFrom,
  reserveDateTo,
}) {
  const dateItems = [
    {
      label: "از",
      value: reserveDateFrom?.readAbleDate,
      placeholder: operationGroup ? "انتخاب شروع" : "شروع",
      active: Boolean(operationGroup && !reserveDateFrom),
    },
    {
      label: "تا",
      value: reserveDateTo?.readAbleDate,
      placeholder: operationGroup && reserveDateFrom ? "انتخاب پایان" : "پایان",
      active: Boolean(operationGroup && reserveDateFrom && !reserveDateTo),
    },
  ];

  return (
    <div dir="rtl" className={classNames("relative z-20", className)}>
      <div className="pointer-events-auto grid grid-cols-1 gap-1.5 md:grid-cols-2 md:gap-0 md:overflow-hidden md:rounded-2xl md:border md:border-gray-200 md:bg-white md:shadow-sm dark:md:border-slate-700 dark:md:bg-slate-950">
        {dateItems.map((item, index) => (
          <div
            key={item.label}
            className={classNames(
              "flex h-14 min-w-0 items-center gap-2.5 rounded-2xl border px-3 text-right transition md:h-16 md:rounded-none md:border-0 md:px-4 md:ring-inset",
              index === 0
                ? "md:rounded-r-2xl"
                : "md:rounded-l-2xl md:border-r md:border-gray-200 dark:md:border-slate-700",
              item.active
                ? "border-primary-500 bg-primary-action text-primary-contrast shadow-sm md:ring-2 md:ring-primary-500"
                : item.value
                  ? "border-primary-100 bg-white text-gray-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  : "border-gray-200 bg-gray-50 text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
            )}
          >
            <span
              className={classNames(
                "grid h-8 w-8 shrink-0 place-items-center rounded-full md:h-9 md:w-9",
                item.active
                  ? "bg-white/20 text-primary-contrast"
                  : "bg-primary-50 text-primary-700 dark:bg-slate-900 dark:text-primary-200",
              )}
            >
              <CalendarDaysIcon className="h-4 w-4" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 leading-none">
              <span className="block h-3 text-[10px] font-semibold leading-3 opacity-75">
                تاریخ {item.label}
              </span>
              <span className="block h-4 truncate text-xs font-bold leading-4 sm:text-sm md:h-5 md:leading-5">
                {item.value || item.placeholder}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
