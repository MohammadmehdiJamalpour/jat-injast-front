import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Button from "./Button";

describe("Button", () => {
  it("renders primary buttons with the shared button styles", () => {
    const html = renderToStaticMarkup(<Button>ثبت</Button>);

    expect(html).toContain("btn-primary");
    expect(html).toContain("btn-press");
    expect(html).toContain('type="button"');
    expect(html).toContain("ثبت");
  });

  it("keeps loading and disabled button states accessible", () => {
    const html = renderToStaticMarkup(
      <Button loading disabled>
        ارسال
      </Button>,
    );

    expect(html).toContain("disabled");
    expect(html).toContain("animate-spin");
    expect(html).toContain("ارسال");
  });

  it("supports non-button elements without invalid disabled attributes", () => {
    const html = renderToStaticMarkup(
      <Button as="a" href="/search" disabled>
        جستجو
      </Button>,
    );

    expect(html).toContain('href="/search"');
    expect(html).toContain('aria-disabled="true"');
    expect(html).not.toContain('disabled=""');
  });

  it("renders semantic variants and sizes through shared classes", () => {
    const html = renderToStaticMarkup(
      <div>
        <Button variant="secondary" size="sm">تقویم</Button>
        <Button variant="danger" size="lg">حذف</Button>
        <Button variant="ghost">بازگشت</Button>
      </div>,
    );

    expect(html).toContain("btn-secondary");
    expect(html).toContain("bg-red-50");
    expect(html).toContain("bg-transparent");
    expect(html).toContain("px-3");
    expect(html).toContain("px-5");
  });
});
