import { renderToStaticMarkup } from "react-dom/server";
import fs from "node:fs";
import { describe, expect, it } from "vitest";

import IconButton from "./IconButton";

describe("overlay and icon primitives", () => {
  it("renders IconButton with an accessible name and stable button defaults", () => {
    const html = renderToStaticMarkup(
      <IconButton label="Close panel">
        <span aria-hidden="true">x</span>
      </IconButton>,
    );

    expect(html).toContain('type="button"');
    expect(html).toContain('aria-label="Close panel"');
    expect(html).toContain('title="Close panel"');
    expect(html).toContain("rounded-full");
  });

  it("keeps IconButton loading and link-like disabled states accessible", () => {
    const html = renderToStaticMarkup(
      <div>
        <IconButton label="Saving" loading />
        <IconButton as="a" href="/dashboard" label="Dashboard" disabled>
          <span>open</span>
        </IconButton>
      </div>,
    );

    expect(html).toContain("animate-spin");
    expect(html).toContain('href="/dashboard"');
    expect(html).toContain('aria-disabled="true"');
  });

  it("keeps Modal wired to RTL dialog structure and close control", () => {
    const modalFile = fs.readFileSync(new URL("./Modal.jsx", import.meta.url), "utf8");

    expect(modalFile).toContain('dir="rtl"');
    expect(modalFile).toContain("<Dialog");
    expect(modalFile).toContain("<Dialog.Title");
    expect(modalFile).toContain("aria-label");
    expect(modalFile).toContain("onClose");
  });
});
