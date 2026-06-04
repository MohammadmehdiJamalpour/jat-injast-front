import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

function SmoothCollapse({
  open,
  collapsedHeight = 128,
  duration = 300,
  className = "",
  children,
}) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(open ? collapsedHeight : collapsedHeight);

  const updateHeight = useCallback(() => {
    const content = contentRef.current;
    if (!content) return;

    setHeight(open ? content.scrollHeight : collapsedHeight);
  }, [collapsedHeight, open]);

  useLayoutEffect(() => {
    updateHeight();
  }, [updateHeight, children]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content || typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(() => {
      if (open) {
        setHeight(content.scrollHeight);
      }
    });

    observer.observe(content);
    return () => observer.disconnect();
  }, [open]);

  return (
    <div
      className={`overflow-hidden transition-[height] ease-in-out ${className}`}
      style={{
        height: `${height}px`,
        transitionDuration: `${duration}ms`,
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

export default SmoothCollapse;
