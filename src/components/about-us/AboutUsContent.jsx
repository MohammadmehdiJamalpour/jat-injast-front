"use client";

import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Badge from "../../ui/Badge";
import Button from "../../ui/Button";
import Card from "../../ui/Card";
import RevealSection from "../../ui/RevealSection";
import SectionHeader from "../../ui/SectionHeader";

const stats = [
  { label: "شهرهای فعال", value: "+۳۵", Icon: MapPinIcon },
  { label: "پشتیبانی رزرو", value: "۲۴/۷", Icon: ClockIcon },
  { label: "تمرکز اصلی", value: "اقامت امن", Icon: ShieldCheckIcon },
];

export const aboutSections = [
  {
    key: "overview",
    eyebrow: "معرفی",
    title: "جات اینجاست برای رزرو اقامتگاه‌های قابل اعتماد در ایران ساخته شده است.",
    body:
      "ما تجربه رزرو ویلا، کلبه، بوم‌گردی و اقامتگاه شهری را ساده، شفاف و قابل پیگیری می‌کنیم. هدف محصول این است که مهمان با خیال راحت انتخاب کند و میزبان ابزارهای لازم برای مدیریت اقامتگاه خود را داشته باشد.",
    points: ["جستجوی سریع و محلی", "تقویم و قیمت‌گذاری شفاف", "مسیر رزرو قابل پیگیری"],
    Icon: SparklesIcon,
  },
  {
    key: "mission",
    eyebrow: "ماموریت",
    title: "رزرو کوتاه‌مدت را از یک فرایند پراکنده به یک تجربه قابل اعتماد تبدیل می‌کنیم.",
    body:
      "در هر مرحله، از مشاهده اقامتگاه تا گفت‌وگو با میزبان و پرداخت آزمایشی، تلاش کرده‌ایم تصمیم‌گیری کاربر روشن باشد و اطلاعات مهم در جای درست نمایش داده شود.",
    points: ["کاهش ابهام در رزرو", "حفظ حق انتخاب مهمان", "ابزار دقیق برای میزبان"],
    Icon: ShieldCheckIcon,
  },
  {
    key: "values",
    eyebrow: "ارزش‌ها",
    title: "سادگی، صداقت و احترام به زمان کاربر پایه طراحی محصول است.",
    body:
      "طراحی ما باید کم‌حرف، سریع و قابل فهم باشد. اطلاعات قیمت، قوانین، ظرفیت، امکانات و وضعیت رزرو باید بدون جست‌وجوی اضافه در دسترس باشد.",
    points: ["متن‌های کوتاه و روشن", "حریم خصوصی کاربر", "پشتیبانی پاسخ‌گو"],
    Icon: HeartIcon,
  },
  {
    key: "experience",
    eyebrow: "تجربه کاربری",
    title: "مسیر مهمان و میزبان جدا طراحی شده، اما از یک زبان بصری مشترک استفاده می‌کند.",
    body:
      "مهمان روی کشف و رزرو تمرکز دارد؛ میزبان روی مدیریت تقویم، قیمت و گفت‌وگو. هر دو پنل با ساختار ثابت، وضعیت‌های خوانا و تعامل‌های سبک طراحی شده‌اند.",
    points: ["پنل مهمان", "پنل میزبان", "پنل مدیریت وب"],
    Icon: CheckCircleIcon,
  },
];

export const ABOUT_SECTION_IDS = aboutSections.map((section) => section.key);

function StatCard({ label, value, Icon }) {
  return (
    <Card variant="glass" padding="p-3 sm:p-4" radius="rounded-2xl" className="flex min-w-0 items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary-500/10 text-primary-700 dark:bg-primary-400/15 dark:text-sky-100 sm:h-11 sm:w-11">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-lg font-black text-gray-950 dark:text-white">{value}</span>
        <span className="block text-xs font-bold leading-5 text-gray-500 dark:text-sky-100/70">{label}</span>
      </span>
    </Card>
  );
}

function AboutSection({ section }) {
  const Icon = section.Icon;

  return (
    <RevealSection id={section.key} className="scroll-mt-32 md:scroll-mt-28">
      <Card variant="interactive" padding="p-4 sm:p-5 md:p-7" radius="rounded-2xl md:rounded-3xl" className="overflow-hidden">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
          <div className="min-w-0 space-y-4 sm:space-y-5">
            <Badge>{section.eyebrow}</Badge>
            <div className="space-y-3">
              <h2 className="text-lg font-black leading-8 text-gray-950 dark:text-white sm:text-xl sm:leading-9 md:text-2xl md:leading-10">
                {section.title}
              </h2>
              <p className="text-sm leading-8 text-gray-600 dark:text-sky-100/75 md:text-base">
                {section.body}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {section.points.map((point) => (
                <Badge key={point} tone="neutral" className="max-w-full justify-start rounded-2xl px-3 py-1.5 text-right leading-5">
                  <CheckCircleIcon className="h-4 w-4 text-primary-600 dark:text-sky-200" />
                  <span className="min-w-0 break-words">{point}</span>
                </Badge>
              ))}
            </div>
          </div>

          <div className="relative hidden h-56 overflow-hidden rounded-3xl border border-primary-100 bg-primary-50 dark:border-primary-400/20 dark:bg-primary-500/10 lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.25),transparent_38%),radial-gradient(circle_at_70%_80%,rgba(34,211,238,0.18),transparent_42%)]" />
            <div className="absolute inset-0 grid place-items-center text-primary-700 dark:text-sky-100">
              <Icon className="h-20 w-20" />
            </div>
          </div>
        </div>
      </Card>
    </RevealSection>
  );
}

export default function AboutUsContent() {
  return (
    <div className="space-y-6">
      <Card variant="glass" padding="p-4 sm:p-5 md:p-8" radius="rounded-2xl md:rounded-3xl" className="overflow-hidden">
        <div className="grid gap-5 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center">
          <div className="min-w-0 space-y-5 sm:space-y-6">
            <SectionHeader
              title="درباره جات اینجاست"
              subtitle="مسیر کامل رزرو اقامتگاه، مدیریت میزبان، پرداخت آزمایشی و پشتیبانی رزرو در جات اینجاست."
              className="border-none pb-0"
            />
            <p className="max-w-3xl text-sm leading-8 text-gray-600 dark:text-sky-100/75 md:text-base">
              جات اینجاست مسیر رزرو اقامتگاه را برای مهمان ساده می‌کند و به میزبان ابزارهایی برای مدیریت اقامتگاه، تقویم، قیمت و گفت‌وگو می‌دهد.
            </p>
            <div className="grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
              <Button as="a" href="/search" size="sm" className="w-full sm:w-auto">
                مشاهده اقامتگاه‌ها
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>
              <Button as="a" href="/terms-of-service" variant="secondary" size="sm" className="w-full sm:w-auto">
                قوانین و شفافیت
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((item) => (
              <StatCard key={item.label} {...item} />
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {aboutSections.map((section) => (
          <AboutSection key={section.key} section={section} />
        ))}
      </div>
    </div>
  );
}
