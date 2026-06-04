import {
  InformationCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export function EditProfileHeader({ copy, isVendor }) {
  return (
    <div className="mb-5 flex flex-col gap-4 border-b border-primary-100 pb-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-primary-100 dark:bg-primary-500/10 dark:text-primary-100 dark:ring-primary-400/25">
          <UserCircleIcon className="h-7 w-7" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-gray-950 dark:text-white md:text-xl">
            {copy.editTitle}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-300">
            {copy.editDescription}
          </p>
        </div>
      </div>

      {isVendor && (
        <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-sm text-amber-700 ring-1 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-100 dark:ring-amber-400/25">
          <InformationCircleIcon className="h-5 w-5" />
          {copy.vendorLocked}
        </div>
      )}
    </div>
  );
}

export function EditProfileSubmitBar({
  copy,
  error,
  isError,
  isSubmitting,
  isVendor,
}) {
  return (
    <>
      {isError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          {error?.response?.data?.message || copy.submitError}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-primary-100 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-500 dark:text-slate-400">
          {copy.immutablePhoneNote}
        </p>

        {!isVendor && (
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary btn-press min-h-11 rounded-2xl px-8 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? copy.saving : copy.save}
          </button>
        )}
      </div>
    </>
  );
}
