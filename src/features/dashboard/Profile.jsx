
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Dialog } from '@headlessui/react';
import {
  AtSymbolIcon,
  CakeIcon,
  IdentificationIcon,
  InformationCircleIcon,
  MapPinIcon,
  PhoneIcon,
  UserCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Loading from '../../ui/Loading.jsx';
import { becomeVendor, getUser } from '../../services/userService';
import toPersianNumber from '../../utils/toPersianNumber';
import dayjs from 'dayjs';
import jalaliday from 'jalaliday';

dayjs.extend(jalaliday);

const Profile = ({ user, onUpdateUser }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const { mutate, isLoading: isBecomingVendor } = useMutation(becomeVendor, {
    onSuccess: async () => {
      try {
        const newUserData = await getUser();
        onUpdateUser(newUserData);
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'خطایی رخ داده است');
      }
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || 'خطایی رخ داده است');
    },
  });

  const handleBecomeVendorClick = () => {
    setErrorMessage(null);
    setIsConfirmationOpen(true);
  };

  const confirmBecomeVendor = () => {
    setIsConfirmationOpen(false);
    mutate();
  };

  const formatPersianDate = (date) => {
    if (!date) return 'ثبت نشده';
    const jalaliDate = dayjs(date).calendar('jalali');
    return toPersianNumber(jalaliDate.locale('fa').format('DD MMMM YYYY'));
  };

  const emptyValue = 'ثبت نشده';
  const displayText = (value) => value || emptyValue;
  const displayNumber = (value) => (value ? toPersianNumber(value) : emptyValue);
  const cityName = user?.city?.name || emptyValue;
  const sexLabel = user?.sex?.label || emptyValue;
  const birthDate = formatPersianDate(user?.birth_date);
  const isVendor = user?.type === 'Vendor';
  const isAdmin = user?.type === 'Admin';
  const roleLabel = isAdmin ? 'مدیر' : isVendor ? 'میزبان' : 'مهمان';
  const completionItems = [
    user?.name,
    user?.phone,
    user?.email,
    user?.national_code,
    user?.city?.name,
    user?.birth_date,
  ];
  const completedCount = completionItems.filter(Boolean).length;
  const completionPercent = Math.round((completedCount / completionItems.length) * 100);
  const profileItems = [
    { label: 'نام و نام خانوادگی', value: displayText(user?.name), icon: UserIcon },
    { label: 'شماره تلفن همراه', value: displayNumber(user?.phone), icon: PhoneIcon },
    { label: 'ایمیل', value: displayText(user?.email), icon: AtSymbolIcon },
    { label: 'کد ملی', value: displayNumber(user?.national_code), icon: IdentificationIcon },
    { label: 'شهر', value: cityName, icon: MapPinIcon },
    { label: 'شماره همراه دوم', value: displayNumber(user?.second_phone), icon: PhoneIcon },
    { label: 'تاریخ تولد', value: birthDate, icon: CakeIcon },
    { label: 'جنسیت', value: sexLabel, icon: UserCircleIcon },
  ];

  return (
    <div dir="rtl" className="w-full rounded-3xl border border-primary-100 bg-white/85 p-4 shadow-sm shadow-primary-50/60 dark:border-slate-700 dark:bg-slate-900/80 dark:shadow-black/20 sm:p-5">
      <div className="mb-5 flex flex-col gap-3 border-b border-primary-100 pb-4 dark:border-slate-700 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-slate-950 dark:text-primary-200">
              <UserCircleIcon className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-950 dark:text-slate-100">اطلاعات شخصی</h2>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
                نمایش خلاصه و وضعیت تکمیل پروفایل
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-800 dark:bg-primary-900/35 dark:text-primary-100">
            نقش: {roleLabel}
          </span>
          <span className="rounded-full border border-primary-100 bg-white px-3 py-1 text-xs font-bold text-gray-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
            تکمیل پروفایل: {toPersianNumber(completionPercent)}٪
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {profileItems.map((item) => (
          <ProfileInfoCard key={item.label} {...item} />
        ))}
        <ProfileInfoCard
          label="درباره شما"
          value={displayText(user?.bio)}
          icon={InformationCircleIcon}
          className="sm:col-span-2 xl:col-span-3"
        />
      </div>

      {errorMessage && (
        <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          {errorMessage}
        </p>
      )}

      {!isVendor && !isAdmin && (
        <button
          onClick={handleBecomeVendorClick}
          className="btn-primary btn-press mt-5 max-w-36 text-sm"
          disabled={isBecomingVendor}
        >
          {isBecomingVendor ? <Loading size={20} /> : 'میزبان شوید'}
        </button>
      )}

      <Dialog open={isConfirmationOpen} onClose={() => setIsConfirmationOpen(false)} dir="rtl" className="relative z-50 text-right">
        <div className="fixed inset-0 bg-white/15 backdrop-blur-md dark:bg-white/5" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel dir="rtl" className="w-full max-w-md space-y-4 rounded-3xl border border-primary-100 bg-white p-6 text-right shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            <Dialog.Title className="text-lg font-bold">آیا از تبدیل شدن به میزبان مطمئن هستید؟</Dialog.Title>
            <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-slate-300">در صورت تایید، اطلاعات شما به عنوان میزبان در سیستم ثبت خواهد شد.</p>
            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                className="btn-secondary btn-press"
                onClick={() => setIsConfirmationOpen(false)}
                disabled={isBecomingVendor}
              >
                لغو
              </button>
              <button
                className="btn-primary btn-press"
                onClick={confirmBecomeVendor}
                disabled={isBecomingVendor}
              >
                {isBecomingVendor ? 'در حال ثبت...' : 'بله'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

const ProfileInfoCard = ({ label, value, icon: Icon, className = '' }) => (
  <div className={`group rounded-2xl border border-gray-100 bg-gray-50/70 px-3 py-3 transition hover:border-primary-100 hover:bg-primary-50/60 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-primary-400/40 dark:hover:bg-slate-800/70 ${className}`}>
    <div className="flex items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white text-primary-700 shadow-sm transition group-hover:bg-primary-600 group-hover:text-white dark:bg-slate-900 dark:text-primary-200 dark:group-hover:bg-primary-500">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <div className="text-xs font-medium text-gray-500 dark:text-slate-400">{label}</div>
        <div className="mt-1 break-words text-sm font-bold tabular-nums text-gray-900 dark:text-slate-100">
          {value}
        </div>
      </div>
    </div>
  </div>
);

export default Profile;
