import toPersianNumber from './toPersianNumber';

export function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return "چند ثانیه پیش";
  } else if (diffMin < 60) {
    return toPersianNumber(diffMin) + " دقیقه پیش";
  } else if (diffHour < 24) {
    return toPersianNumber(diffHour) + " ساعت پیش";
  } else {
    return toPersianNumber(diffDay) + " روز پیش";
  }
}
