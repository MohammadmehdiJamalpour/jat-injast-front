import { absoluteUrl } from "./seo";

const publicRoutes = [
  { url: "/", priority: 1 },
  { url: "/search", priority: 0.9 },
  { url: "/about", priority: 0.6 },
  { url: "/how-become-host", priority: 0.6 },
  { url: "/terms-of-service", priority: 0.5 },
];

export default function sitemap() {
  const now = new Date();

  return publicRoutes.map((route) => ({
    url: absoluteUrl(route.url),
    lastModified: now,
    changeFrequency: route.url === "/" || route.url === "/search" ? "daily" : "monthly",
    priority: route.priority,
  }));
}
