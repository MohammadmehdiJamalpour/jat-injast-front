import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import clsx from "clsx";
import { CheckIcon } from "@heroicons/react/24/solid";
import {
  useFetchHouseViews,
  useFetchNeighbours,
  useFetchRoutes,
  useFetchTextures,
} from "../../../../services/fetchDataService";
import Card from "../../../../ui/Card";
import Loading from "../../../../ui/Loading";
import Select from "../../../../ui/Select";
import Textarea from "../../../../ui/Textarea";
import { fa } from "../../../../i18n/fa";
import { reportClientError } from "../../../../utils/reportClientError";

const copy = fa.dashboard.editHouse.environmentInfoForm;

const initialFormData = {
  selectedTextures: [],
  selectedViews: [],
  selectedNeighbour: "",
  selectedRoutes: [],
  accessMethod: "",
  viewDescription: "",
};

const toSelectOptions = (options = []) =>
  options.map((option) => ({
    value: option.key,
    label: option.label,
  }));

const getFieldError = (errors, key) => {
  const value = errors?.[key];
  return Array.isArray(value) ? value.join("، ") : value;
};

const getInitialFormData = (houseData) => {
  if (!houseData) return initialFormData;

  return {
    selectedTextures: houseData.areas?.map((area) => area.key) || [],
    selectedViews: houseData.views?.types?.map((view) => view.key) || [],
    selectedNeighbour: houseData.neighbour?.key || "",
    selectedRoutes: houseData.arrivals?.types?.map((route) => route.key) || [],
    accessMethod: houseData.arrivals?.description || "",
    viewDescription: houseData.views?.description || "",
  };
};

const OptionCard = ({ option, selected, onToggle }) => (
  <Card
    role="checkbox"
    aria-checked={selected}
    tabIndex={0}
    variant="interactive"
    padding="p-3"
    className={clsx(
      "cursor-pointer transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:focus-visible:ring-primary-200",
      selected && "border-primary-400 bg-primary-50/80 dark:border-primary-300 dark:bg-primary-500/15",
    )}
    onClick={() => onToggle(option.key)}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onToggle(option.key);
      }
    }}
  >
    <div className="flex items-center justify-between gap-3">
      <span className="flex min-w-0 items-center gap-2">
        {option.icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-500/15">
            <img src={option.icon} alt="" className="h-5 w-5 object-contain" />
          </span>
        )}
        <span className="truncate text-sm font-bold text-gray-950 dark:text-white">
          {option.label}
        </span>
      </span>

      <span
        className={clsx(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition",
          selected
            ? "border-primary-action bg-primary-action text-white"
            : "border-primary-200 bg-white text-transparent dark:border-primary-400/30 dark:bg-slate-950",
        )}
      >
        <CheckIcon className="h-4 w-4" />
      </span>
    </div>
  </Card>
);

const OptionGrid = ({ title, options, selectedValues, onToggle, error }) => (
  <div className="space-y-3">
    <div>
      <h3 className="text-base font-black text-gray-950 dark:text-white">
        {title}
      </h3>
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-200">{error}</p>}
    </div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {options.map((option) => (
        <OptionCard
          key={option.key}
          option={option}
          selected={selectedValues.includes(option.key)}
          onToggle={onToggle}
        />
      ))}
    </div>
  </div>
);

const EditHouseEnvironmentDetails = forwardRef(
  ({ houseData, loadingHouse, handleEditHouse, houseId }, ref) => {
    const { data: textureOptions = [], isLoading: loadingTextures } =
      useFetchTextures();
    const { data: viewOptions = [], isLoading: loadingViews } =
      useFetchHouseViews();
    const { data: neighbourOptions = [], isLoading: loadingNeighbours } =
      useFetchNeighbours();
    const { data: routeOptions = [], isLoading: loadingRoutes } =
      useFetchRoutes();

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isModified, setIsModified] = useState(false);

    const neighbourSelectOptions = useMemo(
      () => toSelectOptions(neighbourOptions),
      [neighbourOptions],
    );

    useEffect(() => {
      setFormData(getInitialFormData(houseData));
      setErrors({});
      setIsModified(false);
    }, [houseData]);

    const toggleOption = (key, field) => {
      setFormData((prevFormData) => {
        const selectedValues = prevFormData[field] || [];
        const isSelected = selectedValues.includes(key);
        return {
          ...prevFormData,
          [field]: isSelected
            ? selectedValues.filter((item) => item !== key)
            : [...selectedValues, key],
        };
      });
      setIsModified(true);
    };

    const handleInputChange = (field, value) => {
      setFormData((prevFormData) => ({ ...prevFormData, [field]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, [field]: null }));
      setIsModified(true);
    };

    const validateAndSubmit = async () => {
      if (!isModified) return true;

      setErrors({});

      if (!houseId) {
        toast.error(copy.missingHouseId);
        reportClientError("edit-house-environment-missing-house-id");
        return false;
      }

      try {
        await handleEditHouse({
          areas: formData.selectedTextures,
          views: formData.selectedViews,
          neighbour: formData.selectedNeighbour,
          arrivals: formData.selectedRoutes,
          arrival_description: formData.accessMethod,
          view_description: formData.viewDescription,
        });
        toast.success(copy.saveSuccess);
        setIsModified(false);
        return true;
      } catch (errorData) {
        reportClientError("edit-house-environment-save", errorData);
        if (errorData?.errors?.fields) setErrors(errorData.errors.fields);
        toast.error(errorData?.message || copy.saveError);
        return false;
      }
    };

    useImperativeHandle(ref, () => ({ validateAndSubmit }));

    if (
      loadingHouse ||
      loadingTextures ||
      loadingViews ||
      loadingNeighbours ||
      loadingRoutes
    ) {
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

        <OptionGrid
          title={copy.texture}
          options={textureOptions}
          selectedValues={formData.selectedTextures}
          onToggle={(key) => toggleOption(key, "selectedTextures")}
          error={getFieldError(errors, "areas")}
        />

        <OptionGrid
          title={copy.views}
          options={viewOptions}
          selectedValues={formData.selectedViews}
          onToggle={(key) => toggleOption(key, "selectedViews")}
          error={getFieldError(errors, "views")}
        />

        <Textarea
          label={copy.viewDescription}
          name="viewDescription"
          value={formData.viewDescription}
          onChange={(event) => handleInputChange("viewDescription", event.target.value)}
          placeholder={copy.viewDescriptionPlaceholder}
          error={getFieldError(errors, "view_description")}
        />

        <Select
          label={copy.neighbour}
          value={formData.selectedNeighbour}
          onChange={(event) => handleInputChange("selectedNeighbour", event.target.value)}
          options={neighbourSelectOptions}
          error={getFieldError(errors, "neighbour")}
        />

        <OptionGrid
          title={copy.routes}
          options={routeOptions}
          selectedValues={formData.selectedRoutes}
          onToggle={(key) => toggleOption(key, "selectedRoutes")}
          error={getFieldError(errors, "arrivals")}
        />

        <Textarea
          label={copy.accessMethod}
          name="accessMethod"
          value={formData.accessMethod}
          onChange={(event) => handleInputChange("accessMethod", event.target.value)}
          placeholder={copy.accessMethodPlaceholder}
          error={getFieldError(errors, "arrival_description")}
        />
      </section>
    );
  },
);

EditHouseEnvironmentDetails.displayName = "EditHouseEnvironmentDetails";

export default EditHouseEnvironmentDetails;
