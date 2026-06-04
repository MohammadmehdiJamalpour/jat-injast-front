import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Table from "./Table";

const columns = [
  { key: "title", label: "عنوان" },
  { key: "status", label: "وضعیت", align: "center" },
];

describe("Table", () => {
  it("renders desktop and mobile-safe table content from one row source", () => {
    const html = renderToStaticMarkup(
      React.createElement(Table, {
        columns,
        rows: [{ id: "1", title: "رزرو شمال", status: "پرداخت شده" }],
        keyExtractor: (row) => row.id,
        mobileTitle: (row) => row.title,
        mobileMeta: (row) => row.status,
      }),
    );

    expect(html).toContain("<table");
    expect(html).toContain("رزرو شمال");
    expect(html).toContain("پرداخت شده");
    expect(html).toContain("md:hidden");
  });

  it("renders an empty state for missing rows", () => {
    const html = renderToStaticMarkup(
      React.createElement(Table, {
        columns,
        rows: [],
        emptyMessage: "موردی برای نمایش وجود ندارد.",
      }),
    );

    expect(html).toContain("موردی برای نمایش وجود ندارد.");
  });
});
