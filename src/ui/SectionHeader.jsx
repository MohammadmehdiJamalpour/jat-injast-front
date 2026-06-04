import clsx from "clsx";

export default function SectionHeader({
  title,
  subtitle,
  action,
  align = "right",
  className,
}) {
  return (
    <header
      className={clsx(
        "flex flex-col gap-3 border-b border-primary-100 pb-4 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "text-center sm:text-right",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-lg font-black text-gray-950 dark:text-white sm:text-xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm leading-7 text-gray-500 dark:text-sky-100/70">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
