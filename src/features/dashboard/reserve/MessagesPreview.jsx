import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import {
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { AttachmentPreview, PendingAttachment } from "./MessageAttachments";
import {
  formatMessageDate,
  normalizeAttachmentUrl,
  sortMessagesByDate,
} from "./messagePreviewUtils";

export default function MessagesPreview({
  messages = [],
  loading = false,
  chatError = null,
  newMessage = "",
  setNewMessage,
  onSendMessage,
  sendingMessage = false,
  allowSendMessage = true,
  limit = 10,
  title = "آخرین پیام‌ها",
  subtitle = "گفت‌وگو درباره همین رزرو",
  emptyMessage = "هنوز پیامی ثبت نشده است.",
  messagesAreaClassName = "min-h-0 flex-1",
}) {
  const containerRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingStreamRef = useRef(null);
  const [pendingAttachment, setPendingAttachment] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState(null);

  const previewMessages = useMemo(
    () => sortMessagesByDate(messages, limit),
    [messages, limit],
  );

  useEffect(() => {
    if (!loading && containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [loading, previewMessages]);

  const clearPendingAttachment = () => {
    setPendingAttachment(null);
  };

  const stopRecordingTracks = () => {
    recordingStreamRef.current?.getTracks?.().forEach((track) => track.stop());
    recordingStreamRef.current = null;
  };

  const stopVoiceRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  };

  const startVoiceRecording = async () => {
    setRecordingError(null);

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setRecordingError("مرورگر شما امکان ضبط صدا را پشتیبانی نمی‌کند.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recordingStreamRef.current = stream;
      recordedChunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data?.size) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setRecordingError("ضبط صدا با خطا روبه‌رو شد.");
        setIsRecording(false);
        stopRecordingTracks();
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const file = new File([blob], `voice-${Date.now()}.webm`, { type: mimeType });

        if (blob.size > 0) {
          setPendingAttachment({ file, kind: "audio" });
        }

        setIsRecording(false);
        stopRecordingTracks();
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      setRecordingError("برای ضبط صدا باید اجازه دسترسی به میکروفون را بدهید.");
      setIsRecording(false);
      stopRecordingTracks();
    }
  };

  const handleFileSelect = (kind) => (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setPendingAttachment({ file, kind });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const hasText = Boolean(newMessage.trim());
    if (!allowSendMessage || sendingMessage || isRecording || (!hasText && !pendingAttachment)) return;

    const result = await onSendMessage?.({
      attachment: pendingAttachment?.file || null,
      attachmentKind: pendingAttachment?.kind || "",
    });

    if (result !== false) {
      clearPendingAttachment();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const mediaButtons = [
    {
      key: "image",
      label: "ارسال تصویر",
      icon: PhotoIcon,
      ref: imageInputRef,
      accept: "image/*",
    },
    {
      key: "video",
      label: "ارسال ویدیو",
      icon: VideoCameraIcon,
      ref: videoInputRef,
      accept: "video/*",
    },
  ];

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      stopRecordingTracks();
    };
  }, []);

  const visibleError = chatError || recordingError;

  return (
    <section
      dir="rtl"
      className="flex h-full min-h-full w-full flex-col rounded-2xl border border-primary-500 bg-white p-2 text-right shadow-sm shadow-primary-50/60 dark:border-primary-400/70 dark:bg-slate-950/40 dark:shadow-black/20 sm:rounded-3xl sm:p-4"
    >
      <header className="mb-2 flex items-center justify-between gap-2 sm:mb-3 sm:gap-3">
        <div>
          <h4 className="text-sm font-bold text-gray-950 dark:text-sky-50 sm:text-base">
            {title}
          </h4>
          <p className="mt-0.5 text-[11px] text-gray-500 dark:text-sky-100/70 sm:mt-1 sm:text-xs">
            {subtitle}
          </p>
        </div>

        <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-primary-500/20 dark:text-sky-100 sm:h-10 sm:w-10">
          <ChatBubbleLeftRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
      </header>

      {visibleError && (
        <p className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          خطا: {visibleError}
        </p>
      )}

      <div
        ref={containerRef}
        className={`scrollbar-thin scrollbar-no-arrows flex flex-col gap-2 overflow-y-auto rounded-2xl bg-primary-50/30 p-1.5 dark:bg-slate-900/45 sm:gap-3 sm:rounded-3xl sm:p-3 ${messagesAreaClassName}`}
      >
        {loading ? (
          <div className="min-h-48 w-full animate-pulse rounded-3xl bg-primary-100/80 dark:bg-slate-800" />
        ) : previewMessages.length > 0 ? (
          previewMessages.map((msg, index) => {
            const isMine = Boolean(msg.is_mine);
            const attachments = Array.isArray(msg.attachments) ? msg.attachments : [];

            return (
              <article
                key={msg.uuid || msg.id || `${msg.created_at || "message"}-${index}`}
                className={`flex ${isMine ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[94%] rounded-[1.35rem] px-3 py-2.5 text-xs leading-6 shadow-sm sm:max-w-[86%] sm:rounded-[1.65rem] sm:px-4 sm:py-3 sm:text-sm sm:leading-7 md:max-w-[74%] ${
                    isMine
                      ? "rounded-br-md bg-primary-600 text-sky-50 dark:bg-primary-500/90 dark:text-white"
                      : "rounded-bl-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-sky-50"
                  }`}
                >
                  {msg.message && (
                    <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                  )}

                  {attachments.map((attachment) => (
                    <AttachmentPreview key={attachment.id || normalizeAttachmentUrl(attachment)} attachment={attachment} />
                  ))}

                  {msg.created_at && (
                    <p
                      className={`mt-2 text-[11px] leading-5 ${
                        isMine
                          ? "text-sky-100/80"
                          : "text-slate-500 dark:text-sky-100/65"
                      }`}
                    >
                      {formatMessageDate(msg.created_at)}
                    </p>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          <div className="flex min-h-48 items-center justify-center rounded-3xl border border-dashed border-primary-100 text-sm text-gray-500 dark:border-slate-700 dark:text-sky-100/65">
            {emptyMessage}
          </div>
        )}
      </div>

      <div className="mt-2 sm:mt-3">
        <PendingAttachment
          attachment={pendingAttachment}
          onClear={clearPendingAttachment}
        />

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-1 rounded-[2rem] border border-primary-100 bg-white p-1.5 shadow-sm transition focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-primary-300 dark:focus-within:ring-primary-300/20 sm:gap-2 sm:p-2"
        >
          <div className="flex shrink-0 items-center gap-1">
            {mediaButtons.map(({ key, label, icon: Icon, ref, accept }) => (
              <Fragment key={key}>
                <input
                  ref={ref}
                  type="file"
                  accept={accept}
                  onChange={handleFileSelect(key)}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={!allowSendMessage || sendingMessage}
                  onClick={() => ref.current?.click()}
                  className="btn-press flex h-9 w-9 items-center justify-center rounded-full text-primary-700 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:text-slate-300 dark:text-sky-100 dark:hover:bg-slate-800 dark:disabled:text-slate-600"
                  aria-label={label}
                  title={label}
                >
                  <Icon className="h-5 w-5" />
                </button>
              </Fragment>
            ))}

            <button
              type="button"
              disabled={!allowSendMessage || sendingMessage}
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              className={`btn-press flex h-9 w-9 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:text-slate-300 dark:disabled:text-slate-600 ${
                isRecording
                  ? "animate-pulse bg-red-50 text-red-600 ring-1 ring-red-200 dark:bg-red-500/15 dark:text-red-200 dark:ring-red-500/30"
                  : "text-primary-700 hover:bg-primary-50 dark:text-sky-100 dark:hover:bg-slate-800"
              }`}
              aria-label={isRecording ? "پایان ضبط صدا" : "ضبط صدا"}
              title={isRecording ? "پایان ضبط صدا" : "ضبط صدا"}
            >
              <MicrophoneIcon className="h-5 w-5" />
            </button>
          </div>

          <textarea
            dir="rtl"
            rows={1}
            value={newMessage}
            onChange={(event) => setNewMessage?.(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!allowSendMessage}
            placeholder={
              allowSendMessage
                ? "پیام خود را بنویسید..."
                : "در این مرحله امکان ارسال پیام وجود ندارد"
            }
            className="scrollbar-thin scrollbar-no-arrows max-h-24 min-h-10 min-w-0 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm leading-6 text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-400 dark:text-sky-50 dark:placeholder:text-sky-100/45"
          />

          <button
            type="submit"
            disabled={
              !allowSendMessage ||
              sendingMessage ||
              isRecording ||
              (!newMessage.trim() && !pendingAttachment)
            }
            className="btn-press flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-action text-white shadow-sm transition hover:bg-primary-action-hover disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
            aria-label="ارسال پیام"
            title="ارسال پیام"
          >
            {sendingMessage ? (
              <BeatLoader size={5} color="#fff" />
            ) : (
              <PaperAirplaneIcon className="h-5 w-5 -rotate-45" />
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
