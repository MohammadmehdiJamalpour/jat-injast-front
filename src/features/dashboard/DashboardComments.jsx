
import React, { useState, useEffect } from "react";
import { getComments, replyToComment } from "../../services/commentService";
import Loading from "../../ui/Loading";
import CondensedPagination from "../../components/CondensedPaginations";
import { toast } from "react-hot-toast";
// Make sure the path to Vote is correct
import Vote from "../../ui/Vote";
import toPersianNumber from './../../utils/toPersianNumber';
import { reportClientError } from "../../utils/reportClientError";

function DashboardComments() {
  // State for comments, pagination, loading, error
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for reply modal
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  // We'll store which comment's UUID (from comment.reserve.uuid) we're replying to
  const [selectedReserveUuid, setSelectedReserveUuid] = useState(null);

  // Fetch comments from the API
  const fetchComments = async (pageNum) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getComments(pageNum);

      let newComments = [];
      let pagination = { last_page: 1 };


      if (response.data && Array.isArray(response.data.data)) {
        newComments = response.data.data;
        pagination = response.data.pagination || { last_page: 1 };
      } else if (response.data && Array.isArray(response.data)) {
        newComments = response.data;
        pagination = response.pagination || { last_page: 1 };
      } else if (Array.isArray(response)) {
        newComments = response;
      }

      setComments(newComments);
      setTotalPages(pagination.last_page || 1);
    } catch (err) {
      reportClientError("Dashboard comments fetch", err);
      setError("خطایی در دریافت نظرات رخ داده است.");
    } finally {
      setLoading(false);
    }
  };

  // Load comments whenever 'page' changes
  useEffect(() => {
    fetchComments(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Handle opening the reply modal
  const handleOpenReplyModal = (reserveUuid) => {
    setSelectedReserveUuid(reserveUuid);
    setReplyText("");
    setShowReplyModal(true);
  };

  // Handle closing the reply modal
  const handleCloseReplyModal = () => {
    setShowReplyModal(false);
    setSelectedReserveUuid(null);
    setReplyText("");
  };

  // Send the reply via API
  const handleSendReply = async () => {
    if (!selectedReserveUuid || !replyText.trim()) return;
    try {
      setReplyLoading(true);
      await replyToComment(selectedReserveUuid, replyText.trim());

      // After sending, close the modal
      handleCloseReplyModal();

      // Re-fetch comments to see the updated replies
      await fetchComments(page);

      // Show a success toast using react-hot-toast
      toast.success("پیام با موفقیت ارسال شد");
    } catch (err) {
      reportClientError("Dashboard comment reply", err);
      toast.error("خطایی در ارسال پیام رخ داد");
    } finally {
      setReplyLoading(false);
    }
  };

  // If still loading and no comments have been loaded yet
  if (loading && comments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading type="beat" color="primary" size={8} />
      </div>
    );
  }

  // If there's an error fetching data
  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 relative">
      <h2 className="text-xl font-bold mb-4">نظرات کاربران</h2>

      {/* Comments List */}
      {comments.length === 0 ? (
        <p>هیچ نظری وجود ندارد.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4">
          {comments.map((comment, index) => (
            <li
              key={
                comment.reserve?.uuid
                  ? `${comment.reserve.uuid}-${index}`
                  : index
              }
              className="border border-primary-500 py-2 px-3 rounded-3xl dark:border-primary-400/50 dark:bg-slate-950/40"
            >
              <div className="flex gap-4 mt-1 items-center"> 
              <p className="font-semibold">
                نام مهمان : 
                <span className="font-normal"> {comment.name || comment.reserve?.guest?.name || "نامشخص"}</span>
              </p>
                 <div className="max-w-12">
                 <Vote vote={comment.vote} size="sm" />
                </div>
              
              </div>
             
              <p className="font-samibold">
                متن نظر :
                <span className="font-normal mr-0.5">{comment.comment}</span></p>
               
              {/* Use the small vote component instead of raw text */}
            

              {/* Show existing reply if any */}
              {comment.replay && (
                <p className="text-sm  mt-1">
                  <strong>پاسخ شما :</strong>
                  {comment.replay}
                </p>
              )}

              {/* Created at date/time */}
              {comment.created_at?.date_persian && comment.created_at?.time && (
                <p className="text-xs font-samibold  mt-1">
                  تاریخ ثبت نظر :
                 <span className="font-normal mr-0.5"> {toPersianNumber(comment.created_at.date_persian)} {toPersianNumber(comment.created_at.time)}</span>
                </p>
              )}

              {/* If can_send_replay is true, show the "reply" button */}
            <div className="w-full flex justify-end">
            {comment.can_send_replay && (
                <button
                  onClick={() => handleOpenReplyModal(comment.reserve.uuid)}
                  className="text-secondary-50 mt-2 inline-block bg-primary-500 px-3 py-1 rounded-full transition hover:bg-primary-600 dark:bg-primary-600 dark:text-white dark:hover:bg-primary-500"
                >
                  جواب دادن به این پیام
                </button>
              )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <CondensedPagination
        currentPage={page}
        totalPages={totalPages}
        onChangePage={(newPage) => setPage(newPage)}
        className="mt-4"
      />

      {/* Reply Modal */}
      {showReplyModal && (
        <div
          dir="rtl"
          className="modal-rtl fixed inset-0 z-50 flex items-center justify-center bg-white/15 text-right backdrop-blur-md dark:bg-white/5"
          onClick={handleCloseReplyModal}
        >
          {/* Modal content */}
          <div
            className="relative w-full max-w-sm rounded-3xl bg-white p-5 text-right dark:border dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()} // prevent click from closing if inside
          >
            <h2 className="text-lg font-bold mb-3">ارسال پاسخ</h2>
            <textarea
              dir="rtl"
              className="h-24 w-full resize-none rounded-3xl border border-primary-300 px-3 py-2 text-right transition-all duration-300 focus:border-primary-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="متن پاسخ میزبان..."
            />
            <div className="mt-4 flex justify-end space-x-2 rtl:space-x-reverse">
              <button
                onClick={handleCloseReplyModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-3xl hover:bg-gray-400 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                انصراف
              </button>
              <button
                onClick={handleSendReply}
                disabled={replyLoading}
                className="px-4 py-2 bg-primary-600 text-white rounded-3xl hover:bg-primary-700 disabled:opacity-50 dark:bg-primary-600 dark:hover:bg-primary-500"
              >
                {replyLoading ? "در حال ارسال..." : "ارسال پیام"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardComments;
