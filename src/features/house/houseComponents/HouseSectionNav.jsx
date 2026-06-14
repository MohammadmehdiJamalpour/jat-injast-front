
const sections = [
  { name: "calendar", label: "تقویم" },
  { name: "rooms",    label: "اتاق‌ها" },
  { name: "rules",    label: "قوانین" },
  { name: "comments", label: "دیدگاه‌ها" },
];

function HouseSectionsNav({ isVisible, onScrollTo, activeSection }) {
  return (
    <nav
      data-testid="house-section-nav"
      style={{ top: "calc(var(--header-offset, 0px) + 0.75rem)" }}
      aria-hidden={!isVisible}
      className={`fixed inset-x-0 z-[450] box-border px-3 transition-opacity duration-300 md:left-1/2 md:right-auto md:w-full md:max-w-md md:-translate-x-1/2 md:px-0
                  ${isVisible ? "opacity-100 pointer-events-auto"
                              : "opacity-0 pointer-events-none"}`}
    >
      <ul className="no-scrollbar flex max-w-full gap-2 overflow-x-auto rounded-3xl bg-primary-300 px-3 py-2 text-white shadow-centered lg:justify-start">
        {sections.map(({ name, label }) => (
          <li key={name} className="shrink-0">
            <button
              type="button"
              data-testid={`house-section-nav-${name}`}
              onClick={() => onScrollTo(name)}
              aria-current={activeSection === name ? "true" : undefined}
              className={`whitespace-nowrap rounded-3xl px-3 py-1.5 text-sm font-semibold leading-6 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80
                        ${activeSection === name
                          ? "bg-primary-600 shadow-sm"
                          : "bg-primary-300 hover:bg-primary-400"}`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default HouseSectionsNav;
