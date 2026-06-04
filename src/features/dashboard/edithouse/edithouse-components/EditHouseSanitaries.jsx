import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import clsx from "clsx";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useFetchSanitaryOptions } from "../../../../services/fetchDataService";
import Card from "../../../../ui/Card";
import EmptyState from "../../../../ui/EmptyState";
import Loading from "../../../../ui/Loading";
import { fa } from "../../../../i18n/fa";
import { reportClientError } from "../../../../utils/reportClientError";

const copy = fa.dashboard.editHouse.sanitariesForm;

const SanitaryOption = ({ option, selected, onToggle }) => (
  <Card
    role="checkbox"
    aria-checked={selected}
    tabIndex={0}
    variant="interactive"
    padding="p-4"
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
    <div className="flex items-center justify-between gap-3 text-right">
      <span className="flex min-w-0 items-center gap-3">
        {option.icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-500/15">
            <img src={option.icon} alt="" className="h-6 w-6 object-contain" />
          </span>
        )}
        <span className="truncate text-base font-black text-gray-950 dark:text-white">
          {option.label}
        </span>
      </span>

      <span
        className={clsx(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition",
          selected
            ? "border-primary-action bg-primary-action text-white"
            : "border-primary-200 bg-white text-transparent dark:border-primary-400/30 dark:bg-slate-950",
        )}
      >
        <CheckIcon className="h-5 w-5" />
      </span>
    </div>
  </Card>
);

const EditHouseSanitaries = forwardRef(
  ({ houseData, handleEditHouse, loadingHouse }, ref) => {
    const { data: sanitaryOptions = [], isLoading } = useFetchSanitaryOptions();
    const [selectedSanitaries, setSelectedSanitaries] = useState([]);
    const [isModified, setIsModified] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
      if (!Array.isArray(houseData?.sanitaries)) return;
      setSelectedSanitaries(houseData.sanitaries.map((sanitary) => sanitary.key));
      setIsModified(false);
      setErrors({});
    }, [houseData?.sanitaries]);

    const toggleSanitary = (key) => {
      setSelectedSanitaries((prevSelected) =>
        prevSelected.includes(key)
          ? prevSelected.filter((sanitary) => sanitary !== key)
          : [...prevSelected, key],
      );
      setIsModified(true);
    };

    const validateAndSubmit = async () => {
      if (!isModified) return true;

      setErrors({});

      try {
        await handleEditHouse({ sanitaries: selectedSanitaries });
        toast.success(copy.saveSuccess);
        setIsModified(false);
        return true;
      } catch (errorData) {
        reportClientError("edit-house-sanitaries-save", errorData);
        if (errorData?.errors?.fields) setErrors(errorData.errors.fields);
        toast.error(errorData?.message || copy.saveError);
        return false;
      }
    };

    useImperativeHandle(ref, () => ({ validateAndSubmit }));

    if (isLoading || loadingHouse) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loading message={copy.loading} />
        </div>
      );
    }

    if (!sanitaryOptions.length) return <EmptyState title={copy.empty} />;

    const sanitaryError = errors.sanitaries?.[0];

    return (
      <section className="space-y-4 p-2 text-right lg:p-4">
        <div>
          <h2 className="text-xl font-black text-gray-950 dark:text-white">
            {copy.title}
          </h2>
          {sanitaryError && (
            <p className="mt-2 text-sm font-bold text-red-600 dark:text-red-200">
              {sanitaryError}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {sanitaryOptions.map((option) => (
            <SanitaryOption
              key={option.key}
              option={option}
              selected={selectedSanitaries.includes(option.key)}
              onToggle={toggleSanitary}
            />
          ))}
        </div>
      </section>
    );
  },
);

EditHouseSanitaries.displayName = "EditHouseSanitaries";

export default EditHouseSanitaries;
