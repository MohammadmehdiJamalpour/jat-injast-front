import toPersianNumber from "../../../utils/toPersianNumber";

const persianDateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatMessageDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return toPersianNumber(value);

  const parts = Object.fromEntries(
    persianDateFormatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return [parts.weekday, parts.day, parts.month, parts.year]
    .filter(Boolean)
    .join(" ");
}

export function normalizeAttachmentUrl(attachment) {
  return attachment?.url || attachment?.attachment || attachment?.file || "";
}

export function sortMessagesByDate(messages, limit) {
  const ordered = [...messages].sort((first, second) => {
    const firstTime = new Date(first.created_at || 0).getTime();
    const secondTime = new Date(second.created_at || 0).getTime();
    return (Number.isNaN(firstTime) ? 0 : firstTime) - (Number.isNaN(secondTime) ? 0 : secondTime);
  });

  return ordered.length > limit ? ordered.slice(ordered.length - limit) : ordered;
}
