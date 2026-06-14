import { describe, expect, it } from "vitest";

import { htmlToPlainText } from "./htmlText";

describe("htmlToPlainText", () => {
  it("removes tags and script content while preserving readable text", () => {
    expect(
      htmlToPlainText(
        "<p>Flexible &amp; safe</p><script>alert('xss')</script><p>Second line</p>",
      ),
    ).toBe("Flexible & safe\n\nSecond line");
  });

  it("decodes numeric entities without returning HTML", () => {
    expect(htmlToPlainText("A &#x3C;strong&#x3E; tag")).toBe(
      "A <strong> tag",
    );
  });
});
