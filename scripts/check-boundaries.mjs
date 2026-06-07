import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "src");
const sourceExtensions = new Set([".js", ".jsx", ".ts", ".tsx"]);
const skippedDirectories = new Set([".next", "coverage", "dist", "node_modules"]);

const importPattern =
  /(?:import|export)\s+(?:[^'"()]+?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;

function toPosix(filePath) {
  return filePath.replaceAll("\\", "/");
}

function walkFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (skippedDirectories.has(entry.name)) return [];
      return walkFiles(fullPath);
    }

    if (!entry.isFile() || !sourceExtensions.has(path.extname(entry.name))) {
      return [];
    }

    return [fullPath];
  });
}

function resolveSourceImport(importerRelativePath, specifier) {
  if (specifier.startsWith("@/")) {
    return `src/${specifier.slice(2)}`;
  }

  if (!specifier.startsWith(".")) {
    return null;
  }

  const importerDirectory = path.dirname(path.join(root, importerRelativePath));
  const resolvedPath = path.relative(
    root,
    path.resolve(importerDirectory, specifier),
  );

  return toPosix(resolvedPath);
}

function featureName(relativePath) {
  const match = relativePath.match(/^src\/features\/([^/]+)/);
  return match?.[1] ?? null;
}

function ruleFor(importer, target) {
  if (!target?.startsWith("src/")) return null;

  if (importer.startsWith("src/ui/") && target.startsWith("src/features/")) {
    return "ui cannot import feature code";
  }

  if (
    importer.startsWith("src/services/") &&
    (target.startsWith("src/features/") ||
      target.startsWith("src/components/") ||
      target.startsWith("src/ui/"))
  ) {
    return "services cannot import UI or feature code";
  }

  if (importer.startsWith("src/app/") && target.startsWith("src/services/")) {
    return "routes cannot import services directly";
  }

  const importerFeature = featureName(importer);
  const targetFeature = featureName(target);
  if (importerFeature && targetFeature && importerFeature !== targetFeature) {
    return "features cannot import unrelated feature internals";
  }

  return null;
}

const violations = [];

for (const filePath of walkFiles(sourceRoot)) {
  const relativePath = toPosix(path.relative(root, filePath));
  const content = fs.readFileSync(filePath, "utf8");

  for (const match of content.matchAll(importPattern)) {
    const specifier = match[1] || match[2];
    const target = resolveSourceImport(relativePath, specifier);
    const rule = ruleFor(relativePath, target);

    if (rule) {
      violations.push(`${relativePath} -> ${specifier}: ${rule}`);
    }
  }
}

if (violations.length > 0) {
  process.stderr.write(`Frontend boundary check failed:\n${violations.join("\n")}\n`);
  process.exit(1);
}

process.stdout.write("Frontend boundary check passed.\n");
