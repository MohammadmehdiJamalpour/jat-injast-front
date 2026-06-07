import { useEffect, useMemo, useState } from "react";
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

import CondensedPagination from "../../components/CondensedPaginations";
import { getComments, replyToComment } from "../../services/commentService";
import Badge from "../../ui/Badge";
import EmptyState from "../../ui/EmptyState";
import Loading from "../../ui/Loading";
import Modal from "../../ui/Modal";
import Vote from "../../ui/Vote";
import { reportClientError } from "../../utils/reportClientError";
import toPersianNumber from "../../utils/toPersianNumber";

const hostReplySuggestions = [
  "از نظر شما سپاسگزاریم. خوشحالیم که اقامت خوبی داشتید و امیدواریم دوباره میزبان شما باشیم.",
  "ممنون از بازخورد دقیق شما. نکته‌ای که گفتید را برای بهبود تجربه مهمان‌ها پیگیری می‌کنیم.",
  "سپاس از ثبت تجربه‌تان. خوشحالیم که برخورد میزبان و شرایط اقامتگاه برای شما رضایت‌بخش بوده است.",
  "از اینکه این مورد را اطلاع دادید ممنونیم. برای رفع آن اقدام می‌کنیم و بازخورد شما برای ما مهم است.",
];

function parseCommentsResponse(response) {
  if (response?.data && Array.isArray(response.data.data)) {
    return {
      comments: response.data.data,
      totalPages: response.data.pagination?.last_page || 1,
    };
  }

  if (response?.data && Array.isArray(response.data)) {
    return {
      comments: response.data,
      totalPages: response.pagination?.last_page || 1,
    };
  }

  if (Array.isArray(response)) {
    return { comments: response, totalPages: 1 };
  }

  return { comments: [], totalPages: 1 };
}

function getCommentTargetUuid(comment) {
  return comment?.uuid || comment?.reserve?.uuid || comment?.reserve_uuid || null;
}

function getGuestName(comment) {
  return comment?.name || comment?.reserve?.guest?.name || comment?.guest?.name || "مهمان";
}

function getHouseName(comment) {
  return comment?.reserve?.house?.name || "اقامتگاه";
}

function formatCommentDate(comment) {
  const date = comment?.created_at?.date_persian;
  const time = comment?.created_at?.time;

  if (!date && !time) return "تاریخ نامشخص";
  return [date && toPersianNumber(date), time && toPersianNumber(time)]
    .filter(Boolean)
    .join("، ");
}

