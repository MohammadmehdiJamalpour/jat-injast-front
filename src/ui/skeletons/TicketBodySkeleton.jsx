import React from "react";
import Skeleton from "../Skeleton";

export default function TicketBodySkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-4 w-32" />

      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="ml-auto h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <Skeleton className="h-10 w-full" />
    </div>
  );
}
