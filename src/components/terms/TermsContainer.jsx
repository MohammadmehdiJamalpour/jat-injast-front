import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import Card from "../../ui/Card";
import ScrollablePanel from "../../ui/ScrollablePanel";
import TermsContent, { SECTION_IDS, termsSections } from "./TermsContent";
import TermsSidebar from "./TermsSidebar";

export default function TermsContainer() {
  const [activeSection, setActiveSection] = useState("general");

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

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main
      data-public-static-shell
      className="mx-auto grid w-full max-w-7xl gap-4 px-3 py-4 sm:px-4 sm:py-6 md:grid-cols-[16rem_minmax(0,1fr)] lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-6"
    >
      <aside className="hidden md:block md:self-stretch">
        <Card
          variant="glass"
          padding="p-2"
          radius="rounded-2xl"
          className="overflow-hidden md:sticky md:top-24 md:z-10 md:max-h-[calc(100vh-7rem)] md:w-[16rem] lg:w-[18rem]"
        >
          <ScrollablePanel maxHeight="calc(100vh - 8rem)" className="rounded-2xl">
            <TermsSidebar activeSection={activeSection} scrollTo={scrollTo} />
          </ScrollablePanel>
        </Card>
      </aside>

      <div className="sticky top-20 z-20 min-w-0 -mx-1 md:hidden">
        <Card variant="glass" padding="p-2" radius="rounded-2xl" className="min-w-0">
          <div className="grid grid-cols-2 gap-2">
            {termsSections.map(({ id, label }) => (
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

      <section className="min-w-0">
        <TermsContent activeSection={activeSection} />
      </section>
    </main>
  );
}
