export function isBeforeDate(date1, date2) {
  if (!date1 || !date2) return false;
  return date1 < date2;
}

export function isBetweenDates(date, dateStart, dateEnd) {
  if (!dateStart || !dateEnd) return false;
  return date > dateStart && date < dateEnd;
}

export function isSameDate(date1, date2) {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function getDayDateValue(day) {
  if (!day || typeof day !== "object") return null;
  return (
    day.date ||
    day.gregorianDate ||
    day.date_info?.gregorian ||
    day.dateInfo?.gregorian ||
    null
  );
}

export function parseDayString(dayString) {
  if (typeof dayString !== "string" || !dayString.includes("-")) return null;
  const [year, month, day] = dayString.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function getTodayMidnight() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function canUseHoverPreview(
  event,
  targetWindow = typeof window !== "undefined" ? window : undefined,
) {
  if (event?.pointerType !== "mouse") return false;
  if (typeof targetWindow?.matchMedia !== "function") return true;
  return targetWindow.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function stripVisualStateClasses(classes) {
  return classes.filter(
    (className) =>
      !className.startsWith("bg-") &&
      !className.startsWith("border-") &&
      !className.startsWith("text-") &&
      !className.includes(":bg-") &&
      !className.includes(":border-") &&
      !className.includes(":text-") &&
      !className.includes("diagonal-stripes"),
  );
}

export function canSelectCalendarDay(
  day,
  { allowOffsiteBooking = false } = {},
) {
  if (!day) return false;
  if (day.isBlank || day.isCurrentMonth) return false;

  const dayDateObj = parseDayString(getDayDateValue(day));
  if (!dayDateObj) return false;
  if (dayDateObj < getTodayMidnight()) return false;

  if (allowOffsiteBooking && day.isBookingOffSite) return true;
  if (day.isLock && day.isDisable) return false;

  return !(day.isLock || day.isDisable);
}

export function getVendorDayStyles({
  day,
  reserveDateFrom,
  reserveDateTo,
  hoverDate,
}) {
  if (!day || day.isBlank || day.isCurrentMonth) {
    return "invisible";
  }

  if (day.isLock && day.isDisable) {
    return "bg-gray-200 text-gray-400 cursor-not-allowed diagonal-stripes border border-gray-400";
  }

  const dayDateObj = parseDayString(getDayDateValue(day));
  if (!dayDateObj) {
    return "bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-200";
  }

  if (dayDateObj < getTodayMidnight()) {
    if (day.isLock || day.isDisable) {
      return "bg-gray-200 text-gray-400 cursor-not-allowed diagonal-stripes border border-gray-300";
    }
    return "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300";
  }

  let base = [
    "bg-white",
    "text-gray-800",
    "border",
    "dark:bg-slate-950",
    "dark:text-slate-100",
  ];
  let borderClasses = ["border-gray-300"];

  if (day.isHoliday) borderClasses = ["border-red-700", "dark:border-red-500"];
  if (day.isToday) borderClasses = ["border-primary-600"];
  base.push(...borderClasses);

  if (day.isLock || day.isDisable) {
    base.push(
      "bg-gray-200",
      "text-gray-400",
      "cursor-not-allowed",
      "diagonal-stripes",
    );
  }

  if (day.isHoliday) base.push("text-red-700", "dark:text-red-400");

  let fromDateObj = reserveDateFrom ? new Date(reserveDateFrom.date) : null;
  let toDateObj = reserveDateTo ? new Date(reserveDateTo.date) : null;

  if (fromDateObj && !toDateObj && hoverDate) {
    const hoverObj = parseDayString(getDayDateValue(hoverDate));
    if (!hoverObj) return base.join(" ");

    if (isBeforeDate(hoverObj, fromDateObj)) {
      toDateObj = fromDateObj;
      fromDateObj = hoverObj;
    } else {
      toDateObj = hoverObj;
    }
  }

  if (fromDateObj && toDateObj && !day.isLock && !day.isDisable) {
    const isInRange =
      isSameDate(dayDateObj, fromDateObj) ||
      isSameDate(dayDateObj, toDateObj) ||
      isBetweenDates(dayDateObj, fromDateObj, toDateObj);

    if (isInRange) {
      base = stripVisualStateClasses(base);
      if (
        isSameDate(dayDateObj, fromDateObj) ||
        isSameDate(dayDateObj, toDateObj)
      ) {
        base.push(
          "bg-primary-action",
          "border-primary-600",
          "text-primary-contrast",
        );
      } else {
        base.push("bg-primary-200", "border-primary-200", "text-white");
      }
    }
  } else if (
    fromDateObj &&
    !toDateObj &&
    isSameDate(dayDateObj, fromDateObj) &&
    !day.isLock &&
    !day.isDisable
  ) {
    base = stripVisualStateClasses(base);
    base.push("bg-primary-400", "border-primary-600", "text-primary-contrast");
  }

  return base.join(" ");
}
