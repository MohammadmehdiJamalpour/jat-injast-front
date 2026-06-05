import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "src");

const textExtensions = new Set([
  ".css",
  ".js",
  ".jsx",
  ".json",
  ".mjs",
  ".ts",
  ".tsx",
]);

const allowedConsoleFiles = new Set([
  path.normalize("src/utils/reportClientError.js"),
]);

const bannedPatterns = [
  {
    name: "mojibake marker",
    pattern: /[\u00C2-\u00C3\u00D8-\u00DB\uFFFD]|â/,
  },
  {
    name: "console.log",
    pattern: /\bconsole\.log\s*\(/,
  },
  {
    name: "direct console.error",
    pattern: /\bconsole(?:\?\.)?\.?error\s*(?:\?\.|\.)?\s*\(/,
    allowFile: allowedConsoleFiles,
  },
  {
    name: "TODO/FIXME",
    pattern: /\b(?:TODO|FIXME)\b/i,
  },
  {
    name: "placeholder copy",
    pattern: /\b(?:dummy|fake)\b/i,
  },
  {
    name: "generated file marker",
    pattern: /\bFULL FILE\b/i,
  },
  {
    name: "generated edit marker",
    pattern: /\b(?:NEW|UPDATED|Additional function)\b/,
  },
  {
    name: "source path header",
    pattern: /^\/\/\s*src\//,
  },
  {
    name: "legacy typo marker",
    pattern:
      /\b(?:veondorCalendar|useHouseCalenderData|RatingStarts|TermsContainer\.jsx\.jsx)\b/,
  },
];

function walkFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (["node_modules", ".next", "dist", "coverage"].includes(entry.name)) {
        return [];
      }
      return walkFiles(fullPath);
    }

    if (!entry.isFile() || !textExtensions.has(path.extname(entry.name))) {
      return [];
    }

    return [fullPath];
  });
}

const violations = [];

for (const filePath of walkFiles(sourceRoot)) {
  const relativePath = path.relative(root, filePath).replaceAll("\\", "/");
  const normalizedRelativePath = path.normalize(relativePath);
  const content = fs.readFileSync(filePath, "utf8");

  for (const rule of bannedPatterns) {
    if (rule.allowFile?.has(normalizedRelativePath)) {
      continue;
    }

    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (rule.pattern.test(line)) {
        violations.push(`${relativePath}:${index + 1} ${rule.name}`);
      }
    });
  }
}

if (violations.length > 0) {
  process.stderr.write(`Frontend hygiene check failed:\n${violations.join("\n")}\n`);
  process.exit(1);
}

process.stdout.write("Frontend hygiene check passed.\n");
