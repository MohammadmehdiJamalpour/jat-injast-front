import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { classNames } from './../../../utils/classNames';

export default function DateRangeSelector({
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
    <div dir="rtl" className="relative z-20">
      <div className="pointer-events-auto mt-1.5 grid grid-cols-2 gap-1.5">
        {dateItems.map((item) => (
          <div
            key={item.label}
            className={classNames(
              "flex min-h-10 items-center gap-2 rounded-2xl border px-2.5 py-1.5 text-right transition",
              item.active
                ? "border-primary-500 bg-primary-action text-primary-contrast shadow-sm"
                : item.value
                ? "border-primary-100 bg-white text-gray-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                : "border-gray-200 bg-gray-50 text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
            )}
          >
            <span
              className={classNames(
                "grid h-7 w-7 shrink-0 place-items-center rounded-full",
                item.active
                  ? "bg-white/20 text-primary-contrast"
                  : "bg-primary-50 text-primary-700 dark:bg-slate-900 dark:text-primary-200"
              )}
            >
              <CalendarDaysIcon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold opacity-75">تاریخ {item.label}</span>
              <span className="block truncate text-[11px] font-bold sm:text-xs">
                {item.value || item.placeholder}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
