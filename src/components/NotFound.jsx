import { Link } from "@/lib/router-compat";

function NotFound({
  title = "صفحه پیدا نشد",
  message = "",
  showRetry = false,
  onRetry,
  returnPath = "/",
}) {
  return (
    <div className="py-20 text-center">
      <h1 className="mb-10 text-3xl font-bold lg:text-5xl">{title}</h1>
      {message && <p className="mb-10">{message}</p>}
      <div className="flex justify-center gap-4">
        <Link
          to={returnPath}
          className="rounded-3xl bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 lg:text-2xl"
        >
          برگشت
        </Link>
        {showRetry && (
          <button
            onClick={onRetry}
            className="rounded-3xl bg-secondary-600 px-4 py-2 text-white hover:bg-secondary-700 lg:text-2xl"
          >
            تلاش مجدد
          </button>
        )}
      </div>
    </div>
  );
}

export default NotFound;
