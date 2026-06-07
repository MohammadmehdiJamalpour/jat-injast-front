import { classNames } from "../../../utils/classNames";

export function WalletDataSection({ title, description, children }) {
  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 sm:text-lg">{title}</h3>
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ children }) {
  return (
    <div className="rounded-3xl border border-dashed border-primary-200 bg-primary-50/40 px-4 py-6 text-center text-sm text-gray-500">
      {children}
    </div>
  );
}

export function ResponsiveDataTable({
  columns,
  rows,
  getRowKey,
  emptyMessage,
  mobileTitle,
  mobileSubtitle,
  mobileMeta,
}) {
  if (!rows?.length) {
    return <EmptyState>{emptyMessage || "داده‌ای برای نمایش وجود ندارد."}</EmptyState>;
  }

  const visibleMobileColumns = columns.filter((column) => !column.mobileHidden);

  return (
    <>
      <div className="hidden overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-sm shadow-primary-50/60 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-primary-50/80 text-xs font-semibold text-gray-500">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={classNames(
                      "whitespace-nowrap px-4 py-3",
                      column.align === "right" ? "text-right" : "text-center",
                      column.headerClassName,
                    )}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, index) => (
                <tr
                  key={getRowKey?.(row, index) ?? row.id ?? index}
                  className="transition-colors duration-200 hover:bg-primary-50/45"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={classNames(
                        "px-4 py-3 text-gray-700",
                        column.align === "right" ? "text-right" : "text-center",
                        column.className,
                      )}
                    >
                      {column.render ? column.render(row, index) : row[column.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-2 md:hidden">
        {rows.map((row, index) => (
          <article
            key={getRowKey?.(row, index) ?? row.id ?? index}
            className="rounded-3xl border border-primary-100 bg-white p-3 shadow-sm shadow-primary-50/70"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="truncate text-sm font-bold text-gray-900">
                  {mobileTitle?.(row, index) ?? visibleMobileColumns[0]?.render?.(row, index) ?? "—"}
                </h4>
                {mobileSubtitle && (
                  <p className="mt-1 truncate text-xs text-gray-500">
                    {mobileSubtitle(row, index)}
                  </p>
                )}
              </div>
              {mobileMeta && (
                <div className="shrink-0 text-xs font-medium text-primary-700">
                  {mobileMeta(row, index)}
                </div>
              )}
            </div>

            <dl className="space-y-2">
              {visibleMobileColumns.map((column) => (
                <div
                  key={column.key}
                  className="flex items-start justify-between gap-3 rounded-2xl bg-gray-50 px-3 py-2"
                >
                  <dt className="shrink-0 text-xs text-gray-500">{column.label}</dt>
                  <dd className="min-w-0 text-left text-xs font-medium text-gray-800">
                    {column.render ? column.render(row, index) : row[column.key] ?? "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}
