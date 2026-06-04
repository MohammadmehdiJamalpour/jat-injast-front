import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { useFetchWeekendOptions } from "../../../../services/fetchDataService";
import Card from "../../../../ui/Card";
import Input from "../../../../ui/Input";
import Loading from "../../../../ui/Loading";
import Select from "../../../../ui/Select";
import { fa } from "../../../../i18n/fa";
import { reportClientError } from "../../../../utils/reportClientError";

const copy = fa.dashboard.editHouse.reservationRuleForm;

const defaultMinimumStay = {
  all: "1",
  Saturday: "1",
  Sunday: "1",
  Monday: "1",
  Tuesday: "1",
  Wednesday: "1",
  Thursday: "1",
  Friday: "1",
};

const getFieldError = (errors, key) => {
  const value = errors?.[key];
  return Array.isArray(value) ? value.join("، ") : value;
};

const toWeekendOptions = (options = []) =>
  options.map((option) => ({
    value: option.key,
    label: option.label,
  }));

const getInitialFormData = (houseData) => ({
  short_term_booking_length:
    houseData?.reservation?.discount?.short_term?.minimum_length_stay ?? "",
  short_term_booking_discount:
    houseData?.reservation?.discount?.short_term?.discount ?? "",
  long_term_booking_length:
    houseData?.reservation?.discount?.long_term?.minimum_length_stay ?? "",
  long_term_booking_discount:
    houseData?.reservation?.discount?.long_term?.discount ?? "",
  minimum_length_stay: {
    ...defaultMinimumStay,
    ...(houseData?.reservation?.minimum_length_stay || {}),
  },
  enter_from: houseData?.reservation?.timing?.enter?.from ?? "14:00",
  enter_until: houseData?.reservation?.timing?.enter?.to ?? "23:00",
  discharge_time: houseData?.reservation?.timing?.leave ?? "12:00",
  capacity: houseData?.reservation?.capacity?.normal ?? "",
  maximum_capacity: houseData?.reservation?.capacity?.maximum ?? "",
  weekendType: houseData?.weekendType?.key ?? "",
});

const NumberInput = ({ name, label, value, onChange, error, placeholder, min, max }) => (
  <Input
    type="number"
    inputMode="numeric"
    name={name}
    label={label}
    value={value ?? ""}
    onChange={(event) => onChange(name, event.target.value)}
    placeholder={placeholder}
    error={error}
    min={min}
    max={max}
  />
);

const TimeInput = ({ name, label, value, onChange, error }) => (
  <Input
    type="time"
    name={name}
    label={label}
    value={value ?? ""}
    onChange={(event) => onChange(name, event.target.value)}
    error={error}
  />
);

