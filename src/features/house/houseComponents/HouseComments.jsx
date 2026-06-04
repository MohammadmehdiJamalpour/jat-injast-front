import { useEffect, useMemo, useState } from "react";

import Vote from "../../../ui/Vote";
import { fetchHouseComments } from "../../../services/houseService";
import { reportClientError } from "../../../utils/reportClientError";

const fallbackAvatar = "/assets/jat-injast-badge.svg";

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

  return (
    <div className="flex flex-col gap-4 border-b p-2 last:border-b-0">
      <div className="flex items-center">
        <img
          src={getCommentAvatar(comment)}
          alt={getCommentName(comment)}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="text-base font-semibold">{getCommentName(comment)}</h3>
            <span className="mr-6 text-xs text-gray-400">{getCommentDate(comment)}</span>
          </div>
          <p className="mt-2 text-sm text-gray-700">{comment.comment}</p>
        </div>
        <Vote vote={comment.vote} size="sm" />
      </div>

      {replay && (
        <div className="flex flex-col rounded-2xl bg-gray-200 bg-opacity-50 p-2 pr-4">
          <div className="flex h-14 w-full gap-1 p-1">
            <div className="h-full w-12 overflow-hidden rounded-full">
              <img src={vendorAvatar} alt="میزبان" className="block h-full w-full object-cover" />
            </div>
            <div className="flex items-center justify-center gap-4 p-1">
              <h4 className="font-bold">پاسخ میزبان</h4>
            </div>
          </div>
          <p className="pr-3">{replay}</p>
        </div>
      )}
    </div>
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
    setComments(initialComments.slice(0, 3));
    setLoadedFullComments(false);
  }, [initialComments]);

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
      <div className="px-2">
        <h2 className="mb-4 text-lg font-semibold">نظرات کاربران</h2>
        <p className="mt-4 px-4 text-sm text-gray-500">هنوز نظری ثبت نشده است.</p>
      </div>
    );
  }

  return (
    <div className="px-2 pt-2">
      <h2 className="mb-4 text-lg font-semibold">نظرات کاربران</h2>
      <div className="mt-6 w-full rounded-2xl bg-gray-50 px-1 py-1">
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
          className="mt-2 text-primary-600 hover:underline focus:outline-none"
          disabled={loadingMore}
        >
          {loadingMore ? "در حال بارگذاری..." : "مشاهده بیشتر..."}
        </button>
      )}
    </div>
  );
}

export default HouseComments;
