export const routeModes = {
  home: {
    path: "/",
    generation: "static route shell + CSR island",
    reason: "رزرو اقامتگاه در سراسر ایران با جستجو، مقایسه و مدیریت آسان سفر.",
  },
  search: {
    path: "/search",
    generation: "static route shell + CSR island",
    reason: "جستجوی اقامتگاه بر اساس مقصد، تاریخ، ظرفیت و امکانات.",
  },
  house: {
    path: "/house/[uuid]",
    generation: "dynamic route + CSR island",
    reason: "جزئیات اقامتگاه، قوانین، امکانات و مسیر رزرو.",
  },
  dashboard: {
    path: "/dashboard",
    generation: "dynamic route + CSR island",
    reason: "مدیریت رزروها، اقامتگاه‌ها، پیام‌ها و کیف پول.",
  },
  adminPanel: {
    path: "/admin-panel",
    generation: "static route shell + CSR island",
    reason: "مدیریت کاربران، اقامتگاه‌ها، رزروها و پرداخت‌ها.",
  },
  editHouse: {
    path: "/dashboard/edit-house/[uuid]",
    generation: "dynamic route + CSR island",
    reason: "ویرایش اطلاعات، تصاویر، قیمت‌گذاری و تقویم اقامتگاه.",
  },
  login: {
    path: "/login",
    generation: "static route shell + CSR island",
    reason: "ورود به حساب کاربری جات اینجاست.",
  },
  staticContent: {
    paths: ["/about", "/how-become-host", "/terms-of-service"],
    generation: "static route shell + CSR island",
    reason: "اطلاعات رسمی جات اینجاست برای کاربران و میزبان‌ها.",
  },
};
