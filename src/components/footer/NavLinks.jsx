import { Link } from "@/lib/router-compat";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

const col1 = [
  { to: "/about", label: "درباره ما" },
  { to: "/about", label: "سوالات متداول" },
];

const col2 = [
  { to: "/how-become-host", label: "میزبان شوید" },
  { to: "/terms-of-service", label: "قوانین و مقررات" },
];

function List({ items }) {
  return (
    <ul className="space-y-1.5">
      {items.map(({ to, label }) => (
        <li key={`${to}-${label}`}>
          <Link
            to={to}
            className="group inline-flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-primary-800 transition hover:bg-primary-50 hover:text-primary-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100"
          >
            <span className="truncate">{label}</span>
            <ChevronLeftIcon className="h-4 w-4 shrink-0 text-primary-500 transition group-hover:-translate-x-0.5 dark:text-primary-300" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function NavLinks({ columns }) {
  const normalizedColumns =
    Array.isArray(columns) && columns.length ? columns : [col1, col2];

  return (
    <nav className="rounded-3xl border border-primary-100/70 bg-primary-50/30 p-3 dark:border-slate-800 dark:bg-slate-900/60">
      <h3 className="mb-2 px-3 text-sm font-bold text-primary-900 dark:text-slate-100">
        دسترسی سریع
      </h3>
      <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
        {normalizedColumns.map((items, index) => (
          <List key={index} items={Array.isArray(items) ? items : []} />
        ))}
      </div>
    </nav>
  );
}
