import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRightIcon, PlusIcon } from "@heroicons/react/24/outline";

import {
  getTicketDepartments,
  getTickets,
} from "../../../services/ticketService";
import TicketList from "./TicketList";
import CreateTicketForm from "./CreateTicketForm";
import TicketBody from "./TicketBody";
import DeleteDialog from "./DeleteDialog";
import TicketListSkeleton from "../../../ui/skeletons/TicketListSkeleton";
import toPersianNumber from "../../../utils/toPersianNumber";

export default function Tickets() {
  const queryClient = useQueryClient();
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [view, setView] = useState("list");

  const {
    data: tickets = [],
    isLoading: loadingList,
    isError,
  } = useQuery({ queryKey: ["tickets"], queryFn: getTickets });

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["ticket-departments"],
      queryFn: getTicketDepartments,
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  const activeTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === activeTicketId),
    [activeTicketId, tickets],
  );

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 p-5 text-center text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
        خطا در دریافت تیکت‌ها
      </div>
    );
  }

  return (
    <section dir="rtl" className="relative p-1.5 text-right lg:p-3">
      {view === "detail" && activeTicketId ? (
        <TicketDetailView
          ticket={activeTicket}
          ticketId={activeTicketId}
          onBack={() => {
            setActiveTicketId(null);
            setView("list");
          }}
          onRemove={setDeleteTarget}
        />
      ) : view === "create" ? (
        <TicketCreateView
          onBack={() => setView("list")}
          onCreated={(id) => {
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
            setActiveTicketId(id);
            setView("detail");
          }}
        />
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between lg:px-3">
            <div>
              <h2 className="text-xl font-bold text-gray-950 dark:text-white">
                تیکت‌ها
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-sky-100/70">
                {toPersianNumber(tickets.length)} تیکت ثبت شده در حساب شما
              </p>
            </div>

            <button
              type="button"
              data-testid="ticket-create-trigger"
              onClick={() => setView("create")}
              className="btn-primary btn-press inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold"
            >
              <PlusIcon className="h-5 w-5" />
              تیکت جدید
            </button>
          </div>

          {loadingList ? (
            <TicketListSkeleton />
          ) : (
            <TicketList
              tickets={tickets}
              onSelect={(id) => {
                setActiveTicketId(id);
                setView("detail");
              }}
            />
          )}
        </>
      )}

      <DeleteDialog
        ticket={deleteTarget}
        onClose={() => {
          setDeleteTarget(null);
          if (deleteTarget?.id === activeTicketId) {
            setActiveTicketId(null);
            setView("list");
          }
        }}
      />
    </section>
  );
}

function TicketCreateView({ onBack, onCreated }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start gap-3 rounded-3xl border border-primary-100 bg-white/80 p-3 text-right shadow-sm shadow-primary-50/60 dark:border-slate-800 dark:bg-slate-950/45 dark:shadow-black/20 sm:flex-row sm:items-center sm:justify-start">
        <button
          type="button"
          onClick={onBack}
          className="btn-press inline-flex h-11 w-fit items-center gap-2 rounded-2xl border border-primary-100 bg-primary-50 px-4 text-sm font-bold text-primary-800 transition hover:border-primary-300 hover:bg-primary-100 dark:border-primary-400/30 dark:bg-primary-500/10 dark:text-white dark:hover:bg-primary-500/20"
        >
          <ArrowRightIcon className="h-5 w-5" />
          بازگشت به لیست
        </button>

        <div className="min-w-0 text-right">
          <p className="text-xs text-gray-500 dark:text-sky-100/65">
            فرم پشتیبانی
          </p>
          <h3 className="truncate text-base font-bold text-gray-950 dark:text-white">
            ایجاد تیکت جدید
          </h3>
        </div>
      </div>

      <CreateTicketForm onCreated={onCreated} onCancel={onBack} />
    </div>
  );
}

function TicketDetailView({ ticket, ticketId, onBack, onRemove }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start gap-3 rounded-3xl border border-primary-100 bg-white/80 p-3 text-right shadow-sm shadow-primary-50/60 dark:border-slate-800 dark:bg-slate-950/45 dark:shadow-black/20 sm:flex-row sm:items-center sm:justify-start">
        <button
          type="button"
          onClick={onBack}
          className="btn-press inline-flex h-11 w-fit items-center gap-2 rounded-2xl border border-primary-100 bg-primary-50 px-4 text-sm font-bold text-primary-800 transition hover:border-primary-300 hover:bg-primary-100 dark:border-primary-400/30 dark:bg-primary-500/10 dark:text-white dark:hover:bg-primary-500/20"
        >
          <ArrowRightIcon className="h-5 w-5" />
          بازگشت به لیست
        </button>

        <div className="min-w-0 text-right">
          <p className="text-xs text-gray-500 dark:text-sky-100/65">
            جزئیات تیکت
          </p>
          <h3 className="truncate text-base font-bold text-gray-950 dark:text-white">
            {ticket?.subject || `تیکت شماره ${toPersianNumber(ticketId)}`}
          </h3>
        </div>
      </div>

      <TicketBody ticketId={ticketId} onRemove={onRemove} />
    </div>
  );
}
