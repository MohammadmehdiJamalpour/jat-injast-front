import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MessagesPreview from "./MessagesPreview";

describe("MessagesPreview", () => {
  it("renders chat messages with a scrollable message area and send controls", () => {
    const html = renderToStaticMarkup(
      React.createElement(MessagesPreview, {
        title: "آخرین پیام‌ها",
        subtitle: "گفتگو درباره رزرو",
        messagesAreaClassName: "max-h-[60vh]",
        messages: [
          {
            id: 1,
            message: "رزرو تایید شد.",
            created_at: "2026-06-03T08:00:00Z",
            is_mine: true,
          },
          {
            id: 2,
            message: "ممنون از پیگیری شما.",
            created_at: "2026-06-03T08:10:00Z",
            is_mine: false,
          },
        ],
        newMessage: "",
        setNewMessage: () => {},
        onSendMessage: () => {},
      }),
    );

    expect(html).toContain("آخرین پیام‌ها");
    expect(html).toContain("رزرو تایید شد.");
    expect(html).toContain("ممنون از پیگیری شما.");
    expect(html).toContain("overflow-y-auto");
    expect(html).toContain("max-h-[60vh]");
    expect(html).toContain("type=\"file\"");
  });
});
