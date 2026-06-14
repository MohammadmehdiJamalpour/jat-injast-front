import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const routeStatsPath = path.join(
  rootDir,
  ".next",
  "diagnostics",
  "route-bundle-stats.json",
);

const kib = 1024;
const routeBudgets = {
  "/": 660 * kib,
  "/search": 660 * kib,
  "/house/[uuid]": 662 * kib,
  "/about": 720 * kib,
  "/how-become-host": 720 * kib,
  "/terms-of-service": 720 * kib,
};
const forbiddenInitialMarkers = [
  { label: "Leaflet", pattern: /leaflet|_leaflet_id|leaflet-bar/i },
  { label: "Swiper", pattern: /swiper-slide|__swiper__|SwiperSlide/i },
  { label: "Slick", pattern: /slick-carousel|react-slick/i },
  {
    label: "react-modern-calendar-datepicker",
    pattern: /react-modern-calendar-datepicker/i,
  },
];

function formatKiB(bytes) {
  return `${Math.round(bytes / kib)} KiB`;
}

if (!fs.existsSync(routeStatsPath)) {
  console.error(
    "Missing .next/diagnostics/route-bundle-stats.json. Run `npm run build` or `npm run analyze:bundles` first.",
  );
  process.exit(1);
}

const stats = JSON.parse(fs.readFileSync(routeStatsPath, "utf8"));
const byRoute = new Map(stats.map((entry) => [entry.route, entry]));
const failures = [];

for (const [route, budget] of Object.entries(routeBudgets)) {
  const entry = byRoute.get(route);
  if (!entry) {
    failures.push(`${route}: missing route bundle stats`);
    continue;
  }

  const actual = entry.firstLoadUncompressedJsBytes;
  if (actual > budget) {
    failures.push(
      `${route}: ${formatKiB(actual)} exceeds budget ${formatKiB(budget)}`,
    );
  }

  for (const chunkPath of entry.firstLoadChunkPaths || []) {
    if (!chunkPath.endsWith(".js")) continue;

    const absoluteChunkPath = path.resolve(rootDir, path.normalize(chunkPath));
    if (!fs.existsSync(absoluteChunkPath)) continue;

    const chunkText = fs.readFileSync(absoluteChunkPath, "utf8");
    for (const marker of forbiddenInitialMarkers) {
      if (marker.pattern.test(chunkText)) {
        failures.push(`${route}: first-load chunk includes ${marker.label}`);
      }
    }
  }
}

const summary = [...byRoute.values()]
  .filter((entry) => routeBudgets[entry.route])
  .sort((a, b) => b.firstLoadUncompressedJsBytes - a.firstLoadUncompressedJsBytes)
  .map(
    (entry) =>
      `${entry.route.padEnd(22)} ${formatKiB(entry.firstLoadUncompressedJsBytes)}`,
  );

console.log("Public route first-load JS budgets:");
console.log(summary.join("\n"));

if (failures.length) {
  console.error("\nPerformance budget failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("\nPerformance budget passed.");
