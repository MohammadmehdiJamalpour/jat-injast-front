import {
  BanknotesIcon,
  DocumentTextIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { termsSections } from "./TermsContent";

const icons = {
  general: DocumentTextIcon,
  guest: UserIcon,
  host: UserGroupIcon,
  payment: BanknotesIcon,
  cancellation: ShieldCheckIcon,
  privacy: LockClosedIcon,
};

export default function TermsSidebar({ activeSection, scrollTo }) {
  return (
    <nav className="space-y-2" aria-label="فهرست قوانین">
      {termsSections.map(({ id, label }) => {
        const Icon = icons[id] || DocumentTextIcon;
        const selected = activeSection === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            className={clsx(
              "flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-right text-sm font-black transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
              selected
                ? "bg-primary-600 text-white shadow-sm shadow-primary-500/25 dark:bg-primary-500 dark:text-white"
                : "text-gray-600 hover:bg-primary-50 hover:text-primary-800 dark:text-sky-100/80 dark:hover:bg-primary-500/10 dark:hover:text-white",
            )}
          >
            <span className="min-w-0 break-words">{label}</span>
            <Icon className="h-5 w-5 shrink-0" />
          </button>
        );
      })}
    </nav>
  );
}
