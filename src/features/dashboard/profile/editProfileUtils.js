import jalaali from "jalaali-js";

export const DEFAULT_GENDER = "Male";

export const genderOptions = [
  { value: "Male", label: "مرد" },
  { value: "Female", label: "زن" },
  { value: "Other", label: "دیگر" },
];

const genderLookup = {
  Male: "Male",
  مرد: "Male",
  Female: "Female",
  زن: "Female",
  Other: "Other",
  دیگر: "Other",
};

export const birthDateFields = [
  { name: "birthDay", label: "روز", maxLength: 2 },
  { name: "birthMonth", label: "ماه", maxLength: 2 },
  { name: "birthYear", label: "سال", maxLength: 4 },
];

export const profileFieldCopy = {
  birthDateTitle: "تاریخ تولد",
  birthDateHelper: "تاریخ را به تقویم شمسی وارد کنید.",
  avatarTitle: "عکس پروفایل",
  avatarHelper: "تصویر مربع و واضح نتیجه بهتری دارد.",
  avatarAction: "انتخاب تصویر جدید",
};

export function gregorianToPersian(gregorianDate) {
  if (!gregorianDate) return { year: "", month: "", day: "" };

  const dateWithoutTime = gregorianDate.split("T")[0];
  const [year, month, day] = dateWithoutTime.split("-").map(Number);
  if (!year || !month || !day) return { year: "", month: "", day: "" };

  const persianDate = jalaali.toJalaali(year, month, day);
  return {
    year: String(persianDate.jy),
    month: String(persianDate.jm).padStart(2, "0"),
    day: String(persianDate.jd).padStart(2, "0"),
  };
}

export function persianToGregorian(year, month, day) {
  if (!year || !month || !day) return "";

  const gregorianDate = jalaali.toGregorian(
    Number(year),
    Number(month),
    Number(day),
  );

  return `${gregorianDate.gy}-${String(gregorianDate.gm).padStart(2, "0")}-${String(gregorianDate.gd).padStart(2, "0")}`;
}

function normalizeGender(sex) {
  const raw = sex?.value || sex?.label || sex || DEFAULT_GENDER;
  return genderLookup[raw] || DEFAULT_GENDER;
}

export function makeInitialFormData(user, birthDate) {
  return {
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    nationalCode: user?.national_code || "",
    email: user?.email || "",
    province: user?.city?.province?.id || "",
    city: user?.city?.id || "",
    birthDay: birthDate.day,
    birthMonth: birthDate.month,
    birthYear: birthDate.year,
    gender: normalizeGender(user?.sex),
    secondPhone: user?.second_phone || "",
    bio: user?.bio || "",
    avatar: null,
  };
}
