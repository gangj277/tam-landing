import fs from "fs/promises";
import path from "path";

import { chromium, type Frame, type Locator, type Page } from "playwright-core";

const STATE_PATH = path.resolve(
  process.cwd(),
  "../output/playwright/naver-blog/naver-auth-state.json",
);
const OUTPUT_DIR = path.resolve(
  process.cwd(),
  "../output/playwright/naver-blog/tam-launch-free-trial-cta-fix",
);
const LOG_NO = "224244493743";
const BLOG_ID = "tam-e";
const EDIT_URL = `https://blog.naver.com/${BLOG_ID}?Redirect=Update&logNo=${LOG_NO}`;
const PUBLIC_URL = `https://blog.naver.com/${BLOG_ID}/${LOG_NO}`;
const CTA_TEXT = "선착순 36가정, 탐 1개월 무료체험 사전 신청하기";
const CTA_URL = "https://www.tam-n.com/";

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });
  const context = await browser.newContext({
    storageState: STATE_PATH,
    viewport: { width: 1440, height: 1200 },
  });
  const page = await context.newPage();

  await page.goto(EDIT_URL, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);

  const frame = await getEditorFrame(page);
  await frame.locator("article p").first().waitFor({ state: "visible", timeout: 20000 });
  await dismissEditorPanels(page, frame);

  await updateCtaLink(page, frame, CTA_TEXT, CTA_URL);

  await page.screenshot({
    path: path.join(OUTPUT_DIR, "before-republish.png"),
    fullPage: true,
  });

  await frame.getByRole("button", { name: "발행", exact: true }).first().click();
  await page.waitForTimeout(1000);
  await frame.getByRole("button", { name: "발행", exact: true }).nth(1).click();
  await page.waitForURL(new RegExp(`blog\\.naver\\.com\\/${BLOG_ID}\\/${LOG_NO}|PostView\\.naver`), {
    timeout: 30000,
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(4000);

  await verifyPublic(browser);

  await context.close();
  await browser.close();
}

async function updateCtaLink(page: Page, frame: Frame, text: string, url: string) {
  const paragraph = frame
    .locator("article p")
    .filter({ hasText: text })
    .first();

  await paragraph.waitFor({ state: "visible", timeout: 10000 });
  await paragraph.scrollIntoViewIfNeeded();
  await paragraph.click({ force: true });
  await page.waitForTimeout(160);
  await page.keyboard.press("End").catch(() => undefined);
  await page.waitForTimeout(80);

  for (let i = 0; i < Array.from(text).length; i += 1) {
    await page.keyboard.press("Shift+ArrowLeft");
  }
  await page.waitForTimeout(180);

  await frame.locator("button.se-link-toolbar-button").last().click();
  const urlInput = frame.locator("input.se-custom-layer-link-input").last();
  await urlInput.waitFor({ state: "visible", timeout: 5000 });
  await urlInput.fill(url);
  await frame.locator("button.se-custom-layer-link-apply-button").last().click();
  await page.waitForTimeout(400);
  await page.keyboard.press("ArrowRight").catch(() => undefined);
  await page.keyboard.press("Enter").catch(() => undefined);
  await page.waitForTimeout(400);
}

async function verifyPublic(browser: import("playwright-core").Browser) {
  const verifyPage = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
  });
  await verifyPage.goto(PUBLIC_URL, { waitUntil: "networkidle" });
  await verifyPage.waitForTimeout(1500);

  const frame =
    verifyPage.frame({ name: "mainFrame" }) ??
    verifyPage.frames().find((candidate) => candidate.url().includes("PostView.naver"));

  if (!frame) {
    throw new Error("public mainFrame not found");
  }

  const anchors = await frame.evaluate(() =>
    Array.from(document.querySelectorAll("a")).map((anchor) => ({
      text: anchor.textContent?.trim() ?? "",
      href: anchor.href || anchor.getAttribute("href"),
    })),
  );

  await fs.writeFile(
    path.join(OUTPUT_DIR, "published-anchors.json"),
    JSON.stringify(anchors, null, 2),
    "utf8",
  );
  await verifyPage.screenshot({
    path: path.join(OUTPUT_DIR, "after-republish.png"),
    fullPage: true,
  });

  const cta = anchors.find((anchor) => anchor.text === CTA_TEXT);
  const hasUrl = cta?.href === CTA_URL;

  if (!hasUrl) {
    throw new Error(`CTA verification failed: href=${cta?.href ?? "missing"}`);
  }

  console.log(JSON.stringify({ url: PUBLIC_URL, href: cta.href }, null, 2));
  await verifyPage.close();
}

async function getEditorFrame(page: Page) {
  const frame =
    page.frame({ name: "mainFrame" }) ??
    page.frames().find((candidate) => candidate.url().includes("PostUpdateForm.naver"));

  if (!frame) {
    throw new Error("mainFrame not found");
  }

  return frame;
}

async function dismissEditorPanels(page: Page, frame: Frame) {
  const buttons = [
    frame.getByRole("button", { name: "닫기", exact: true }).last(),
    frame.getByRole("button", { name: "팝업 닫기", exact: true }).last(),
    frame.locator('button[aria-label="닫기"]').last(),
    frame.locator('button[title="닫기"]').last(),
  ];

  for (const button of buttons) {
    if (await isVisible(button)) {
      await button.click().catch(() => undefined);
      await page.waitForTimeout(140);
    }
  }

  await page.keyboard.press("Escape").catch(() => undefined);
  await page.keyboard.press("Escape").catch(() => undefined);
  await page.waitForTimeout(140);
}

async function isVisible(locator: Locator): Promise<boolean> {
  try {
    return await locator.isVisible();
  } catch {
    return false;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
