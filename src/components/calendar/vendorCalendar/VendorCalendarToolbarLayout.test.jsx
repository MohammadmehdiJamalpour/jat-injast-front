import fs from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import DateRangeSelector from "./DateRangeSelector";
import OperationButtons from "./OperationButtons";

describe("vendor calendar toolbar layout", () => {
  it("renders desktop date inputs as a joined two-half selector", () => {
    const html = renderToStaticMarkup(
      <DateRangeSelector
        operationGroup="peak"
        reserveDateFrom={{ readAbleDate: "1405/04/01" }}
        reserveDateTo={null}
      />,
    );

    expect(html).toContain("md:grid-cols-2");
    expect(html).toContain("md:gap-0");
    expect(html).toContain("md:border-r");
    expect(html).toContain("md:ring-inset");
  });

  it("keeps operation buttons equal width and contained on desktop", () => {
    const html = renderToStaticMarkup(
      <OperationButtons
        handleReset={() => {}}
        openOperationFlow={() => {}}
        operationGroup={null}
      />,
    );
    const activeHtml = renderToStaticMarkup(
      <OperationButtons
        handleReset={() => {}}
        openOperationFlow={() => {}}
        operationGroup="price"
      />,
    );

    expect(html).toContain("md:grid-cols-2");
    expect(html).not.toContain("md:w-[34rem]");
    expect(activeHtml).not.toContain("md:w-[42rem]");
    expect(activeHtml).toContain("md:grid-cols-2");
    expect(activeHtml).not.toContain("md:col-span-2");
    expect(activeHtml.match(/<button/g)).toHaveLength(4);
    expect(activeHtml).toContain("border-red-600 bg-transparent");
    expect(activeHtml).toContain("hover:bg-red-600");
    expect(html).toContain("lg:h-full");
    expect(html).toContain("lg:grid-rows-2");
  });

  it("scopes the compact modal width, responsive grid toolbar, and title pill to the vendor calendar", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "src/components/calendar/VendorCalendar.jsx"),
      "utf8",
    );
    const operationModalSource = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/components/calendar/vendorCalendar/OperationModal.jsx",
      ),
      "utf8",
    );

    expect(source).toContain('maxWidth="md:max-w-[80vw]"');
    expect(source).toContain(
      'maxHeightClassName="max-h-[calc(100vh-5rem)] md:max-h-[calc(100vh-6rem)]"',
    );
    expect(source).toContain("rounded-2xl border border-primary-100");
    expect(source).toContain("md:grid-cols-2");
    expect(source).toContain("md:grid-rows-[auto_auto]");
    expect(source).toContain("lg:grid-cols-[minmax(0,60%)_minmax(0,40%)]");
    expect(source).toContain("xl:grid-cols-[minmax(0,70%)_minmax(0,30%)]");
    expect(source).toContain("lg:grid-rows-[auto_auto]");
    expect(source).toContain(
      'className="w-full min-w-0 md:col-span-2 md:row-start-2 md:self-end lg:col-span-1 lg:col-start-1 lg:row-start-2 xl:ml-auto xl:w-[60%] 2xl:w-[55%]"',
    );
    expect(source).toContain(
      'className="w-full min-w-0 md:col-start-2 md:row-start-1 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-full lg:self-stretch"',
    );
    expect(source).toContain("inline-flex h-8 w-fit max-w-full");
    expect(source.indexOf("<DateRangeSelector")).toBeLessThan(
      source.indexOf("<OperationButtons"),
    );
    expect(operationModalSource).toContain(
      'COMPACT_OPERATION_MODAL_MAX_WIDTH = "max-w-md"',
    );
    expect(operationModalSource).not.toContain('maxWidth="max-w-3xl"');
  });
});
