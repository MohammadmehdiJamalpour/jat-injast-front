// =============================
// =============================
import React from "react";
import toPersianNumber from "../../../utils/toPersianNumber";

import Vote from './../../../ui/Vote';

export default function CommentSection({ comment }) {
  if (!comment) return null;

  return (
    /* 👇  added h-full flex flex-col */
    <div className="border border-primary-500 p-4 rounded-3xl space-y-2 w-full h-full flex flex-col">
      <h4 className="font-bold">کامنت و امتیاز</h4>

      <div className="flex items-center gap-2">
        <strong>امتیاز:</strong>
        <Vote vote={comment.vote ?? 0} size="sm" />
      </div>

      <p className="flex-grow">
        <strong>نظر مهمان:</strong> {comment.comment || "بدون نظر"}
      </p>

      <p>
        <strong>پاسخ میزبان:</strong> {comment.replay || "بدون پاسخ"}
      </p>

      <p>
        <strong>تاریخ ثبت نظر:</strong>{" "}
        {comment.created_at?.date_persian
          ? `${toPersianNumber(comment.created_at.date_persian)} ساعت ${toPersianNumber(
              comment.created_at.time || "--:--"
            )}`
          : "نامشخص"}
      </p>
    </div>
  );
}
