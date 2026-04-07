import fs from "fs/promises";
import path from "path";

import { chromium, type Frame, type Locator, type Page } from "playwright-core";

const STATE_PATH = path.resolve(
  process.cwd(),
  "../output/playwright/naver-blog/naver-auth-state.json",
);
const OUTPUT_DIR = path.resolve(
  process.cwd(),
  "../output/playwright/naver-blog/parent-career-conversation-flagship-cta-fix-v3",
);
const LOG_NO = "224244462427";
const EDIT_URL = `https://blog.naver.com/tam-e?Redirect=Update&logNo=${LOG_NO}`;
const PUBLIC_URL = `https://blog.naver.com/tam-e/${LOG_NO}`;
const CTA_PARAGRAPH =
  "집에서 진로 대화를 어떻게 시작하면 좋을지, 바로 따라할 수 있게 정리한 가이드를 아래에 남겨둡니다.";
const CTA_TEXT = "초등 고학년 진로탐색, 집에서 어떻게 시작할지 자세히 보기";
const CTA_URL = "https://www.tam-n.com/guide/elementary-career-exploration";

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

  if (await frame.getByText(CTA_TEXT, { exact: true }).count()) {
    await frame.getByText(CTA_TEXT, { exact: true }).first().scrollIntoViewIfNeeded();
  } else {
    await appendCta(frame, page);
  }

  await page.screenshot({
    path: path.join(OUTPUT_DIR, "before-republish.png"),
    fullPage: true,
  });

  await frame.getByRole("button", { name: "발행", exact: true }).first().click();
  await page.waitForTimeout(1000);
  await frame.getByRole("button", { name: "발행", exact: true }).nth(1).click();
  await page.waitForURL(/blog\.naver\.com\/tam-e\/224244462427|PostView\.naver/, {
    timeout: 30000,
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(4000);

  await verifyPublic(browser);

  await context.close();
  await browser.close();
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
  const body = await frame.locator("body").innerText();

  await fs.writeFile(
    path.join(OUTPUT_DIR, "published-anchors.json"),
    JSON.stringify(anchors, null, 2),
    "utf8",
  );
  await fs.writeFile(path.join(OUTPUT_DIR, "published-body.txt"), body, "utf8");
  await verifyPage.screenshot({
    path: path.join(OUTPUT_DIR, "after-republish.png"),
    fullPage: true,
  });

  const hasText = body.includes(CTA_TEXT);
  const hasUrl = anchors.some((anchor) =>
    (anchor.href ?? "").includes("tam-n.com/guide/elementary-career-exploration"),
  );

  if (!hasText || !hasUrl) {
    throw new Error(`CTA verification failed: hasText=${hasText}, hasUrl=${hasUrl}`);
  }

  console.log(JSON.stringify({ url: PUBLIC_URL, hasText, hasUrl }, null, 2));
  await verifyPage.close();
}

async function appendCta(frame: Frame, page: Page) {
  const lastParagraph = frame.locator("article p").last();
  await lastParagraph.scrollIntoViewIfNeeded();
  await lastParagraph.click({ force: true });
  await page.waitForTimeout(160);

  await page.keyboard.press("End").catch(() => undefined);
  await page.keyboard.press("ArrowRight").catch(() => undefined);
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(250);

  await page.keyboard.type(CTA_PARAGRAPH);
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(180);

  await page.keyboard.type(CTA_TEXT);
  await selectTypedText(page, CTA_TEXT);
  await frame.locator("button.se-link-toolbar-button").last().click();

  const urlInput = frame.locator("input.se-custom-layer-link-input").last();
  await urlInput.waitFor({ state: "visible", timeout: 5000 });
  await urlInput.fill(CTA_URL);
  await frame.locator("button.se-custom-layer-link-apply-button").last().click();
  await page.waitForTimeout(250);
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1000);
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

async function selectTypedText(page: Page, text: string) {
  const characterCount = Array.from(text).length;
  for (let i = 0; i < characterCount; i += 1) {
    await page.keyboard.press("Shift+ArrowLeft");
  }
  await page.waitForTimeout(120);
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
