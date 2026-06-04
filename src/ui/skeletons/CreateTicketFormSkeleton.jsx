import React from "react";
import Skeleton from "../Skeleton";

export default function CreateTicketFormSkeleton() {
  return (
    <div className="mt-3 space-y-4 rounded-xl border bg-white p-6 shadow-centered dark:bg-gray-800">
      <Skeleton className="h-5 w-32" />
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
      <Skeleton className="ml-auto h-10 w-24" />
    </div>
  );
}
