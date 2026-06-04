import React, {
  useState,
  useRef,
  useEffect,
  Fragment,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import FilterContent from "./FilterContent";

/**
 * Renders:
 *   • Three primary pills (< md)
 *   • Right-side sheet with all filters
 */
export default function MobileFilters({
  filters,
  mobilePrimary = ["تاریخ سفر", "تعداد نفرات"],
  mobileExtraLabel = "سایر فیلترها",
}) {
  const [openSheet, setOpenSheet] = useState(false);
  const [initialFilter, setInitialFilter] = useState(null);
  const sectionRefs = useRef({});

  /* Auto-scroll inside the sheet to the requested section */
  useEffect(() => {
    if (
      openSheet &&
      initialFilter &&
      sectionRefs.current[initialFilter]
    ) {
      sectionRefs.current[initialFilter].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [openSheet, initialFilter]);

  return (
    <>
      {/* ───── Pill row (mobile only) ───── */}
      <div className="relative z-[6200] flex gap-3 justify-evenly px-3 py-2.5 overflow-x-auto scrollbar-none md:hidden">
        {mobilePrimary.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setOpenSheet(true);
              setInitialFilter(filter);
            }}
            className="btn-press flex-shrink-0 rounded-full bg-primary-action px-4 py-2 text-sm text-primary-contrast shadow-centered shadow-primary-200/70 transition focus:outline-none focus:ring-2 focus:ring-primary-300 hover:bg-primary-action-hover whitespace-nowrap"
          >
            {filter}
          </button>
        ))}
        <button
          onClick={() => {
            setOpenSheet(true);
            setInitialFilter(null);
          }}
          className="btn-press flex-shrink-0 rounded-full bg-primary-action px-4 py-2 text-sm text-primary-contrast shadow-centered shadow-primary-200/70 transition focus:outline-none focus:ring-2 focus:ring-primary-300 hover:bg-primary-action-hover whitespace-nowrap"
        >
          {mobileExtraLabel}
        </button>
      </div>

      {/* ───── Right-side sheet ───── */}
      <Transition appear show={openSheet} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[7000] md:hidden"
          dir="rtl"
          onClose={() => setOpenSheet(false)}
        >
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-white/15 backdrop-blur-md dark:bg-white/5" />
          </Transition.Child>

          {/* Slide-in panel */}
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 flex justify-start">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="flex h-screen w-5/6 flex-col overflow-hidden rounded-l-3xl border border-primary-600 bg-white text-right shadow-centered shadow-primary-200/80 xs:w-4/5 550:w-6/8">
                  {/* Header */}
                  <header className="flex items-center rounded-3xl border-primary-600 shadow-centered shadow-primary-100/70 bg-primary-50/60 justify-between px-4 py-3 border-b flex-none">
                    <h2 className="text-lg font-semibold text-primary-800">فیلترها</h2>
                    <button
                      onClick={() => setOpenSheet(false)}
                      aria-label="بستن"
                      className="transition text-primary-600 hover:text-primary-700"
                    >
                      <XMarkIcon className="h-8 w-8 rounded-full bg-primary-action p-0.5 text-primary-contrast" />
                    </button>
                  </header>

                  {/* Scrollable content */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8">
                    {filters.map((filter) => (
                      <section
                        key={filter}
                        ref={(el) => (sectionRefs.current[filter] = el)}
                        className="space-y-4 text-primary-800 w-full mx-auto max-w-sm sm:max-w-md pt-2 xs:pt-3 "
                      >
                        {/* <h3 className="font-medium text-primary-500 text-sm">
                          {filter}
                        </h3> */}
                        
                        <FilterContent filter={filter} />
                      </section>
                    ))}
                  </div>

                  {/* Footer */}
                  <footer className="flex-none rounded-t-3xl border-primary-600 bg-primary-50/70 shadow-centered-lg-top shadow-primary-100 border-t px-4 py-4">
                    <button className="btn-press w-full rounded-3xl bg-primary-action py-3 text-sm font-semibold text-primary-contrast shadow-centered shadow-primary-100/70 hover:bg-primary-action-hover">
                      اعمال فیلترها
                    </button>
                  </footer>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
