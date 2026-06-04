"use client";

import { Switch } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { resolvedTheme, setPreference } = useTheme();
  const isDark = resolvedTheme === "dark";
  const label = isDark ? "تغییر به حالت روشن" : "تغییر به حالت تیره";

  return (
    <div
      dir="ltr"
      className={`inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-2 py-1 text-white shadow-sm backdrop-blur ${className}`}
    >
      <SunIcon
        className={`h-4 w-4 transition ${isDark ? "opacity-45" : "opacity-100"}`}
        aria-hidden="true"
      />
      <Switch
        checked={isDark}
        onChange={(checked) => setPreference(checked ? "dark" : "light")}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border border-white/20 transition focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-primary-700 ${
          isDark ? "bg-slate-900" : "bg-white"
        }`}
        title={label}
        aria-label={label}
      >
        <span
          aria-hidden="true"
          className={`absolute left-1 top-1 inline-block h-4 w-4 rounded-full shadow transition ${
            isDark
              ? "translate-x-5 bg-primary-300"
              : "translate-x-0 bg-primary-action"
          }`}
        />
      </Switch>
      <MoonIcon
        className={`h-4 w-4 transition ${isDark ? "opacity-100" : "opacity-45"}`}
        aria-hidden="true"
      />
    </div>
  );
}
