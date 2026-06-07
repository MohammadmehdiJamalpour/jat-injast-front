import { useState } from "react";
import TicketBody from "./TicketBody";
import DeleteDialog from "./DeleteDialog";

export default function TicketItem({ ticketId }) {
  const [deleteTarget, setDeleteTarget] = useState(null);

  return (
    <div className="">
      <TicketBody ticketId={ticketId} onRemove={setDeleteTarget} />

      <DeleteDialog
        ticket={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
