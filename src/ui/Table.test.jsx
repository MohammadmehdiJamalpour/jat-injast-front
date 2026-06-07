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
      <Table
        columns={columns}
        rows={[{ id: "1", title: "رزرو شمال", status: "پرداخت شده" }]}
        keyExtractor={(row) => row.id}
        mobileTitle={(row) => row.title}
        mobileMeta={(row) => row.status}
      />,
    );

    expect(html).toContain("<table");
    expect(html).toContain("رزرو شمال");
    expect(html).toContain("پرداخت شده");
    expect(html).toContain("md:hidden");
  });

  it("renders custom cells and mobile subtitles", () => {
    const html = renderToStaticMarkup(
      <Table
        columns={[
          { key: "amount", label: "مبلغ", render: (row) => `${row.amount} تومان` },
          { key: "status", label: "وضعیت" },
        ]}
        rows={[{ id: "2", amount: "۳۰۰٬۰۰۰", status: "در انتظار" }]}
        keyExtractor={(row) => row.id}
        mobileTitle={(row) => row.status}
        mobileSubtitle={(row) => `کد ${row.id}`}
      />,
    );

    expect(html).toContain("۳۰۰٬۰۰۰ تومان");
    expect(html).toContain("در انتظار");
    expect(html).toContain("کد 2");
  });

  it("renders an empty state for missing rows", () => {
    const html = renderToStaticMarkup(
      <Table columns={columns} rows={[]} emptyMessage="موردی برای نمایش وجود ندارد." />,
    );

    expect(html).toContain("موردی برای نمایش وجود ندارد.");
  });
});
