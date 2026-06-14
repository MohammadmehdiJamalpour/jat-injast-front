"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import Card from "../../ui/Card";
import ScrollablePanel from "../../ui/ScrollablePanel";

export default function PublicPageClientNav({
  sections,
  initialSection,
  ariaLabel,
}) {
  const [activeSection, setActiveSection] = useState(initialSection);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      { root: null, rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const buttons = sections.map(({ id, label }) => {
    const selected = activeSection === id;

    return (
      <button
        key={id}
        type="button"
        onClick={() => scrollTo(id)}
        className={clsx(
          "flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-right text-sm font-black transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
          selected
            ? "bg-primary-600 text-white shadow-sm shadow-primary-500/25 dark:bg-primary-500 dark:text-white"
            : "text-gray-600 hover:bg-primary-50 hover:text-primary-800 dark:text-sky-100/80 dark:hover:bg-primary-500/10 dark:hover:text-white",
        )}
        >
          <span className="min-w-0 break-words">{label}</span>
        </button>
      );
  });

  return (
    <>
      <aside className="hidden md:block md:self-stretch">
        <Card
          variant="glass"
          padding="p-2"
          radius="rounded-2xl"
          className="overflow-hidden md:sticky md:top-24 md:z-10 md:max-h-[calc(100vh-7rem)] md:w-[16rem] lg:w-[18rem]"
        >
          <ScrollablePanel maxHeight="calc(100vh - 8rem)" className="rounded-2xl">
            <nav className="space-y-2" aria-label={ariaLabel}>
              {buttons}
            </nav>
          </ScrollablePanel>
        </Card>
      </aside>

      <div className="sticky top-20 z-20 min-w-0 -mx-1 md:hidden">
        <Card variant="glass" padding="p-2" radius="rounded-2xl" className="min-w-0">
          <div className="grid grid-cols-2 gap-2">
            {sections.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className={clsx(
                  "min-h-9 w-full rounded-full px-2 py-2 text-xs font-black leading-5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
                  activeSection === id
                    ? "bg-primary-600 text-white shadow-sm shadow-primary-500/25 dark:bg-primary-500"
                    : "bg-white text-gray-600 dark:bg-slate-900 dark:text-sky-100",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
