import { Fragment, useEffect, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  DocumentTextIcon,
  PaperClipIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import {
  createTicket,
  getTicketDepartments,
} from "../../../services/ticketService";
import CreateTicketFormSkeleton from "../../../ui/skeletons/CreateTicketFormSkeleton";

export default function CreateTicketForm({ onCreated, onCancel }) {
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [department, setDepartment] = useState(null);
  const [priority, setPriority] = useState(null);
  const [file, setFile] = useState(null);

  const { data: departmentsData, isLoading } = useQuery({
    queryKey: ["ticket-departments"],
    queryFn: getTicketDepartments,
    staleTime: 5 * 60 * 1000,
  });

  const departments = useMemo(
    () =>
      (departmentsData?.departments ?? []).map((item) => ({
        value: item.id,
        label: item.title || item.label,
      })),
    [departmentsData?.departments],
  );

  const priorities = useMemo(
    () =>
      (departmentsData?.priorities ?? []).map((item) => ({
        value: item.key,
        label: item.title || item.label,
        color: item.color,
      })),
    [departmentsData?.priorities],
  );

  useEffect(() => {
    if (!priority && priorities.length) setPriority(priorities[0]);
  }, [priority, priorities]);

  const { mutate, isLoading: isLoadingCreate, isPending } = useMutation({
    mutationFn: createTicket,
    onSuccess: (newTicket) => {
      toast.success("تیکت ایجاد شد.");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      onCreated?.(newTicket.id);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "ثبت تیکت با خطا روبه‌رو شد.",
      );
    },
  });

  const sending = isLoadingCreate || isPending;

  function handleSubmit(event) {
    event.preventDefault();

    if (!department) {
      toast.error("دپارتمان را انتخاب کنید.");
      return;
    }

    if (!message.trim() && !file) {
      toast.error("متن پیام یا فایل پیوست الزامی است.");
      return;
    }

    const formData = new FormData();
    formData.append("subject", subject.trim());
    formData.append("message", message.trim());
    formData.append("department_id", department.value);
    formData.append("priority", priority?.value || "normal");
    if (file) formData.append("attachment", file);

    mutate(formData);
  }

  if (isLoading) return <CreateTicketFormSkeleton />;

  return (
    <form
      dir="rtl"
      onSubmit={handleSubmit}
      className="mb-5 rounded-3xl border border-primary-100 bg-white/85 p-4 text-right shadow-sm shadow-primary-50/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/50 dark:shadow-black/20 sm:p-5 lg:p-6"
    >
      <div className="mb-5 flex flex-col gap-3 border-b border-primary-100 pb-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-primary-100 dark:bg-primary-500/10 dark:text-primary-100 dark:ring-primary-400/25">
            <DocumentTextIcon className="h-7 w-7" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">
              ایجاد تیکت جدید
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-300">
              موضوع، دپارتمان و پیام خود را وارد کنید.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FormInput
          label="موضوع"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="مثلا مشکل پرداخت رزرو"
          required
        />

        <SelectField
          label="دپارتمان"
          value={department}
          options={departments}
          placeholder="انتخاب دپارتمان"
          onChange={setDepartment}
        />

        <SelectField
          label="اولویت"
          value={priority}
          options={priorities}
          placeholder="انتخاب اولویت"
          onChange={setPriority}
        />

        <AttachmentField file={file} onChange={setFile} />
      </div>

      <div className="mt-4">
        <FormTextArea
          label="پیام"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="پیام خود را با جزئیات بنویسید."
        />
      </div>

      <div className="mt-5 flex flex-col-reverse gap-3 border-t border-primary-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="btn-press min-h-11 rounded-2xl border border-gray-200 px-6 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          انصراف
        </button>

        <button
          type="submit"
          disabled={sending || !subject.trim()}
          className="btn-primary btn-press min-h-11 rounded-2xl px-8 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "در حال ارسال..." : "ثبت تیکت"}
        </button>
      </div>
    </form>
  );
}

function FormInput({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-200">
        {label}
      </span>
      <input
        {...props}
        className="h-12 w-full rounded-2xl border border-gray-100 bg-gray-50/80 px-4 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-primary-400 dark:focus:bg-slate-950 dark:focus:ring-primary-400/15"
      />
    </label>
  );
}

function FormTextArea({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-200">
        {label}
      </span>
      <textarea
        {...props}
        rows={5}
        className="min-h-32 w-full resize-none rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 text-sm leading-7 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-primary-400 dark:focus:bg-slate-950 dark:focus:ring-primary-400/15"
      />
    </label>
  );
}

function SelectField({ label, value, options, placeholder, onChange }) {
  return (
    <div className="relative">
      <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-200">
        {label}
      </span>
      <Listbox value={value} onChange={onChange}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button className="flex h-12 w-full items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/80 px-4 text-right text-sm text-gray-950 outline-none transition focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-50 dark:focus:border-primary-400 dark:focus:bg-slate-950 dark:focus:ring-primary-400/15">
              <span className="truncate">{value?.label || placeholder}</span>
              <ChevronDownIcon
                className={`h-5 w-5 shrink-0 text-gray-400 transition-transform dark:text-slate-400 ${open ? "rotate-180" : ""}`}
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
                    key={`${label}-${option.value}`}
                    value={option}
                    className={({ active, selected }) =>
                      `cursor-pointer select-none rounded-xl px-3 py-2 transition ${
                        active || selected
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
    </div>
  );
}

function AttachmentField({ file, onChange }) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-gray-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/35">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary-700 shadow-sm dark:bg-slate-950 dark:text-primary-100">
          <PaperClipIcon className="h-5 w-5" />
        </span>
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
            پیوست
          </h4>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
            تصویر، ویدئو، صدا یا فایل مرتبط را اضافه کنید.
          </p>
        </div>
      </div>

      <label className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-primary-200 bg-white px-4 py-3 text-sm text-primary-800 transition hover:border-primary-400 hover:bg-primary-50 dark:border-primary-400/30 dark:bg-slate-950/70 dark:text-primary-100 dark:hover:bg-primary-500/10">
        <span className="truncate">{file?.name || "انتخاب فایل پیوست"}</span>
        <input
          type="file"
          className="sr-only"
          onChange={(event) => onChange(event.target.files?.[0] || null)}
        />
      </label>

      {file && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="btn-press mt-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-200 dark:hover:bg-red-500/20"
        >
          <XMarkIcon className="h-4 w-4" />
          حذف فایل
        </button>
      )}
    </div>
  );
}
