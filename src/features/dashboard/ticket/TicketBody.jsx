import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  HashtagIcon,
  InboxStackIcon,
  PaperClipIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

import { getTicketById, updateTicket } from "../../../services/ticketService";
import TicketBodySkeleton from "../../../ui/skeletons/TicketBodySkeleton";
import MessagesPreview from "../reserve/MessagesPreview";
import toPersianNumber from "../../../utils/toPersianNumber";

const persianDateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatTicketDate(value) {
  if (!value) return "ثبت نشده";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return toPersianNumber(value);
  return persianDateFormatter.format(date);
}

function getDepartmentLabel(ticket) {
  if (!ticket) return "پشتیبانی";
  if (typeof ticket.department === "string" && ticket.department) return ticket.department;
  return ticket.department_detail?.label || ticket.department_detail?.title || "پشتیبانی";
}

function getPriorityLabel(priority) {
  return priority?.label || priority?.title || priority || "معمولی";
}

function getStatusLabel(ticket) {
  return ticket?.status_detail?.label || ticket?.status || "نامشخص";
}

function inferAttachmentKind(attachment) {
  const source = (
    attachment?.kind ||
    attachment?.content_type ||
    attachment?.url ||
    attachment?.attachment ||
    attachment?.file ||
    ""
  ).toLowerCase();

  if (source.startsWith("image/") || /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(source)) {
    return "image";
  }
  if (source.startsWith("video/") || /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(source)) {
    return "video";
  }
  if (source.startsWith("audio/") || /\.(mp3|wav|ogg|webm|m4a)$/i.test(source)) {
    return "audio";
  }

  return "file";
}

function normalizeAttachment(attachment) {
  const url = attachment?.url || attachment?.attachment || attachment?.file || "";
  const name =
    attachment?.name ||
    decodeURIComponent(String(url).split("/").filter(Boolean).at(-1) || "فایل پیوست");

  return {
    ...attachment,
    url,
    attachment: url,
    name,
    kind: inferAttachmentKind(attachment),
  };
}

function normalizeTicketMessage(message) {
  const isAdmin = message?.user?.is_admin ?? message?.sender?.is_staff ?? message?.sender_type === "admin";

  return {
    ...message,
    is_mine: !isAdmin,
    attachments: Array.isArray(message?.attachments)
      ? message.attachments.map(normalizeAttachment)
      : [],
  };
}

export default function TicketBody({ ticketId, onRemove }) {
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");

  const {
    data: ticket,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => getTicketById(ticketId),
  });

  const messages = useMemo(
    () => (ticket?.messages || []).map(normalizeTicketMessage),
    [ticket?.messages],
  );

  const replyMutation = useMutation({
    mutationFn: ({ id, payload }) => updateTicket(id, payload),
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
    onError: (mutationError) => {
      toast.error(
        mutationError?.response?.data?.message ||
          mutationError?.message ||
          "ارسال پیام با خطا روبه‌رو شد.",
      );
    },
  });

  async function handleSendMessage({ attachment, attachmentKind } = {}) {
    const messageText = newMessage.trim();
    if (!messageText && !attachment) return false;

    const payload = new FormData();
    payload.append("_method", "PUT");
    payload.append("message", messageText);

    if (attachment) {
      payload.append("attachment", attachment);
      payload.append("attachment_kind", attachmentKind || "");
    }

    await replyMutation.mutateAsync({ id: ticketId, payload });
    return true;
  }

  if (isLoading) return <TicketBodySkeleton />;

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 p-4 text-center text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
        {error?.response?.data?.message || "خطا در بارگیری تیکت"}
      </div>
    );
  }

  const canReply = Boolean(ticket?.can_replay);
  const departmentLabel = getDepartmentLabel(ticket);
  const statusLabel = getStatusLabel(ticket);
  const priorityLabel = getPriorityLabel(ticket?.priority);
  const attachmentsCount = messages.reduce(
    (total, message) => total + (message.attachments?.length || 0),
    0,
  );
  const details = [
    {
      label: "شماره تیکت",
      value: `#${toPersianNumber(ticket?.id || ticketId)}`,
      icon: HashtagIcon,
    },
    {
      label: "دپارتمان",
      value: departmentLabel,
      icon: InboxStackIcon,
    },
    {
      label: "وضعیت",
      value: statusLabel,
      icon: CheckCircleIcon,
    },
    {
      label: "اولویت",
      value: priorityLabel,
      icon: CalendarDaysIcon,
    },
    {
      label: "تاریخ ایجاد",
      value: formatTicketDate(ticket?.created_at),
      icon: CalendarDaysIcon,
    },
    {
      label: "تعداد پیام‌ها",
      value: `${toPersianNumber(messages.length)} پیام`,
      icon: ChatBubbleLeftRightIcon,
    },
    {
      label: "پیوست‌ها",
      value: `${toPersianNumber(attachmentsCount)} فایل`,
      icon: PaperClipIcon,
    },
    {
      label: "امکان پاسخ",
      value: canReply ? "فعال" : "بسته شده",
      icon: CheckCircleIcon,
    },
  ];

  return (
    <article dir="rtl" className="space-y-3">
      <header className="flex flex-col gap-3 rounded-3xl border border-primary-100 bg-white/75 p-3 text-right shadow-sm shadow-primary-50/60 dark:border-slate-800 dark:bg-slate-950/45 dark:shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-gray-950 dark:text-white">
            {ticket?.subject || "تیکت پشتیبانی"}
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-sky-100/70">
            {departmentLabel} · وضعیت: {statusLabel} · اولویت: {priorityLabel}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRemove(ticket)}
          className="btn-press inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200 dark:hover:bg-red-500/20"
        >
          <TrashIcon className="h-4 w-4" />
          حذف تیکت
        </button>
      </header>

      <section className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {details.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-2xl border border-primary-100 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-950/35"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-sky-100">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-gray-500 dark:text-sky-100/65">
                {label}
              </p>
              <p className="mt-1 truncate text-sm font-bold text-gray-950 dark:text-white">
                {value}
              </p>
            </div>
          </div>
        ))}
      </section>

      <MessagesPreview
        messages={messages}
        loading={isLoading}
        chatError={null}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        sendingMessage={replyMutation.isPending || replyMutation.isLoading}
        allowSendMessage={canReply}
        limit={80}
        title="آخرین پیام‌ها"
        subtitle="گفت‌وگو درباره همین تیکت"
        emptyMessage="هنوز پیامی برای این تیکت ثبت نشده است."
      />
    </article>
  );
}
