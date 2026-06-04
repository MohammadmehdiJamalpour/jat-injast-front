import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

const logotype = "/assets/jat-injast-wordmark-primary.svg";
const downloadGoogle = "/download-google.webp";
const downloadMyket = "/download-myket.webp";
const downloadSibApp = "/download-sibapp.webp";
const downloadBazar = "/download-bazar.webp";

const defaultBadges = [
  { src: downloadGoogle, name: "Google Play" },
  { src: downloadBazar, name: "Bazar" },
  { src: downloadMyket, name: "Myket" },
  { src: downloadSibApp, name: "SibApp" },
];

function Badge({ src, alt }) {
  return (
    <span className="flex h-9 w-28 items-center justify-center overflow-hidden rounded-xl bg-white px-1.5 transition dark:bg-slate-900 sm:w-32">
      <img
        src={src}
        className="h-full w-auto max-w-full object-contain"
        alt={alt}
        loading="lazy"
      />
    </span>
  );
}

export default function DownloadApp({ downloads = [] }) {
  const badges =
    Array.isArray(downloads) && downloads.length ? downloads : defaultBadges;

  return (
    <section className="rounded-3xl border border-primary-100/70 bg-primary-50/40 p-3 dark:border-slate-800 dark:bg-slate-900/70 sm:p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary-600 text-white dark:bg-primary-500">
            <ArrowDownTrayIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <img src={logotype} alt="جات اینجاست" className="h-7 w-auto max-w-36" />
            <p className="mt-1 text-xs text-primary-700 dark:text-slate-400">
              دریافت اپلیکیشن نمونه رزرو اقامتگاه
            </p>
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-2 justify-items-center gap-2 sm:w-[16.5rem]">
          {badges.slice(0, 4).map((badge) => (
            <Badge
              key={badge.name || badge.src}
              src={badge.src}
              alt={badge.name || "download"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
