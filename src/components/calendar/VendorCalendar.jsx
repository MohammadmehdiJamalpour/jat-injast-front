import { useEffect, useMemo, useState } from "react";
import { useVendorHouseCalendarData } from "./useVendorHouseCalendarData";
import { useVendorRoomCalendarData } from "./useVendorRoomCalendarData";
import OperationButtons from "./vendorCalendar/OperationButtons";
import DateRangeSelector from "./vendorCalendar/DateRangeSelector";
import DayDetailModal from "./vendorCalendar/DayDetailModal";
import OperationModal from "./vendorCalendar/OperationModal";
import useCalendarHouseDetails from "./useCalendarHouseDetails";
import Modal from "../../ui/Modal";
import VendorCalendarContainer from "./VendorCalendarContainer";
import CalendarLegend from "./vendorCalendar/CalendarLegend";
import { useVendorCalendarOperations } from "./useVendorCalendarOperations";

export default function VendorCalendar({
  isOpen,
  onClose,
  houseUuid,
  instantBooking = false,
}) {
  const { data: houseData, isLoading: loadingHouse, isError: isErrorHouse, error: errorHouse } =
    useCalendarHouseDetails(houseUuid);

  const isRentRoom = houseData?.is_rent_room === true;
  const isRentRoomDefined = typeof houseData?.is_rent_room !== "undefined";

  const roomOptions = useMemo(() => {
    if (!isRentRoomDefined || !isRentRoom || !houseData?.room) return [];
    return houseData.room
      .filter((r) => !r.is_living_room)
      .map((r) => ({ uuid: r.uuid, name: r.name }));
  }, [houseData, isRentRoomDefined, isRentRoom]);

  const [selectedRoomUuid, setSelectedRoomUuid] = useState(null);
  useEffect(() => {
    if (isRentRoom && roomOptions.length > 0 && !selectedRoomUuid) {
      setSelectedRoomUuid(roomOptions[0].uuid);
    }
  }, [isRentRoom, roomOptions, selectedRoomUuid]);

  const {
    isLoading: isHouseCalLoading,
    isError: isHouseCalError,
    error: houseCalError,
    data: houseCalendarData,
    refetch: houseCalendarRefetch,
    fetchNextMonth: houseFetchNextMonth,
  } = useVendorHouseCalendarData({
    uuid: houseUuid,
    enabled: isOpen && isRentRoomDefined && !isRentRoom,
  });

  const {
    isLoading: isRoomCalLoading,
    isError: isRoomCalError,
    error: roomCalError,
    data: roomCalendarData,
    refetch: roomCalendarRefetch,
    fetchNextMonth: roomFetchNextMonth,
  } = useVendorRoomCalendarData({
    uuid: houseUuid,
    enabled: isOpen && isRentRoomDefined && isRentRoom && !!selectedRoomUuid,
    selectedRoomUuid,
  });

  const finalCalendarData = useMemo(() => {
    if (!isRentRoomDefined) return [];
    return isRentRoom ? roomCalendarData : houseCalendarData;
  }, [isRentRoomDefined, isRentRoom, roomCalendarData, houseCalendarData]);

  const combinedError = useMemo(() => {
    if (isErrorHouse) {
      return errorHouse?.message || "خطا در دریافت اطلاعات اقامتگاه";
    }
    if (!isRentRoomDefined) return null;
    if (!isRentRoom && isHouseCalError) return houseCalError?.message;
    if (isRentRoom && isRoomCalError) return roomCalError?.message;
    return null;
  }, [
    isErrorHouse,
    errorHouse,
    isRentRoomDefined,
    isRentRoom,
    isHouseCalError,
    houseCalError,
    isRoomCalError,
    roomCalError,
  ]);

  async function fetchNextMonth() {
    if (!isRentRoomDefined) return;
    if (isRentRoom) {
      await roomFetchNextMonth();
    } else {
      await houseFetchNextMonth();
    }
  }

  const isLoadingCalendar =
    !isRentRoomDefined || (isRentRoom ? isRoomCalLoading : isHouseCalLoading);

  const [isRefetchingCalendar, setIsRefetchingCalendar] = useState(false);
  async function refetchCalendarData() {
    setIsRefetchingCalendar(true);
    if (isRentRoom) {
      await roomCalendarRefetch();
    } else {
      await houseCalendarRefetch();
    }
    setIsRefetchingCalendar(false);
  }

  const calendarOperations = useVendorCalendarOperations({
    houseUuid,
    isRentRoom,
    selectedRoomUuid,
    refetchCalendarData,
  });

  const {
    errorMessage,
    handleAddOffsite,
    handleAddPeak,
    handleChangePrice,
    handleCloseOperationModal,
    handleDayClick,
    handleRemoveOffsite,
    handleRemovePeak,
    handleRemovePrice,
    handleReset,
    openOperationFlow,
    operationGroup,
    pendingRequest,
    price,
    quantity,
    reserveDateFrom,
    reserveDateTo,
    selectedDayDetails,
    setPrice,
    setQuantity,
    setShowDayModal,
    showDayModal,
    showOperationModal,
  } = calendarOperations;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تقویم اقامتگاه" maxWidth="max-w-5xl">
      {isOpen && (isLoadingCalendar || isRefetchingCalendar) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm dark:bg-slate-950/60">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full mt-4 border-4 border-t-primary-500 animate-spin mb-2" />
          </div>
        </div>
      )}

      <div dir="rtl" className="relative max-h-[68vh] space-y-1.5 overflow-y-auto px-1 py-0 text-right scrollbar-thin sm:px-2">
        {operationGroup && (
          <div className="absolute inset-0 z-10 pointer-events-none bg-white/70 backdrop-blur-sm transition duration-200 ease-in-out dark:bg-slate-950/50" />
        )}

        {loadingHouse ? (
          <div className="h-12 w-full animate-pulse rounded-2xl bg-gray-200 dark:bg-slate-800" />
        ) : isErrorHouse ? (
          <div className="text-center text-sm text-red-500">{combinedError}</div>
        ) : houseData ? (
          <div className="rounded-2xl border border-primary-100 bg-primary-50/70 px-3 py-1.5 text-xs font-bold text-gray-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:text-sm">
            {houseData.name} - {houseData.structure?.label}
          </div>
        ) : null}

        {!loadingHouse && combinedError && (
          <div className="py-1 text-center text-sm text-red-600">{combinedError}</div>
        )}

        {errorMessage && (
          <div className="text-center text-sm text-red-500">{errorMessage}</div>
        )}

        {isRentRoomDefined && isRentRoom && roomOptions.length > 0 && (
          <div className="mb-1 w-full sm:w-52">
            <select
              className="w-full rounded-xl border border-primary-600 bg-white px-3 py-1.5 text-right text-xs text-gray-700 dark:bg-slate-950 dark:text-slate-100"
              value={selectedRoomUuid || ""}
              onChange={(e) => setSelectedRoomUuid(e.target.value)}
            >
              {roomOptions.map((room) => (
                <option key={room.uuid} value={room.uuid}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>
        )}
       
        <div className="flex w-full justify-center">
          <OperationButtons
            operationGroup={operationGroup}
            openOperationFlow={openOperationFlow}
            handleReset={handleReset}
          />
        </div>
        <DateRangeSelector
          operationGroup={operationGroup}
          reserveDateFrom={reserveDateFrom}
          reserveDateTo={reserveDateTo}
        />
          
        {finalCalendarData && finalCalendarData.length > 0 && (
          <div className={operationGroup ? "relative z-20" : ""}>
            <VendorCalendarContainer
              calendarData={finalCalendarData}
              onDayClick={handleDayClick}
              isRentRoom={isRentRoom}
              roomOptions={roomOptions}
              selectedRoomUuid={selectedRoomUuid}
              instantBooking={instantBooking}
              loadingCalendar={isLoadingCalendar}
              fetchNextMonth={fetchNextMonth}
              reserveDateFrom={reserveDateFrom}
              reserveDateTo={reserveDateTo}
            />
          </div>
        )}
        <CalendarLegend />
        <DayDetailModal
          showDayModal={!operationGroup && showDayModal}
          setShowDayModal={setShowDayModal}
          selectedDayDetails={selectedDayDetails}
        />

        <OperationModal
          showOperationModal={showOperationModal}
          operationGroup={operationGroup}
          pendingRequest={pendingRequest}
          price={price}
          quantity={quantity}
          reserveDateFrom={reserveDateFrom}
          reserveDateTo={reserveDateTo}
          onClose={() => {
            if (!pendingRequest) handleCloseOperationModal();
          }}
          setPrice={setPrice}
          setQuantity={setQuantity}
          handleAddPeak={handleAddPeak}
          handleRemovePeak={handleRemovePeak}
          handleAddOffsite={handleAddOffsite}
          handleRemoveOffsite={handleRemoveOffsite}
          handleChangePrice={handleChangePrice}
          handleRemovePrice={handleRemovePrice}
          isRentRoom={isRentRoom}
        />
      </div>
    </Modal>
  );
}
