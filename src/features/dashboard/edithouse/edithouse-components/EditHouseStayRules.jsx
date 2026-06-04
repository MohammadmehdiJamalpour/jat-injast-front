import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { toast } from "react-hot-toast";
import Button from "../../../../ui/Button";
import Card from "../../../../ui/Card";
import Spinner from "../../../../ui/Loading";
import TextField from "../../../../ui/TextField";
import ToggleSwitch from "../../../../ui/ToggleSwitch";
import { useFetchRules } from "../../../../services/fetchDataService";
import { reportClientError } from "../../../../utils/reportClientError";
import { fa } from "../../../../i18n/fa";

const copy = fa.dashboard.editHouse.stayRules;

const statusOptions = [
  { key: "NotAllowed", label: copy.statuses.NotAllowed },
  { key: "Allowed", label: copy.statuses.Allowed },
  { key: "Needed", label: copy.statuses.Needed },
  { key: "NotNeeded", label: copy.statuses.NotNeeded },
];

const EditHouseStayRules = forwardRef(
  ({ houseData, handleEditHouse, loadingHouse, refetchHouseData }, ref) => {
    const { data: rulesData = [], isLoading: loadingRules } = useFetchRules();
    const [selectedRules, setSelectedRules] = useState({});
    const [descriptions, setDescriptions] = useState({});
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const [errorList, setErrorList] = useState([]);

    useEffect(() => {
      if (rulesData.length > 0 && Array.isArray(houseData?.rules?.types)) {
        const rulesByKey = new Map(houseData.rules.types.map((rule) => [rule.key, rule]));

        setSelectedRules(
          rulesData.reduce((acc, rule) => {
            acc[rule.key] = rulesByKey.get(rule.key)?.status?.key || null;
            return acc;
          }, {}),
        );

        setDescriptions(
          rulesData.reduce((acc, rule) => {
            acc[rule.key] = rulesByKey.get(rule.key)?.description || "";
            return acc;
          }, {}),
        );
      }
    }, [rulesData, houseData?.rules?.types]);

    const handleOptionToggle = (ruleKey, optionKey) => {
      setSelectedRules((prev) => ({
        ...prev,
        [ruleKey]: prev[ruleKey] === optionKey ? null : optionKey,
      }));
      setIsModified(true);
    };

    const handleNoteChange = (ruleKey, value) => {
      setDescriptions((prev) => ({
        ...prev,
        [ruleKey]: value,
      }));
      setIsModified(true);
    };

    const validateAndSubmit = async () => {
      if (!isModified) return true;

      setLoadingSubmit(true);
      setErrorList([]);

      try {
        await handleEditHouse({
          rules: Object.keys(selectedRules)
            .filter((key) => selectedRules[key] !== null)
            .map((key) => ({
              key,
              status: selectedRules[key],
              description: descriptions[key] || "",
            })),
        });

        await refetchHouseData();
        toast.success(copy.saveSuccess);
        setIsModified(false);
        return true;
      } catch (error) {
        reportClientError("Error submitting rules:", error);
        toast.error(copy.saveError);
        setErrorList([copy.retryError]);
        return false;
      } finally {
        setLoadingSubmit(false);
      }
    };

    useImperativeHandle(ref, () => ({
      validateAndSubmit,
    }));

    if (loadingHouse || loadingRules) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner />
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="w-full overflow-auto px-2 pt-2 scrollbar-thin lg:px-4">
          <h2 className="mb-4 text-right font-bold lg:text-lg">
            {copy.title}
          </h2>

          {errorList.length > 0 && (
            <div className="mb-4 space-y-2">
              {errorList.map((error) => (
                <div key={error} className="text-sm text-red-500 dark:text-red-200">
                  {error}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {rulesData.map((rule) => (
              <Card
                key={rule.key}
                variant="bordered"
                className="mt-4 p-4 shadow-centered dark:shadow-black/20"
              >
                <span className="mb-2 block text-sm font-bold text-gray-800 dark:text-sky-50">
                  {rule.label}
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((option) => (
                    <ToggleSwitch
                      key={option.key}
                      checked={selectedRules[rule.key] === option.key}
                      onChange={() => handleOptionToggle(rule.key, option.key)}
                      label={option.label}
                    />
                  ))}
                </div>

                <div className="mt-2">
                  <TextField
                    label={copy.note}
                    placeholder={copy.notePlaceholder}
                    value={descriptions[rule.key] || ""}
                    onChange={(event) => handleNoteChange(rule.key, event.target.value)}
                  />
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-4 flex w-full justify-end lg:col-span-2">
            <Button onClick={validateAndSubmit} disabled={loadingSubmit} loading={loadingSubmit}>
              {loadingSubmit ? copy.loading : copy.submit}
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

EditHouseStayRules.displayName = "EditHouseStayRules";

export default EditHouseStayRules;