const EditHouseReservationRules = forwardRef(
  ({ houseData, handleEditHouse, loadingHouse, refetchHouseData }, ref) => {
    const { data: weekendOptions = [], isLoading: loadingWeekendOptions } =
      useFetchWeekendOptions();
    const [formData, setFormData] = useState(getInitialFormData(houseData));
    const [isModified, setIsModified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const weekendSelectOptions = useMemo(
      () => toWeekendOptions(weekendOptions),
      [weekendOptions],
    );

    useEffect(() => {
      setFormData(getInitialFormData(houseData));
      setIsModified(false);
      setErrors({});
    }, [houseData]);

    const handleInputChange = (name, value) => {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
      setIsModified(true);
    };

    const handleMinimumStayChange = (day, value) => {
      setFormData((prevData) => ({
        ...prevData,
        minimum_length_stay: {
          ...prevData.minimum_length_stay,
          [day]: value,
        },
      }));
      setErrors((prevErrors) => ({ ...prevErrors, [`minimum_length_stay.${day}`]: null }));
      setIsModified(true);
    };

    const validateForm = () => {
      const validationErrors = {};

      if (!formData.enter_from) validationErrors.enter_from = [copy.validation.enterFrom];
      if (!formData.enter_until) validationErrors.enter_until = [copy.validation.enterUntil];
      if (!formData.discharge_time) {
        validationErrors.discharge_time = [copy.validation.dischargeTime];
      }
      if (!formData.capacity) validationErrors.capacity = [copy.validation.capacity];
      if (!formData.maximum_capacity) {
        validationErrors.maximum_capacity = [copy.validation.maximumCapacity];
      }
      if (!formData.weekendType) validationErrors.weekendType = [copy.validation.weekendType];

      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0;
    };

    const validateAndSubmit = async () => {
      if (!isModified) return true;

      setIsSubmitting(true);
      setErrors({});

      if (!validateForm()) {
        toast.error(copy.validationSummary);
        setIsSubmitting(false);
        return false;
      }

      try {
        await handleEditHouse(formData);
        await refetchHouseData?.();
        toast.success(copy.saveSuccess);
        setIsModified(false);
        return true;
      } catch (errorData) {
        reportClientError("edit-house-reservation-rules-save", errorData);
        if (errorData?.errors?.fields) setErrors(errorData.errors.fields);
        toast.error(errorData?.message || copy.saveError);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    };

    useImperativeHandle(ref, () => ({ validateAndSubmit }));

    if (loadingHouse || loadingWeekendOptions || isSubmitting) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loading message={copy.loading} />
        </div>
      );
    }

    return (
      <section className="space-y-5 p-4 text-right">
        <h2 className="text-xl font-black text-gray-950 dark:text-white">
          {copy.title}
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <NumberInput
            label={copy.shortStayNights}
            name="short_term_booking_length"
            value={formData.short_term_booking_length}
            onChange={handleInputChange}
            placeholder={copy.shortStayNightsPlaceholder}
            error={getFieldError(errors, "short_term_booking_length")}
            min="0"
          />

          <NumberInput
            label={copy.shortStayDiscount}
            name="short_term_booking_discount"
            value={formData.short_term_booking_discount}
            onChange={handleInputChange}
            placeholder={copy.discountPlaceholder}
            error={getFieldError(errors, "short_term_booking_discount")}
            min="0"
            max="100"
          />

          <NumberInput
            label={copy.longStayNights}
            name="long_term_booking_length"
            value={formData.long_term_booking_length}
            onChange={handleInputChange}
            placeholder={copy.longStayNightsPlaceholder}
            error={getFieldError(errors, "long_term_booking_length")}
            min="0"
          />

          <NumberInput
            label={copy.longStayDiscount}
            name="long_term_booking_discount"
            value={formData.long_term_booking_discount}
            onChange={handleInputChange}
            placeholder={copy.discountPlaceholder}
            error={getFieldError(errors, "long_term_booking_discount")}
            min="0"
            max="100"
          />

          <TimeInput
            label={copy.enterFrom}
            name="enter_from"
            value={formData.enter_from}
            onChange={handleInputChange}
            error={getFieldError(errors, "enter_from")}
          />

          <TimeInput
            label={copy.enterUntil}
            name="enter_until"
            value={formData.enter_until}
            onChange={handleInputChange}
            error={getFieldError(errors, "enter_until")}
          />

          <TimeInput
            label={copy.dischargeTime}
            name="discharge_time"
            value={formData.discharge_time}
            onChange={handleInputChange}
            error={getFieldError(errors, "discharge_time")}
          />

          <NumberInput
            label={copy.capacity}
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            error={getFieldError(errors, "capacity")}
            min="1"
          />

          <NumberInput
            label={copy.maximumCapacity}
            name="maximum_capacity"
            value={formData.maximum_capacity}
            onChange={handleInputChange}
            error={getFieldError(errors, "maximum_capacity")}
            min="1"
          />

          <NumberInput
            label={copy.minimumStayAll}
            name="minimum_length_stay.all"
            value={formData.minimum_length_stay.all}
            onChange={(_name, value) => handleMinimumStayChange("all", value)}
            error={getFieldError(errors, "minimum_length_stay.all")}
            min="0"
          />

          <Select
            label={copy.weekendType}
            value={formData.weekendType}
            onChange={(event) => handleInputChange("weekendType", event.target.value)}
            options={weekendSelectOptions}
            error={getFieldError(errors, "weekendType")}
          />
        </div>

        <Card variant="bordered" padding="p-4" className="space-y-4">
          <div>
            <h3 className="text-base font-black text-gray-950 dark:text-white">
              {copy.minimumStayByWeekday}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {copy.weekdays.map((day) => (
              <NumberInput
                key={day.key}
                label={day.label}
                name={`minimum_length_stay.${day.key}`}
                value={formData.minimum_length_stay[day.key]}
                onChange={(_name, value) => handleMinimumStayChange(day.key, value)}
                placeholder={copy.weekdayPlaceholder(day.label)}
                error={getFieldError(errors, `minimum_length_stay.${day.key}`)}
                min="0"
              />
            ))}
          </div>
        </Card>
      </section>
    );
  },
);

EditHouseReservationRules.displayName = "EditHouseReservationRules";

export default EditHouseReservationRules;
