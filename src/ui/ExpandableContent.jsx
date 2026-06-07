import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Disclosure } from "@headlessui/react";
import SmoothCollapse from "./SmoothCollapse";

export const expandableButtonClassName =
  "btn-press inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-800 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-300";

function ExpandableContent({
  children,
  collapsedHeight = 128,
  duration = 320,
  contentClassName = "",
  buttonClassName = expandableButtonClassName,
  fadeClassName = "",
  expandLabel = "مشاهده بیشتر...",
  collapseLabel = "بستن",
  dir,
}) {
  const measureRef = useRef(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  const updateOverflow = useCallback(() => {
    const element = measureRef.current;
    if (!element) return;

    setHasOverflow(element.scrollHeight > collapsedHeight + 2);
  }, [collapsedHeight]);

  useLayoutEffect(() => {
    updateOverflow();
  }, [children, updateOverflow]);

  useEffect(() => {
    const element = measureRef.current;
    if (!element || typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(updateOverflow);
    observer.observe(element);

    return () => observer.disconnect();
  }, [updateOverflow]);

  return (
    <Disclosure>
      {({ open }) => (
        <div>
          <div className="relative">
            <SmoothCollapse
              open={!hasOverflow || open}
              collapsedHeight={collapsedHeight}
              duration={duration}
            >
              <div ref={measureRef} className={contentClassName} dir={dir}>
                {children}
              </div>
            </SmoothCollapse>

            {hasOverflow && !open && (
              <div
                className={`surface-fade pointer-events-none absolute bottom-0 left-0 h-10 w-full rounded-b-xl ${fadeClassName}`}
              />
            )}
          </div>

          {hasOverflow && (
            <div className="mt-2">
              <Disclosure.Button className={buttonClassName} aria-expanded={open}>
                {open ? collapseLabel : expandLabel}
              </Disclosure.Button>
            </div>
          )}
        </div>
      )}
    </Disclosure>
  );
}

export default ExpandableContent;
