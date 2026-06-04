import clsx from "clsx";

export default function EmptyState({ icon, title, description, action, className }) {
  return (
    <div
      className={clsx(
        "flex min-h-40 flex-col items-center justify-center rounded-3xl border border-dashed border-primary-100 bg-primary-50/45 p-6 text-center dark:border-primary-400/25 dark:bg-primary-500/10",
        className,
      )}
    >
      {icon && <div className="mb-3 text-primary-700 dark:text-sky-100">{icon}</div>}
      <p className="text-base font-bold text-gray-950 dark:text-white">{title}</p>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-7 text-gray-500 dark:text-sky-100/70">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
