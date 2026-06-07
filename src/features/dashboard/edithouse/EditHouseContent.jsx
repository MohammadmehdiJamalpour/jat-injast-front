import { useEffect, useRef, useState } from "react";
import { useParams } from "@/lib/router-compat";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import AddressDetails from "./edithouse-components/EditHouseAddressDetails";
import EditHouseLocationDetails from "./edithouse-components/EditHouseLocationDetails";
import GeneralInfo from "./edithouse-components/EditHouseGeneralInfo";
import MainFacilities from "./edithouse-components/EditHouseMainFacilities";
import Rooms from "./edithouse-components/EditHouseRooms";
import Sanitaries from "./edithouse-components/EditHouseSanitaries";
import ReservationRules from "./edithouse-components/EditHouseReservationRules";
import StayRules from "./edithouse-components/EditHouseStayRules";
import Pricing from "./edithouse-components/EditHousePricing";
import Images from "./edithouse-components/EditHouseImages";
import EnvironmentInfo from "./edithouse-components/EditHouseEnvironmentInfo";
import useFetchHouse from "../useFetchHouse";
import useEditHouse from "./useEditHouse";
import Loading from "../../../ui/Loading";
import EditHouseDocuments from "./edithouse-components/EditHouseDocuments";
import EditHouseFinalSubmit from "./edithouse-components/EditHouseFinalSubmit";
import EditHouseCancellationRules from "./edithouse-components/EditHouseCancellationRules";
import Button from "../../../ui/Button";
import CustomInfoIcon from "../../../ui/CustomInfoIcon";
import Modal from "../../../ui/Modal";
import NotFound from "../../../components/NotFound";
import { reportClientError } from "../../../utils/reportClientError";
import { fa } from "../../../i18n/fa";

const stepComponents = {
  address: AddressDetails,
  location: EditHouseLocationDetails,
  generalInfo: GeneralInfo,
  environmentInfo: EnvironmentInfo,
  mainFacilities: MainFacilities,
  rooms: Rooms,
  sanitaries: Sanitaries,
  reservationRules: ReservationRules,
  stayRules: StayRules,
  cancellationRules: EditHouseCancellationRules,
  pricing: Pricing,
  images: Images,
  documents: EditHouseDocuments,
  finalSubmit: EditHouseFinalSubmit,
};

function EditHouseContent({
  selectedTab,
  handleNextTab,
  handlePreviousTab,
}) {
  const { uuid } = useParams();
  const copy = fa.dashboard.editHouse;
  const childRef = useRef(null);
  const [houseData, setHouseData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const {
    data: fetchedHouseData,
    isLoading: loadingHouse,
    isFetching,
    error,
    refetch: refetchHouseData,
  } = useFetchHouse(uuid);

  const { mutateAsync: editHouseAsync } = useEditHouse();

  useEffect(() => {
    if (fetchedHouseData) {
      setHouseData(fetchedHouseData);
    }
  }, [fetchedHouseData]);

  useEffect(() => {
    childRef.current = null;
  }, [selectedTab]);

  if (error) {
    reportClientError("Fetching house encountered an error:", error);
    return (
      <NotFound
        title={copy.errorTitle}
        message={copy.errorMessage}
        showRetry
        onRetry={refetchHouseData}
      />
    );
  }

  if (loadingHouse || houseData === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loading type="beat" color="primary" size={8} />
        <p className="text-sm font-bold text-gray-600 dark:text-sky-100/75">
          {copy.loadingHouse}
        </p>
      </div>
    );
  }

  const handleEditHouse = async (updatedData) => {
    try {
      const response = await editHouseAsync({
        houseId: uuid,
        houseData: updatedData,
      });
      setHouseData((prev) => ({ ...prev, ...response }));
      return true;
    } catch (err) {
      reportClientError("Edit House Error:", err.response?.data || err.message);
      throw err.response?.data || err;
    }
  };

  const commonProps = {
    houseData,
    setHouseData,
    houseId: uuid,
    loadingHouse,
    isFetching,
    handleEditHouse,
    refetchHouseData,
  };

  const StepComponent = stepComponents[selectedTab] || AddressDetails;
  const requiresRef = !["rooms", "images", "documents", "finalSubmit"].includes(selectedTab);
  const stepProps = requiresRef
    ? { ref: childRef, ...commonProps }
    : commonProps;

  const persistAndMove = async (move) => {
    setIsSaving(true);
    try {
      if (requiresRef && childRef.current?.validateAndSubmit) {
        const success = await childRef.current.validateAndSubmit();
        if (success) move();
      } else {
        move();
      }
    } catch (err) {
      reportClientError("Edit house navigation failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const infoText = copy.info[selectedTab] || copy.info.address;

  return (
    <div className="flex h-full flex-col">
      <div className="max-h-[80vh] flex-grow overflow-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 dark:scrollbar-thumb-primary-400/45">
        <StepComponent {...stepProps} />
      </div>

      <div className="flex items-center justify-between gap-3 p-2 py-3 lg:p-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => persistAndMove(handlePreviousTab)}
          disabled={selectedTab === "address" || isSaving}
        >
          <ArrowRightIcon className="h-4 w-4" />
          {copy.previousPage}
        </Button>

        {isSaving && (
          <span className="text-sm text-gray-500 dark:text-sky-100/70">
            {copy.saving}
          </span>
        )}

        <div className="flex items-center gap-2">
          <CustomInfoIcon
            className="h-6 w-6 cursor-pointer text-gray-500 dark:text-sky-100"
            onClick={() => setIsInfoModalOpen(true)}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => persistAndMove(handleNextTab)}
            disabled={selectedTab === "finalSubmit" || isSaving}
          >
            {copy.nextPage}
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Modal
        open={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title={copy.moreInfo}
        size="sm"
      >
        <p className="leading-8 text-gray-700 dark:text-sky-50">{infoText}</p>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setIsInfoModalOpen(false)}>{copy.close}</Button>
        </div>
      </Modal>
    </div>
  );
}

export default EditHouseContent;
