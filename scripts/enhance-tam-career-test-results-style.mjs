import fs from "fs/promises";
import path from "path";

import { chromium } from "playwright-core";

const BLOG_ID = "tam-e";
const LOG_NO = "224244382364";
const STATE_PATH = path.resolve(
  process.cwd(),
  "../output/playwright/naver-blog/naver-auth-state.json",
);
const OUTPUT_DIR = path.resolve(
  process.cwd(),
  "../output/playwright/naver-blog/career-test-results-style-upgrade",
);

const upgrades = [
  {
    paragraphIncludes: "진로검사 결과지는 버릴 종이도",
    phrases: ["버릴 종이도, 아이를 정의하는 정답지도 아니기 때문입니다."],
  },
  {
    paragraphIncludes: "문제는 검사가 쓸모 있느냐 없느냐가 아니라",
    phrases: ["우리가 결과지를 어떤 방식으로 읽느냐에 있습니다."],
  },
  {
    paragraphIncludes: "문제는 검사를 하는 데 있지 않습니다.",
    phrases: [
      "문제는 검사를 하는 데 있지 않습니다. 결과지를 아이의 정체성처럼 읽어버리는 순간부터 어긋나기 시작합니다.",
    ],
  },
  {
    paragraphIncludes: "검사 결과가 절대적인 진단이나 예측을 해주는 것은 아니므로",
    phrases: ["절대적인 진단이나 예측", "참고자료로만 활용"],
  },
  {
    paragraphIncludes: "과도하게 의미를 두거나 지나치게 의존하지 말라고도 설명합니다.",
    phrases: ["과도하게 의미를 두거나 지나치게 의존하지 말라고도 설명합니다."],
  },
  {
    paragraphIncludes: "OECD가 2025년 발표한",
    phrases: ["39%", "33%", "진로 불확실성이 우리 아이만의 문제가 아니라는 사실"],
  },
  {
    paragraphIncludes: "불확실한 시기의 아이에게 필요한 것은",
    phrases: ["불확실한 시기의 아이에게 필요한 것은 더 강한 라벨이 아니라, 더 많은 탐색과 더 정교한 관찰입니다."],
  },
  {
    paragraphIncludes: "첫째, 유형명을 결론이 아니라 가설로 읽습니다.",
    phrases: ["첫째, 유형명을 결론이 아니라 가설로 읽습니다."],
  },
  {
    paragraphIncludes: "둘째, 결과를 실제 장면과 연결합니다.",
    phrases: ["둘째, 결과를 실제 장면과 연결합니다."],
  },
  {
    paragraphIncludes: "셋째, 높은 점수만 보지 않고 어긋나는 부분도 함께 봅니다.",
    phrases: ["셋째, 높은 점수만 보지 않고 어긋나는 부분도 함께 봅니다."],
  },
  {
    paragraphIncludes: "넷째, 결과를 다음 경험 설계에 씁니다.",
    phrases: [
      "넷째, 결과를 다음 경험 설계에 씁니다.",
      "결과지는 방향을 확정하는 도장이 아니라 다음 실험을 고르는 지도에 가깝습니다.",
    ],
  },
  {
    paragraphIncludes: "그래서 진로검사 결과지와 가장 잘 맞는 보완재는",
    phrases: ["더 많은 정보가 아니라 더 다양한 경험입니다."],
  },
  {
    paragraphIncludes: "중요한 것은 검사처럼 한 번 답하는 일이 아니라",
    phrases: ["수십 번의 선택이 쌓이며", "경험의 층을 더합니다."],
  },
];

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    storageState: STATE_PATH,
  });

  const page = await context.newPage();
  const frame = await openUpdateEditor(page);

  await page.screenshot({
    path: path.join(OUTPUT_DIR, "before-upgrade-editor.png"),
    fullPage: true,
  });

  for (const upgrade of upgrades) {
    await applyBoldUpgrade(frame, upgrade);
  }

  await page.screenshot({
    path: path.join(OUTPUT_DIR, "after-upgrade-editor.png"),
    fullPage: true,
  });

  await fs.writeFile(
    path.join(OUTPUT_DIR, "after-upgrade-article.json"),
    JSON.stringify(await captureArticleState(frame), null, 2),
    "utf8",
  );

  const finalUrl = await publishUpdatedPost(page, frame);

  await fs.writeFile(
    path.join(OUTPUT_DIR, "updated-post.json"),
    JSON.stringify({ url: finalUrl, blogId: BLOG_ID, logNo: LOG_NO }, null, 2),
    "utf8",
  );

  await page.screenshot({
    path: path.join(OUTPUT_DIR, "after-publish-desktop.png"),
    fullPage: true,
  });

  await fs.writeFile(
    path.join(OUTPUT_DIR, "published-anchors.json"),
    JSON.stringify(await captureAnchorState(page), null, 2),
    "utf8",
  );

  await captureMobileScreenshot(browser, finalUrl);

  await context.close();
  await browser.close();
}

