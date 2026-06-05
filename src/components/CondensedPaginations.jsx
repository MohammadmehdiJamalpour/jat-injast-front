
import React from "react";

import toPersianNumber from './../utils/toPersianNumber';

/**
 * Helper function to create a condensed list of page numbers.
 * - Always include pages 1..2 if they exist
 * - Always include pages (total-1)..total if they exist
 * - Always include (current-1), current, (current+1) if they exist
 * - Insert "..." whenever there's a gap > 1 between consecutive pages
 */
function getCondensedPages(current, total) {
  let pages = new Set();

  // 1) Always include the first 2 pages
  for (let i = 1; i <= 2 && i <= total; i++) {
    pages.add(i);
  }

  // 2) Include the pages around the current page (current-1, current, current+1)
  for (let i = current - 1; i <= current + 1; i++) {
    if (i > 2 && i < total) {
      pages.add(i);
    }
  }

  // 3) Always include the last 2 pages
  for (let i = total - 1; i <= total; i++) {
    if (i >= 1) {
      pages.add(i);
    }
  }

  // Convert to an array and sort numerically
  const sorted = [...pages].sort((a, b) => a - b);

  // Build a final array that inserts "..." when there's a gap
  const finalPages = [];
  for (let i = 0; i < sorted.length; i++) {
    finalPages.push(sorted[i]);
    if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) {
      finalPages.push("...");
    }
  }
  return finalPages;
}

/**
 * Condensed Pagination Component
 *
 * Props:
 * - currentPage (number): the current page index
 * - totalPages (number): total number of pages
 * - onChangePage (function): callback that gets called with the new page index
 *
 * Optionally pass additional props (e.g. className) if you want to customize styling
 * from the outside.
 */
function CondensedPagination({
  currentPage,
  totalPages,
  onChangePage,
  className = "",
}) {
  const condensedPages = getCondensedPages(currentPage, totalPages);

  // Handlers for Prev/Next
  const handlePrev = () => {
    if (currentPage > 1) onChangePage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onChangePage(currentPage + 1);
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {/* Prev / Next Row */}
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

      {/* Condensed Page Buttons */}
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
