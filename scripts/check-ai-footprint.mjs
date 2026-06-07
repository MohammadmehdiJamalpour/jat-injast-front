import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(root, "src");

const textExtensions = new Set([".js", ".jsx", ".ts", ".tsx"]);
const skippedDirectories = new Set([
  ".next",
  "coverage",
  "dist",
  "node_modules",
  "test-results",
]);

const isTestFile = (relativePath) =>
  /(^|\/)(?:test|__tests__)\//.test(relativePath) ||
  /\.(?:test|spec)\.[jt]sx?$/.test(relativePath);

const literal = (...parts) => parts.join("");
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const escapedLiteral = (...parts) => escapeRegExp(literal(...parts));
const anyLiteral = (...terms) =>
  `(?:${terms.map((term) => escapedLiteral(...term)).join("|")})`;

const bannedPatterns = [
  {
    name: "mojibake marker",
    pattern: /[\u00C2-\u00C3\u00D8-\u00DB\uFFFD]|\u00C3\u00A2/,
  },
  {
    name: "placeholder domain",
    pattern:
      /(?:placeholder\.com|example\.com|[\w.-]+@[\w.-]+\.test\b|https?:\/\/[^\s"'<>]+\.test\b)/i,
  },
  {
    name: "placeholder production name",
    pattern: new RegExp(
      `\\b${anyLiteral(["mock"], ["sample"])}\\w*\\b|\\b${anyLiteral(["dummy"], ["fake"])}\\b`,
      "i",
    ),
  },
  {
    name: "instruction comment marker",
    pattern: new RegExp(
      `\\b${anyLiteral(
        ["adjust if needed"],
        ["correct relative path"],
        ["or the correct relative path"],
        ["Make sure"],
        ["Handle errors if needed"],
      )}\\b`,
      "i",
    ),
  },
  {
    name: "source path header",
    pattern: /^\s*\/\/\s*(?:src\/|components\/|utils\/|[\w.-]+\.(?:jsx?|tsx?))\s*$/i,
  },
  {
    name: "decorative section comment",
    pattern: /^\s*(?:\/\/|\/\*+|\{\s*\/\*)[^\n]*(?:[-=\u2500\u2501\u2014]{3,})/u,
  },
  {
    name: "edit marker",
    pattern: new RegExp(
      `\\b${anyLiteral(
        ["FULL", " ", "FILE"],
        ["Additional function"],
        ["UPDATED"],
        ["NEW"],
      )}\\b`,
    ),
  },
];

function walkFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      if (skippedDirectories.has(entry.name)) return [];
      return walkFiles(path.join(directory, entry.name));
    }

    const fullPath = path.join(directory, entry.name);
    if (!entry.isFile() || !textExtensions.has(path.extname(entry.name))) {
      return [];
    }

    return [fullPath];
  });
}

const violations = [];

for (const filePath of walkFiles(sourceRoot)) {
  const relativePath = path.relative(root, filePath).replaceAll("\\", "/");
  if (isTestFile(relativePath)) continue;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const rule of bannedPatterns) {
      if (rule.pattern.test(line)) {
        violations.push(`${relativePath}:${index + 1} ${rule.name}`);
      }
    }
  });
}

if (violations.length > 0) {
  process.stderr.write(`Frontend AI-footprint audit failed:\n${violations.join("\n")}\n`);
  process.exit(1);
}

process.stdout.write("Frontend AI-footprint audit passed.\n");
