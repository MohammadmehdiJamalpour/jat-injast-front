import { useId, useRef } from "react";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { fa } from "../i18n/fa";

export default function FileUpload({
  label = fa.common.fields.fileAttachment,
  helper,
  accept,
  multiple = false,
  disabled = false,
  files,
  onChange,
  className,
}) {
  const id = useId();
  const inputRef = useRef(null);
  const selectedFiles = Array.from(files || []);

  return (
    <div className={clsx("space-y-2 text-right", className)}>
      <label className="text-sm font-bold text-gray-800 dark:text-sky-50" htmlFor={id}>
        {label}
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="btn-press flex min-h-14 w-full items-center justify-between rounded-2xl border border-primary-100 bg-white px-4 text-sm text-gray-700 transition hover:border-primary-300 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-primary-400/25 dark:bg-slate-950/45 dark:text-sky-50 dark:hover:bg-primary-500/10"
      >
        <span className="truncate">
          {selectedFiles.length
            ? selectedFiles.map((file) => file.name).join("، ")
            : fa.common.actions.select}
        </span>
        <PaperClipIcon className="h-5 w-5 shrink-0 text-primary-700 dark:text-sky-100" />
      </button>
      {helper && <p className="text-xs text-gray-500 dark:text-sky-100/65">{helper}</p>}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => onChange?.(event.target.files, event)}
      />
    </div>
  );
}
