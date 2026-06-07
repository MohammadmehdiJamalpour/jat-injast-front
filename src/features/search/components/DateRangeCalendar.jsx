import {
  useState,
  useMemo,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { toPersian } from "./../../../utils/toPersianDigits";

dayjs.extend(jalaliday);

const PERSIAN_MONTHS = [
  "فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور",
  "مهر","آبان","آذر","دی","بهمن","اسفند",
];
const isSame = (a, b) =>
  a && b && a.year === b.year && a.month === b.month && +a.day === +b.day;
const isBefore = (a, b) =>
  !b ? false
      : a.year !== b.year   ? a.year  < b.year
      : a.month !== b.month ? a.month < b.month
      : +a.day < +b.day;
const isBetween = (d, s, e) => {
  const D = new Date(d.year, d.month - 1, d.day);
  return (
    D > new Date(s.year, s.month - 1, s.day) &&
    D < new Date(e.year, e.month - 1, e.day)
  );
};

const selectedDayCls =
  "!border-primary-action !bg-primary-action !text-white shadow-lg shadow-primary-200/60 ring-2 ring-primary-200 ring-offset-2 ring-offset-white dark:!border-sky-300 dark:!bg-sky-300 dark:!text-slate-950 dark:shadow-sky-950/30 dark:ring-sky-200/70 dark:ring-offset-slate-950";
const previewEdgeDayCls =
  "!border-primary-500 !bg-primary-200 !text-primary-900 shadow-md shadow-primary-100/70 ring-2 ring-primary-300 ring-offset-1 ring-offset-white dark:!border-sky-300 dark:!bg-sky-400/35 dark:!text-white dark:shadow-sky-950/25 dark:ring-sky-300/50 dark:ring-offset-slate-950";
const rangeDayCls =
  "!border-primary-300 !bg-primary-100 !text-primary-900 shadow-inner ring-1 ring-primary-300/70 dark:!border-sky-400/70 dark:!bg-sky-400/20 dark:!text-sky-50 dark:ring-sky-300/35";

const buildCalendarData = (months = 12) => {
  const today = dayjs().calendar("jalali");
  const data  = [];

  for (let i = 0; i < months; i++) {
    const first         = today.add(i, "month").startOf("month");
    const daysInMonth   = first.daysInMonth();
    const leadingBlanks = first.day(); // 0 = Saturday

    const month = {
      year: first.year(),
      month: first.month() + 1,
      month_name: PERSIAN_MONTHS[first.month()],
      days: [],
    };

    /* leading blanks */
    for (let b = 0; b < leadingBlanks; b++) month.days.push({ isBlank: true });

    /* day cells */
    for (let d = 1; d <= daysInMonth; d++) {
      const g = first.date(d).calendar("gregory");
      month.days.push({
        day          : d,
        gregorianDate: g.toDate(),
        isDisable    : g.isBefore(dayjs(), "day"),
        isToday      : g.isSame(dayjs(), "day"),
        isHoliday    : g.day() === 6, // Friday
      });
    }

    /* trailing blanks */
    while (month.days.length % 7 !== 0) month.days.push({ isBlank: true });
    data.push(month);
  }
  return data;
};

const baseDayCls = (day, extraDisabled) => {
  if (day.isBlank) return "invisible";
  if (day.isDisable || extraDisabled)
    return "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500";
  const cls = [];
  if (day.isToday)   cls.push("border-2 bg-primary-50/80 border-primary-600 dark:bg-primary-900/35 dark:border-primary-300");
  if (day.isHoliday) cls.push("text-red-600 dark:text-red-300");
  return cls.join(" ");
};

const DateRangeCalendar = forwardRef(({ months = 12, onChange }, ref) => {
  const calendarData = useMemo(() => buildCalendarData(months), [months]);

  /* responsive columns */
  const [monthsPerView, setMonthsPerView] = useState(
    typeof window !== "undefined" && window.innerWidth < 1024 ? 1 : 2
  );
  useEffect(() => {
    const handle = () => setMonthsPerView(window.innerWidth < 1024 ? 1 : 2);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  /* swiper index */
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, calendarData.length - monthsPerView);

  /* range state */
  const [from,  setFrom ]  = useState(null);
  const [to,    setTo   ]  = useState(null);
  const [hoverDate, setHoverDate] = useState(null);

  /* expose API */
  useImperativeHandle(ref, () => ({
    prev : () => setIndex(i => Math.max(0,        i - 1)),
    next : () => setIndex(i => Math.min(maxIndex, i + 1)),
    clear: () => { setFrom(null); setTo(null); setHoverDate(null); },
  }));

  /* notify parent */
  useEffect(() => { onChange?.({ from, to }); }, [from, to, onChange]);

  /* click handler */
  const pick = (day, meta) => {
    if (day.extraDisabled || day.isDisable || day.isBlank) return;
    const dateObj = { year: meta.year, month: meta.month, day: day.day, gregorianDate: day.gregorianDate };
    if (!from || (from && to)) {
      setFrom(dateObj); setTo(null); setHoverDate(null);
    } else if (!isBefore(dateObj, from)) {
      setTo(dateObj); setHoverDate(null);
    }
  };

  /* translation */
  const translateX = monthsPerView === 1 ? index * 100 : (index * 100) / monthsPerView;

  /* render */
  return (
    <div className="w-full overflow-hidden mt-4">
      <div
        className="flex transition-transform duration-300"
        style={{ transform: `translateX(${translateX}%)` }}
      >
        {calendarData.map((month, mi) => {
          const visibleStart = index;
          const visibleEnd   = index + monthsPerView - 1;
          const showPrev     = mi === visibleStart;
          const showNext     = mi === visibleEnd;

          return (
            <div key={mi} className="flex-shrink-0 w-full lg:w-1/2 px-2 select-none">
              {/* month header */}
              <div className="flex items-center justify-between mb-2">
                {showPrev ? (
                  <button
                    onClick={() => setIndex(i => Math.max(0, i - 1))}
                    disabled={index === 0}
                    className="rounded-full bg-primary-action p-1 text-primary-contrast transition hover:bg-primary-action-hover disabled:bg-slate-800 disabled:text-slate-500 disabled:opacity-70"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                ) : <span className="w-5" />}

                <h4 className="font-bold text-primary-800 dark:text-primary-200">
                  {month.month_name} {toPersian(month.year)}
                </h4>

                {showNext ? (
                  <button
                    onClick={() => setIndex(i => Math.min(maxIndex, i + 1))}
                    disabled={index === maxIndex}
                    className="rounded-full bg-primary-action p-1 text-primary-contrast transition hover:bg-primary-action-hover disabled:bg-slate-800 disabled:text-slate-500 disabled:opacity-70"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                ) : <span className="w-5" />}
              </div>

              {/* weekday labels */}
              <div className="grid grid-cols-7 text-center font-semibold text-primary-800 mb-2 dark:text-primary-200">
                {["ش","ی","د","س","چ","پ","ج"].map(d => <div key={d}>{d}</div>)}
              </div>

              {/* day cells */}
              <div className="grid grid-cols-7 gap-0.5">
                {month.days.map((day, di) => {
                  const date = { year: month.year, month: month.month, day: day.day };
                  const extraDisabled = from && !to && isBefore(date, from);

                  let cls = baseDayCls(day, extraDisabled);
                  const selStart = isSame(date, from);
                  const selEnd   = isSame(date, to);
                  const hoverEdge = from && !to && hoverDate && isSame(date, hoverDate);

                  let between = false;
                  if (from && to) between = isBetween(date, from, to);
                  else if (from && hoverDate) {
                    let s = from, e = hoverDate;
                    if (isBefore(e, s)) [s, e] = [e, s];
                    between = isBetween(date, s, e) || isSame(date, s) || isSame(date, e);
                  }

                  if (selStart || selEnd) cls += ` ${selectedDayCls}`;
                  else if (hoverEdge) cls += ` ${previewEdgeDayCls}`;
                  else if (between) cls += ` ${rangeDayCls}`;

                  return (
                    <button
                      key={di}
                      onClick={() => pick(day, month)}
                      onMouseEnter={() => {
                        from && !to && !day.isDisable && !extraDisabled && !day.isBlank && setHoverDate(date);
                      }}
                      onMouseLeave={() => hoverDate && setHoverDate(null)}
                      disabled={day.isDisable || extraDisabled || day.isBlank}
                      className={`border border-gray-200 bg-white text-gray-800 transition-all duration-200 ease-out dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 rounded-2xl flex items-center justify-center aspect-square overflow-hidden text-xs sm:text-sm ${cls}`}
                    >
                      {!day.isBlank && toPersian(day.day)}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default DateRangeCalendar;
