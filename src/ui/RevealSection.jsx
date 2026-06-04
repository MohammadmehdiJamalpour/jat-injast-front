import React, { forwardRef, useEffect, useRef, useState } from "react";

function setRefs(node, refs) {
  refs.forEach((ref) => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(node);
    } else {
      ref.current = node;
    }
  });
}

const RevealSection = forwardRef(function RevealSection(
  {
    as: Component = "section",
    className = "",
    threshold = 0.12,
    rootMargin = "0px 0px -10% 0px",
    once = true,
    children,
    ...props
  },
  forwardedRef,
) {
  const localRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = localRef.current;
    if (!node) return undefined;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setVisible(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return (
    <Component
      ref={(node) => {
        localRef.current = node;
        setRefs(node, [forwardedRef]);
      }}
      className={`reveal-section ${visible ? "is-visible" : ""} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

export default RevealSection;
