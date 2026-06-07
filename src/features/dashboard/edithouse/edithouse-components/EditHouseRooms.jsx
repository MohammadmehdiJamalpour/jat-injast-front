import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Button from "../../../../ui/Button";
import Modal from "../../../../ui/Modal";
import Spinner from "../../../../ui/Loading";
import ScrollablePanel from "../../../../ui/ScrollablePanel";
import {
  useFetchRoomFacilities,
  useFetchCoolingAndHeatingOptions,
} from "../../../../services/fetchDataService";
import {
  createRoom,
  deleteRoom,
  editRoom,
} from "../../../../services/houseService";
import EditHouseRoomCard from "./EditHouseRoomCard";
import {
  buildRoomPayload,
  makeEmptyRoom,
  makeInitialRooms,
  roomCopy,
} from "./roomFormUtils";

const fieldErrorMessages = (fieldErrors) =>
  Object.values(fieldErrors)
    .flat()
    .filter(Boolean);

const EditHouseRooms = ({ houseData, houseId, refetchHouseData }) => {
  const [rooms, setRooms] = useState([]);
  const [hasLivingRoom, setHasLivingRoom] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [expandedRoomIndex, setExpandedRoomIndex] = useState(null);

  const { data: facilitiesData = [], isLoading: loadingFacilities } =
    useFetchRoomFacilities();
  const { data: airConditionData = [], isLoading: loadingAirConditions } =
    useFetchCoolingAndHeatingOptions();

  useEffect(() => {
    const initialRooms = makeInitialRooms(houseData);
    setRooms(initialRooms);
    setHasLivingRoom(initialRooms.some((room) => room.isLivingRoom));
  }, [houseData]);

  const addRoom = (isLivingRoom = false) => {
    setRooms((prevRooms) => [
      makeEmptyRoom({
        isLivingRoom,
        isRentRoom: houseData.is_rent_room,
      }),
      ...prevRooms,
    ]);
    if (isLivingRoom) setHasLivingRoom(true);
    setExpandedRoomIndex(0);
  };

  const handleInputChange = (index, key, value) => {
    setRooms((prevRooms) =>
      prevRooms.map((room, currentIndex) =>
        currentIndex === index
          ? { ...room, [key]: value, hasUnsavedChanges: true }
          : room,
      ),
    );
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [key]: null,
    }));
  };

  const toggleSelection = (index, type, key) => {
    const keyName =
      type === "facility" ? "selectedFacilities" : "selectedAirConditions";

    setRooms((prevRooms) =>
      prevRooms.map((room, currentIndex) => {
        if (currentIndex !== index) return room;

        const selectedItems = room[keyName] || [];
        const nextItems = selectedItems.includes(key)
          ? selectedItems.filter((item) => item !== key)
          : [...selectedItems, key];

        return { ...room, [keyName]: nextItems, hasUnsavedChanges: true };
      }),
    );
  };

  const handleRoomSubmit = async (index) => {
    const roomData = rooms[index];
    const payload = buildRoomPayload(roomData, houseData.is_rent_room);

    setLoadingSubmit(true);
    setFieldErrors({});

    try {
      if (roomData.uuid) {
        await editRoom(houseId, roomData.uuid, payload);
      } else {
        await createRoom(houseId, payload);
      }

      await refetchHouseData();
      toast.success(roomCopy.saveSuccess);
      setRooms((prevRooms) =>
        prevRooms.map((room, currentIndex) =>
          currentIndex === index ? { ...room, hasUnsavedChanges: false } : room,
        ),
      );
    } catch (error) {
      if (error.response?.status === 422) {
        setFieldErrors(error.response.data.errors.fields ?? {});
        toast.error(roomCopy.validationError);
      } else {
        toast.error(roomCopy.saveError);
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (!loadingDelete) setIsModalOpen(false);
  };

  const removeRoomFromState = (roomData) => {
    setRooms((prevRooms) =>
      prevRooms.filter((_, currentIndex) => currentIndex !== deleteIndex),
    );
    if (roomData.isLivingRoom) setHasLivingRoom(false);
  };

  const handleDelete = async () => {
    const roomData = rooms[deleteIndex];
    if (!roomData) return;

    setLoadingDelete(true);

    if (!roomData.uuid) {
      removeRoomFromState(roomData);
      setLoadingDelete(false);
      setIsModalOpen(false);
      return;
    }

    try {
      await deleteRoom(houseId, roomData.uuid);
      await refetchHouseData();
      removeRoomFromState(roomData);
      toast.success(roomCopy.deleteSuccess);
    } catch {
      toast.error(roomCopy.deleteError);
    } finally {
      setLoadingDelete(false);
      setIsModalOpen(false);
    }
  };

  if (loadingFacilities || loadingAirConditions) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const errors = fieldErrorMessages(fieldErrors);

  return (
    <div className="relative p-1.5 lg:p-3">
      <div className="mt-2 text-right font-bold lg:text-lg">
        {roomCopy.title}
      </div>

      <div className="flex w-full flex-col gap-3 px-4 pt-3 md:flex-row md:items-start md:justify-between">
        <div className="min-h-5">
          {errors.length > 0 && (
            <div className="space-y-1 pr-2 text-sm text-red-600 dark:text-red-200">
              {errors.map((error, index) => (
                <div key={`${error}-${index}`}>{error}</div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button size="sm" onClick={() => addRoom(false)}>
            {roomCopy.addRoom}
          </Button>
          <Button
            size="sm"
            onClick={() => addRoom(true)}
            disabled={hasLivingRoom}
          >
            {roomCopy.addLivingRoom}
          </Button>
        </div>
      </div>

      <ScrollablePanel
        maxHeight="70vh"
        className="mt-2 min-h-[70vh] w-full px-2 lg:px-4"
      >
        {rooms.map((room, index) => (
          <EditHouseRoomCard
            key={room.uuid || `${index}-${room.isLivingRoom}`}
            room={room}
            index={index}
            totalRooms={rooms.length}
            defaultOpen={index === expandedRoomIndex}
            isRentRoom={houseData.is_rent_room}
            facilities={facilitiesData}
            airConditions={airConditionData}
            fieldErrors={fieldErrors}
            loadingSubmit={loadingSubmit}
            loadingDelete={loadingDelete}
            onInputChange={handleInputChange}
            onToggleSelection={toggleSelection}
            onSubmit={handleRoomSubmit}
            onDelete={confirmDelete}
          />
        ))}
      </ScrollablePanel>

      <Modal
        open={isModalOpen}
        onClose={closeDeleteModal}
        title={roomCopy.deleteTitle}
        size="sm"
      >
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={closeDeleteModal}>
            {roomCopy.cancel}
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={loadingDelete}
            disabled={loadingDelete}
          >
            {roomCopy.confirmDelete}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default EditHouseRooms;
