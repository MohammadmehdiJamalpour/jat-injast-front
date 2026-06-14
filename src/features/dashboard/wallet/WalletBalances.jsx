import toPersianNumber from "../../../utils/toPersianNumber";

function WalletBalances({ user }) {
  if (!user?.wallet) return null;

  const items = [
    { label: "موجودی اصلی", value: user.wallet.main || 0 },
    { label: "بلوکه‌شده", value: user.wallet.blocked || 0 },
  ];

  return (
    <div className="rounded-3xl border border-primary-100 bg-white p-4 shadow-sm shadow-primary-50/70 dark:border-slate-700 dark:bg-slate-950/50 dark:shadow-black/20">
      <h4 className="mb-3 text-sm font-bold text-gray-900">موجودی کیف پول</h4>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl bg-primary-50/70 px-4 py-3 dark:bg-slate-900"
          >
            <p className="text-xs text-gray-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-2 text-lg font-bold text-gray-900 dark:text-slate-100">
              {toPersianNumber(item.value)}
              <span className="mr-1 text-xs font-medium text-gray-500">تومان</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WalletBalances;
