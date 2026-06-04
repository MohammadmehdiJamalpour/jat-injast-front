import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import FileUpload from "./FileUpload";
import SectionHeader from "./SectionHeader";
import Select from "./Select";
import Skeleton from "./Skeleton";
import Textarea from "./Textarea";

describe("form and layout primitives", () => {
  it("renders Textarea with label, helper, and RTL field surface", () => {
    const html = renderToStaticMarkup(
      React.createElement(Textarea, {
        label: "توضیحات",
        helper: "حداقل چند جمله بنویسید.",
        placeholder: "متن پیام",
      }),
    );

    expect(html).toContain("توضیحات");
    expect(html).toContain("حداقل چند جمله بنویسید.");
    expect(html).toContain('dir="rtl"');
    expect(html).toContain("field-surface");
  });

  it("renders Select options with a stable placeholder", () => {
    const html = renderToStaticMarkup(
      React.createElement(Select, {
        label: "شهر",
        options: [
          { value: "tehran", label: "تهران" },
          { value: "shiraz", label: "شیراز" },
        ],
      }),
    );

    expect(html).toContain("شهر");
    expect(html).toContain("انتخاب کنید");
    expect(html).toContain("تهران");
    expect(html).toContain("شیراز");
  });

  it("renders FileUpload with selected file names", () => {
    const files = [{ name: "avatar.png" }, { name: "contract.pdf" }];
    const html = renderToStaticMarkup(
      React.createElement(FileUpload, {
        label: "مدارک",
        files,
      }),
    );

    expect(html).toContain("مدارک");
    expect(html).toContain("avatar.png، contract.pdf");
    expect(html).toContain('type="file"');
  });

  it("renders SectionHeader title, subtitle, and action", () => {
    const html = renderToStaticMarkup(
      React.createElement(SectionHeader, {
        title: "کیف پول",
        subtitle: "مدیریت کارت ها و تراکنش ها",
        action: React.createElement("button", null, "افزودن کارت"),
      }),
    );

    expect(html).toContain("کیف پول");
    expect(html).toContain("مدیریت کارت ها و تراکنش ها");
    expect(html).toContain("افزودن کارت");
  });

  it("renders Skeleton variants with the expected geometry classes", () => {
    const html = renderToStaticMarkup(
      React.createElement("div", null, [
        React.createElement(Skeleton, { key: "line" }),
        React.createElement(Skeleton, { key: "card", variant: "card" }),
        React.createElement(Skeleton, { key: "avatar", variant: "avatar" }),
      ]),
    );

    expect(html).toContain("animate-pulse");
    expect(html).toContain("h-48");
    expect(html).toContain("rounded-full");
  });
});
