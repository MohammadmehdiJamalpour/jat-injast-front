export const routeModes = {
  home: {
    path: "/",
    generation: "static route shell + CSR island",
    reason: "Marketing/home UI is public, but its legacy widgets still use browser APIs and React Query.",
  },
  search: {
    path: "/search",
    generation: "static route shell + CSR island",
    reason: "Filters, map state, and Leaflet interactions are client-only.",
  },
  house: {
    path: "/house/[uuid]",
    generation: "dynamic route + CSR island",
    reason: "The route depends on a house UUID and interactive reservation/calendar state.",
  },
  dashboard: {
    path: "/dashboard",
    generation: "dynamic route + CSR island",
    reason: "Auth, role panels, cookies, and mutations must run in the browser.",
  },
  adminPanel: {
    path: "/admin-panel",
    generation: "static route shell + CSR island",
    reason: "Admin data is staff-only, authenticated, and mutation-heavy in the browser.",
  },
  editHouse: {
    path: "/dashboard/edit-house/[uuid]",
    generation: "dynamic route + CSR island",
    reason: "Owner editing is authenticated and mutation-heavy.",
  },
  login: {
    path: "/login",
    generation: "static route shell + CSR island",
    reason: "The form is interactive and writes the auth cookie in the browser.",
  },
  staticContent: {
    paths: ["/about", "/how-become-host", "/terms-of-service"],
    generation: "static route shell + CSR island",
    reason: "Content routes are stable, with current legacy components mounted client-side.",
  },
};
