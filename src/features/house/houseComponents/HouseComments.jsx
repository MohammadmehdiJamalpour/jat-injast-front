import { useEffect, useMemo, useState } from "react";

import Vote from "../../../ui/Vote";
import { expandableButtonClassName } from "../../../ui/ExpandableContent";
import { fetchHouseComments } from "../../../services/houseService";
import { reportClientError } from "../../../utils/reportClientError";

const fallbackAvatar = "/assets/images/core-transparent/jat-injast-icon-white-transparent-512.png";

function getAvatarClassName(src, className) {
  const fallbackStyles =
    src === fallbackAvatar ? "bg-slate-950 object-contain" : "bg-white object-cover";
  return `${className} ${fallbackStyles}`;
}

function getCommentName(comment) {
  return comment.name || comment.guest?.name || "کاربر";
}

function getCommentAvatar(comment) {
  return comment.avatar || comment.guest?.avatar || fallbackAvatar;
}

function getCommentDate(comment) {
  if (typeof comment.created_at === "string") return comment.created_at;
  return comment.created_at?.date_persian || "";
}

function CommentItem({ comment, vendorAvatar }) {
  const replay = comment.replay || comment.host_replay;
  const commentText = comment.comment || comment.text || comment.message || "";
  const commentAvatar = getCommentAvatar(comment);

  return (
    <article className="flex flex-col gap-4 px-1 py-5 sm:px-2">
      <div className="flex items-start gap-3 sm:gap-4">
        <img
          src={commentAvatar}
          alt={getCommentName(comment)}
          className={getAvatarClassName(
            commentAvatar,
            "h-11 w-11 shrink-0 rounded-full border border-primary-100 shadow-sm dark:border-slate-700 sm:h-12 sm:w-12",
          )}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 sm:text-base">
              {getCommentName(comment)}
            </h3>
            {getCommentDate(comment) && (
              <span className="text-xs text-gray-400 dark:text-slate-500">
                {getCommentDate(comment)}
              </span>
            )}
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-700 dark:text-slate-300">
            {commentText}
          </p>
        </div>
        <div className="shrink-0 pt-1">
          <Vote vote={comment.vote} size="sm" />
        </div>
      </div>

      {replay && (
        <div className="mr-0 rounded-2xl border border-primary-100/80 bg-primary-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/70 sm:mr-14">
          <div className="flex items-start gap-3">
            <img
              src={vendorAvatar}
              alt="میزبان"
              className={getAvatarClassName(
                vendorAvatar,
                "h-9 w-9 shrink-0 rounded-full border border-white shadow-sm dark:border-slate-700",
              )}
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-primary-900 dark:text-slate-100">
                پاسخ میزبان
              </h4>
              <p className="mt-1 text-sm leading-7 text-primary-800 dark:text-slate-300">
                {replay}
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function HouseComments({ houseData }) {
  const initialComments = useMemo(() => houseData?.comments || [], [houseData?.comments]);
  const vendorInfo = houseData?.vendor || houseData?.owner || {};
  const vendorAvatar = vendorInfo.avatar || fallbackAvatar;
  const uuid = houseData?.uuid;

  const [comments, setComments] = useState(() => initialComments.slice(0, 3));
  const [loadedFullComments, setLoadedFullComments] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let ignore = false;

    setComments(initialComments.slice(0, 3));
    setLoadedFullComments(false);

    if (initialComments.length || !uuid) {
      return () => {
        ignore = true;
      };
    }

    setLoadingMore(true);
    fetchHouseComments(uuid)
      .then((fullComments) => {
        if (ignore) return;
        setComments(Array.isArray(fullComments) ? fullComments : []);
        setLoadedFullComments(true);
      })
      .catch((error) => {
        if (!ignore) reportClientError("House comments initial load", error);
      })
      .finally(() => {
        if (!ignore) setLoadingMore(false);
      });

    return () => {
      ignore = true;
    };
  }, [initialComments, uuid]);

  const loadMoreComments = async () => {
    if (!uuid || loadedFullComments) return;
    setLoadingMore(true);
    try {
      const fullComments = await fetchHouseComments(uuid);
      setComments(Array.isArray(fullComments) ? fullComments : []);
      setLoadedFullComments(true);
    } catch (error) {
      reportClientError("House comments load more", error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (!comments.length) {
    return (
      <section className="px-2 py-6 sm:px-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">نظرات کاربران</h2>
        </div>
        <div className="mt-5 rounded-2xl border border-gray-100 bg-white/70 px-5 py-8 text-sm leading-7 text-gray-500 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
          {loadingMore ? "در حال بارگذاری نظرات..." : "هنوز نظری برای این اقامتگاه ثبت نشده است."}
        </div>
      </section>
    );
  }

  return (
    <section className="px-2 py-6 sm:px-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">نظرات کاربران</h2>
          <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-slate-400">
            تجربه مهمان‌ها و پاسخ‌های میزبان در همین بخش نمایش داده می‌شود.
          </p>
        </div>
        <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-200">
          {comments.length} نظر
        </span>
      </div>

      <div className="mt-5 w-full divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white/80 px-4 py-1 shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/70 sm:px-5">
        {comments.map((comment) => (
          <CommentItem
            key={comment.uuid || comment.id || `${comment.comment}-${comment.vote}`}
            comment={comment}
            vendorAvatar={vendorAvatar}
          />
        ))}
      </div>

      {!loadedFullComments && uuid && (
        <button
          type="button"
          onClick={loadMoreComments}
          className={`mt-4 ${expandableButtonClassName} disabled:cursor-not-allowed disabled:opacity-60`}
          disabled={loadingMore}
        >
          {loadingMore ? "در حال بارگذاری..." : "مشاهده بیشتر..."}
        </button>
      )}
    </section>
  );
}

export default HouseComments;
