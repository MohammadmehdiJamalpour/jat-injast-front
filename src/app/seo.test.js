import { afterEach, beforeEach, describe, expect, it } from "vitest";

import robots from "./robots";
import { absoluteUrl, createPageMetadata, jsonLdScript } from "./seo";
import sitemap from "./sitemap";

const ORIGINAL_ENV = { ...process.env };
const siteUrl = "https://www.jat-injast.local";

function restoreEnv() {
  for (const key of Object.keys(process.env)) {
    if (!(key in ORIGINAL_ENV)) {
      delete process.env[key];
    }
  }
  Object.assign(process.env, ORIGINAL_ENV);
}

describe("SEO metadata helpers", () => {
  beforeEach(() => {
    restoreEnv();
    process.env.NEXT_PUBLIC_SITE_URL = siteUrl;
  });

  afterEach(() => {
    restoreEnv();
  });

  it("creates canonical and social URLs from the configured site origin", () => {
    const metadata = createPageMetadata({
      path: "/search",
      title: "Search",
      description: "Find stays by destination, date, capacity, and amenities.",
      image: "/assets/images/app-icons-dark-tile/app-icon-dark-navy-512.png",
    });

    expect(metadata.alternates.canonical).toBe(`${siteUrl}/search`);
    expect(metadata.openGraph.url).toBe(`${siteUrl}/search`);
    expect(metadata.openGraph.images[0].url).toBe(
      `${siteUrl}/assets/images/app-icons-dark-tile/app-icon-dark-navy-512.png`,
    );
    expect(metadata.twitter.card).toBe("summary_large_image");
  });

  it("keeps structured data safe for inline JSON-LD scripts", () => {
    expect(jsonLdScript({ name: "<script>" }).__html).toBe(
      '{"name":"\\u003cscript>"}',
    );
  });

  it("publishes a crawl policy and sitemap only for public routes", () => {
    const policy = robots();
    const [rules] = policy.rules;

    expect(policy.host).toBe(siteUrl);
    expect(policy.sitemap).toBe(`${siteUrl}/sitemap.xml`);
    expect(rules.allow).toEqual(
      expect.arrayContaining([
        "/",
        "/search",
        "/about",
        "/how-become-host",
        "/terms-of-service",
        "/house/",
      ]),
    );
    expect(rules.disallow).toEqual(
      expect.arrayContaining(["/dashboard", "/admin-panel", "/login", "/panel"]),
    );
  });

  it("includes deployment-known public routes in the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toEqual(
      expect.arrayContaining([
        absoluteUrl("/"),
        absoluteUrl("/search"),
        absoluteUrl("/about"),
        absoluteUrl("/how-become-host"),
        absoluteUrl("/terms-of-service"),
      ]),
    );
    expect(urls.some((url) => url.includes("/dashboard"))).toBe(false);
    expect(sitemap()[0].lastModified).toBeInstanceOf(Date);
  });
});
