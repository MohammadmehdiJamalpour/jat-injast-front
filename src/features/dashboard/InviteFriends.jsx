import { useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  ClipboardDocumentIcon,
  CurrencyDollarIcon,
  HashtagIcon,
  LinkIcon,
  ReceiptPercentIcon,
  ShareIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import toPersianNumber from "../../utils/toPersianNumber";

const emptyValue = "ثبت نشده";

const hasValue = (value) =>
  value !== null && value !== undefined && String(value).trim() !== "";

const formatCommission = (value) => {
  if (!hasValue(value)) return emptyValue;

  const text = String(value).trim().replace("%", "٪");
  if (text.includes("٪") || text.includes("درصد")) {
    return toPersianNumber(text);
  }

  return `${toPersianNumber(text)}٪`;
};

const formatMoney = (value) => {
  if (!hasValue(value)) return emptyValue;

  const text = String(value).trim();
  const numeric = Number(text.replace(/,/g, ""));
  const formatted = Number.isFinite(numeric)
    ? toPersianNumber(numeric.toLocaleString("en-US"))
    : toPersianNumber(text);

  return `${formatted} تومان`;
};

const copyText = async (text) => {
  if (
    typeof navigator !== "undefined" &&
    typeof navigator.clipboard?.writeText === "function"
  ) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard is unavailable");
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.right = "-9999px";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const copied = document.execCommand("copy");
    if (!copied) throw new Error("Copy command failed");
  } finally {
    document.body.removeChild(textarea);
  }
};

