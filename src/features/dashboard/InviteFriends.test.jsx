import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import InviteFriends from "./InviteFriends";

describe("InviteFriends", () => {
  it("renders a copyable referral link with percentage and money units", () => {
    const html = renderToStaticMarkup(
      <InviteFriends
        user={{
          referral_code: "ABC123",
          referral_commission: 12,
          total_referral_earned: 125000,
        }}
      />,
    );

    expect(html).toContain("/login?referralcode=ABC123");
    expect(html).toContain("کپی لینک");
    expect(html).toContain("۱۲٪");
    expect(html).toContain("۱۲۵,۰۰۰ تومان");
    expect(html).not.toContain("۱۲۵,۰۰۰ نفر");
  });

  it("does not render undefined referral values when user fields are missing", () => {
    const html = renderToStaticMarkup(<InviteFriends user={{}} />);

    expect(html).toContain("کد دعوت برای حساب شما ثبت نشده است");
    expect(html).toContain("ثبت نشده");
    expect(html).not.toContain("undefined");
    expect(html).not.toContain("referralcode=undefined");
  });
});
