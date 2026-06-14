import { useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import FilterContent from "./FilterContent";

function getPanelAlignment(rect) {
  if (typeof window === "undefined" || !rect) return "center";

  const center = rect.left + rect.width / 2;
  const viewportWidth = window.innerWidth;

  if (center > viewportWidth * 0.55) return "right";
  if (center < viewportWidth * 0.45) return "left";
  return "center";
}

function getPanelAlignmentClass(alignment) {
  if (alignment === "right") return "md:left-auto md:right-0";
  if (alignment === "left") return "md:left-0 md:right-auto";
  return "md:left-1/2 md:right-auto md:-translate-x-1/2";
}

/**
 * Renders the full pill list + popovers for ≥ md screens.
 */
export default function DesktopFilters({ filters }) {
  const [activeFilter, setActiveFilter] = useState(null);
  const [panelAlignments, setPanelAlignments] = useState({});

  const openFilter = (filter, target) => {
    const alignment = getPanelAlignment(target?.getBoundingClientRect());

    setPanelAlignments((current) =>
      current[filter] === alignment
        ? current
        : { ...current, [filter]: alignment },
    );
    setActiveFilter(filter);
  };

  return (
    <div
      className="relative z-[1] mb-2.5 hidden min-w-0 flex-wrap justify-center gap-3 overflow-visible px-2 py-2 md:flex"
      data-testid="desktop-filter-bar"
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter;
        const panelAlignmentClass = getPanelAlignmentClass(
          panelAlignments[filter] || "center",
        );
        const popoverClassName = `relative md:block ${
          isActive ? "z-[17000]" : "z-[1]"
        }`;
        const panelClassName = [
          "absolute right-0 top-full z-[18000] mt-3 w-max",
          "max-w-[calc(100vw-1.5rem)] rounded-3xl border-2 border-primary-400",
          "bg-white p-5 text-right shadow-centered shadow-primary-50/70",
          "before:absolute before:inset-x-0 before:-top-3 before:h-3 before:content-['']",
          "md:max-w-md lg:max-w-2xl xl:max-w-3xl",
          panelAlignmentClass,
          "dark:bg-slate-950 dark:text-slate-100",
        ].join(" ");

        return (
          <Popover
            key={filter}
            className={popoverClassName}
            onMouseLeave={() => setActiveFilter(null)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setActiveFilter(null);
              }
            }}
            data-active-filter={isActive ? "true" : "false"}
          >
            <>
              <Popover.Button
                onMouseEnter={(event) => openFilter(filter, event.currentTarget)}
                onFocus={(event) => openFilter(filter, event.currentTarget)}
                onClick={(event) => {
                  if (activeFilter !== filter) {
                    openFilter(filter, event.currentTarget);
                  }
                  setActiveFilter((current) =>
                    current === filter ? null : filter,
                  );
                }}
                aria-expanded={activeFilter === filter}
                data-testid="desktop-filter-button"
                className="btn-press flex-shrink-0 rounded-full bg-primary-action px-4 py-2 text-sm text-primary-contrast shadow-centered shadow-primary-200/70 transition hover:bg-primary-action-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 whitespace-nowrap"
              >
                {filter}
              </Popover.Button>

              <Transition
                show={activeFilter === filter}
                enter="transition duration-150 ease-out"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition duration-100 ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
              >
                <Popover.Panel
                  static
                  onMouseEnter={() => setActiveFilter(filter)}
                  data-testid="desktop-filter-panel"
                  className={panelClassName}
                >
                  <FilterContent filter={filter} />
                  <button className="btn-press mx-auto mt-4 hidden w-full max-w-md rounded-3xl bg-primary-action py-2 text-sm font-semibold text-primary-contrast hover:bg-primary-action-hover md:block">
                  اعمال
                  </button>
                </Popover.Panel>
              </Transition>
            </>
          </Popover>
        );
      })}
    </div>
  );
}
