import { expect, test } from "@playwright/test";

const customer = {
  id: 1,
  name: "کاربر مهمان",
  first_name: "کاربر",
  last_name: "مهمان",
  phone: "09100000001",
  type: "Customer",
  birth_date: "1990-05-12",
  sex: "Male",
  city: null,
  wallet: { main: 0, blocked: 0 },
};

async function addAuthCookie(page, baseURL) {
  await page.context().addCookies([
    {
      name: "authToken",
      value: "test-token",
      url: baseURL || "http://127.0.0.1:3004",
    },
  ]);
}

async function stubProfileEditApi(page, onProfileUpdate) {
  await page.route("**/client/profile", async (route) => {
    const request = route.request();

    if (request.method() === "PUT") {
      onProfileUpdate(request.postDataBuffer()?.toString("utf8") || "");
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { ...customer, birth_date: "1990-05-10" },
        }),
      });
    }

    return route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: customer }),
    });
  });

  await page.route("**/assets/province", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    }),
  );
}

test("profile birthday picker submits Gregorian birth_date", async ({
  page,
  baseURL,
}) => {
  let profilePayload = "";

  await stubProfileEditApi(page, (payload) => {
    profilePayload = payload;
  });
  await addAuthCookie(page, baseURL);

  await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  await page.getByRole("tab", { name: "ویرایش اطلاعات" }).click();

  const birthday = page.getByRole("textbox", { name: "تاریخ تولد" });
  await expect(birthday).toHaveValue("۲۲ اردیبهشت ۱۳۶۹");

  await birthday.click();
  await page.getByRole("gridcell", { name: "۲۰ اردیبهشت ۱۳۶۹" }).click();
  await expect(birthday).toHaveValue("۲۰ اردیبهشت ۱۳۶۹");

  await page.getByRole("button", { name: "ذخیره تغییرات" }).click();
  await expect.poll(() => profilePayload).toContain('name="birth_date"');
  expect(profilePayload).toContain("1990-05-10");
  expect(profilePayload).not.toContain('name="birthDay"');
  expect(profilePayload).not.toContain('name="birthMonth"');
  expect(profilePayload).not.toContain('name="birthYear"');
});
