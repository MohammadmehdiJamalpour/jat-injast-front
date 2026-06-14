import Footer from "../Footer";
import AboutUsContent from "../about-us/AboutUsContent";
import TermsContent from "../terms/TermsContent";
import PublicPageClientNav from "./PublicPageClientNav";

const aboutNavSections = [
  { id: "overview", label: "معرفی" },
  { id: "mission", label: "ماموریت" },
  { id: "values", label: "ارزش‌ها" },
  { id: "experience", label: "تجربه کاربری" },
];

const termsNavSections = [
  { id: "general", label: "استفاده از سرویس" },
  { id: "guest", label: "تعهدات مهمان" },
  { id: "host", label: "تعهدات میزبان" },
  { id: "payment", label: "پرداخت و تسویه" },
  { id: "cancellation", label: "لغو رزرو" },
  { id: "privacy", label: "حریم خصوصی" },
];

const hostSections = [
  {
    id: "overview",
    label: "چرا میزبان شویم؟",
    title: "چرا به جات اینجاست بپیوندید؟",
    body: [
      "با تبدیل خانه یا اقامتگاه خود به یک گزینه میزبانی در جات اینجاست، می‌توانید درآمدی پایدار کسب کرده و فرهنگ مهمان‌نوازی ایرانی را با مسافران سراسر کشور به اشتراک بگذارید.",
      "ما با ارائه ابزارهای حرفه‌ای، سیستم رزرو ایمن و پشتیبانی ۲۴ ساعته، مسیر شما را برای تبدیل شدن به یک میزبان موفق هموار کرده‌ایم.",
    ],
  },
  {
    id: "requirements",
    label: "شرایط لازم",
    title: "شرایط لازم برای میزبانی",
    items: [
      "مالکیت یا اختیار قانونی برای اجاره اقامتگاه.",
      "ارائه مدارک شناسایی معتبر.",
      "رعایت استانداردهای بهداشتی و ایمنی.",
      "دسترسی به اینترنت برای مدیریت رزروها.",
    ],
  },
  {
    id: "steps",
    label: "مراحل ثبت اقامتگاه",
    title: "مراحل ثبت اقامتگاه",
    ordered: true,
    items: [
      "ایجاد حساب کاربری یا ورود به حساب موجود.",
      "تکمیل فرم اطلاعات ملک و بارگذاری تصاویر باکیفیت.",
      "تعیین قیمت، قوانین اقامت و تقویم دسترس‌پذیری.",
      "ارسال برای بررسی و تایید تیم جات اینجاست.",
    ],
  },
  {
    id: "fees",
    label: "کارمزد و تسویه",
    title: "کارمزد و تسویه حساب",
    body: [
      "جات اینجاست بابت هر رزرو موفق ۱۰٪ کارمزد از مبلغ کل میهمان دریافت می‌کند. مبلغ باقی‌مانده حداکثر ۴۸ ساعت پس از ورود میهمان، به حساب بانکی شما واریز می‌شود.",
    ],
  },
  {
    id: "support",
    label: "پشتیبانی میزبان",
    title: "پشتیبانی میزبان",
    body: [
      "تیم پشتیبانی ما ۲۴ ساعته در تمام روزهای هفته از طریق تلفن، چت آنلاین و ایمیل پاسخگوی سوالات شماست.",
    ],
    items: [
      "تلفن: ۰۲۱-۹۱۲۳۴۵۶۷",
      "ارسال درخواست از بخش تیکت پشتیبانی پنل میزبان",
      "راهنمای جامع میزبان در مرکز راهنما",
    ],
  },
];

function PublicShell({
  children,
  nav,
  initialSection,
  ariaLabel,
  footer = true,
  initialFooterContent,
}) {
  return (
    <div data-public-static-shell className="mt-20 min-w-0 md:mt-24">
      <main className="mx-auto grid w-full max-w-7xl gap-4 px-3 py-4 sm:px-4 sm:py-6 md:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-6">
        <PublicPageClientNav
          sections={nav}
          initialSection={initialSection}
          ariaLabel={ariaLabel}
        />
        <section className="min-w-0">{children}</section>
      </main>
      {footer && <Footer mode="static" initialInfo={initialFooterContent ?? {}} />}
    </div>
  );
}

export function AboutPageContent({ initialFooterContent }) {
  return (
    <PublicShell
      nav={aboutNavSections}
      initialSection="overview"
      initialFooterContent={initialFooterContent}
      ariaLabel="بخش‌های درباره ما"
    >
      <h1 className="sr-only">درباره جات اینجاست</h1>
      <AboutUsContent />
    </PublicShell>
  );
}

export function TermsPageContent({ initialFooterContent }) {
  return (
    <PublicShell
      nav={termsNavSections}
      initialSection="general"
      initialFooterContent={initialFooterContent}
      ariaLabel="فهرست قوانین"
    >
      <h1 className="sr-only">قوانین و مقررات جات اینجاست</h1>
      <TermsContent />
    </PublicShell>
  );
}

export function HostPageContent() {
  return (
    <PublicShell
      nav={hostSections}
      initialSection="overview"
      ariaLabel="بخش‌های راهنمای میزبانی"
      footer={false}
    >
      <article className="space-y-5 rounded-xl border border-primary-400 bg-gray-50 p-3 shadow-centered md:p-5">
        <header className="space-y-2">
          <h1 className="text-2xl font-black text-gray-950">میزبان جات اینجاست شوید</h1>
          <p className="leading-8 text-gray-700">
            راهنمای میزبانی برای ثبت اقامتگاه، مدیریت رزروها، قیمت‌گذاری و دریافت پشتیبانی در جات اینجاست.
          </p>
        </header>

        {hostSections.map((section) => {
          const List = section.ordered ? "ol" : "ul";

          return (
            <section key={section.id} id={section.id} className="scroll-mt-32 rounded-xl bg-white p-4">
              <h2 className="mb-3 text-xl font-semibold">{section.title}</h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph} className="mb-3 text-justify leading-8 text-gray-700">
                  {paragraph}
                </p>
              ))}
              {section.items && (
                <List className={`${section.ordered ? "list-decimal" : "list-disc"} space-y-2 pr-5 leading-8`}>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </List>
              )}
            </section>
          );
        })}
      </article>
    </PublicShell>
  );
}
