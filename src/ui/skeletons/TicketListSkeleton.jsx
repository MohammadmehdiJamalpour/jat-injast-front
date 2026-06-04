import React from "react";
import Skeleton from "../Skeleton";

export default function TicketListSkeleton({ rows = 4 }) {
  return (
    <div className="scrollbar-thin mt-2 max-h-[70vh] overflow-auto px-2 lg:px-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="mb-2 rounded-3xl bg-primary-50/60 p-4 shadow-centered shadow-primary-50/60"
        >
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}
