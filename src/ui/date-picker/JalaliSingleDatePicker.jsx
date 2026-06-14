import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

import {
  addJalaliDays,
  addJalaliMonths,
  buildJalaliMonth,
  compareJalaliDates,
  createJalaliDate,
  formatDigits,
  getJalaliMonthLength,
  getJalaliWeekdayIndex,
  getNextJalaliMonth,
  getPreviousJalaliMonth,
  getTodayJalali,
  isSameJalaliDate,
  JALALI_MONTH_NAMES,
  JALALI_WEEK_DAYS,
  parseJalaliDate,
  resolveYearRange,
} from "./jalaliDateUtils";

const COPY = {
  placeholder:
    "\u0627\u0646\u062a\u062e\u0627\u0628 \u062a\u0627\u0631\u06cc\u062e",
  dateAriaLabel: "\u062a\u0627\u0631\u06cc\u062e",
  calendarAriaLabel:
    "\u0627\u0646\u062a\u062e\u0627\u0628 \u062a\u0627\u0631\u06cc\u062e",
  previousMonth: "\u0645\u0627\u0647 \u0642\u0628\u0644",
  nextMonth: "\u0645\u0627\u0647 \u0628\u0639\u062f",
  clearDate:
    "\u067e\u0627\u06a9 \u06a9\u0631\u062f\u0646 \u062a\u0627\u0631\u06cc\u062e",
  month: "\u0645\u0627\u0647",
  year: "\u0633\u0627\u0644",
};

