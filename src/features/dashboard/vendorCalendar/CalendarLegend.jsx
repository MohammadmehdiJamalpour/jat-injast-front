import React from "react";

const sampleBox =
  "relative h-5 w-5 overflow-hidden rounded-md border border-gray-300 bg-white dark:border-slate-700 dark:bg-slate-950";

export default function CalendarLegend() {
  const legendItems = [
    {
      label: "ایام پیک",
      render: (
        <div className={sampleBox}>
          <div
            className="absolute left-0 top-0 h-full w-full opacity-90"
            style={{
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
              backgroundColor: "var(--color-primary-400)",
            }}
          />
        </div>
      ),
    },
    {
      label: "ایام پیک توسط ادمین",
      render: (
        <div className={sampleBox}>
          <div className="absolute left-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </div>
      ),
    },
    {
      label: "امروز",
      render: <div className="h-5 w-5 rounded-md border-2 border-primary-600 bg-white dark:bg-slate-950" />,
    },
    {
      label: "رزرو خارج از سایت",
      render: (
        <div className={sampleBox}>
          <div
            className="absolute left-0 top-0 h-full w-full"
            style={{
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              backgroundColor: "var(--color-secondary-200)",
            }}
          />
        </div>
      ),
    },
    {
      label: "قفل شده + غیر فعال",
      render: (
        <div className="relative h-5 w-5 rounded-md border border-gray-300 bg-gray-200 text-gray-400 diagonal-stripes dark:border-slate-700 dark:bg-slate-800" />
      ),
    },
  ];

  return (
    <div dir="rtl" className="mt-1.5 border-t border-primary-100 pt-2 dark:border-slate-700">
      <h3 className="mb-1.5 text-xs font-bold text-gray-800 dark:text-slate-100">
        راهنمای تقویم
      </h3>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            {item.render}
            <span className="text-[11px] text-gray-600 dark:text-slate-300">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
