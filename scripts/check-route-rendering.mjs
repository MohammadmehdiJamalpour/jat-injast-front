import { readFile } from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { expectedBuildRoutes } from "../src/app/route-modes.js";

const routeConfigChecks = [
  {
    path: "/",
    file: "src/app/page.jsx",
    checks: [/export const dynamic = "force-static"/],
  },
  {
    path: "/search",
    file: "src/app/search/page.jsx",
    checks: [/export const dynamic = "force-static"/],
  },
  {
    path: "/house/[uuid]",
    file: "src/app/house/[uuid]/page.jsx",
    checks: [
      /export const dynamic = "force-dynamic"/,
      /export const dynamicParams = true/,
    ],
  },
  {
    path: "/dashboard",
    file: "src/app/dashboard/page.jsx",
    checks: [/export const dynamic = "force-dynamic"/],
  },
  {
    path: "/dashboard/edit-house/[uuid]",
    file: "src/app/dashboard/edit-house/[uuid]/page.jsx",
    checks: [/export const dynamic = "force-dynamic"/],
  },
  {
    path: "/admin-panel",
    file: "src/app/admin-panel/page.jsx",
    checks: [/export const dynamic = "force-dynamic"/],
  },
  {
    path: "/login",
    file: "src/app/login/page.jsx",
    checks: [/export const dynamic = "force-static"/],
  },
  {
    path: "/panel/login-with-token",
    file: "src/app/panel/login-with-token/page.jsx",
    checks: [/export const dynamic = "force-dynamic"/],
  },
  {
    path: "/about",
    file: "src/app/about/page.jsx",
    checks: [/export const dynamic = "force-static"/],
  },
  {
    path: "/how-become-host",
    file: "src/app/how-become-host/page.jsx",
    checks: [/export const dynamic = "force-static"/],
  },
  {
    path: "/terms-of-service",
    file: "src/app/terms-of-service/page.jsx",
    checks: [/export const dynamic = "force-static"/],
  },
];

const expectedPrerenderedRoutes = [
  { path: "/", output: ["index.html"] },
  { path: "/search", output: ["search.html"] },
  { path: "/about", output: ["about.html"] },
  { path: "/how-become-host", output: ["how-become-host.html"] },
  { path: "/terms-of-service", output: ["terms-of-service.html"] },
  { path: "/login", output: ["login.html"] },
  { path: "/robots.txt", output: ["robots.txt.body"] },
  { path: "/sitemap.xml", output: ["sitemap.xml.body"] },
];

const expectedDynamicPrerenderRoutes = [];

const runtimeOnlyRoutes = [
  { path: "/house/[uuid]", unexpectedOutput: ["house", "[uuid].html"] },
  { path: "/dashboard", unexpectedOutput: ["dashboard.html"] },
  { path: "/dashboard/edit-house/[uuid]", unexpectedOutput: ["dashboard", "edit-house", "[uuid].html"] },
  { path: "/admin-panel", unexpectedOutput: ["admin-panel.html"] },
  { path: "/panel/login-with-token", unexpectedOutput: ["panel", "login-with-token.html"] },
  { path: "/api/map-ir/search" },
  { path: "/api/map-ir/autocomplete" },
];

function sourcePath(file) {
  return path.join(process.cwd(), ...file.split("/"));
}

function appOutputPath(segments) {
  return path.join(process.cwd(), ".next", "server", "app", ...segments);
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

async function readJson(file) {
  return JSON.parse(await readFile(path.join(process.cwd(), file), "utf8"));
}

const failures = [];

for (const route of routeConfigChecks) {
  const source = await readFile(sourcePath(route.file), "utf8");
  for (const check of route.checks) {
    if (!check.test(source)) {
      failures.push(`${route.path}: missing ${check}`);
    }
  }
}

const appPathRoutes = await readJson(".next/app-path-routes-manifest.json");
const builtRoutes = new Set(Object.values(appPathRoutes));
const prerenderManifest = await readJson(".next/prerender-manifest.json");

for (const expected of expectedBuildRoutes) {
  if (!builtRoutes.has(expected.path)) {
    failures.push(`${expected.path}: missing from built app-path manifest`);
  }
}

for (const expected of expectedPrerenderedRoutes) {
  if (!prerenderManifest.routes[expected.path]) {
    failures.push(`${expected.path}: missing from prerender manifest routes`);
  }

  const outputPath = appOutputPath(expected.output);
  if (!fileExists(outputPath)) {
    failures.push(`${expected.path}: missing static output ${path.relative(process.cwd(), outputPath)}`);
  }
}

for (const routePath of expectedDynamicPrerenderRoutes) {
  if (!prerenderManifest.dynamicRoutes[routePath]) {
    failures.push(`${routePath}: missing from prerender manifest dynamic routes`);
  }

  if (prerenderManifest.routes[routePath]) {
    failures.push(`${routePath}: should not be emitted as a fixed prerender route`);
  }
}

for (const route of runtimeOnlyRoutes) {
  if (prerenderManifest.routes[route.path] || prerenderManifest.dynamicRoutes[route.path]) {
    failures.push(`${route.path}: runtime-only route unexpectedly appears in prerender manifest`);
  }

  if (route.unexpectedOutput) {
    const outputPath = appOutputPath(route.unexpectedOutput);
    if (fileExists(outputPath)) {
      failures.push(`${route.path}: unexpected static output ${path.relative(process.cwd(), outputPath)}`);
    }
  }
}

if (failures.length) {
  console.error("Route rendering strategy check failed.");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Route rendering strategy check passed for ${routeConfigChecks.length} route configs, ${expectedBuildRoutes.length} built routes, ${expectedPrerenderedRoutes.length} prerendered outputs, and ${runtimeOnlyRoutes.length} runtime-only routes.`,
);
