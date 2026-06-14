import {
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

import toPersianNumber from "../../../utils/toPersianNumber";

const persianDateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatTicketDate(value) {
  if (!value) return "بدون تاریخ";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return toPersianNumber(value);
  return persianDateFormatter.format(date);
}

function priorityClass(priority) {
  if (priority?.color === "danger" || priority?.key === "high") {
    return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-200";
  }

  if (priority?.color === "warning" || priority?.key === "normal") {
    return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-100";
  }

  return "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-100";
}

function statusClass(status) {
  if (status === "closed") {
    return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  }

  if (status === "answered") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-100";
  }

  return "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-100";
}

export default function TicketList({ tickets, onSelect }) {
  if (!tickets.length) {
    return (
      <div className="mt-8 rounded-3xl border border-dashed border-primary-100 bg-white/70 p-8 text-center text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-sky-100/65">
        هنوز تیکتی ثبت نشده است.
      </div>
    );
  }

  return (
    <div className="scrollbar-thin scrollbar-no-arrows mt-6 max-h-[70vh] space-y-2 overflow-y-auto px-1 py-2 lg:px-3">
      {tickets.map((ticket) => {
        const priorityLabel =
          ticket.priority?.label || ticket.priority?.title || ticket.priority || "معمولی";
        const statusLabel =
          ticket.status_detail?.label || ticket.status || "نامشخص";
        const messagesCount = ticket.messages?.length || 0;

        return (
          <button
            key={ticket.id}
            type="button"
            onClick={() => onSelect(ticket.id)}
            className="group flex w-full items-center gap-3 rounded-3xl border border-primary-50 bg-primary-50/55 p-3 text-right shadow-sm shadow-primary-50/70 transition hover:-translate-y-0.5 hover:border-primary-200 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-950/40 dark:shadow-black/20 dark:hover:border-primary-400/40 dark:hover:bg-slate-900"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-primary-700 shadow-sm ring-1 ring-primary-100 transition group-hover:bg-primary-600 group-hover:text-white dark:bg-slate-900 dark:text-primary-100 dark:ring-slate-700 dark:group-hover:bg-primary-500">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="truncate text-sm font-bold text-gray-950 dark:text-white sm:text-base">
                  {ticket.subject}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${priorityClass(ticket.priority)}`}>
                  {priorityLabel}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusClass(ticket.status)}`}>
                  {statusLabel}
                </span>
              </span>

              <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-sky-100/65">
                <span>{ticket.department || ticket.department_detail?.label || "پشتیبانی"}</span>
                <span>{formatTicketDate(ticket.created_at)}</span>
                <span>{toPersianNumber(messagesCount)} پیام</span>
              </span>
            </span>

            <ChevronLeftIcon className="h-5 w-5 shrink-0 text-gray-400 transition group-hover:-translate-x-1 group-hover:text-primary-700 dark:text-sky-100/50 dark:group-hover:text-primary-100" />
          </button>
        );
      })}
    </div>
  );
}
