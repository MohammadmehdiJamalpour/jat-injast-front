import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Badge from "./Badge";
import Card from "./Card";
import FileUpload from "./FileUpload";
import PriceLabel from "./PriceLabel";
import ScrollablePanel from "./ScrollablePanel";
import SectionHeader from "./SectionHeader";
import Select from "./Select";
import Skeleton from "./Skeleton";
import Textarea from "./Textarea";

describe("form and layout primitives", () => {
  it("renders Badge tones with readable theme classes", () => {
    const html = renderToStaticMarkup(
      <div>
        <Badge tone="success">پرداخت شده</Badge>
        <Badge tone="danger">ناموفق</Badge>
        <Badge tone="neutral">در انتظار</Badge>
      </div>,
    );

    expect(html).toContain("bg-emerald-50");
    expect(html).toContain("bg-red-50");
    expect(html).toContain("dark:text-sky-100");
    expect(html).toContain("پرداخت شده");
  });

  it("renders Card variants while preserving semantic element selection", () => {
    const html = renderToStaticMarkup(
      <Card as="section" variant="glass" padding="p-6" className="custom-card">
        محتوای کارت
      </Card>,
    );

    expect(html).toContain("<section");
    expect(html).toContain("backdrop-blur-xl");
    expect(html).toContain("p-6");
    expect(html).toContain("custom-card");
    expect(html).toContain("محتوای کارت");
  });

  it("renders Textarea with label, helper, error, and RTL field surface", () => {
    const html = renderToStaticMarkup(
      <Textarea
        label="توضیحات"
        helper="حداقل چند جمله بنویسید."
        error="توضیحات الزامی است."
        placeholder="متن پیام"
      />,
    );

    expect(html).toContain("توضیحات");
    expect(html).toContain("توضیحات الزامی است.");
    expect(html).toContain('dir="rtl"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain("field-surface");
  });

  it("renders Select options with placeholder, helper, and error state", () => {
    const html = renderToStaticMarkup(
      <Select
        label="شهر"
        helper="شهر محل اقامتگاه را انتخاب کنید."
        error="انتخاب شهر الزامی است."
        options={[
          { value: "tehran", label: "تهران" },
          { value: "shiraz", label: "شیراز" },
        ]}
      />,
    );

    expect(html).toContain("شهر");
    expect(html).toContain("انتخاب کنید");
    expect(html).toContain("تهران");
    expect(html).toContain("شیراز");
    expect(html).toContain("انتخاب شهر الزامی است.");
    expect(html).toContain('aria-invalid="true"');
  });

  it("renders FileUpload with selected file names and file attributes", () => {
    const files = [{ name: "avatar.png" }, { name: "contract.pdf" }];
    const html = renderToStaticMarkup(
      <FileUpload label="مدارک" helper="تصویر یا فایل PDF" files={files} accept="image/*,.pdf" multiple />,
    );

    expect(html).toContain("مدارک");
    expect(html).toContain("تصویر یا فایل PDF");
    expect(html).toContain("avatar.png، contract.pdf");
    expect(html).toContain('accept="image/*,.pdf"');
    expect(html).toContain("multiple");
    expect(html).toContain('type="file"');
  });

  it("renders SectionHeader title, subtitle, action, and center alignment", () => {
    const html = renderToStaticMarkup(
      <SectionHeader
        align="center"
        title="کیف پول"
        subtitle="مدیریت کارت‌ها و تراکنش‌ها"
        action={<button type="button">افزودن کارت</button>}
      />,
    );

    expect(html).toContain("کیف پول");
    expect(html).toContain("مدیریت کارت‌ها و تراکنش‌ها");
    expect(html).toContain("افزودن کارت");
    expect(html).toContain("text-center");
  });

  it("renders ScrollablePanel with themed scrollbar and max height", () => {
    const html = renderToStaticMarkup(
      <ScrollablePanel maxHeight="20rem" className="panel-extra">
        <p>محتوا</p>
      </ScrollablePanel>,
    );

    expect(html).toContain('style="max-height:20rem"');
    expect(html).toContain("scrollbar-thin");
    expect(html).toContain("panel-extra");
  });

  it("renders PriceLabel with Persian digits and currency", () => {
    const html = renderToStaticMarkup(<PriceLabel value={1250000} />);

    expect(html).toContain("۱,۲۵۰,۰۰۰");
    expect(html).toContain("تومان");
  });

  it("renders Skeleton variants with the expected geometry classes", () => {
    const html = renderToStaticMarkup(
      <div>
        <Skeleton />
        <Skeleton variant="card" />
        <Skeleton variant="avatar" />
        <Skeleton variant="table" className="custom-skeleton" />
      </div>,
    );

    expect(html).toContain("animate-pulse");
    expect(html).toContain("h-48");
    expect(html).toContain("rounded-full");
    expect(html).toContain("custom-skeleton");
  });
});