function JalaliSingleDatePicker({
  id,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  required = false,
  placeholder = COPY.placeholder,
  minDate,
  maxDate,
  initialMonth,
  yearRange,
  isDateDisabled,
  className,
  inputClassName,
  calendarClassName,
  "aria-label": ariaLabel = COPY.dateAriaLabel,
  "aria-invalid": ariaInvalid,
}) {
  const reactId = useId();
  const baseId = id ?? `jalali-date-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const calendarId = `${baseId}-calendar`;
  const formatOptions = useMemo(() => ({ digits: "persian" }), []);
  const today = useMemo(() => getTodayJalali(formatOptions), [formatOptions]);
  const selectedDate = useMemo(
    () => parseJalaliDate(value, formatOptions),
    [formatOptions, value],
  );
  const parsedInitialMonth = useMemo(
    () => parseJalaliDate(initialMonth, formatOptions),
    [formatOptions, initialMonth],
  );
  const min = useMemo(
    () => parseJalaliDate(minDate, formatOptions),
    [formatOptions, minDate],
  );
  const max = useMemo(
    () => parseJalaliDate(maxDate, formatOptions),
    [formatOptions, maxDate],
  );
  const initialViewDate = parsedInitialMonth ?? selectedDate ?? today;

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(initialViewDate.jy);
  const [viewMonth, setViewMonth] = useState(initialViewDate.jm);
  const [focusedDate, setFocusedDate] = useState(initialViewDate);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const suppressNextFocusOpenRef = useRef(false);
  const dayRefs = useRef(new Map());

  const years = useMemo(() => {
    const range = resolveYearRange(yearRange, today.jy);
    const values = [];
    for (let year = range.start; year <= range.end; year += 1) values.push(year);
    return values;
  }, [today.jy, yearRange]);

  const visibleMonth = useMemo(
    () => ({ jy: viewYear, jm: viewMonth }),
    [viewMonth, viewYear],
  );

  const isUnavailable = useCallback(
    (date) => {
      if (min && compareJalaliDates(date, min) < 0) return true;
      if (max && compareJalaliDates(date, max) > 0) return true;
      return isDateDisabled ? isDateDisabled(date) : false;
    },
    [isDateDisabled, max, min],
  );

  const setDayRef = useCallback((iso, node) => {
    if (node) dayRefs.current.set(iso, node);
    else dayRefs.current.delete(iso);
  }, []);

  const focusInput = useCallback(() => {
    suppressNextFocusOpenRef.current = true;
    window.setTimeout(() => {
      inputRef.current?.focus();
      window.setTimeout(() => {
        suppressNextFocusOpenRef.current = false;
      }, 0);
    }, 0);
  }, []);

  const closeCalendar = useCallback(
    (returnFocus = true) => {
      setOpen(false);
      if (returnFocus) focusInput();
    },
    [focusInput],
  );

  const setViewToDate = useCallback((date) => {
    setViewYear(date.jy);
    setViewMonth(date.jm);
  }, []);

  const moveFocus = useCallback(
    (date, direction = 1) => {
      const nextFocus = coerceFocusableDate(
        date,
        direction,
        isUnavailable,
        formatOptions,
      );
      setFocusedDate(nextFocus);
      setViewToDate(nextFocus);
    },
    [formatOptions, isUnavailable, setViewToDate],
  );

  const openCalendar = useCallback(() => {
    if (suppressNextFocusOpenRef.current) {
      suppressNextFocusOpenRef.current = false;
      return;
    }
    if (disabled || readOnly) return;

    const nextFocus = coerceFocusableDate(
      selectedDate ?? initialViewDate,
      1,
      isUnavailable,
      formatOptions,
    );
    setFocusedDate(nextFocus);
    setViewToDate(nextFocus);
    setOpen(true);
  }, [
    disabled,
    formatOptions,
    initialViewDate,
    isUnavailable,
    readOnly,
    selectedDate,
    setViewToDate,
  ]);

  const selectDate = useCallback(
    (date) => {
      if (disabled || readOnly || isUnavailable(date)) return;

      onChange?.(parseJalaliDate(date, formatOptions));
      closeCalendar(true);
    },
    [closeCalendar, disabled, formatOptions, isUnavailable, onChange, readOnly],
  );

  const clearDate = useCallback(() => {
    if (disabled || readOnly) return;
    onChange?.(null);
    closeCalendar(true);
  }, [closeCalendar, disabled, onChange, readOnly]);

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      openCalendar();
    }

    if (event.key === "Escape" && open) {
      event.preventDefault();
      closeCalendar(true);
    }
  };

  const handleCalendarKeyDown = (event) => {
    if (!open) return;
    if (event.target.closest("[data-jalali-listbox]")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeCalendar(true);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectDate(focusedDate);
      return;
    }

    const weekdayIndex = getJalaliWeekdayIndex(focusedDate);
    const keyHandlers = {
      ArrowLeft: () => moveFocus(addJalaliDays(focusedDate, 1, formatOptions), 1),
      ArrowRight: () => moveFocus(addJalaliDays(focusedDate, -1, formatOptions), -1),
      ArrowDown: () => moveFocus(addJalaliDays(focusedDate, 7, formatOptions), 1),
      ArrowUp: () => moveFocus(addJalaliDays(focusedDate, -7, formatOptions), -1),
      Home: () => moveFocus(addJalaliDays(focusedDate, -weekdayIndex, formatOptions), -1),
      End: () => moveFocus(addJalaliDays(focusedDate, 6 - weekdayIndex, formatOptions), 1),
      PageUp: () => moveFocus(addJalaliMonths(focusedDate, -1, formatOptions), -1),
      PageDown: () => moveFocus(addJalaliMonths(focusedDate, 1, formatOptions), 1),
    };

    const handler = keyHandlers[event.key];
    if (handler) {
      event.preventDefault();
      handler();
    }
  };

  useEffect(() => {
    if (open) return;

    setViewToDate(initialViewDate);
    setFocusedDate(initialViewDate);
  }, [initialViewDate, open, setViewToDate]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        closeCalendar(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeCalendar, open]);

  useEffect(() => {
    if (!open) return undefined;

    const frame = window.requestAnimationFrame(() => {
      dayRefs.current.get(focusedDate.iso)?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [focusedDate.iso, open, visibleMonth]);

  return (
    <div ref={containerRef} className={clsx("relative w-full min-w-0", className)} dir="rtl">
      <div className="relative">
        <CalendarDaysIcon
          className={clsx(
            "pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2",
            disabled ? "text-gray-300 dark:text-slate-600" : "text-primary-600 dark:text-primary-200",
          )}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id={baseId}
          type="text"
          value={selectedDate?.display ?? ""}
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          required={required}
          aria-label={ariaLabel}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={calendarId}
          aria-invalid={ariaInvalid || undefined}
          onFocus={openCalendar}
          onClick={openCalendar}
          onKeyDown={handleInputKeyDown}
          className={clsx(
            "h-12 w-full cursor-pointer rounded-2xl border border-gray-100 bg-gray-50/80 py-0 pl-11 pr-11 text-right text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-primary-400 dark:focus:bg-slate-950 dark:focus:ring-primary-400/15 dark:disabled:bg-slate-900/50 dark:disabled:text-slate-500",
            inputClassName,
          )}
        />
        <ChevronDownIcon
          className={clsx(
            "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-transform",
            open ? "rotate-180" : "",
            disabled ? "text-gray-300 dark:text-slate-600" : "text-gray-400 dark:text-slate-400",
          )}
          aria-hidden="true"
        />
      </div>

      <Transition
        show={open}
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1 scale-[0.98]"
        enterTo="opacity-100 translate-y-0 scale-100"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 translate-y-0 scale-100"
        leaveTo="opacity-0 translate-y-1 scale-[0.98]"
      >
        <div
          id={calendarId}
          role="dialog"
          aria-label={COPY.calendarAriaLabel}
          className={clsx(
            "absolute left-1/2 top-full z-[80] mt-2 w-[calc(100vw-2rem)] max-w-[20.5rem] -translate-x-1/2 rounded-2xl border border-primary-100 bg-white p-3 text-right shadow-xl shadow-primary-100/40 outline-none dark:border-slate-700 dark:bg-slate-950 dark:shadow-black/35 sm:left-auto sm:right-0 sm:w-[20.5rem] sm:translate-x-0",
            calendarClassName,
          )}
          onKeyDown={handleCalendarKeyDown}
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            <button
              type="button"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-700 transition hover:border-primary-200 hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-primary-500/15"
              onClick={() => {
                const previous = getPreviousJalaliMonth(viewYear, viewMonth);
                const day = Math.min(focusedDate.jd, getJalaliMonthLength(previous.jy, previous.jm));
                moveFocus(createJalaliDate(previous.jy, previous.jm, day, formatOptions), -1);
              }}
              aria-label={COPY.previousMonth}
            >
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="order-3 flex w-full min-w-0 items-center justify-center gap-2 sm:order-none sm:w-auto sm:flex-1">
              <DatePickerListbox
                label={COPY.month}
                value={viewMonth}
                options={JALALI_MONTH_NAMES.map((monthName, index) => ({
                  label: monthName,
                  value: index + 1,
                }))}
                onChange={(nextMonth) => {
                  const day = Math.min(focusedDate.jd, getJalaliMonthLength(viewYear, nextMonth));
                  moveFocus(createJalaliDate(viewYear, nextMonth, day, formatOptions), 1);
                }}
              />

              <DatePickerListbox
                label={COPY.year}
                value={viewYear}
                options={years.map((year) => ({
                  label: formatDigits(year, "persian"),
                  value: year,
                }))}
                onChange={(nextYear) => {
                  const day = Math.min(focusedDate.jd, getJalaliMonthLength(nextYear, viewMonth));
                  moveFocus(createJalaliDate(nextYear, viewMonth, day, formatOptions), 1);
                }}
              />
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {selectedDate ? (
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-600 transition hover:border-red-200 hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-200 dark:hover:bg-red-500/20"
                  onClick={clearDate}
                  aria-label={COPY.clearDate}
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              ) : null}
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-700 transition hover:border-primary-200 hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-primary-500/15"
                onClick={() => {
                  const next = getNextJalaliMonth(viewYear, viewMonth);
                  const day = Math.min(focusedDate.jd, getJalaliMonthLength(next.jy, next.jm));
                  moveFocus(createJalaliDate(next.jy, next.jm, day, formatOptions), 1);
                }}
                aria-label={COPY.nextMonth}
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <MonthGrid
            jy={visibleMonth.jy}
            jm={visibleMonth.jm}
            focusedDate={focusedDate}
            today={today}
            selectedDate={selectedDate}
            isUnavailable={isUnavailable}
            setDayRef={setDayRef}
            onFocusDate={setFocusedDate}
            onSelectDate={selectDate}
            formatOptions={formatOptions}
          />
        </div>
      </Transition>
    </div>
  );
}

function DatePickerListbox({ label, value, options, onChange }) {
  const selectedLabel = options.find((option) => option.value === value)?.label ?? "";

  return (
    <Listbox value={value} onChange={onChange}>
      <ListboxLabel className="sr-only">{label}</ListboxLabel>
      <div className="relative min-w-0" data-jalali-listbox>
        <ListboxButton className="flex h-9 min-w-20 items-center justify-between gap-1 rounded-full border border-gray-100 bg-gray-50 px-3 text-xs font-bold text-gray-800 transition hover:border-primary-200 hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-primary-500/15">
          <span className="truncate">{selectedLabel}</span>
          <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-400 dark:text-slate-400" aria-hidden="true" />
        </ListboxButton>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="scrollbar-thin absolute right-0 z-[90] mt-1 max-h-56 min-w-full overflow-auto rounded-xl border border-primary-100 bg-white p-1 text-sm shadow-xl shadow-primary-100/40 outline-none dark:border-slate-700 dark:bg-slate-950 dark:shadow-black/35">
            {options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className={({ focus, selected }) =>
                  clsx(
                    "cursor-pointer select-none rounded-lg px-3 py-2 text-right transition",
                    focus || selected
                      ? "bg-primary-50 text-primary-800 dark:bg-primary-500/15 dark:text-white"
                      : "text-gray-700 dark:text-slate-200",
                  )
                }
              >
                {option.label}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
}

function MonthGrid({
  jy,
  jm,
  focusedDate,
  today,
  selectedDate,
  isUnavailable,
  setDayRef,
  onFocusDate,
  onSelectDate,
  formatOptions,
}) {
  const cells = useMemo(() => buildJalaliMonth(jy, jm, formatOptions), [formatOptions, jm, jy]);
  const labelId = `jalali-picker-month-${jy}-${jm}`;

  return (
    <div>
      <div id={labelId} className="mb-2 text-center text-sm font-extrabold text-gray-900 dark:text-slate-50">
        {JALALI_MONTH_NAMES[jm - 1]} {formatDigits(jy, "persian")}
      </div>

      <div role="grid" aria-labelledby={labelId} className="grid grid-cols-7 gap-1">
        {JALALI_WEEK_DAYS.map((day) => (
          <div
            key={day}
            role="columnheader"
            className="flex h-7 items-center justify-center text-xs font-bold text-gray-500 dark:text-slate-400"
          >
            {day}
          </div>
        ))}
        {cells.map((cell) => {
          if (!cell.date) {
            return <div key={cell.key} className="aspect-square min-h-8" aria-hidden="true" />;
          }

          const date = cell.date;
          const unavailable = isUnavailable(date);
          const selected = isSameJalaliDate(date, selectedDate);
          const isToday = isSameJalaliDate(date, today);
          const isFocused = isSameJalaliDate(date, focusedDate);

          return (
            <button
              key={date.iso}
              ref={(node) => setDayRef(date.iso, node)}
              type="button"
              role="gridcell"
              disabled={unavailable}
              aria-label={date.display}
              aria-selected={selected}
              aria-current={isToday ? "date" : undefined}
              aria-disabled={unavailable}
              tabIndex={isFocused && !unavailable ? 0 : -1}
              onClick={(event) => {
                event.preventDefault();
                onSelectDate(date);
              }}
              onFocus={() => onFocusDate(date)}
              className={clsx(
                "inline-flex aspect-square min-h-8 w-full items-center justify-center rounded-xl border text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:focus-visible:ring-primary-200",
                unavailable
                  ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300 line-through dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-600"
                  : "border-gray-100 bg-white text-gray-800 hover:border-primary-200 hover:bg-primary-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-primary-500/15",
                isToday && !selected && "border-primary-300 text-primary-700 dark:border-primary-300 dark:text-primary-100",
                selected && "border-primary-600 bg-primary-600 text-white hover:bg-primary-700 dark:border-primary-400 dark:bg-primary-500 dark:text-white",
              )}
            >
              {formatDigits(date.jd, "persian")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function coerceFocusableDate(date, direction, isUnavailable, options) {
  if (!isUnavailable(date)) return date;

  for (let distance = 1; distance <= 370; distance += 1) {
    const candidate = addJalaliDays(date, distance * direction, options);
    if (!isUnavailable(candidate)) return candidate;
  }

  for (let distance = 1; distance <= 370; distance += 1) {
    const candidate = addJalaliDays(date, distance * direction * -1, options);
    if (!isUnavailable(candidate)) return candidate;
  }

  return date;
}

export default JalaliSingleDatePicker;
