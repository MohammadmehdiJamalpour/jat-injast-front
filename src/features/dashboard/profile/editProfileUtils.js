import {
  getBirthdayInitialMonth,
  getTodayJalali,
  gregorianIsoToJalaliDate,
} from "../../../ui/date-picker/jalaliDateUtils";

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

export const profileFieldCopy = {
  birthDateTitle: "تاریخ تولد",
  birthDateHelper: "تاریخ را از تقویم شمسی انتخاب کنید.",
  birthDatePlaceholder: "انتخاب تاریخ تولد",
  avatarTitle: "عکس پروفایل",
  avatarHelper: "تصویر مربع و واضح نتیجه بهتری دارد.",
  avatarAction: "انتخاب تصویر جدید",
};

export function gregorianToJalaliDate(gregorianDate) {
  return gregorianIsoToJalaliDate(gregorianDate);
}

export function getBirthdayPickerConfig() {
  const today = getTodayJalali();

  return {
    minDate: "1300-01-01",
    maxDate: today.iso,
    initialMonth: getBirthdayInitialMonth(),
    yearRange: { start: 1300, end: today.jy },
  };
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
    birthDate: birthDate || null,
    gender: normalizeGender(user?.sex),
    secondPhone: user?.second_phone || "",
    bio: user?.bio || "",
    avatar: null,
  };
}
