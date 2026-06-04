import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Button from "../../../../ui/Button";
import TextField from "../../../../ui/TextField";
import TextArea from "../../../../ui/Textarea";
import ToggleSwitch from "../../../../ui/ToggleSwitch";
import ToggleSwitchGroup from "../../../../ui/ToggleSwitchGroup";
import NumberField from "../../../../ui/NumberField";
import { roomCopy } from "./roomFormUtils";

const numberFields = [
  {
    key: "numberSingleBeds",
    name: "numberSingleBeds",
    label: roomCopy.singleBeds,
    errorKey: "number_single_beds",
  },
  {
    key: "numberDoubleBeds",
    name: "numberDoubleBeds",
    label: roomCopy.doubleBeds,
    errorKey: "number_double_beds",
  },
  {
    key: "numberSofaBeds",
    name: "numberSofaBeds",
    label: roomCopy.sofaBeds,
  },
  {
    key: "numberFloorService",
    name: "numberFloorService",
    label: roomCopy.floorService,
  },
];

export default function EditHouseRoomCard({
  room,
  index,
  totalRooms,
  defaultOpen,
  isRentRoom,
  facilities,
  airConditions,
  fieldErrors,
  loadingSubmit,
  loadingDelete,
  onInputChange,
  onToggleSelection,
  onSubmit,
  onDelete,
}) {
  const title = room.roomName || roomCopy.unnamedRoom(totalRooms - index);

  return (
    <Disclosure defaultOpen={defaultOpen} as="div" className="mb-2">
      {({ open }) => (
        <div>
          <Disclosure.Button className="mt-2 flex w-full items-center justify-between rounded-xl border border-primary-100 bg-white px-4 py-2 text-right shadow-centered transition hover:border-primary-200 hover:bg-primary-50 dark:border-primary-400/20 dark:bg-slate-900 dark:text-sky-50 dark:hover:bg-slate-800">
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-bold">{title}</span>
              {room.isLivingRoom && (
                <span className="rounded-full bg-secondary-500 px-2 py-1 text-xs text-white">
                  {roomCopy.livingRoom}
                </span>
              )}
              {room.hasUnsavedChanges && (
                <span className="text-xs text-red-500 dark:text-red-200">
                  {roomCopy.unsaved}
                </span>
              )}
            </span>
            <ChevronDownIcon
              className={`h-5 w-5 transition-transform duration-200 ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </Disclosure.Button>

          <Disclosure.Panel className="mt-1.5 rounded-xl border border-primary-100 bg-white p-4 shadow-centered dark:border-primary-400/20 dark:bg-slate-900 dark:text-sky-50">
            <TextField
              label={roomCopy.name}
              name="roomName"
              value={room.roomName}
              onChange={(event) =>
                onInputChange(index, "roomName", event.target.value)
              }
              placeholder={roomCopy.name}
              error={fieldErrors.roomName}
            />

            {isRentRoom && (
              <TextField
                label={roomCopy.quantity}
                name="quantity"
                value={room.quantity}
                onChange={(event) =>
                  onInputChange(index, "quantity", event.target.value)
                }
                error={fieldErrors.quantity}
                placeholder={roomCopy.quantity}
              />
            )}

            <div className="my-3">
              <ToggleSwitch
                checked={room.isMasterRoom}
                onChange={() =>
                  onInputChange(index, "isMasterRoom", !room.isMasterRoom)
                }
                label={roomCopy.master}
              />
            </div>

            {numberFields.map((field) => (
              <NumberField
                key={field.key}
                label={field.label}
                name={field.name}
                value={room[field.key]}
                onChange={(event) =>
                  onInputChange(index, field.key, event.target.value)
                }
                errorMessages={fieldErrors[field.errorKey]}
                min="0"
              />
            ))}

            <ToggleSwitchGroup
              label={roomCopy.facilities}
              options={facilities}
              selectedOptions={room.selectedFacilities}
              onChange={(key) => onToggleSelection(index, "facility", key)}
            />

            <ToggleSwitchGroup
              label={roomCopy.airConditions}
              options={airConditions}
              selectedOptions={room.selectedAirConditions}
              onChange={(key) => onToggleSelection(index, "airCondition", key)}
            />

            <TextArea
              label={roomCopy.description}
              name="description"
              value={room.description}
              onChange={(event) =>
                onInputChange(index, "description", event.target.value)
              }
              placeholder={roomCopy.descriptionPlaceholder}
              className="mt-4"
            />

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <Button
                onClick={() => onSubmit(index)}
                disabled={loadingSubmit}
                loading={loadingSubmit}
              >
                {room.uuid ? roomCopy.saveChanges : roomCopy.saveRoom}
              </Button>

              <Button
                variant="danger"
                onClick={() => onDelete(index)}
                disabled={loadingDelete}
              >
                {loadingDelete ? roomCopy.deleting : roomCopy.deleteRoom}
              </Button>
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
