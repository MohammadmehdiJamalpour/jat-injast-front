import React from "react";
import TermsCard from "./TermsCard";
const becomeHost = "/become-host.webp";

/* ——— ۳ کارت موضوعی ——— */
const cards = [
  /* 1) عمومی */
  {
    id: "general",
    title: "بخش عمومی",
    img: becomeHost,
    body: (
      <>
        {/* مقدمه */}
        <h3 className="font-bold mb-1">مقدمه</h3>
        <p className="mb-4">
          جهت استفاده از سایت و اپلیکیشن «جات اینجاست»، مطالعه و پذیرش قوانین
          زیر الزامی است. این مقررات برای حفظ حقوق متقابل و ایجاد فضایی امن
          تدوین شده‌اند.
        </p>

        {/* اصطلاحات */}
        <h3 className="font-bold mb-1">اصطلاحات و تعاریف</h3>
        <ul className="list-disc pr-5 leading-7 space-y-1 mb-4">
          <li>اقامتگاه: همهٔ اماکن قابل رزرو (ویلا، سوئیت، هتل، کلبه و…)</li>
          <li>میزبان / مهمان / مالک یا ناظر رزرو / کاربر</li>
          <li>حساب کاربری: پروفایل اختصاصی در پلتفرم</li>
        </ul>

        {/* شرایط کلی */}
        <h3 className="font-bold mb-1">شرایط کلی استفاده</h3>
        <ul className="list-disc pr-5 leading-7 space-y-1 mb-4">
          <li>تابع قوانین جمهوری اسلامی ایران</li>
          <li>حداقل سن استفاده ۱۸ سال</li>
          <li>مسئولیت درج اطلاعات دقیق با کاربر است</li>
          <li>پلتفرم صرفاً واسط است و ضامن تعهدات طرفین نیست</li>
        </ul>

        {/* سایر بندها */}
        <h3 className="font-bold mb-1">سایر موارد</h3>
        <p className="leading-7">
          شامل سلب مسئولیت، گزارش سوءرفتار، حقوق کاربران، فورس‌ماژور و پرسش‌های
          متداول که جزئیات آن‌ها در متن کامل قوانین آمده است.
        </p>
      </>
    ),
  },

  /* 2) تعهدات */
  {
    id: "commitments",
    title: "تعهدات",
    img: becomeHost,
    body: (
      <>
        {/* تعهدات سایت */}
        <h3 className="font-bold mb-1">تعهدات سایت</h3>
        <ul className="list-disc pr-5 leading-7 space-y-1 mb-4">
          <li>کارمزد ۱۰٪ و تسویه با میزبان در روز کاری پس از ورود مهمان</li>
          <li>پشتیبانی تلفنی / چتی ۲۴ ساعته</li>
          <li>تبلیغات رایگان برای میزبانان</li>
        </ul>

        {/* تعهدات میزبان */}
        <h3 className="font-bold mb-1">تعهدات میزبان</h3>
        <ul className="list-disc pr-5 leading-7 space-y-1 mb-4">
          <li>انطباق کامل اطلاعات و تصاویر با واقعیت اقامتگاه</li>
          <li>پاسخ به درخواست رزرو حداکثر ظرف ۳ ساعت</li>
          <li>به‌روزرسانی مستمر قیمت و تقویم</li>
        </ul>

        {/* تعهدات مهمان */}
        <h3 className="font-bold mb-1">تعهدات مهمان</h3>
        <ul className="list-disc pr-5 leading-7 space-y-1">
          <li>ثبت دقیق اطلاعات هویتی</li>
          <li>رعایت قوانین محل اقامت</li>
          <li>جبران خسارات احتمالی به اقامتگاه</li>
        </ul>
      </>
    ),
  },

  /* 3) لغو رزرو */
  {
    id: "cancellation",
    title: "لغو رزرو و بازگشت وجه",
    img: becomeHost,
    body: (
      <>
        <h3 className="font-bold mb-1">قوانین بازگشت هزینه</h3>
        <ul className="list-disc pr-5 leading-7 space-y-1 mb-4">
          <li>لغو توسط میزبان → بازگشت کامل وجه به مهمان</li>
          <li>
            لغو توسط مهمان → طبق سیاست لغو (سهل‌گیرانه، متعادل، سخت‌گیرانه)
          </li>
          <li>عدم مراجعه در تاریخ رزرو → عدم استرداد وجه</li>
        </ul>

        <h3 className="font-bold mb-1">لغو توسط مهمان</h3>
        <p className="leading-7 mb-4">
          بسته به مدل لغو و فاصلهٔ زمانی تا شروع اقامت، بین ۰٪ تا ۱۰۰٪ مبلغ
          به‌عنوان جریمه کسر می‌شود.
        </p>

        <h3 className="font-bold mb-1">لغو توسط میزبان</h3>
        <p className="leading-7">
          میزبان در شرایط عادی تا ۱ روز قبل از شروع اقامت می‌تواند بدون جریمه
          لغو کند؛ در بازه‌های کوتاه‌تر ۱۰٪ تا ۴۰٪ مبلغ رزرو به‌عنوان خسارت کسر
          می‌شود.
        </p>
      </>
    ),
  },
];

/* برای IntersectionObserver در Container */
export const SECTION_IDS = cards.map((c) => c.id);

function TermsContent({ activeSection }) {
  return (
    <article className="space-y-12">
      {cards.map((card, idx) => (
        <div
          key={card.id}
          id={card.id}
          className={`scroll-mt-28 transition-all duration-300 ${
            activeSection === card.id ? "rounded-3xl bg-primary-50/70 " : ""
          }`}
        >
          <TermsCard
            reverse={idx % 2 !== 0}
            title={card.title}
            body={card.body}
          />
        </div>
      ))}
    </article>
  );
}

export default TermsContent;
