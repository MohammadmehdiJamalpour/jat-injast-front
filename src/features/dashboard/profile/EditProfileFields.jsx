import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { PhotoIcon } from "@heroicons/react/24/outline";

export function ProfileInput({
  label,
  error,
  disabled,
  className = "",
  dir = "rtl",
  ...props
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-200">
        {label}
      </span>
      <input
        {...props}
        dir={dir}
        disabled={disabled}
        className="h-12 w-full rounded-2xl border border-gray-100 bg-gray-50/80 px-4 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-primary-400 dark:focus:bg-slate-950 dark:focus:ring-primary-400/15 dark:disabled:bg-slate-900/50 dark:disabled:text-slate-500"
      />
      <ErrorList messages={error} />
    </label>
  );
}

export function ProfileTextArea({ label, error, disabled, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-200">
        {label}
      </span>
      <textarea
        {...props}
        rows={5}
        disabled={disabled}
        className="min-h-32 w-full resize-none rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 text-sm leading-7 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-primary-400 dark:focus:bg-slate-950 dark:focus:ring-primary-400/15"
      />
      <ErrorList messages={error} />
    </label>
  );
}

export function SelectField({
  label,
  value,
  options,
  placeholder,
  onChange,
  disabled,
  error,
}) {
  return (
    <div className="relative">
      <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-200">
        {label}
      </span>
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button className="flex h-12 w-full items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/80 px-4 text-right text-sm text-gray-950 outline-none transition focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-50 dark:focus:border-primary-400 dark:focus:bg-slate-950 dark:focus:ring-primary-400/15 dark:disabled:bg-slate-900/50 dark:disabled:text-slate-500">
              <span className="truncate">{value?.label || placeholder}</span>
              <ChevronDownIcon
                className={`h-5 w-5 shrink-0 text-gray-400 transition-transform dark:text-slate-400 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="scrollbar-thin absolute z-[80] mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-primary-100 bg-white p-1 text-sm shadow-xl shadow-primary-100/40 outline-none dark:border-slate-700 dark:bg-slate-950 dark:shadow-black/35">
                {options.map((option) => (
                  <Listbox.Option
                    key={`${label}-${option.value}-${option.label}`}
                    value={option}
                    disabled={option.disabled}
                    className={({ active, selected, disabled: optionDisabled }) =>
                      `cursor-pointer select-none rounded-xl px-3 py-2 transition ${
                        optionDisabled
                          ? "cursor-not-allowed text-gray-400 dark:text-slate-500"
                          : active || selected
                            ? "bg-primary-50 text-primary-800 dark:bg-primary-500/15 dark:text-white"
                            : "text-gray-700 dark:text-slate-200"
                      }`
                    }
                  >
                    {option.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
      <ErrorList messages={error} />
    </div>
  );
}

export function BirthDateFields({
  formData,
  onChange,
  disabled,
  title,
  helper,
  fields,
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-gray-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/35">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
            {helper}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {fields.map((field) => (
          <ProfileInput
            key={field.name}
            label={field.label}
            name={field.name}
            value={formData[field.name]}
            onChange={(event) => onChange(field.name, event.target.value)}
            placeholder={field.label}
            disabled={disabled}
            inputMode="numeric"
            maxLength={field.maxLength}
            dir="ltr"
          />
        ))}
      </div>
    </div>
  );
}

export function AvatarField({
  title,
  helper,
  actionLabel,
  fileName,
  onChange,
  disabled,
  error,
}) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-gray-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/35">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary-700 shadow-sm dark:bg-slate-950 dark:text-primary-100">
          <PhotoIcon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
            {helper}
          </p>
        </div>
      </div>

      <label className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-primary-200 bg-white px-4 py-3 text-sm text-primary-800 transition hover:border-primary-400 hover:bg-primary-50 dark:border-primary-400/30 dark:bg-slate-950/70 dark:text-primary-100 dark:hover:bg-primary-500/10">
        <span className="truncate">{fileName || actionLabel}</span>
        <input
          type="file"
          name="avatar"
          className="sr-only"
          onChange={onChange}
          accept="image/*"
          disabled={disabled}
        />
      </label>
      <ErrorList messages={error} />
    </div>
  );
}

export function ErrorList({ messages }) {
  if (!messages) return null;

  const list = Array.isArray(messages) ? messages : [messages];
  return (
    <div className="mt-2 space-y-1">
      {list.map((message, index) => (
        <p key={`${message}-${index}`} className="text-xs text-red-500">
          {message}
        </p>
      ))}
    </div>
  );
}
