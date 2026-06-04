import PropTypes from "prop-types";
import clsx from "clsx";
import {
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const brandLogo = "/assets/jat-injast-badge.svg";

export default function InfoSection({ info, isLoading = false }) {
  if (!info && !isLoading) return null;

  const title = info?.title || "جات اینجاست";
  const description =
    info?.description || "رزرو اقامتگاه، ویلا و بوم گردی در شهرهای ایران";

  return (
    <section className="min-w-0 space-y-4">
      <div className={clsx("space-y-3", isLoading && "animate-pulse")}>
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-primary-100 bg-primary-50 dark:border-slate-700 dark:bg-slate-900">
            {!isLoading ? (
              <img
                src={brandLogo}
                alt={title}
              className="h-full w-full object-cover"
              />
            ) : (
              <span className="h-7 w-7 rounded-xl bg-primary-100 dark:bg-slate-800" />
            )}
          </div>

          <div className="min-w-0">
            <h2
              className={clsx(
                "text-base font-extrabold leading-7 text-primary-900 dark:text-slate-100",
                isLoading && "h-5 w-28 rounded-lg bg-primary-100 text-transparent dark:bg-slate-800",
              )}
            >
              {isLoading ? "\u00A0" : title}
            </h2>
            <p
              className={clsx(
                "mt-1 max-w-md text-xs leading-6 text-primary-700 dark:text-slate-400 sm:text-sm",
                isLoading && "h-4 w-56 rounded-lg bg-primary-100 text-transparent dark:bg-slate-800",
              )}
            >
              {isLoading ? "\u00A0" : description}
            </p>
          </div>
        </div>

        <div className="grid gap-2 text-xs text-primary-800 dark:text-slate-300 sm:text-sm">
          <InfoLine
            icon={PhoneIcon}
            label="تلفن"
            value={info?.phone}
            fallback="۰۲۱-۹۱۰۰۰۰۰۰"
            isLoading={isLoading}
          />
          <InfoLine
            icon={MapPinIcon}
            label="آدرس"
            value={info?.address}
            fallback="تهران، دفتر مرکزی جات اینجاست"
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  );
}

function InfoLine({ icon: Icon, label, value, fallback, isLoading }) {
  return (
    <div className="flex min-w-0 items-start gap-2 rounded-2xl border border-primary-100/70 bg-primary-50/40 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/70">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-300" />
      <span className="shrink-0 font-semibold">{label}:</span>
      {isLoading ? (
        <span className="mt-1 h-3 w-36 rounded bg-primary-100 dark:bg-slate-800" />
      ) : (
        <span className="min-w-0 truncate text-primary-700 dark:text-slate-400">
          {value || fallback}
        </span>
      )}
    </div>
  );
}

InfoSection.propTypes = {
  info: PropTypes.object,
  isLoading: PropTypes.bool,
};

InfoLine.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  fallback: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};
