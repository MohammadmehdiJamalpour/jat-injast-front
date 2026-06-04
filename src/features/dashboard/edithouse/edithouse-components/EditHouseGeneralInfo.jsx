import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import clsx from "clsx";
import {
  useFetchHouseFloors,
  useFetchPrivacyOptions,
} from "../../../../services/fetchDataService";
import Card from "../../../../ui/Card";
import Input from "../../../../ui/Input";
import Loading from "../../../../ui/Loading";
import Select from "../../../../ui/Select";
import Textarea from "../../../../ui/Textarea";
import { fa } from "../../../../i18n/fa";
import { reportClientError } from "../../../../utils/reportClientError";

const copy = fa.dashboard.editHouse.generalInfoForm;

const initialFormData = {
  name: "",
  land_size: "",
  structure_size: "",
  number_stairs: "",
  description: "",
  tip: "",
  privacy: "",
  rentType: "",
  price_handle_by: "PerNight",
  ownership: "",
};

const ownershipOptions = Object.entries(copy.ownershipOptions).map(([value, label]) => ({
  value,
  label,
}));

const rentTypeOptions = Object.entries(copy.rentTypeOptions).map(([value, label]) => ({
  value,
  label,
}));

const priceHandleOptions = Object.entries(copy.priceHandleOptions).map(([value, label]) => ({
  value,
  label,
}));

const getFieldError = (errors, key) => {
  const value = errors?.[key];
  return Array.isArray(value) ? value.join("، ") : value;
};

const toSelectOptions = (options = []) =>
  options.map((option) => ({
    value: option.key,
    label: option.label,
  }));

const getInitialFormData = (houseData) => {
  if (!houseData) return initialFormData;

  return {
    name: houseData.name || "",
    land_size: houseData.structure?.land_size || "",
    structure_size: houseData.structure?.size || "",
    number_stairs: houseData.structure?.number_stairs || "",
    description: houseData.description || "",
    tip: houseData.tip?.key || "",
    privacy: houseData.privacy?.key || "",
    rentType: houseData.structure?.can_rent_room
      ? houseData.is_rent_room
        ? "Rooms"
        : "House"
      : "House",
    price_handle_by: houseData.price_handle_by?.key || "PerNight",
    ownership: houseData.ownership || "",
  };
};

