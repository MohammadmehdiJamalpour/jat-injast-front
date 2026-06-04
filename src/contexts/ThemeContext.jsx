"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "jat-injast-theme";
const ThemeContext = createContext(null);

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(preference) {
  const resolved = preference === "system" ? getSystemTheme() : preference;
  const root = document.documentElement;

  root.dataset.themePreference = preference;
  root.dataset.theme = resolved;
  root.classList.toggle("dark", resolved === "dark");

  return resolved;
}

export function ThemeProvider({ children }) {
  const [preference, setPreferenceState] = useState("system");
  const [resolvedTheme, setResolvedTheme] = useState("light");

  useEffect(() => {
    const storedPreference = localStorage.getItem(STORAGE_KEY);
    const nextPreference =
      storedPreference === "light" || storedPreference === "dark"
        ? storedPreference
        : "system";

    setPreferenceState(nextPreference);
    setResolvedTheme(applyTheme(nextPreference));
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (preference === "system") {
        setResolvedTheme(applyTheme("system"));
      }
    };

    media.addEventListener("change", handleSystemChange);
    return () => media.removeEventListener("change", handleSystemChange);
  }, [preference]);

  const setPreference = (nextPreference) => {
    if (nextPreference === "light" || nextPreference === "dark") {
      localStorage.setItem(STORAGE_KEY, nextPreference);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      nextPreference = "system";
    }
    setPreferenceState(nextPreference);
    setResolvedTheme(applyTheme(nextPreference));
  };

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
