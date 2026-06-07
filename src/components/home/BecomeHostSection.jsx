import { ChevronLeftIcon } from "@heroicons/react/24/outline";
const becomeHost = "/become-host.webp";

/**
 * Fully-responsive hero section inviting property owners to become hosts on jat-injast.
 *
 * • Mobile-first: stacks vertically, switches to 2-column layout on =lg screens.
 * • Uses Tailwind utility classes only (no custom CSS).
 * • RTL-friendly via `dir="rtl"` so Persian text renders correctly.
 * • Image path is configurable via props.
 */

const BecomeHostSection = ({ siteName = "جات اینجاست" }) => {
  return (
    <section
      dir="rtl"
      className="mx-4 mb-12 border border-primary-300 shadow-centered shadow-primary-75 mt-5 lg:mt-10  hover:shadow-centered-lg hover:scale-105  hover:shadow-primary-100 transition-all duration-500 rounded-3xl xs:max-w-sm    small:max-w-md  550:max-w-lg sm:max-w-xl md:max-w-2xl 850:max-w-3xl lg:max-w-4xl  xl:max-w-6xl 2xl:max-w-7xl 3xl:max-w-8xl  overflow-hidden lg:mb-16 lg:flex"
    >
      {/* Content */}
      <div className="flex flex-col justify-center p-6 lg:w-3/5 gap-6">
        {/* Heading */}
        <h3 className="text-2xl md:text-3xl text-primary-800 font-bold">
          میزبان {siteName} شوید
        </h3>
        <p className=" text-primary-800 leading-relaxed">
          اقامتگاه خود را ثبت کنید و رزروها، تقویم و قیمت‌گذاری را از پنل میزبان
          مدیریت کنید.
        </p>

        {/* CTA */}
        <div>
          <a
            href="/dashboard"
            className="btn-press inline-flex items-center gap-1 rounded-3xl border border-primary px-5 py-3 text-sm font-semibold text-primary-800 shadow-centered shadow-primary-50 transition-colors duration-300 hover:bg-primary-action hover:text-primary-contrast"
          >
            <span>شروع میزبانی</span>
            <ChevronLeftIcon className="w-5 h-5" />
          </a>
        </div>

        {/* Why section */}
        <div className="space-y-3">
          <span className="block font-medium ">
            چرا در {siteName} میزبان شوید؟
          </span>
          <div className="flex flex-wrap  gap-2 text-sm">
            <Badge>مدیریت ساده رزرو</Badge>
            <Badge>تقویم و قیمت‌گذاری منعطف</Badge>
            <Badge>دسترسی به پنل میزبان</Badge>
          </div>
        </div>
      </div>
      {/* Image */}
      <div className="lg:w-2/5 w-full">
        <img
          src={becomeHost}
          alt="host hero"
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>
    </section>
  );
};

/**
 * Reusable pill-style badge.
 */
const Badge = ({ children }) => (
  <span className="rounded-full bg-primary-50 shadow-centered shadow-primary-50 text-primary-800 font-bold px-3 py-1">
    {children}
  </span>
);

export default BecomeHostSection;
