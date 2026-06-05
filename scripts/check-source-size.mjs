import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "src");
const maxFeatureLines = 350;
const sourceExtensions = new Set([".js", ".jsx", ".ts", ".tsx"]);
const allowedLargeFiles = new Set([
  "src/i18n/fa.js",
  "src/features/admin/adminConfig.js",
]);

function walkFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (["node_modules", ".next", "dist", "coverage"].includes(entry.name)) {
        return [];
      }

      return walkFiles(fullPath);
    }

    if (!entry.isFile() || !sourceExtensions.has(path.extname(entry.name))) {
      return [];
    }

    return [fullPath];
  });
}

const violations = [];

for (const filePath of walkFiles(sourceRoot)) {
  const relativePath = path.relative(root, filePath).replaceAll("\\", "/");
  if (allowedLargeFiles.has(relativePath)) continue;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/).length;
  if (lines > maxFeatureLines) {
    violations.push(`${relativePath}: ${lines} lines`);
  }
}

if (violations.length > 0) {
  process.stderr.write(
    `Frontend source-size check failed. Split these files below ${maxFeatureLines} lines:\n${violations.join("\n")}\n`,
  );
  process.exit(1);
}

process.stdout.write("Frontend source-size check passed.\n");
