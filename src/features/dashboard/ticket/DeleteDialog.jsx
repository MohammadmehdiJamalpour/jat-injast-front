import { Dialog } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTicket } from "../../../services/ticketService";
import { toast } from "react-hot-toast";

export default function DeleteDialog({ ticket, onClose }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id) => deleteTicket(id),
    onSuccess: () => {
      toast.success("تیکت حذف شد");
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      onClose();
    },
    onError: () => toast.error("خطا در حذف تیکت"),
  });

  if (!ticket) return null;

  return (
    <Dialog
      open={!!ticket}
      onClose={onClose}
      dir="rtl"
      className="relative z-50 text-right"
    >
      <div className="fixed inset-0 bg-white/15 backdrop-blur-md dark:bg-white/5" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-3xl border border-red-100 bg-white p-5 text-right shadow-xl shadow-red-100/30 dark:border-red-500/20 dark:bg-slate-950 dark:text-slate-100 dark:shadow-black/30">
          <Dialog.Title className="text-lg font-bold text-gray-950 dark:text-white">
            حذف تیکت «{ticket.subject}»
          </Dialog.Title>
          <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-slate-300">
            آیا مطمئن هستید که می‌خواهید این تیکت را حذف کنید؟
          </p>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn-press min-h-10 rounded-2xl border border-gray-200 px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              لغو
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => mutate(ticket.id)}
              className="btn-press min-h-10 rounded-2xl bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "در حال حذف..." : "بله، حذف کن"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
