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
import { useFetchFacilities } from "../../../../services/fetchDataService";
import { editHouseFacilities } from "../../../../services/houseService";
import Card from "../../../../ui/Card";
import EmptyState from "../../../../ui/EmptyState";
import Input from "../../../../ui/Input";
import Loading from "../../../../ui/Loading";
import Textarea from "../../../../ui/Textarea";
import { fa } from "../../../../i18n/fa";
import { reportClientError } from "../../../../utils/reportClientError";

const copy = fa.dashboard.editHouse.mainFacilitiesForm;

const parseFieldValue = (value) => {
  if (typeof value !== "string") return value;
  const trimmedValue = value.trim();
  if (trimmedValue && !Number.isNaN(Number(trimmedValue))) return Number(trimmedValue);
  return value === "true" || value;
};

const getExistingFieldValue = (existingFacility, field) => {
  const existingField = existingFacility?.fields?.find(
    (item) => item.title.trim() === field.title.trim(),
  );

  if (!existingField) return field.type === "toggle" ? false : "";
  return existingField.value === "true" || existingField.value === true || existingField.value;
};

const buildInitialFacilities = (facilitiesData, houseFacilities = []) =>
  facilitiesData.reduce((acc, facility) => {
    const existingFacility = houseFacilities.find((item) => item.key === facility.key);
    acc[facility.key] = {
      checked: Boolean(existingFacility),
      fields: (facility.fields || []).reduce((fieldAcc, field) => {
        fieldAcc[field.title.trim()] = getExistingFieldValue(existingFacility, field);
        return fieldAcc;
      }, {}),
    };
    return acc;
  }, {});

const FacilitySwitch = ({ checked, label, icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center justify-between gap-3 text-right"
  >
    <span className="flex min-w-0 items-center gap-3">
      {icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-500/15">
          <img src={icon} alt="" className="h-6 w-6 object-contain" />
        </span>
      )}
      <span className="truncate text-base font-black text-gray-950 dark:text-white">
        {label}
      </span>
    </span>

    <span
      className={clsx(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition",
        checked
          ? "border-primary-action bg-primary-action text-white"
          : "border-primary-200 bg-white text-transparent dark:border-primary-400/30 dark:bg-slate-950",
      )}
    >
      <CheckIcon className="h-5 w-5" />
    </span>
  </button>
);

