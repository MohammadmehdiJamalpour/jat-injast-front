export default function SearchSeoContent() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-28 md:pt-24">
      <a
        href="#search-page"
        className="fixed right-4 top-3 z-[9000] max-w-[calc(100vw-2rem)] -translate-y-24 rounded-full bg-primary-action px-4 py-2 text-center text-sm font-bold leading-tight text-primary-contrast opacity-0 shadow-centered transition focus:translate-y-0 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
      >
        {'\u0631\u0641\u062a\u0646 \u0628\u0647 \u0627\u0628\u0632\u0627\u0631 \u062c\u0633\u062a\u062c\u0648'}
      </a>
      <a
        href="/"
        className="fixed right-4 top-16 z-[9000] max-w-[calc(100vw-2rem)] -translate-y-32 rounded-full bg-white px-4 py-2 text-center text-sm font-bold leading-tight text-primary-800 opacity-0 shadow-centered ring-1 ring-primary-100 transition focus:translate-y-0 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:bg-slate-950 dark:text-sky-100 dark:ring-slate-700"
      >
        {'\u0628\u0627\u0632\u06af\u0634\u062a \u0628\u0647 \u0635\u0641\u062d\u0647 \u0627\u0635\u0644\u06cc'}
      </a>
      <div className="rounded-3xl border border-primary-100 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
        <h1 className="text-2xl font-black text-gray-950 dark:text-white">
          جستجوی اقامتگاه
        </h1>
        <p className="mt-2 leading-8 text-gray-700 dark:text-sky-100/75">
          اقامتگاه‌های مناسب سفر خود را بر اساس مقصد، تاریخ، ظرفیت، محدوده قیمت، امکانات و قوانین پیدا کنید. نقشه و فیلترها پس از بارگذاری JavaScript فعال می‌شوند.
        </p>
      </div>
    </section>
  );
}