function InviteFriends({ user }) {
  const [isCopying, setIsCopying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const copiedTimeoutRef = useRef(null);

  const referralCode = hasValue(user?.referral_code)
    ? String(user.referral_code).trim()
    : "";
  const appOrigin =
    process.env.NEXT_PUBLIC_APP_ORIGIN ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const referralLink = referralCode
    ? `${appOrigin}/login?referralcode=${referralCode}`
    : "";

  useEffect(() => {
    const supported =
      Boolean(referralLink) &&
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function";

    setCanShare(supported);
  }, [referralLink]);

  useEffect(
    () => () => {
      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    },
    [],
  );

  if (!user) return null;

  const handleCopy = async () => {
    if (!referralLink || isCopying) return;

    try {
      setIsCopying(true);
      await copyText(referralLink);
      setIsCopied(true);
      toast.success("لینک دعوت کپی شد");

      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }

      copiedTimeoutRef.current = window.setTimeout(() => {
        setIsCopied(false);
      }, 2200);
    } catch {
      toast.error("کپی لینک ممکن نشد");
    } finally {
      setIsCopying(false);
    }
  };

  const handleShare = async () => {
    if (!referralLink || !canShare || isSharing) return;

    try {
      setIsSharing(true);
      await navigator.share({
        title: "دعوت به جات اینجاست",
        text: "با این لینک وارد جات اینجاست شوید.",
        url: referralLink,
      });
      toast.success("لینک آماده اشتراک‌گذاری شد");
    } catch (error) {
      if (error?.name !== "AbortError") {
        toast.error("اشتراک‌گذاری لینک ممکن نشد");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const stats = [
    {
      label: "کد دعوت",
      value: referralCode || emptyValue,
      icon: HashtagIcon,
      dir: referralCode ? "ltr" : "rtl",
    },
    {
      label: "کمیسیون معرف",
      value: formatCommission(user.referral_commission),
      icon: ReceiptPercentIcon,
      dir: "rtl",
    },
    {
      label: "کل درآمد معرف",
      value: formatMoney(user.total_referral_earned),
      icon: CurrencyDollarIcon,
      dir: "rtl",
    },
  ];

  return (
    <section
      dir="rtl"
      className="w-full min-w-0 rounded-3xl border border-primary-100 bg-white/85 p-4 shadow-sm shadow-primary-50/60 dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-black/20 sm:p-5"
    >
      <div className="flex flex-col gap-3 border-b border-primary-100 pb-4 dark:border-slate-700 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-slate-950 dark:text-primary-200">
            <UsersIcon className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-gray-950 dark:text-slate-100">
              دعوت از دوستان
            </h2>
            <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-slate-400">
              لینک را برای دوستانتان بفرستید و وضعیت پاداش معرف را همین‌جا ببینید.
            </p>
          </div>
        </div>

        {referralCode && (
          <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-primary-100 bg-primary-50/70 px-3 py-1.5 text-xs font-bold text-primary-800 dark:border-primary-400/25 dark:bg-primary-500/10 dark:text-sky-50">
            <span className="shrink-0">کد دعوت</span>
            <span
              dir="ltr"
              className="min-w-0 truncate font-mono text-sm tracking-normal text-gray-950 dark:text-slate-100"
            >
              {referralCode}
            </span>
          </div>
        )}
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="dashboard-referral-link"
            className="mb-2 text-sm font-bold text-gray-900 dark:text-slate-100"
          >
            لینک دعوت شما
          </label>

          <div className="flex min-w-0 flex-col gap-2 lg:flex-row">
            <div className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-2xl border border-primary-100 bg-gray-50/80 px-3 shadow-sm shadow-primary-50/40 transition focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 dark:border-slate-700 dark:bg-slate-950/55 dark:shadow-black/20 dark:focus-within:ring-primary-400/25">
              <LinkIcon
                className="h-5 w-5 shrink-0 text-primary-700 dark:text-primary-200"
                aria-hidden="true"
              />
              <input
                id="dashboard-referral-link"
                type="text"
                readOnly
                value={referralLink || "کد دعوت برای حساب شما ثبت نشده است"}
                dir={referralLink ? "ltr" : "rtl"}
                aria-label="لینک دعوت شما"
                onFocus={(event) => event.target.select()}
                className="min-w-0 flex-1 truncate border-0 bg-transparent p-0 text-left text-xs font-medium text-gray-800 shadow-none outline-none ring-0 focus:ring-0 dark:text-slate-100 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!referralLink || isCopying}
                className="btn-primary btn-press min-h-12 gap-2 rounded-2xl px-4 text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-primary-200 dark:focus-visible:ring-offset-slate-950"
                aria-label="کپی کردن لینک دعوت"
              >
                {isCopied ? (
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <ClipboardDocumentIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                )}
                <span>{isCopied ? "کپی شد" : "کپی لینک"}</span>
              </button>

              {canShare && (
                <button
                  type="button"
                  onClick={handleShare}
                  disabled={!referralLink || isSharing}
                  className="btn-secondary btn-press min-h-12 gap-2 rounded-2xl border border-primary-100 px-4 text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-primary-400/25 dark:focus-visible:ring-primary-200 dark:focus-visible:ring-offset-slate-950"
                  aria-label="اشتراک‌گذاری لینک دعوت"
                >
                  <ShareIcon className="h-5 w-5" aria-hidden="true" />
                  <span>{isSharing ? "در حال اشتراک" : "اشتراک"}</span>
                </button>
              )}
            </div>
          </div>

          <p
            aria-live="polite"
            className="mt-2 min-h-5 text-xs text-gray-500 dark:text-slate-400"
          >
            {isCopied
              ? "لینک کامل در کلیپ‌بورد شما قرار گرفت."
              : "برای جلوگیری از خطا، لینک کامل با دکمه کپی می‌شود."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {stats.map((item) => (
            <ReferralStatCard key={item.label} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReferralStatCard({ label, value, icon: Icon, dir }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/70 px-3 py-3 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white text-primary-700 shadow-sm dark:bg-slate-900 dark:text-primary-200">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-slate-400">
            {label}
          </p>
          <p
            dir={dir}
            className="mt-1 break-words text-sm font-bold tabular-nums text-gray-900 dark:text-slate-100"
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default InviteFriends;
