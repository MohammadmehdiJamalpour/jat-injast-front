import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import clsx from "clsx";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useFetchCancellationRules } from "../../../../services/fetchDataService";
import Badge from "../../../../ui/Badge";
import Card from "../../../../ui/Card";
import EmptyState from "../../../../ui/EmptyState";
import Loading from "../../../../ui/Loading";
import { fa } from "../../../../i18n/fa";
import { reportClientError } from "../../../../utils/reportClientError";
import { htmlToPlainText } from "../../../../utils/htmlText";

const copy = fa.dashboard.editHouse.cancellationRuleForm;

const RuleCard = ({ rule, selected, onSelect }) => {
  const description = htmlToPlainText(rule.description);

  return (
    <Card
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      variant="interactive"
      padding="p-4"
      className={clsx(
        "w-full cursor-pointer text-right transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 dark:focus-visible:ring-primary-200",
        selected && "border-primary-400 bg-primary-50/80 dark:border-primary-300 dark:bg-primary-500/15",
      )}
      onClick={() => onSelect(rule.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(rule.id);
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-black text-gray-950 dark:text-white">
            {rule.title}
          </h3>
          {description && (
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600 dark:text-sky-100/75">
              {description}
            </p>
          )}
        </div>

        <span
          className={clsx(
            "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition",
            selected
              ? "border-primary-action bg-primary-action text-white"
              : "border-primary-200 bg-white dark:border-primary-400/30 dark:bg-slate-950",
          )}
        >
          {selected && <CheckCircleIcon className="h-5 w-5" />}
        </span>
      </div>

      {selected && (
        <Badge tone="primary" className="mt-4">
          {copy.selected}
        </Badge>
      )}
    </Card>
  );
};

const EditHouseCancellationRules = forwardRef(
  ({ houseData, handleEditHouse, loadingHouse }, ref) => {
    const {
      data: cancellationRules = [],
      isLoading,
      error,
    } = useFetchCancellationRules();
    const [selectedRuleId, setSelectedRuleId] = useState(null);
    const [initialRuleId, setInitialRuleId] = useState(null);
    const [errors, setErrors] = useState({});
    const [isModified, setIsModified] = useState(false);

    useEffect(() => {
      if (!cancellationRules.length) return;

      const currentRuleId = houseData?.cancellation_rule?.id || null;
      setSelectedRuleId(currentRuleId);
      setInitialRuleId(currentRuleId);
      setIsModified(false);
      setErrors({});
    }, [houseData?.cancellation_rule?.id, cancellationRules.length]);

    const handleSelect = (ruleId) => {
      const nextRuleId = selectedRuleId === ruleId ? null : ruleId;
      setSelectedRuleId(nextRuleId);
      setIsModified(nextRuleId !== initialRuleId);
      setErrors({});
    };

    const validateAndSubmit = async () => {
      if (!isModified) return true;

      setErrors({});

      if (!selectedRuleId) {
        setErrors({ cancellation_rule_id: [copy.selectRequired] });
        toast.error(copy.selectRequired);
        return false;
      }

      try {
        await handleEditHouse({ cancellation_rule_id: selectedRuleId });
        toast.success(copy.saveSuccess);
        setInitialRuleId(selectedRuleId);
        setIsModified(false);
        return true;
      } catch (errorData) {
        reportClientError("edit-house-cancellation-rules-save", errorData);
        if (errorData?.errors?.fields) setErrors(errorData.errors.fields);
        toast.error(errorData?.message || copy.saveError);
        return false;
      }
    };

    useImperativeHandle(ref, () => ({ validateAndSubmit }));

    if (isLoading || loadingHouse) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loading />
        </div>
      );
    }

    if (error) {
      return <EmptyState title={copy.loadError} />;
    }

    if (!cancellationRules.length) {
      return <EmptyState title={copy.empty} />;
    }

    const ruleError = errors.cancellation_rule_id?.[0];

    return (
      <section className="space-y-4 p-2 text-right lg:p-4">
        <div>
          <h2 className="text-xl font-black text-gray-950 dark:text-white">
            {copy.title}
          </h2>
          {ruleError && (
            <p className="mt-2 text-sm font-bold text-red-600 dark:text-red-200">
              {ruleError}
            </p>
          )}
        </div>

        <div role="radiogroup" className="grid grid-cols-1 gap-3">
          {cancellationRules.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              selected={selectedRuleId === rule.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </section>
    );
  },
);

EditHouseCancellationRules.displayName = "EditHouseCancellationRules";

export default EditHouseCancellationRules;
