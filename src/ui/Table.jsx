import clsx from "clsx";
import EmptyState from "./EmptyState";
import { fa } from "../i18n/fa";

export default function Table({
  columns,
  rows,
  keyExtractor = (_row, index) => index,
  emptyMessage = fa.common.empty.default,
  mobileTitle,
  mobileSubtitle,
  mobileMeta,
  className,
}) {
  const safeRows = Array.isArray(rows) ? rows : [];

  if (!safeRows.length) {
    return <EmptyState title={emptyMessage} className={className} />;
  }

  return (
    <div className={clsx("w-full", className)}>
      <div className="hidden overflow-hidden rounded-3xl border border-primary-100 dark:border-slate-800 md:block">
        <table className="w-full border-collapse text-right text-sm">
          <thead className="bg-primary-50 text-primary-900 dark:bg-slate-900 dark:text-sky-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-bold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-50 dark:divide-slate-800">
            {safeRows.map((row, index) => (
              <tr key={keyExtractor(row, index)} className="bg-white dark:bg-slate-950/35">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={clsx(
                      "px-4 py-3 text-gray-800 dark:text-sky-50",
                      column.align === "center" && "text-center",
                      column.align === "left" && "text-left",
                    )}
                  >
                    {column.render ? column.render(row, index) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {safeRows.map((row, index) => (
          <article
            key={keyExtractor(row, index)}
            className="rounded-3xl border border-primary-100 bg-white p-4 shadow-sm shadow-primary-50/40 dark:border-slate-800 dark:bg-slate-950/45 dark:shadow-black/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-950 dark:text-white">
                  {mobileTitle
                    ? mobileTitle(row, index)
                    : (columns[0]?.render?.(row, index) ?? row[columns[0]?.key])}
                </p>
                {mobileSubtitle && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-sky-100/70">
                    {mobileSubtitle(row, index)}
                  </p>
                )}
              </div>
              {mobileMeta && (
                <div className="shrink-0 text-left text-sm font-bold text-primary-800 dark:text-sky-50">
                  {mobileMeta(row, index)}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
