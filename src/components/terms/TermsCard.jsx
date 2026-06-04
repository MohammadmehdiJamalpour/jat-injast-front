import React from "react";
const becomeHost = "/become-host.webp";

/**
 * کارت دو ستونه برای نمایش عنوان + محتوای دلخواه (body) و تصویر ثابت.
 * • در موبایل ستونی، از ≥lg به بعد دو ستونه
 * • اگر propِ reverse=true باشد تصویر و متن جابه‌جا می‌شوند.
 */
const TermsCard = ({ reverse = false, title, body }) => (
  <section
    dir="rtl"
    className={`mx-auto mb-10 rounded-3xl overflow-hidden shadow transition-transform duration-500  lg:flex 
 
    `}
  >
    {/* متن */}
    <div className="flex flex-col gap-6 p-6 lg:w-3/5">
      <h2 className="text-2xl md:text-3xl font-bold text-primary-800">
        {title}
      </h2>
      {/* محتوای بدنه */}
      <div className="text-primary-800 leading-relaxed">{body}</div>
    </div>

    {/* تصویر */}
    <div className="w-full lg:w-2/5">
      <img
        src={becomeHost}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  </section>
);

export default TermsCard;