const OptionButtons = ({ label, options, value, onChange, error }) => (
  <div className="space-y-2 text-right">
    <p className="text-sm font-bold text-gray-800 dark:text-sky-50">{label}</p>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={clsx(
              "btn-press rounded-full border px-4 py-2 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:focus-visible:ring-primary-200",
              selected
                ? "border-primary-action bg-primary-action text-white"
                : "border-primary-100 bg-white text-gray-700 hover:border-primary-200 hover:bg-primary-50 dark:border-primary-400/25 dark:bg-slate-950/45 dark:text-sky-50 dark:hover:bg-primary-500/15",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
    {error && <p className="text-xs text-red-600 dark:text-red-200">{error}</p>}
  </div>
);

const EditHouseGeneralInfo = forwardRef(
  ({ houseData, loadingHouse, handleEditHouse, houseId }, ref) => {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isModified, setIsModified] = useState(false);

    const { data: houseFloorOptions = [], isLoading: loadingHouseFloors } =
      useFetchHouseFloors();
    const { data: privacyOptions = [], isLoading: loadingPrivacyOptions } =
      useFetchPrivacyOptions();

    const houseFloorSelectOptions = useMemo(
      () => toSelectOptions(houseFloorOptions),
      [houseFloorOptions],
    );
    const privacySelectOptions = useMemo(
      () => toSelectOptions(privacyOptions),
      [privacyOptions],
    );

    useEffect(() => {
      setFormData(getInitialFormData(houseData));
      setErrors({});
      setIsModified(false);
    }, [houseData]);

    const handleInputChange = (name, value) => {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      setIsModified(true);
    };

    const validateAndSubmit = async () => {
      if (!isModified) return true;

      setErrors({});

      if (!houseId) {
        toast.error(copy.missingHouseId);
        reportClientError("edit-house-general-info-missing-house-id");
        return false;
      }

      try {
        await handleEditHouse(formData);
        toast.success(copy.saveSuccess);
        setIsModified(false);
        return true;
      } catch (errorData) {
        reportClientError("edit-house-general-info-save", errorData);
        if (errorData?.errors?.fields) setErrors(errorData.errors.fields);
        toast.error(errorData?.message || copy.saveError);
        return false;
      }
    };

    useImperativeHandle(ref, () => ({ validateAndSubmit }));

    if (loadingHouse || loadingHouseFloors || loadingPrivacyOptions) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loading message={copy.loading} />
        </div>
      );
    }

    return (
      <Card variant="surface" padding="p-4" className="bg-transparent shadow-none dark:bg-transparent">
        <form className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Input
            label={copy.name}
            name="name"
            value={formData.name}
            onChange={(event) => handleInputChange("name", event.target.value)}
            placeholder={copy.namePlaceholder}
            error={getFieldError(errors, "name")}
          />

          <Input
            label={copy.landSize}
            name="land_size"
            value={formData.land_size}
            onChange={(event) => handleInputChange("land_size", event.target.value)}
            placeholder={copy.landSizePlaceholder}
            error={getFieldError(errors, "land_size")}
            inputMode="numeric"
          />

          <Input
            label={copy.structureSize}
            name="structure_size"
            value={formData.structure_size}
            onChange={(event) => handleInputChange("structure_size", event.target.value)}
            placeholder={copy.structureSizePlaceholder}
            error={getFieldError(errors, "structure_size")}
            inputMode="numeric"
          />

          <Input
            label={copy.stairs}
            name="number_stairs"
            value={formData.number_stairs}
            onChange={(event) => handleInputChange("number_stairs", event.target.value)}
            placeholder={copy.stairsPlaceholder}
            error={getFieldError(errors, "number_stairs")}
            inputMode="numeric"
          />

          <Select
            label={copy.structureType}
            value={formData.tip}
            onChange={(event) => handleInputChange("tip", event.target.value)}
            options={houseFloorSelectOptions}
            error={getFieldError(errors, "tip")}
          />

          <Select
            label={copy.privacy}
            value={formData.privacy}
            onChange={(event) => handleInputChange("privacy", event.target.value)}
            options={privacySelectOptions}
            error={getFieldError(errors, "privacy")}
          />

          <Select
            label={copy.ownership}
            value={formData.ownership}
            onChange={(event) => handleInputChange("ownership", event.target.value)}
            options={ownershipOptions}
            error={getFieldError(errors, "ownership")}
          />

          <div className="hidden lg:block" />

          <Textarea
            label={copy.description}
            name="description"
            value={formData.description}
            onChange={(event) => handleInputChange("description", event.target.value)}
            placeholder={copy.descriptionPlaceholder}
            error={getFieldError(errors, "description")}
            className="lg:col-span-2"
            rows={5}
          />

          <div className="lg:col-span-2">
            <OptionButtons
              label={copy.priceBasis}
              options={priceHandleOptions}
              value={formData.price_handle_by}
              onChange={(value) => handleInputChange("price_handle_by", value)}
              error={getFieldError(errors, "price_handle_by")}
            />
          </div>

          {houseData?.structure?.can_rent_room && (
            <div className="lg:col-span-2">
              <OptionButtons
                label={copy.rentBasis}
                options={rentTypeOptions}
                value={formData.rentType}
                onChange={(value) => handleInputChange("rentType", value)}
                error={getFieldError(errors, "rentType")}
              />
            </div>
          )}
        </form>
      </Card>
    );
  },
);

EditHouseGeneralInfo.displayName = "EditHouseGeneralInfo";

export default EditHouseGeneralInfo;
