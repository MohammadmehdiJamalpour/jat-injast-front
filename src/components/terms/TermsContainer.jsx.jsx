import React, { useCallback, useEffect, useState } from "react";
import TermsSidebar from "./TermsSidebar";
import TermsContent, { SECTION_IDS } from "./TermsContent";

function TermsContainer() {
  const [activeSection, setActiveSection] = useState("intro");

  /* اسکرول نرمِ کل صفحه */
  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  /* IntersectionObserver روی viewport */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { root: null, rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="md:container xl:max-w-9xl grid md:grid-cols-12 gap-4">
      {/* سایدبار ثابت */}
      <div className="hidden md:block md:col-span-3 px-2">
        <TermsSidebar activeSection={activeSection} scrollTo={scrollTo} />
      </div>

      {/* محتوای اصلی (بی‌مرز و بدون محدودیت) */}
      <div className="md:col-span-9 px-2">
        <TermsContent activeSection={activeSection} />
      </div>
    </div>
  );
}

export default TermsContainer;
