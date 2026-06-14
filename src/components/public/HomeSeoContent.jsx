import BecomeHostSection from "../home/BecomeHostSection";

export default function HomeSeoContent() {
  return (
    <section
      dir="rtl"
      className="pointer-events-none absolute inset-x-0 top-0 z-[85] mx-auto flex h-[80vh] w-full max-w-7xl flex-col items-start justify-start px-4 pb-6 pt-24 text-right text-orange-950 drop-shadow-[0_2px_12px_rgba(255,255,255,0.72)] sm:pt-28 md:px-8 md:pt-28 lg:px-10"
    >
      <div className="mr-0 w-full max-w-[22rem] space-y-3 sm:max-w-xl md:max-w-2xl md:space-y-4">
        <h1 className="text-2xl font-black leading-10 sm:text-4xl md:text-5xl md:leading-[4rem]">
          رزرو اقامتگاه در سراسر ایران
        </h1>
        <p className="text-xs font-bold leading-6 sm:text-sm sm:leading-7 md:text-lg md:leading-8">
          در جات اینجاست ویلا، کلبه، بوم‌گردی و اقامتگاه شهری را بر اساس مقصد،
          تاریخ، ظرفیت و امکانات مقایسه کنید و مسیر رزرو را شفاف دنبال کنید.
        </p>
      </div>
    </section>
  );
}

export function HomeStaticBody() {
  return (
    <div className="relative z-10 mx-auto mt-24 flex w-full max-w-7xl flex-col gap-8 px-4 pb-20 md:px-6">
      <section className="rounded-3xl border border-primary-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
        <h2 className="mb-3 text-xl font-black text-gray-950 dark:text-white">
          جستجو، مقایسه و رزرو ساده‌تر اقامتگاه
        </h2>
        <p className="leading-8 text-gray-700 dark:text-sky-100/75">
          اطلاعات قیمت، ظرفیت، موقعیت، امکانات و قوانین هر اقامتگاه در یک مسیر
          واحد نمایش داده می‌شود تا مهمان پیش از رزرو تصمیم دقیق‌تری بگیرد و
          میزبان بتواند تقویم و رزروهای خود را مدیریت کند.
        </p>
      </section>
      <BecomeHostSection />
    </div>
  );
}
