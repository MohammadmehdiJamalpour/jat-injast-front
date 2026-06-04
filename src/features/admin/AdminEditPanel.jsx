import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { prepareInitial } from "./adminConfig";

export default function AdminEditPanel({
  config,
  item,
  isCreate,
  onClose,
  onSubmit,
  saving,
}) {
  const [form, setForm] = useState(() => prepareInitial(config, item || {}));
  const change = (key, value) => setForm((old) => ({ ...old, [key]: value }));

  return (
    <div
      dir="rtl"
      className="modal-rtl fixed inset-0 z-50 flex items-end justify-center bg-white/15 p-3 text-right backdrop-blur-md dark:bg-white/5 md:items-center"
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-4 text-right shadow-xl dark:border dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 dark:text-sky-50">
            {isCreate ? `افزودن ${config.title}` : `ویرایش ${config.title}`}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(form, isCreate);
          }}
        >
          {config.fields.map((field) => (
            <Field
              key={field.key}
              field={field}
              value={form[field.key]}
              onChange={(value) => change(field.key, value)}
            />
          ))}

          <div className="flex gap-2 md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary-500 px-5 py-2 text-white hover:bg-primary-600 disabled:opacity-60"
            >
              {saving ? "در حال ذخیره..." : "ذخیره"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-5 py-2 text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ field, value, onChange }) {
  const base =
    "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-right text-sm text-gray-900 focus:border-primary-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";

  return (
    <label className={field.type === "textarea" ? "md:col-span-2" : ""}>
      <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </span>

      {field.type === "textarea" ? (
        <textarea
          className={base}
          rows={3}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : field.type === "select" ? (
        <select
          className={base}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">انتخاب کنید</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === "boolean" ? (
        <select
          className={base}
          value={value ? "true" : "false"}
          onChange={(event) => onChange(event.target.value === "true")}
        >
          <option value="true">بله</option>
          <option value="false">خیر</option>
        </select>
      ) : (
        <input
          className={base}
          type={field.type || "text"}
          step={field.step}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}
