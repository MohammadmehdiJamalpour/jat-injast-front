"use client";

import { useEffect, useState } from "react";

export default function HydratedOnly({ children }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;
  return children;
}

export function HideAfterHydration({ children }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (hydrated) return null;
  return children;
}