const FacilityField = ({ field, value, onChange }) => {
  const commonProps = {
    label: field.title,
    placeholder: field.placeholder,
  };

  if (field.type === "toggle") {
    return (
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="btn-press flex w-full items-center justify-between rounded-2xl border border-primary-100 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:border-primary-200 hover:bg-primary-50 dark:border-primary-400/25 dark:bg-slate-950/45 dark:text-sky-50 dark:hover:bg-primary-500/15"
      >
        <span>{field.title}</span>
        <span
          className={clsx(
            "flex h-6 w-11 items-center rounded-full p-1 transition",
            value ? "bg-primary-action" : "bg-gray-300 dark:bg-slate-700",
          )}
        >
          <span
            className={clsx(
              "h-4 w-4 rounded-full bg-white transition",
              value ? "translate-x-0" : "-translate-x-5",
            )}
          />
        </span>
      </button>
    );
  }

  if (field.type === "textarea") {
    return (
      <Textarea
        {...commonProps}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <Input
      {...commonProps}
      type={field.type === "number" ? "number" : "text"}
      inputMode={field.type === "number" ? "numeric" : undefined}
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

const FacilityItem = ({
  facility,
  selectedFacility,
  toggleFacility,
  handleInputChange,
}) => {
  const checked = Boolean(selectedFacility?.checked);

  return (
    <Card
      variant="interactive"
      padding="p-4"
      className={clsx(
        "space-y-4",
        checked && "border-primary-400 bg-primary-50/70 dark:border-primary-300 dark:bg-primary-500/15",
      )}
    >
      <FacilitySwitch
        checked={checked}
        label={facility.label}
        icon={facility.icon}
        onClick={() => toggleFacility(facility.key)}
      />

      {checked && Boolean(facility.fields?.length) && (
        <div className="grid grid-cols-1 gap-3 rounded-2xl bg-white/70 p-3 dark:bg-slate-950/35 md:grid-cols-2">
          {facility.fields.map((field) => {
            const fieldKey = field.title.trim();
            return (
              <FacilityField
                key={fieldKey}
                field={field}
                value={selectedFacility?.fields?.[fieldKey]}
                onChange={(value) => handleInputChange(facility.key, field.title, value)}
              />
            );
          })}
        </div>
      )}
    </Card>
  );
};

const EditHouseMainFacilities = forwardRef(
  ({ houseId, houseData, setHouseData, loadingHouse, refetchHouseData }, ref) => {
    const { data: facilitiesData = [], isLoading: loadingFacilities } =
      useFetchFacilities();
    const [selectedFacilities, setSelectedFacilities] = useState({});
    const [isModified, setIsModified] = useState(false);
    const [isRefetching, setIsRefetching] = useState(false);

    useEffect(() => {
      if (!facilitiesData.length) return;
      setSelectedFacilities(buildInitialFacilities(facilitiesData, houseData?.facilities));
      setIsModified(false);
    }, [houseData?.facilities, facilitiesData]);

    const visibleFacilities = useMemo(() => facilitiesData || [], [facilitiesData]);

    const toggleFacility = (key) => {
      setSelectedFacilities((prevSelected) => {
        const current = prevSelected[key] || { checked: false, fields: {} };
        return {
          ...prevSelected,
          [key]: {
            ...current,
            checked: !current.checked,
            fields: current.checked ? {} : current.fields,
          },
        };
      });
      setIsModified(true);
    };

    const handleInputChange = (facilityKey, fieldTitle, value) => {
      setSelectedFacilities((prevState) => ({
        ...prevState,
        [facilityKey]: {
          ...prevState[facilityKey],
          fields: {
            ...prevState[facilityKey]?.fields,
            [fieldTitle.trim()]: value,
          },
        },
      }));
      setIsModified(true);
    };

    const validateAndSubmit = async () => {
      if (!isModified) return true;

      setIsRefetching(true);

      try {
        const facilitiesDataToSend = Object.entries(selectedFacilities)
          .filter(([, facility]) => facility.checked)
          .map(([key, facility]) => ({
            type: key,
            fields: Object.entries(facility.fields || {}).map(([fieldKey, fieldValue]) => ({
              key: fieldKey.trim(),
              value: parseFieldValue(fieldValue),
            })),
          }));

        const updatedHouseData = await editHouseFacilities(houseId, facilitiesDataToSend);
        if (!updatedHouseData) throw new Error(copy.saveError);

        setHouseData(updatedHouseData);
        toast.success(copy.saveSuccess);
        await refetchHouseData?.();
        setIsModified(false);
        return true;
      } catch (error) {
        reportClientError("edit-house-main-facilities-save", error);
        toast.error(error?.message || copy.saveError);
        return false;
      } finally {
        setIsRefetching(false);
      }
    };

    useImperativeHandle(ref, () => ({ validateAndSubmit }));

    if (loadingHouse || loadingFacilities || isRefetching) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loading message={copy.loading} />
        </div>
      );
    }

    if (!visibleFacilities.length) return <EmptyState title={copy.empty} />;

    return (
      <section className="space-y-4 p-2 text-right lg:p-4">
        <h2 className="text-xl font-black text-gray-950 dark:text-white">
          {copy.title}
        </h2>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {visibleFacilities.map((facility) => (
            <FacilityItem
              key={facility.key}
              facility={facility}
              selectedFacility={selectedFacilities[facility.key]}
              toggleFacility={toggleFacility}
              handleInputChange={handleInputChange}
            />
          ))}
        </div>
      </section>
    );
  },
);

EditHouseMainFacilities.displayName = "EditHouseMainFacilities";

export default EditHouseMainFacilities;
