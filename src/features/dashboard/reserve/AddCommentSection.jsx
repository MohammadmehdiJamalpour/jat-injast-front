import { useState } from "react";
import { toast } from "react-hot-toast";
import { sendComment } from "../../../services/commentService";

import RatingStars from './../../../ui/RatingStars';

export default function AddCommentSection({ reserveUuid, onCommentSent }) {
  const [commentText, setCommentText] = useState("");
  const [vote, setVote]               = useState(0);
  const [sending, setSending]         = useState(false);
  const [error, setError]             = useState(null);

  const handleSubmit = async () => {
    if (!commentText.trim()) {
      toast.error("لطفاً متن نظر را وارد کنید.");
      return;
    }
    if (vote === 0) {
      toast.error("لطفاً امتیاز را مشخص کنید.");
      return;
    }

    try {
      setSending(true);
      setError(null);

      const newComment = await sendComment({
        reserve_uuid: reserveUuid,
        comment:      commentText.trim(),
        vote,
      });

      toast.success("نظر شما با موفقیت ثبت شد.");
      setCommentText("");
      setVote(0);
      onCommentSent?.(newComment);
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "خطایی رخ داده است."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border border-primary-500 p-4 rounded-3xl space-y-3 w-full h-full flex flex-col">
      <h4 className="font-bold">ثبت نظر</h4>

      <div className="flex items-center gap-2">
        <span className="font-semibold">امتیاز شما:</span>
        <RatingStars value={vote} onChange={setVote} />
      </div>

      <textarea
        className="w-full py-2 px-3 border border-primary-300 rounded-3xl focus:outline-none focus:border-primary-600 h-24 resize-none flex-grow"
        placeholder="متن نظر شما..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={sending}
          className="px-4 py-2 bg-primary-600 text-secondary-50 rounded-3xl hover:bg-primary-700 disabled:opacity-50"
        >
          {sending ? "در حال ارسال..." : "ارسال نظر"}
        </button>
      </div>
    </div>
  );
}
