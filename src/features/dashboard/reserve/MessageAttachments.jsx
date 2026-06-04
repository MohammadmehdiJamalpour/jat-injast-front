import { XMarkIcon } from "@heroicons/react/24/outline";

import { normalizeAttachmentUrl } from "./messagePreviewUtils";

export function AttachmentPreview({ attachment, compact = false }) {
  const url = normalizeAttachmentUrl(attachment);
  if (!url) return null;

  const kind = attachment.kind || "";
  const name = attachment.name || "فایل پیوست";
  const sharedClass = compact
    ? "mt-2 max-h-24 rounded-2xl"
    : "mt-3 max-h-56 rounded-2xl";

  if (kind === "image") {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="block">
        <img
          src={url}
          alt={name}
          className={`${sharedClass} w-full object-cover ring-1 ring-white/20`}
        />
      </a>
    );
  }

  if (kind === "video") {
    return (
      <video
        controls
        src={url}
        className={`${sharedClass} w-full bg-black/80 ring-1 ring-white/20`}
      />
    );
  }

  if (kind === "audio") {
    return (
      <audio
        controls
        src={url}
        className="mt-3 h-10 w-full max-w-sm rounded-full"
      />
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-1.5 text-xs underline-offset-4 hover:underline"
    >
      {name}
    </a>
  );
}

export function PendingAttachment({ attachment, onClear }) {
  if (!attachment) return null;

  const labelByKind = {
    image: "تصویر",
    video: "ویدیو",
    audio: "صدا",
  };

  return (
    <div className="mb-2 flex items-center justify-between gap-3 rounded-3xl border border-primary-100 bg-primary-50/70 px-3 py-2 text-xs text-slate-700 dark:border-primary-400/30 dark:bg-slate-900 dark:text-sky-100">
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 rounded-full bg-primary-600 px-2 py-1 text-white">
          {labelByKind[attachment.kind] || "فایل"}
        </span>
        <span className="truncate">{attachment.file.name}</span>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="btn-press flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:text-red-500 dark:bg-slate-800 dark:text-sky-100 dark:ring-slate-700"
        aria-label="حذف فایل انتخاب شده"
        title="حذف فایل انتخاب شده"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
