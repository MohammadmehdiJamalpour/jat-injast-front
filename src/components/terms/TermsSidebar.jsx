import React from "react";
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/solid";

const ICON = "ml-1 w-5 h-5 text-current";

/* فقط سه بخش اصلی */
const TABS = [
  { id: "general",      label: "عمومی",     Icon: DocumentTextIcon },
  { id: "commitments",  label: "تعهدات",   Icon: ShieldCheckIcon   },
  { id: "cancellation", label: "لغو رزرو", Icon: ArrowUturnLeftIcon },
];

function TermsSidebar({ activeSection, scrollTo }) {
  return (
    <nav className="flex flex-col items-center gap-y-2 md:sticky md:top-28">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className={`tab ${activeSection === id ? "tab-selected" : "tab-hover"}`}
        >
          {label}
          <Icon className={ICON} />
        </button>
      ))}
    </nav>
  );
}

export default TermsSidebar;
