import React from "react";

function AboutUsContent({ selectedSection }) {
  const sections = {
    overview: (
      <div className="space-y-4 text-justify leading-7">
        <h2 className="text-xl font-semibold mb-2">درباره جات اینجاست</h2>
        <p>
          «جات اینجاست» در گویش‌های محلی ایران به معنای «جای راحت و وسیع» است؛
          نامی که دقیقاً بازتاب هدف ماست. از سال ۱۳۹۸ با یک مأموریت ساده شروع
          کردیم: خلق فضایی دلپذیر که حس آرامش و امنیت را برای مهمانان به ارمغان
          ‌آورد. گرچه در دوران همه‌گیری کرونا فعالیت‌مان متوقف شد، اما در پاییز
          ۱۴۰۳ با انرژی تازه و خدمات نوین بازگشتیم.
        </p>
      </div>
    ),

    mission: (
      <div className="space-y-4 text-justify leading-7">
        <h2 className="text-xl font-semibold mb-2">ماموریت ما</h2>
        <p>
          ایجاد بستری شفاف، امن و کاربرپسند برای رزرو اقامتگاه‌های متنوع در
          سراسر ایران؛ جایی که کاربران بتوانند بدون دغدغه و با اطمینان،
          اقامتگاهی متناسب با نیازشان بیابند. ما متعهدیم به احترام و کیفیت برای
          کاربران، میزبانان و جامعه‌ای که در آن فعالیت می‌کنیم.
        </p>
      </div>
    ),

    vision: (
      <div className="space-y-4 text-justify leading-7">
        <h2 className="text-xl font-semibold mb-2">چشم‌انداز ما</h2>
        <p>
          تبدیل شدن به پیشروترین بستر اجاره اقامتگاه‌های موقت و میان‌مدت در
          ایران با بهره‌گیری از به‌روزترین فناوری‌ها و ارائه تجربه‌ای
          به‌یادماندنی برای مسافران، تا جایی که مقصد اول گردشگران داخلی باشیم.
        </p>
      </div>
    ),

    values: (
      <div className="space-y-4 text-justify leading-7">
        <h2 className="text-xl font-semibold mb-2">ارزش‌ها و تعهدات ما</h2>
        <ul className="list-disc pr-5 space-y-2">
          <li>اعتماد و شفافیت در همه تعاملات.</li>
          <li>حفظ امنیت و حریم خصوصی کاربران.</li>
          <li>پشتیبانی و راهنمایی مستمر برای مهمانان و میزبانان.</li>
          <li>نوآوری برای ارتقای مداوم تجربه کاربری.</li>
        </ul>
      </div>
    ),

    story: (
      <div className="space-y-4 text-justify leading-7">
        <h2 className="text-xl font-semibold mb-2">داستان ما</h2>
        <p>
          در سال ۱۳۹۸، جمعی از علاقه‌مندان به گردشگری و فناوری گرد‌هم آمدند تا
          پلتفرمی نوآورانه برای اجاره اقامتگاه راه‌اندازی کنند. با وجود چالش‌های
          فراوان، از جمله توقف ناگهانی در دوران کرونا، پاییز ۱۴۰۳ بازگشتیم و
          امروز آماده‌ایم خاطراتی به‌یادماندنی برای شما رقم بزنیم.
        </p>
      </div>
    ),

    benefits: (
      <div className="space-y-4 text-justify leading-7">
        <h2 className="text-xl font-semibold mb-2">
          مزایای استفاده از جات اینجاست
        </h2>
        <ul className="list-disc pr-5 space-y-2">
          <li>رزرو آسان و کاربرپسند در چند مرحله کوتاه.</li>
          <li>تنوع گسترده اقامتگاه: ویلا، سوئیت، بوم‌گردی و ...</li>
          <li>پشتیبانی ۲۴ ساعته در تمامی روزهای هفته.</li>
          <li>ضمانت کیفیت و امنیت مطابق توضیحات درج‌شده.</li>
        </ul>
      </div>
    ),

    testimonials: (
      <div className="space-y-4 text-justify leading-7">
        <h2 className="text-xl font-semibold mb-2">
          نظرات مشتریان و تجربیات کاربران
        </h2>
        <blockquote className="border-r-4 border-primary-400 pr-4 italic">
          «تجربه‌ای فوق‌العاده! جات اینجاست واقعاً در فراهم کردن اقامتگاه مناسب
          و راحت عملکرد عالی دارد.»
        </blockquote>
        <blockquote className="border-r-4 border-primary-400 pr-4 italic">
          «پشتیبانی ۲۴ ساعته باعث شد بدون هیچ نگرانی از اقامتم لذت ببرم.»
        </blockquote>
      </div>
    ),

    support: (
      <div className="space-y-4 text-justify leading-7">
        <h2 className="text-xl font-semibold mb-2">
          پشتیبانی و خدمات پس از فروش
        </h2>
        <p>
          تیم پشتیبانی ما به‌صورت ۲۴ ساعته در کنار شماست تا در تمام مراحل رزرو و
          اقامت راهنمایی‌تان کند و سفری بی‌دغدغه برایتان رقم بزند.
        </p>
      </div>
    ),

    future: (
      <div className="space-y-4 text-justify leading-7">
        <h2 className="text-xl font-semibold mb-2">
          پروژه‌های آینده و طرح‌های توسعه
        </h2>
        <p>
          برنامه‌ریزی برای افزودن قابلیت‌های جستجوی پیشرفته، توسعه تجربه‌های
          بوم‌گردی، و گسترش شبکه میزبانان به سراسر ایران در دستور کار ماست.
          همچنین به‌دنبال همکاری با صنعتگران محلی برای ارائه تجربه‌ای اصیل‌تر از
          فرهنگ ایران هستیم.
        </p>
      </div>
    ),

    contact: (
      <div className="space-y-4 text-justify leading-7">
        <h2 className="text-xl font-semibold mb-2">ارتباط با ما</h2>
        <ul className="list-disc pr-5 space-y-2">
          <li>ایمیل: info@jat-injast.test</li>
          <li>تلفن: ۰۲۱-۹۱۰۹۷۲۵۳</li>
          <li>
            شبکه‌های اجتماعی: ما را دنبال کنید تا از آخرین اخبار و پیشنهادها
            باخبر شوید.
          </li>
        </ul>
      </div>
    ),

    ceo: (
      <div className="space-y-4 text-justify leading-7">
        <h2 className="text-xl font-semibold mb-2">سخن مدیر عامل</h2>
        <p>
          «جات اینجاست برای من چیزی بیش از یک کسب‌وکار است؛ رؤیایی است که به
          زندگی شکل و معنا می‌دهد. از همان ابتدای تأسیس در سال ۱۳۹۸، آرزویمان
          این بود که هر کسی، از هر گوشه ایران، با چند کلیک ساده به فضایی راحت و
          امن دست پیدا کند؛ جایی که انگار به خانه خودش برگشته است. پس از تجربه
          تلخ توقف در دوران کرونا، اکنون با اراده‌ای قوی‌تر و خدمتی نوآورانه‌تر
          در کنار شما هستیم و هر روز به دنبال راه‌های تازه‌ای می‌گردیم تا اقامتی
          خاطره‌انگیز و بی‌دغدغه را برایتان فراهم کنیم. شما لایق بهترین‌ها
          هستید.»
        </p>
      </div>
    ),
  };

  return <div>{sections[selectedSection] || sections.overview}</div>;
}

export default AboutUsContent;
