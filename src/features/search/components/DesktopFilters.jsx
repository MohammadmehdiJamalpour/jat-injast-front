import { useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import FilterContent from "./FilterContent";

/**
 * Renders the full pill list + popovers for ≥ md screens.
 */
export default function DesktopFilters({ filters }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="relative z-[6200] hidden md:flex gap-3 px-2 py-2 mb-2.5 overflow-x-auto scrollbar-none md:overflow-visible">
      {filters.map((filter) => (
        <Popover key={filter} className="relative z-[6200] md:block">
          <>
            <Popover.Button
              onMouseEnter={() => setHovered(filter)}
              onMouseLeave={() => setHovered(null)}
              className="btn-press flex-shrink-0 rounded-full bg-primary-action px-4 py-2 text-sm text-primary-contrast shadow-centered shadow-primary-200/70 transition focus:outline-none focus:ring-2 focus:ring-primary-300 hover:bg-primary-action-hover whitespace-nowrap"
            >
              {filter}
            </Popover.Button>

            <Transition
              show={hovered === filter}
              enter="transition duration-150 ease-out"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition duration-100 ease-in"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
            >
              <Popover.Panel
                static
                onMouseEnter={() => setHovered(filter)}
                onMouseLeave={() => setHovered(null)}
                className="absolute right-0 top-full z-[7000] mt-3 w-max max-w-md rounded-3xl border-2 border-primary-400 bg-white p-5 text-right shadow-centered shadow-primary-50/70 md:left-0 lg:max-w-2xl xl:max-w-3xl dark:bg-slate-950 dark:text-slate-100"
              >
                <FilterContent filter={filter} />
                <button className="btn-press mx-auto mt-4 hidden w-full max-w-md rounded-3xl bg-primary-action py-2 text-sm font-semibold text-primary-contrast hover:bg-primary-action-hover md:block">
                  اعمال
                </button>
              </Popover.Panel>
            </Transition>
          </>
        </Popover>
      ))}
    </div>
  );
}
