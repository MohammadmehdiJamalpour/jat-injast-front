import {
  CheckCircleIcon,
  HeartIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { aboutSections } from "./AboutUsContent";

const iconByKey = {
  overview: SparklesIcon,
  mission: ShieldCheckIcon,
  values: HeartIcon,
  experience: CheckCircleIcon,
};

export default function AboutUsSidebar({ selectedSection, setSelectedSection, scrollTo }) {
  return (
    <nav className="space-y-2" aria-label="بخش‌های درباره ما">
      {aboutSections.map(({ key, eyebrow }) => {
        const Icon = iconByKey[key] || SparklesIcon;
        const selected = selectedSection === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => {
              setSelectedSection(key);
              scrollTo?.(key);
            }}
            className={clsx(
              "flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-right text-sm font-black transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
              selected
                ? "bg-primary-600 text-white shadow-sm shadow-primary-500/25 dark:bg-primary-500 dark:text-white"
                : "text-gray-600 hover:bg-primary-50 hover:text-primary-800 dark:text-sky-100/80 dark:hover:bg-primary-500/10 dark:hover:text-white",
            )}
          >
            <span className="min-w-0 break-words">{eyebrow}</span>
            <Icon className="h-5 w-5 shrink-0" />
          </button>
        );
      })}
    </nav>
  );
}
