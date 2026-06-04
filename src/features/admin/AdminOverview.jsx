import { useQuery } from "@tanstack/react-query";
import Loading from "@/ui/Loading";
import toPersianNumber from "@/utils/toPersianNumber";
import { getAdminOverview, moneyText } from "./adminConfig";

export default function AdminOverview() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: getAdminOverview,
  });

  if (isLoading) return <Loading size={28} />;
  if (isError) return <ErrorBox text="نمای کلی بارگذاری نشد." />;

  const cards = [
    ["کاربران", data?.counts?.users],
    ["مدیران", data?.counts?.admins],
    ["میزبان‌ها", data?.counts?.vendors],
    ["اقامتگاه‌ها", data?.counts?.houses],
    ["منتشر شده", data?.counts?.published_houses],
    ["رزروها", data?.counts?.reservations],
    ["رزروهای در انتظار", data?.counts?.pending_reservations],
    ["پرداخت‌های آزمایشی", data?.counts?.payments],
    ["پرداخت موفق", data?.counts?.successful_payments],
    ["پرداخت ناموفق", data?.counts?.failed_payments],
    ["در انتظار پرداخت", data?.counts?.pending_payments],
    ["گزینه‌های پایه", data?.counts?.type_items],
  ];

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-sky-50">
        نمای کلی سیستم
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-primary-100 bg-primary-50/40 p-4 dark:border-slate-700 dark:bg-slate-950/60"
          >
            <p className="text-sm text-gray-600 dark:text-sky-100">{label}</p>
            <p className="mt-2 text-2xl font-bold text-primary-800 dark:text-white">
              {toPersianNumber(value ?? 0)}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-950">
        <p className="text-sm text-gray-600 dark:text-sky-100">مجموع مبلغ رزروها</p>
        <p className="mt-2 text-xl font-bold text-primary-800 dark:text-white">
          {moneyText(data?.revenue?.total)}
        </p>
        <p className="mt-3 text-sm text-gray-600 dark:text-sky-100">
          درآمد پرداخت‌های آزمایشی موفق
        </p>
        <p className="mt-1 text-xl font-bold text-primary-800 dark:text-white">
          {moneyText(data?.revenue?.payments)}
        </p>
      </div>
    </div>
  );
}

function ErrorBox({ text }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100">
      {text}
    </div>
  );
}
