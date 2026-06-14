
import toPersianNumber from './../utils/toPersianNumber';

function getCondensedPages(current, total) {
  let pages = new Set();

  for (let i = 1; i <= 2 && i <= total; i++) {
    pages.add(i);
  }

  for (let i = current - 1; i <= current + 1; i++) {
    if (i > 2 && i < total) {
      pages.add(i);
    }
  }

  for (let i = total - 1; i <= total; i++) {
    if (i >= 1) {
      pages.add(i);
    }
  }

  const sorted = [...pages].sort((a, b) => a - b);

  const finalPages = [];
  for (let i = 0; i < sorted.length; i++) {
    finalPages.push(sorted[i]);
    if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
      finalPages.push("...");
    }
  }
  return finalPages;
}

function CondensedPagination({
  currentPage,
  totalPages,
  onChangePage,
  className = "",
}) {
  const condensedPages = getCondensedPages(currentPage, totalPages);

  const handlePrev = () => {
    if (currentPage > 1) onChangePage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onChangePage(currentPage + 1);
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 ml-2 bg-gray-300 text-gray-700 rounded-3xl disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:disabled:text-slate-500"
        >
          قبلی
        </button>
        <span>
          صفحه {toPersianNumber(currentPage)} از {toPersianNumber(totalPages)}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-primary-500 text-white rounded-3xl disabled:opacity-50 dark:bg-primary-600 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
        >
          بعدی
        </button>
      </div>

      <div className="flex flex-wrap justify-center mt-2 space-x-2">
        {condensedPages.map((item, i) => {
          if (item === "...") {
            return (
              <span key={`ellipsis-${i}`} className="px-2 py-1">
                ...
              </span>
            );
          } else {
            return (
              <button
                key={item}
                onClick={() => onChangePage(item)}
                disabled={item === currentPage}
                className={`px-3 py-1 rounded-3xl ${
                  item === currentPage
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-200"
                }`}
              >
                {toPersianNumber(item)}
              </button>
            );
          }
        })}
      </div>
    </div>
  );
}

export default CondensedPagination;
