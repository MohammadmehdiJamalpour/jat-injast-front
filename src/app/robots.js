import { getSiteUrl } from "./seo";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/search", "/about", "/how-become-host", "/terms-of-service", "/house/"],
        disallow: ["/dashboard", "/admin-panel", "/login", "/panel"],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
    host: getSiteUrl(),
  };
}