function DashboardComments() {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  const commentStats = useMemo(() => {
    const answered = comments.filter((comment) => Boolean(comment.replay)).length;
    return {
      answered,
      waiting: comments.length - answered,
    };
  }, [comments]);

  async function fetchComments(pageNum) {
    setLoading(true);
    setError(null);

    try {
      const response = await getComments(pageNum);
      const parsed = parseCommentsResponse(response);
      setComments(parsed.comments);
      setTotalPages(parsed.totalPages);
    } catch (err) {
      reportClientError("Dashboard comments fetch", err);
      setError("دریافت نظرات با خطا روبه‌رو شد.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComments(page);
  }, [page]);

  function openReplyDialog(comment) {
    setSelectedComment(comment);
    setReplyText(comment?.replay || comment?.host_replay || "");
  }

  function closeReplyDialog(options) {
    const force = Boolean(options?.force);
    if (replyLoading && !force) return;
    setSelectedComment(null);
    setReplyText("");
  }

  function applySuggestion(suggestion) {
    setReplyText((current) => {
      const trimmed = current.trim();
      return trimmed ? `${trimmed}\n${suggestion}` : suggestion;
    });
  }

  async function handleSendReply() {
    const commentUuid = getCommentTargetUuid(selectedComment);
    const text = replyText.trim();
    if (!commentUuid || !text) return;

    try {
      setReplyLoading(true);
      await replyToComment(commentUuid, text);
      toast.success(selectedComment?.replay ? "پاسخ میزبان ویرایش شد." : "پاسخ میزبان ارسال شد.");
      closeReplyDialog({ force: true });
      await fetchComments(page);
    } catch (err) {
      reportClientError("Dashboard comment reply", err);
      toast.error("ارسال پاسخ با خطا روبه‌رو شد.");
    } finally {
      setReplyLoading(false);
    }
  }

  if (loading && comments.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loading type="beat" color="primary" size={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl" className="rounded-3xl border border-red-100 bg-red-50 p-5 text-center text-sm font-semibold text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
        {error}
      </div>
    );
  }

  return (
    <section dir="rtl" className="space-y-4 p-1.5 text-right lg:p-3">
      <header className="flex flex-col gap-3 rounded-3xl border border-primary-100 bg-white/80 p-4 shadow-sm shadow-primary-50/60 dark:border-slate-800 dark:bg-slate-950/45 dark:shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-primary-700 dark:text-sky-100/75">
            بازخورد مهمان‌ها
          </p>
          <h2 className="mt-1 text-xl font-bold text-gray-950 dark:text-white">
            نظرات کاربران
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral">
            {toPersianNumber(comments.length)} نظر
          </Badge>
          <Badge tone={commentStats.waiting ? "warning" : "success"}>
            {toPersianNumber(commentStats.waiting)} در انتظار پاسخ
          </Badge>
          <Badge tone="success">
            {toPersianNumber(commentStats.answered)} پاسخ‌داده‌شده
          </Badge>
        </div>
      </header>

      {comments.length === 0 ? (
        <EmptyState
          icon={<ChatBubbleLeftRightIcon className="h-8 w-8" />}
          title="هنوز نظری ثبت نشده است."
          description="بعد از پایان رزرو، نظر مهمان‌ها در این بخش نمایش داده می‌شود."
        />
      ) : (
        <ul className="grid grid-cols-1 gap-3">
          {comments.map((comment, index) => {
            const commentUuid = getCommentTargetUuid(comment);
            const answered = Boolean(comment.replay);
            const canManageReply = Boolean(commentUuid && (comment.can_send_replay || answered));

            return (
              <li
                key={comment.uuid || commentUuid || index}
                className="rounded-3xl border border-primary-100 bg-white/85 p-4 shadow-sm shadow-primary-50/50 transition hover:border-primary-200 hover:shadow-centered dark:border-slate-800 dark:bg-slate-950/45 dark:shadow-black/20"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-950 dark:text-white">
                        {getGuestName(comment)}
                      </h3>
                      <Badge tone={answered ? "success" : "warning"}>
                        {answered ? "پاسخ داده شده" : "نیازمند پاسخ"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-sky-100/70">
                      {getHouseName(comment)} · {formatCommentDate(comment)}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Vote vote={comment.vote ?? 0} size="sm" />
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-primary-50/45 p-3 text-sm leading-7 text-gray-800 dark:bg-slate-900/55 dark:text-sky-50">
                  {comment.comment || "متن نظر ثبت نشده است."}
                </div>

                {answered && (
                  <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3 text-sm leading-7 text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-100">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold">
                      <CheckCircleIcon className="h-4 w-4" />
                      پاسخ میزبان
                    </div>
                    <p className="whitespace-pre-wrap break-words">{comment.replay}</p>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-sky-100/60">
                    <ClockIcon className="h-4 w-4" />
                    <span>ثبت نظر: {formatCommentDate(comment)}</span>
                  </div>

                  {canManageReply && (
                    <button
                      type="button"
                      onClick={() => openReplyDialog(comment)}
                      className="btn-primary btn-press min-h-10 rounded-2xl px-4 text-sm font-bold"
                    >
                      {answered ? "ویرایش پاسخ" : "پاسخ میزبان"}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <CondensedPagination
          currentPage={page}
          totalPages={totalPages}
          onChangePage={(newPage) => setPage(newPage)}
          className="mt-4"
        />
      )}

      <Modal
        open={Boolean(selectedComment)}
        onClose={closeReplyDialog}
        title={selectedComment?.replay ? "ویرایش پاسخ میزبان" : "پاسخ به نظر مهمان"}
        size="md"
      >
        <div className="space-y-4">
          {selectedComment && (
            <div className="rounded-2xl border border-primary-100 bg-primary-50/45 p-3 text-sm leading-7 text-gray-800 dark:border-slate-700 dark:bg-slate-950 dark:text-sky-50">
              <p className="mb-1 text-xs font-bold text-primary-700 dark:text-sky-100">
                نظر {getGuestName(selectedComment)}
              </p>
              <p>{selectedComment.comment || "متن نظر ثبت نشده است."}</p>
            </div>
          )}

          <div>
            <p className="mb-2 text-xs font-bold text-gray-600 dark:text-sky-100/75">
              پیشنهادهای پاسخ برای میزبان
            </p>
            <div className="flex flex-wrap gap-2">
              {hostReplySuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => applySuggestion(suggestion)}
                  className="rounded-2xl border border-primary-100 bg-white px-3 py-2 text-right text-xs leading-6 text-gray-700 transition hover:border-primary-300 hover:bg-primary-50 dark:border-slate-700 dark:bg-slate-900 dark:text-sky-100 dark:hover:bg-slate-800"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <label className="space-y-2">
            <span className="text-xs font-bold text-gray-600 dark:text-sky-100/75">
              متن پاسخ
            </span>
            <textarea
              dir="rtl"
              className="scrollbar-thin scrollbar-no-arrows min-h-36 w-full resize-none rounded-3xl border border-primary-100 bg-white px-4 py-3 text-right text-sm leading-7 text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-primary-300 dark:focus:ring-primary-300/20"
              value={replyText}
              onChange={(event) => setReplyText(event.target.value)}
              placeholder="پاسخ کوتاه، محترمانه و مشخص بنویسید..."
            />
          </label>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeReplyDialog}
              disabled={replyLoading}
              className="btn-secondary btn-press min-h-11 rounded-2xl px-4 text-sm font-bold"
            >
              انصراف
            </button>
            <button
              type="button"
              onClick={handleSendReply}
              disabled={replyLoading || !replyText.trim()}
              className="btn-primary btn-press min-h-11 rounded-2xl px-5 text-sm font-bold"
            >
              {replyLoading ? "در حال ارسال..." : selectedComment?.replay ? "ذخیره ویرایش" : "ارسال پاسخ"}
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}

export default DashboardComments;
