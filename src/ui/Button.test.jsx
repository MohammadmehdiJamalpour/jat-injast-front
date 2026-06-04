import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Button from "./Button";

describe("Button", () => {
  it("renders primary buttons with the shared button styles", () => {
    const html = renderToStaticMarkup(React.createElement(Button, null, "ثبت"));

    expect(html).toContain("btn-primary");
    expect(html).toContain("btn-press");
    expect(html).toContain('type="button"');
    expect(html).toContain("ثبت");
  });

  it("keeps loading and disabled button states accessible", () => {
    const html = renderToStaticMarkup(
      React.createElement(Button, { loading: true, disabled: true }, "ارسال"),
    );

    expect(html).toContain("disabled");
    expect(html).toContain("animate-spin");
    expect(html).toContain("ارسال");
  });

  it("supports non-button elements without invalid disabled attributes", () => {
    const html = renderToStaticMarkup(
      React.createElement(Button, { as: "a", href: "/search", disabled: true }, "جستجو"),
    );

    expect(html).toContain('href="/search"');
    expect(html).toContain('aria-disabled="true"');
    expect(html).not.toContain('disabled=""');
  });
});