async function openUpdateEditor(page) {
  await page.goto(`https://blog.naver.com/${BLOG_ID}?Redirect=Update&logNo=${LOG_NO}`, {
    waitUntil: "domcontentloaded",
  });
  const frame = await waitForUpdateEditor(page);
  await dismissHelpOverlay(frame);
  return frame;
}

async function waitForUpdateEditor(page) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const frame = page.frame({ name: "mainFrame" });
    if (frame) {
      const paragraphs = frame.locator("article p");
      try {
        await paragraphs.first().waitFor({ state: "visible", timeout: 2000 });
        if ((await paragraphs.count()) > 5) {
          return frame;
        }
      } catch {
        // Keep waiting.
      }
    }
    await page.waitForTimeout(500);
  }
  throw new Error("Update editor did not become ready");
}

async function dismissHelpOverlay(frame) {
  const closeButton = frame.getByRole("button", { name: "닫기", exact: true });
  if (await isVisible(closeButton)) {
    await closeButton.click();
    await frame.page().waitForTimeout(200);
  }
}

async function applyBoldUpgrade(frame, upgrade) {
  const result = await frame.evaluate(
    (data) => {
      const paragraphIncludes = data.paragraphIncludes;
      const phrases = data.phrases;
      const escapeHtml = (input) =>
        input
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;");

      const paragraphs = Array.from(document.querySelectorAll("article p"));
      const paragraph = paragraphs.find((node) =>
        (node.textContent || "").includes(paragraphIncludes),
      );

      if (!(paragraph instanceof HTMLParagraphElement)) {
        return { ok: false, reason: `paragraph not found: ${paragraphIncludes}` };
      }

      const text = paragraph.textContent || "";
      const firstNode = paragraph.querySelector("span.__se-node");
      const className =
        firstNode instanceof HTMLSpanElement
          ? firstNode.className
          : "se-ff-nanumgothic se-fs15 __se-node";
      const styleValue =
        firstNode instanceof HTMLSpanElement ? firstNode.getAttribute("style") : null;
      const styleAttr = styleValue ? ` style="${escapeHtml(styleValue)}"` : "";

      const positions = phrases
        .map((phrase) => ({ phrase, index: text.indexOf(phrase) }))
        .filter((item) => item.index >= 0)
        .sort((a, b) => a.index - b.index);

      if (positions.length === 0) {
        return { ok: false, reason: `no phrases matched in paragraph: ${paragraphIncludes}` };
      }

      let cursor = 0;
      let html = "";

      for (const item of positions) {
        if (item.index < cursor) continue;

        const before = text.slice(cursor, item.index);
        const target = text.slice(item.index, item.index + item.phrase.length);

        if (before) {
          html += `<span class="${escapeHtml(className)}"${styleAttr}>${escapeHtml(before)}</span>`;
        }

        html += `<span class="${escapeHtml(className)}"${styleAttr}><b>${escapeHtml(target)}</b></span>`;
        cursor = item.index + item.phrase.length;
      }

      const after = text.slice(cursor);
      if (after) {
        html += `<span class="${escapeHtml(className)}"${styleAttr}>${escapeHtml(after)}</span>`;
      }

      paragraph.innerHTML = html;
      paragraph.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          inputType: "insertText",
          data: text,
        }),
      );
      paragraph.dispatchEvent(new Event("change", { bubbles: true }));

      return { ok: true, text: paragraph.textContent };
    },
    upgrade,
  );

  if (!result.ok) {
    throw new Error(result.reason);
  }

  await frame.page().waitForTimeout(120);
}

async function publishUpdatedPost(page, frame) {
  const publishButtons = frame.getByRole("button", { name: "발행", exact: true });
  await publishButtons.first().click();
  await page.waitForTimeout(600);

  const secondStageButtons = frame.getByRole("button", { name: "발행", exact: true });
  if ((await secondStageButtons.count()) > 1) {
    await secondStageButtons.last().click();
  }

  await page.waitForURL(/PostView\.naver|blog\.naver\.com\/tam-e\/224244382364/, {
    timeout: 30000,
  });
  await page.waitForTimeout(2500);
  return page.url();
}

async function captureArticleState(frame) {
  return frame.evaluate(() =>
    Array.from(document.querySelectorAll("article p")).map((paragraph) => ({
      text: paragraph.textContent,
      className: paragraph.className,
      html: paragraph.innerHTML,
    })),
  );
}

async function captureAnchorState(page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll("a")).map((anchor) => ({
      text: anchor.textContent ? anchor.textContent.trim() : null,
      href: anchor.getAttribute("href"),
    })),
  );
}

async function captureMobileScreenshot(browser, url) {
  const mobileContext = await browser.newContext({
    viewport: { width: 430, height: 932 },
    isMobile: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(url, { waitUntil: "networkidle" });
  await mobilePage.screenshot({
    path: path.join(OUTPUT_DIR, "after-publish-mobile.png"),
    fullPage: true,
  });
  await mobileContext.close();
}

async function isVisible(locator) {
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
