// src/features/dashboard/EditProfile.jsx

import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { fa } from "../../i18n/fa";
import Loading from "../../ui/Loading";
import { editUser } from "../../services/userService";
import useFetchCities from "./useFetchCities";
import useFetchProvinces from "./useFetchProvinces";
import useUser from "./useUser";
import {
  AvatarField,
  BirthDateFields,
  ProfileInput,
  ProfileTextArea,
  SelectField,
} from "./profile/EditProfileFields";
import {
  EditProfileHeader,
  EditProfileSubmitBar,
} from "./profile/EditProfileLayout";
import {
  DEFAULT_GENDER,
  birthDateFields,
  genderOptions,
  gregorianToPersian,
  makeInitialFormData,
  persianToGregorian,
  profileFieldCopy,
} from "./profile/editProfileUtils";

function EditProfile({ user, onUpdateUser }) {
  const copy = fa.dashboard.profile;
  const { refetch } = useUser();
  const {
    data: provinces = [],
    isLoading: fetchProvincesLoading,
    error: fetchProvincesError,
  } = useFetchProvinces();

  const birthDate = useMemo(
    () => gregorianToPersian(user?.birth_date),
    [user?.birth_date],
  );

  const [formData, setFormData] = useState(() =>
    makeInitialFormData(user, birthDate),
  );
  const [fieldErrors, setFieldErrors] = useState({});

  const isVendor = user?.type === "Vendor";

  const {
    data: citiesData,
    isLoading: fetchCitiesLoading,
    error: fetchCitiesError,
  } = useFetchCities(formData.province);

  useEffect(() => {
    if (user) setFormData(makeInitialFormData(user, birthDate));
  }, [birthDate, user]);

  const provinceOptions = useMemo(
    () =>
      provinces.map((province) => ({
        value: province.id,
        label: province.name,
      })),
    [provinces],
  );

  const cityOptions = useMemo(() => {
    if (!formData.province) {
      return [{ value: "", label: copy.city.selectProvinceFirst, disabled: true }];
    }

    if (fetchCitiesLoading) {
      return [{ value: "", label: copy.city.loading, disabled: true }];
    }

    const cities = citiesData?.cities || citiesData || [];
    if (!cities.length) {
      return [{ value: "", label: copy.city.empty, disabled: true }];
    }

    return cities.map((city) => ({ value: city.id, label: city.name }));
  }, [citiesData, copy.city.empty, copy.city.loading, copy.city.selectProvinceFirst, fetchCitiesLoading, formData.province]);

  const selectedProvince = useMemo(
    () =>
      provinceOptions.find(
        (option) => String(option.value) === String(formData.province),
      ) || null,
    [formData.province, provinceOptions],
  );

  const selectedCity = useMemo(
    () =>
      cityOptions.find((option) => String(option.value) === String(formData.city)) ||
      null,
    [cityOptions, formData.city],
  );

  const selectedGender = useMemo(
    () =>
      genderOptions.find((option) => option.value === formData.gender) ||
      genderOptions[0],
    [formData.gender],
  );

  const { mutateAsync, isError, error, isLoading, isPending } = useMutation({
    mutationFn: editUser,
    onError: (mutationError) => {
      const response = mutationError?.response?.data;
      const serverErrors = response?.errors?.fields || {};
      setFieldErrors(serverErrors);
      toast.error(response?.message || copy.failure);
    },
    onSuccess: (data) => {
      onUpdateUser?.(data);
      refetch();
      toast.success(copy.success);
    },
  });

  const isSubmitting = isLoading || isPending;

  function updateField(name, value) {
    if (isVendor) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleInputChange(event) {
    updateField(event.target.name, event.target.value);
  }

  function handleProvinceChange(option) {
    if (option?.disabled) return;
    setFormData((prev) => ({
      ...prev,
      province: option?.value || "",
      city: "",
    }));
    setFieldErrors((prev) => ({
      ...prev,
      province_id: undefined,
      city_id: undefined,
    }));
  }

  function handleCityChange(option) {
    if (option?.disabled) return;
    updateField("city", option?.value || "");
    setFieldErrors((prev) => ({ ...prev, city_id: undefined }));
  }

  function handleGenderChange(option) {
    updateField("gender", option?.value || DEFAULT_GENDER);
    setFieldErrors((prev) => ({ ...prev, sex: undefined }));
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0] || null;
    if (!file || isVendor) return;
    setFormData((prev) => ({ ...prev, avatar: file }));
    setFieldErrors((prev) => ({ ...prev, avatar: undefined }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isVendor) return;

    const birthDateGregorian = persianToGregorian(
      formData.birthYear,
      formData.birthMonth,
      formData.birthDay,
    );

    const payload = new FormData();
    payload.append("_method", "PUT");
    payload.append("first_name", formData.firstName);
    payload.append("last_name", formData.lastName);
    payload.append("national_code", formData.nationalCode);
    payload.append("email", formData.email);
    payload.append("birth_date", birthDateGregorian);
    payload.append("second_phone", formData.secondPhone);
    payload.append("sex", formData.gender);
    payload.append("province_id", formData.province);
    payload.append("city_id", formData.city);
    payload.append("bio", formData.bio);

    if (formData.avatar) payload.append("avatar", formData.avatar);

    await mutateAsync(payload);
  }

  if (fetchProvincesLoading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (fetchProvincesError) {
    toast.error(copy.provinceLoadError);
    return null;
  }

  return (
    <section
      dir="rtl"
      className="rounded-3xl border border-primary-100 bg-white/85 p-4 shadow-sm shadow-primary-50/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/50 dark:shadow-black/20 sm:p-5 lg:p-6"
    >
      <EditProfileHeader copy={copy} isVendor={isVendor} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ProfileInput
            label="نام"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="نام خود را وارد کنید"
            disabled={isVendor}
            error={fieldErrors.first_name}
          />
          <ProfileInput
            label="نام خانوادگی"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="نام خانوادگی خود را وارد کنید"
            disabled={isVendor}
            error={fieldErrors.last_name}
          />
          <ProfileInput
            label="کد ملی"
            name="nationalCode"
            value={formData.nationalCode}
            onChange={handleInputChange}
            placeholder="مثلا ۰۰۱۲۳۴۵۶۷۸"
            disabled={isVendor}
            error={fieldErrors.national_code}
            inputMode="numeric"
          />
          <ProfileInput
            label="ایمیل"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="name@example.com"
            disabled={isVendor}
            error={fieldErrors.email}
            dir="ltr"
          />
          <SelectField
            label="استان"
            value={selectedProvince}
            options={provinceOptions}
            placeholder="انتخاب استان"
            onChange={handleProvinceChange}
            disabled={isVendor}
            error={fieldErrors.province_id}
          />
          <SelectField
            label="شهر"
            value={selectedCity}
            options={cityOptions}
            placeholder="انتخاب شهر"
            onChange={handleCityChange}
            disabled={isVendor || !formData.province || fetchCitiesLoading}
            error={fieldErrors.city_id || fetchCitiesError?.message}
          />
          <SelectField
            label="جنسیت"
            value={selectedGender}
            options={genderOptions}
            placeholder="انتخاب جنسیت"
            onChange={handleGenderChange}
            disabled={isVendor}
            error={fieldErrors.sex}
          />
          <ProfileInput
            label="شماره همراه دوم"
            name="secondPhone"
            value={formData.secondPhone}
            onChange={handleInputChange}
            placeholder="شماره دوم"
            disabled={isVendor}
            error={fieldErrors.second_phone}
            inputMode="tel"
            dir="ltr"
          />
        </div>

        <BirthDateFields
          formData={formData}
          onChange={updateField}
          disabled={isVendor}
          title={profileFieldCopy.birthDateTitle}
          helper={profileFieldCopy.birthDateHelper}
          fields={birthDateFields}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <AvatarField
            title={profileFieldCopy.avatarTitle}
            helper={profileFieldCopy.avatarHelper}
            actionLabel={profileFieldCopy.avatarAction}
            fileName={formData.avatar?.name}
            onChange={handleAvatarChange}
            disabled={isVendor}
            error={fieldErrors.avatar}
          />
          <ProfileTextArea
            label="درباره شما"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="چند جمله کوتاه درباره خودتان بنویسید."
            disabled={isVendor}
            error={fieldErrors.bio}
          />
        </div>

        <EditProfileSubmitBar
          copy={copy}
          error={error}
          isError={isError}
          isSubmitting={isSubmitting}
          isVendor={isVendor}
        />
      </form>
    </section>
  );
}

export default EditProfile;
