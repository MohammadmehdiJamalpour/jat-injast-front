
import React from "react";
import { Link } from "@/lib/router-compat";

function NotFound({
  title = "صفحه مورد نظر پیدا نشد!",
  message = "",
  showRetry = false,
  onRetry,
  // new optional prop:
  returnPath = "/",
}) {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl lg:text-5xl font-bold mb-10">{title}</h1>
      {message && <p className="mb-10">{message}</p>}
      <div className="flex justify-center gap-4">
        <Link
          to={returnPath}
          className="px-4 py-2 bg-primary-600 text-white rounded-3xl lg:text-2xl hover:bg-primary-700"
        >
          برگشت
        </Link>
        {showRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-secondary-600 text-white rounded-3xl lg:text-2xl hover:bg-secondary-700"
          >
            تلاش مجدد
          </button>
        )}
      </div>
    </div>
  );
}

export default NotFound;
