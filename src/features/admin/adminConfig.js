import {
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  HomeModernIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import {
  createAdminHouse,
  createAdminTypeItem,
  createAdminUser,
  deleteAdminHouse,
  deleteAdminTypeItem,
  deleteAdminUser,
  getAdminOverview,
  listAdminHouses,
  listAdminPayments,
  listAdminReservations,
  listAdminTypeItems,
  listAdminUsers,
  updateAdminHouse,
  updateAdminReservation,
  updateAdminTypeItem,
  updateAdminUser,
} from "@/services/adminService";
import toPersianNumber from "@/utils/toPersianNumber";

export const tabs = [
  { key: "overview", label: "نمای کلی", icon: AdjustmentsHorizontalIcon },
  { key: "users", label: "کاربران", icon: UsersIcon },
  { key: "houses", label: "اقامتگاه‌ها", icon: HomeModernIcon },
  { key: "reservations", label: "رزروها", icon: CalendarDaysIcon },
  { key: "payments", label: "پرداخت‌ها", icon: CreditCardIcon },
  { key: "typeItems", label: "گزینه‌ها", icon: AdjustmentsHorizontalIcon },
];

const statusOptions = [
  { value: "draft", label: "پیش‌نویس" },
  { value: "pending", label: "در انتظار بررسی" },
  { value: "published", label: "منتشر شده" },
  { value: "rejected", label: "رد شده" },
];

const reservationStatusOptions = [
  { value: "pending", label: "در انتظار تایید" },
  { value: "accepted", label: "تایید شده" },
  { value: "paid", label: "پرداخت شده" },
  { value: "canceled", label: "لغو شده" },
  { value: "done", label: "انجام شده" },
];

const paymentStatusOptions = [
  { value: "created", label: "ایجاد شده" },
  { value: "success", label: "موفق" },
  { value: "failed", label: "ناموفق" },
  { value: "pending", label: "در انتظار بررسی" },
  { value: "refunded", label: "بازگشت وجه" },
];

const paymentMethodOptions = [
  { value: "sandbox_card", label: "پرداخت آزمایشی کارت" },
  { value: "sandbox_wallet", label: "پرداخت آزمایشی کیف پول" },
];

const typeGroups = [
  "area",
  "arrival",
  "coolingAndHeating",
  "houseView",
  "neighbour",
  "sanitaryFacilities",
  "structure",
  "houseFacilities",
  "roomFacilities",
  "airConditions",
  "geography",
  "privacy",
  "rules",
  "tip",
  "weekendHoliday",
];

export function booleanText(value) {
  return value ? "بله" : "خیر";
}

export function moneyText(value) {
  return value
    ? `${toPersianNumber(Number(value).toLocaleString("fa-IR"))} تومان`
    : "-";
}

export function valueOf(item, column) {
  const raw = item?.[column.key];
  return column.format ? column.format(raw, item) : raw ?? "-";
}

export function prepareInitial(config, item) {
  const output = {};
  config.fields.forEach((field) => {
    const source = field.source || field.key;
    const value = item?.[source];
    output[field.key] = field.type === "boolean" ? Boolean(value) : value ?? "";
  });
  return output;
}

export function cleanPayload(fields, form, isCreate) {
  const payload = {};
  fields.forEach((field) => {
    if (!isCreate && field.key === "password" && !form[field.key]) return;
    const value = form[field.key];
    if (value === "" || value === undefined) return;
    payload[field.key] = field.type === "number" ? Number(value) : value;
  });
  return payload;
}

export const configs = {
  users: {
    title: "کاربران",
    queryKey: "admin-users",
    idOf: (item) => item.id,
    canCreate: true,
    canDelete: true,
    list: listAdminUsers,
    create: createAdminUser,
    update: updateAdminUser,
    remove: deleteAdminUser,
    columns: [
      { key: "id", label: "شناسه" },
      { key: "name", label: "نام" },
      { key: "phone", label: "موبایل" },
      { key: "type", label: "نقش" },
      { key: "is_active", label: "فعال", format: booleanText },
      { key: "houses_count", label: "اقامتگاه" },
    ],
    fields: [
      { key: "username", label: "نام کاربری", type: "text", required: true },
      { key: "phone", label: "موبایل", type: "text" },
      { key: "first_name", label: "نام", type: "text" },
      { key: "last_name", label: "نام خانوادگی", type: "text" },
      { key: "email", label: "ایمیل", type: "email" },
      {
        key: "password",
        label: "رمز عبور جدید",
        type: "password",
        onlyCreateOptional: true,
      },
      { key: "is_vendor", label: "میزبان", type: "boolean" },
      { key: "is_staff", label: "مدیر", type: "boolean" },
      { key: "is_active", label: "فعال", type: "boolean" },
    ],
  },
  houses: {
    title: "اقامتگاه‌ها",
    queryKey: "admin-houses",
    idOf: (item) => item.uuid,
    canCreate: true,
    canDelete: true,
    list: listAdminHouses,
    create: createAdminHouse,
    update: updateAdminHouse,
    remove: deleteAdminHouse,
    filters: [
      {
        key: "status",
        label: "وضعیت",
        options: [{ value: "", label: "همه" }, ...statusOptions],
      },
    ],
    columns: [
      { key: "uuid", label: "کد" },
      { key: "name", label: "نام" },
      { key: "owner", label: "مالک", format: (value) => value?.name },
      { key: "status", label: "وضعیت" },
      { key: "city", label: "شهر", format: (value) => value?.name },
      { key: "normal_price", label: "قیمت", format: moneyText },
    ],
    fields: [
      { key: "name", label: "نام اقامتگاه", type: "text", required: true },
      { key: "owner_id", label: "شناسه مالک", type: "number", required: true },
      { key: "status", label: "وضعیت", type: "select", options: statusOptions },
      { key: "is_closed", label: "رزرو بسته است", type: "boolean" },
      { key: "city_id", label: "شناسه شهر", type: "number" },
      { key: "address", label: "آدرس", type: "textarea" },
      { key: "latitude", label: "عرض جغرافیایی", type: "number", step: "0.000001" },
      { key: "longitude", label: "طول جغرافیایی", type: "number", step: "0.000001" },
      { key: "capacity", label: "ظرفیت پایه", type: "number" },
      { key: "maximum_capacity", label: "حداکثر ظرفیت", type: "number" },
      { key: "structure", label: "نوع سازه", type: "text" },
      { key: "privacy", label: "حریم", type: "text" },
      { key: "tip", label: "تیپ", type: "text" },
      {
        key: "normal_price_input",
        label: "قیمت عادی",
        type: "number",
        source: "normal_price",
      },
    ],
  },
  reservations: {
    title: "رزروها",
    queryKey: "admin-reservations",
    idOf: (item) => item.uuid,
    canCreate: false,
    canDelete: false,
    list: listAdminReservations,
    update: updateAdminReservation,
    filters: [
      {
        key: "status",
        label: "وضعیت",
        options: [{ value: "", label: "همه" }, ...reservationStatusOptions],
      },
    ],
    columns: [
      { key: "uuid", label: "کد" },
      { key: "house", label: "اقامتگاه", format: (value) => value?.name },
      { key: "guest", label: "مهمان", format: (value) => value?.name },
      { key: "status_label", label: "وضعیت" },
      { key: "check_in", label: "ورود" },
      { key: "total_price", label: "مبلغ", format: moneyText },
    ],
    fields: [
      {
        key: "status",
        label: "وضعیت",
        type: "select",
        options: reservationStatusOptions,
      },
      { key: "check_in", label: "تاریخ ورود", type: "date" },
      { key: "check_out", label: "تاریخ خروج", type: "date" },
      { key: "num_guests", label: "تعداد مهمان", type: "number" },
      { key: "subtotal", label: "جمع جزء", type: "number" },
      { key: "service_fee", label: "کارمزد", type: "number" },
      { key: "discount", label: "تخفیف", type: "number" },
      { key: "total_price", label: "مبلغ نهایی", type: "number" },
      { key: "voucher_code", label: "کد تخفیف", type: "text" },
    ],
  },
  payments: {
    title: "پرداخت‌های آزمایشی",
    queryKey: "admin-payments",
    idOf: (item) => item.uuid,
    canCreate: false,
    canDelete: false,
    list: listAdminPayments,
    filters: [
      {
        key: "status",
        label: "وضعیت",
        options: [{ value: "", label: "همه" }, ...paymentStatusOptions],
      },
      {
        key: "method",
        label: "روش",
        options: [{ value: "", label: "همه" }, ...paymentMethodOptions],
      },
    ],
    columns: [
      { key: "tracking_code", label: "کد پیگیری" },
      {
        key: "reservation_uuid",
        label: "رزرو",
        format: (_value, item) => item?.reservation?.uuid,
      },
      {
        key: "reservation_house",
        label: "اقامتگاه",
        format: (_value, item) => item?.reservation?.house,
      },
      { key: "user", label: "کاربر", format: (value) => value?.name },
      { key: "status_label", label: "وضعیت" },
      { key: "method_label", label: "روش" },
      { key: "amount", label: "مبلغ", format: moneyText },
    ],
    fields: [],
  },
  typeItems: {
    title: "گزینه‌های پایه",
    queryKey: "admin-type-items",
    idOf: (item) => item.id,
    canCreate: true,
    canDelete: true,
    list: listAdminTypeItems,
    create: createAdminTypeItem,
    update: updateAdminTypeItem,
    remove: deleteAdminTypeItem,
    filters: [
      {
        key: "group",
        label: "گروه",
        options: [
          { value: "", label: "همه" },
          ...typeGroups.map((value) => ({ value, label: value })),
        ],
      },
    ],
    columns: [
      { key: "id", label: "شناسه" },
      { key: "group", label: "گروه" },
      { key: "key", label: "کلید" },
      { key: "title", label: "عنوان" },
      { key: "is_active", label: "فعال", format: booleanText },
      { key: "sort_order", label: "ترتیب" },
    ],
    fields: [
      {
        key: "group",
        label: "گروه",
        type: "select",
        options: typeGroups.map((value) => ({ value, label: value })),
        required: true,
      },
      { key: "key", label: "کلید", type: "text", required: true },
      { key: "title", label: "عنوان", type: "text", required: true },
      { key: "description", label: "توضیحات", type: "textarea" },
      { key: "icon", label: "آیکن / مسیر تصویر", type: "text" },
      { key: "is_active", label: "فعال", type: "boolean" },
      { key: "sort_order", label: "ترتیب", type: "number" },
    ],
  },
};

export { getAdminOverview };
