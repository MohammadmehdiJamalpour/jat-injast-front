const BLOCK_TAG_PATTERN =
  /<\/?(?:address|article|aside|blockquote|br|div|footer|h[1-6]|header|li|main|nav|ol|p|section|tr|ul)\b[^>]*>/gi;
const SCRIPT_STYLE_PATTERN = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
const TAG_PATTERN = /<[^>]*>/g;

const NAMED_ENTITIES = {
  amp: "&",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
  apos: "'",
};

function decodeEntity(entity) {
  if (entity.startsWith("#x")) {
    return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
  }

  if (entity.startsWith("#")) {
    return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
  }

  return NAMED_ENTITIES[entity] || `&${entity};`;
}

export function htmlToPlainText(value) {
  if (typeof value !== "string") return "";

  return value
    .replace(SCRIPT_STYLE_PATTERN, "")
    .replace(BLOCK_TAG_PATTERN, "\n")
    .replace(TAG_PATTERN, "")
    .replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (_match, entity) => {
      try {
        return decodeEntity(entity.toLowerCase());
      } catch {
        return "";
      }
    })
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
