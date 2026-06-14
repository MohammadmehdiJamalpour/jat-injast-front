export default function HomeHeroCopy({ embedded = false }) {
  return (
    <section
      dir="rtl"
      className={
        embedded
          ? "w-full text-center"
          : "pointer-events-none absolute inset-x-0 top-0 z-[85] mx-auto flex h-[80vh] w-full max-w-7xl flex-col items-center justify-start px-4 pb-6 pt-24 text-center text-[var(--color-primary-900)] drop-shadow-[0_2px_12px_rgba(255,255,255,0.72)] sm:pt-28 md:px-8 md:pt-32 lg:px-10 lg:pt-36"
      }
    >
      <div
        data-testid={embedded ? "home-hero-copy" : undefined}
        className={
          embedded
            ? "mx-auto w-full max-w-[19rem] space-y-2.5 sm:max-w-xl sm:space-y-3 md:max-w-2xl md:space-y-4"
            : "w-full max-w-[22rem] space-y-3 rounded-[2rem] border border-white/55 bg-white/35 px-5 py-4 shadow-[0_18px_48px_rgba(3,78,92,0.18)] ring-1 ring-primary-100/40 backdrop-blur-md sm:max-w-xl sm:rounded-[2.5rem] sm:px-7 sm:py-5 md:max-w-2xl md:space-y-4 md:rounded-[3rem] md:px-8 md:py-6 dark:border-white/10 dark:bg-slate-950/35 dark:shadow-black/25 dark:ring-white/10"
        }
      >
        <h1 className="text-2xl font-black leading-10 dark:text-white sm:text-4xl md:text-5xl md:leading-[4rem]">
          رزرو اقامتگاه در سراسر ایران
        </h1>
        <p className="text-xs font-bold leading-6 dark:text-sky-50/90 sm:text-sm sm:leading-7 md:text-lg md:leading-8">
          در جات اینجاست ویلا، کلبه، بوم‌گردی و اقامتگاه شهری را بر اساس مقصد،
          تاریخ، ظرفیت و امکانات مقایسه کنید و مسیر رزرو را شفاف دنبال کنید.
        </p>
      </div>
    </section>
  );
}
