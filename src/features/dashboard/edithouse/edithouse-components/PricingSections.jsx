import { Disclosure } from "@headlessui/react";
import TextField from "../../../../ui/TextField";
import Button from "../../../../ui/Button";

export function PricingInputSection({
  roomUuid,
  title,
  fields,
  values,
  errors,
  placeholder,
  onChange,
}) {
  return (
    <div className="mt-4">
      <h2 className="mt-7 text-lg font-semibold">{title}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map(({ key, label }) => (
          <TextField
            key={key}
            label={label}
            name={key}
            value={values?.[key] || ""}
            onChange={(event) => onChange(key, event.target.value, roomUuid)}
            placeholder={placeholder}
            className={errors[key] ? "border-red-500" : ""}
            error={errors[key]}
          />
        ))}
      </div>
    </div>
  );
}

export function PricingErrorList({ errors }) {
  if (!errors.length) return null;

  return (
    <div className="mt-4 text-red-600">
      <h3 className="font-semibold">خطاهای زیر را بررسی کنید:</h3>
      <ul className="mr-5 list-disc">
        {errors.map((error, index) => (
          <li key={`${error}-${index}`}>{error}</li>
        ))}
      </ul>
    </div>
  );
}

export function PricingSubmitButton({
  children,
  loading,
  onClick,
  className = "",
}) {
  return (
    <Button
      type="button"
      loading={loading}
      disabled={loading}
      onClick={onClick}
      className={className}
    >
      {children}
    </Button>
  );
}

export function RoomPricingDisclosure({
  room,
  index,
  sections,
  values,
  errors,
  errorList,
  placeholder,
  loadingSubmit,
  onChange,
  onSubmit,
}) {
  return (
    <Disclosure
      key={room.uuid}
      as="div"
      className="mb-2"
      defaultOpen={false}
    >
      {({ open }) => (
        <div>
          <Disclosure.Button className="mt-2 flex w-full items-center justify-between rounded-xl bg-white px-4 py-2 shadow-centered dark:bg-slate-900 dark:text-slate-100">
            <span className="flex items-center">
              {room.name || `اتاق ${index + 1}`}
            </span>
            <svg
              className={`h-5 w-5 transition-transform duration-200 ${
                open ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Disclosure.Button>

          <Disclosure.Panel className="mt-1.5 rounded-xl bg-white p-4 shadow-centered dark:bg-slate-900">
            {sections.map((section) => (
              <PricingInputSection
                key={`${room.uuid}-${section.id}`}
                roomUuid={room.uuid}
                title={section.title}
                fields={section.fields}
                values={values}
                errors={errors}
                placeholder={placeholder}
                onChange={onChange}
              />
            ))}

            <div className="mt-4 flex justify-end gap-2">
              <PricingSubmitButton
                loading={loadingSubmit}
                onClick={() => onSubmit(room.uuid)}
              >
                {loadingSubmit ? "در حال ثبت ..." : "ثبت قیمت اتاق"}
              </PricingSubmitButton>
            </div>

            <PricingErrorList errors={errorList} />
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
