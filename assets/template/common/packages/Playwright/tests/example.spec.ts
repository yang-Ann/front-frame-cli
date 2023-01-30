import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  // 网络空闲时打开指定的地址
  await page.goto("https://playwright.dev/", { waitUntil: "networkidle" });

  // 期望标题包含 "Playwright"
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/", { waitUntil: "networkidle" });

  // 点击"开始"链接
  await page.getByRole("link", { name: "Get started" }).click();

  // 期望URL包含 *intro
  await expect(page).toHaveURL(/.*intro/);
});
