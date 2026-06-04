import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";
import Loading from "@/ui/Loading";
import { cleanPayload, valueOf } from "./adminConfig";
import AdminEditPanel from "./AdminEditPanel";

export default function AdminResourcePanel({
  config,
  search,
  setSearch,
  filters,
  setFilters,
  editing,
  setEditing,
  creating,
  setCreating,
  closeForm,
  queryClient,
}) {
  const params = useMemo(
    () => ({ q: search || undefined, ...filters }),
    [filters, search],
  );
  const queryKey = [config.queryKey, params];
  const { data = [], isLoading, isError } = useQuery({
    queryKey,
    queryFn: () => config.list(params),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => config.create(payload),
    onSuccess: () => {
      toast.success("رکورد ایجاد شد");
      queryClient.invalidateQueries({ queryKey: [config.queryKey] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => config.update(id, payload),
    onSuccess: () => {
      toast.success("تغییرات ذخیره شد");
      queryClient.invalidateQueries({ queryKey: [config.queryKey] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => config.remove(id),
    onSuccess: () => {
      toast.success("رکورد حذف شد");
      queryClient.invalidateQueries({ queryKey: [config.queryKey] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });

  const save = (form, isCreate) => {
    const payload = cleanPayload(config.fields, form, isCreate);
    if (isCreate) createMutation.mutate(payload);
    else updateMutation.mutate({ id: config.idOf(editing), payload });
  };

  return (
    <div>
      <ResourceToolbar
        config={config}
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        onCreate={() => setCreating(true)}
      />

      {isLoading && <Loading size={28} />}
      {isError && <ErrorBox text="داده‌ها بارگذاری نشد." />}
      {!isLoading && !isError && (
        <AdminTable
          config={config}
          items={data}
          onEdit={setEditing}
          onDelete={(item) => {
            if (window.confirm("این رکورد حذف شود؟")) {
              deleteMutation.mutate(config.idOf(item));
            }
          }}
        />
      )}

      {(editing || creating) && (
        <AdminEditPanel
          config={config}
          item={editing}
          isCreate={creating}
          onClose={closeForm}
          onSubmit={save}
          saving={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}

function ResourceToolbar({
  config,
  search,
  setSearch,
  filters,
  setFilters,
  onCreate,
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-sky-50">
          {config.title}
        </h2>
        <p className="mt-1 text-xs text-gray-500 dark:text-sky-200">
          آخرین ۱۰۰ رکورد نمایش داده می‌شود.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          placeholder="جستجو"
        />
        {config.filters?.map((filter) => (
          <select
            key={filter.key}
            value={filters[filter.key] || ""}
            onChange={(event) =>
              setFilters((old) => ({
                ...old,
                [filter.key]: event.target.value || undefined,
              }))
            }
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
        {config.canCreate && (
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-primary-500 px-3 py-2 text-sm text-white hover:bg-primary-600"
          >
            <PlusIcon className="h-4 w-4" />
            افزودن
          </button>
        )}
      </div>
    </div>
  );
}

function AdminTable({ config, items, onEdit, onDelete }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl bg-gray-50 p-6 text-center text-sm text-gray-500 dark:bg-slate-950 dark:text-slate-400">
        رکوردی پیدا نشد.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-700">
      <table className="min-w-full divide-y divide-gray-100 text-sm">
        <thead className="bg-gray-50 dark:bg-slate-950">
          <tr>
            {config.columns.map((column) => (
              <th
                key={column.key}
                className="whitespace-nowrap px-3 py-3 text-right font-semibold text-gray-600 dark:text-sky-100"
              >
                {column.label}
              </th>
            ))}
            <th className="px-3 py-3 text-right font-semibold text-gray-600 dark:text-sky-100">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white dark:divide-slate-700 dark:bg-slate-900">
          {items.map((item) => (
            <tr
              key={config.idOf(item)}
              className="hover:bg-primary-50/30 dark:hover:bg-slate-800/70"
            >
              {config.columns.map((column) => (
                <td
                  key={column.key}
                  className="max-w-[220px] truncate px-3 py-3 text-gray-700 dark:text-slate-300"
                >
                  {String(valueOf(item, column) ?? "-")}
                </td>
              ))}
              <td className="whitespace-nowrap px-3 py-3">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className={`ml-2 inline-flex items-center gap-1 rounded-lg border border-primary-200 px-2 py-1 text-primary-700 hover:bg-primary-50 dark:border-primary-400/40 dark:text-primary-200 dark:hover:bg-primary-900/35 ${
                    !config.update || config.fields?.length === 0 ? "hidden" : ""
                  }`}
                >
                  <PencilSquareIcon className="h-4 w-4" />
                  ویرایش
                </button>
                {config.canDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(item)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
                  >
                    <TrashIcon className="h-4 w-4" />
                    حذف
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ErrorBox({ text }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100">
      {text}
    </div>
  );
}
