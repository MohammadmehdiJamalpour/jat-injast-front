import React from "react";

function HowBecomeHostContent({ selectedSection }) {
  const sections = {
    overview: (
      <div className="space-y-4 text-justify leading-7">
        <h2 className="text-xl font-semibold mb-2">
          چرا به جات اینجاست بپیوندید؟
        </h2>
        <p>
          با تبدیل خانه یا اقامتگاه خود به یک گزینه میزبانی در جات اینجاست، می‌توانید
          درآمدی پایدار کسب کرده و فرهنگ مهمان‌نوازی ایرانی را با مسافران سراسر
          کشور به اشتراک بگذارید.
        </p>
        <p>
          ما با ارائه ابزارهای حرفه‌ای، سیستم رزرو ایمن و پشتیبانی ۲۴ ساعته،
          مسیر شما را برای تبدیل شدن به یک میزبان موفق هموار کرده‌ایم.
        </p>
      </div>
    ),
    requirements: (
      <div className="space-y-4 text-justify leading-7">
        <h2 className="text-xl font-semibold mb-2">شرایط لازم برای میزبانی</h2>
        <ul className="list-disc pr-5 space-y-2">
          <li>مالکیت یا اختیار قانونی برای اجاره اقامتگاه.</li>
          <li>ارائه مدارک شناسایی معتبر.</li>
          <li>رعایت استانداردهای بهداشتی و ایمنی.</li>
          <li>دسترسی به اینترنت برای مدیریت رزروها.</li>
        </ul>
      </div>
    ),
    steps: (
      <div className="space-y-4 text-justify leading-7">
        <h2 className="text-xl font-semibold mb-2">مراحل ثبت اقامتگاه</h2>
        <ol className="list-decimal pr-5 space-y-2">
          <li>ایجاد حساب کاربری یا ورود به حساب موجود.</li>
          <li>تکمیل فرم اطلاعات ملک و بارگذاری تصاویر باکیفیت.</li>
          <li>تعیین قیمت، قوانین اقامت و تقویم دسترس‌پذیری.</li>
          <li>ارسال برای بررسی و تایید تیم جات اینجاست.</li>
        </ol>
      </div>
    ),
    fees: (
      <div className="space-y-4 text-justify leading-7">
        <h2 className="text-xl font-semibold mb-2">کارمزد و تسویه حساب</h2>
        <p>
          جات اینجاست بابت هر رزرو موفق **۱۰٪** کارمزد از مبلغ کل میهمان دریافت
          می‌کند. مبلغ باقی‌مانده حداکثر ۴۸ ساعت پس از ورود میهمان، به حساب
          بانکی شما واریز می‌شود.
        </p>
      </div>
    ),
    support: (
      <div className="space-y-4 text-justify leading-7">
        <h2 className="text-xl font-semibold mb-2">پشتیبانی میزبان</h2>
        <p>
          تیم پشتیبانی ما ۲۴ ساعته در تمام روزهای هفته از طریق تلفن، چت آنلاین و
          ایمیل پاسخگوی سوالات شماست.
        </p>
        <ul className="list-disc pr-5 space-y-2">
          <li>تلفن: ۰۲۱‑۹۱۲۳۴۵۶۷</li>
          <li>ایمیل: host-support@jat-injast.test</li>
          <li>
            راهنمای جامع میزبان در{" "}
            <a href="/host-guide" className="text-primary-600 hover:underline">
              مرکز راهنما
            </a>
          </li>
        </ul>
      </div>
    ),
  };

  return <div>{sections[selectedSection] || sections.overview}</div>;
}

export default HowBecomeHostContent;
