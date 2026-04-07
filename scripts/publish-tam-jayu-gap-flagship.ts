import fs from "fs/promises";
import path from "path";

import { chromium, type Locator, type Page } from "playwright-core";

import { buildNaverBlogWriteUrl } from "../lib/naver-blog-automation";
import { absoluteUrl } from "../lib/site";

type Block =
  | { kind: "image"; filePath: string }
  | { kind: "paragraph"; text: string }
  | { kind: "subtitle"; text: string }
  | { kind: "emphasis"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "divider" }
  | { kind: "link"; text: string; url: string };

type PostDefinition = {
  title: string;
  tags: string[];
  blocks: Block[];
};

const BLOG_ID = "tam-e";
const STATE_PATH = path.resolve(
  process.cwd(),
  "../output/playwright/naver-blog/naver-auth-state.json",
);
const OUTPUT_DIR = path.resolve(
  process.cwd(),
  "../output/playwright/naver-blog/jayu-gap-flagship",
);
const IMAGE_PATH = path.resolve(
  process.cwd(),
  "../output/imagegen/tam-naver-blog-v3/jayu-gap-hero.png",
);

const post: PostDefinition = {
  title: "자유학기제 102시간으로 충분할까요, 우리 아이 진로탐색의 빈칸",
  tags: [
    "자유학기제",
    "진로탐색",
    "중학생부모",
    "자기이해",
    "학부모가이드",
    "탐TAM",
  ],
  blocks: [
    {
      kind: "image",
      filePath: IMAGE_PATH,
    },
    {
      kind: "paragraph",
      text: "중학교 입학 설명회를 다녀온 날, 많은 부모는 비슷한 기대를 합니다. 시험 부담이 조금 줄어든 그 한 학기 동안은, 우리 아이도 자신이 무엇에 끌리는지 천천히 만나보게 되지 않을까 하고요.",
    },
    {
      kind: "paragraph",
      text: "그런데 2026년의 현실은 생각보다 훨씬 빠듯합니다. 자유학년제가 사라진 뒤 자유학기제는 중1 1학기 102시간 안에 주제선택과 진로탐색을 압축해서 담아내야 합니다. 제도는 남아 있지만, 아이가 스스로를 알아갈 시간은 생각보다 얇아졌습니다.",
    },
    {
      kind: "emphasis",
      text: "학교가 줄 수 있는 건 한 학기의 기회일 수 있지만, 자기이해는 반복되는 경험 속에서만 자랍니다.",
    },
    {
      kind: "divider",
    },
    {
      kind: "subtitle",
      text: "자유학기제가 줄었다는 건, 단순히 시간이 줄었다는 뜻이 아닙니다",
    },
    {
      kind: "paragraph",
      text: "2025년부터 자유학년제는 사라지고 자유학기제 중심 구조로 재편됐습니다. 부모 입장에서는 여전히 '학교에서 진로탐색을 해주겠지'라고 기대하기 쉽지만, 실제로는 아이가 여러 활동을 스쳐 지나가고 자기 반응을 해석할 여백이 크게 줄어든 셈에 가깝습니다.",
    },
    {
      kind: "paragraph",
      text: "문제는 이 변화가 단지 중학교 한 학기의 문제가 아니라는 점입니다. 고등학교로 가면 아이는 더 많은 선택을 해야 합니다. 그런데 그 선택의 바탕이 되는 자기이해는, 오히려 더 얇게 쌓일 가능성이 커졌습니다.",
    },
    {
      kind: "paragraph",
      text: "정리하면 자유학기제가 남아 있다는 사실보다 중요한 건, 그 안에서 아이가 정말 자신을 알아갈 만큼 충분한 경험을 누적하느냐입니다. 지금 많은 집에서 막히는 지점은 바로 여기입니다.",
    },
    {
      kind: "quote",
      text: "지금 부족한 것은 정보가 아니라, 아이가 자기 반응을 반복해서 확인할 경험입니다.",
    },
    {
      kind: "subtitle",
      text: "아이들이 진로를 못 정하는 이유는, 생각보다 단순합니다",
    },
    {
      kind: "paragraph",
      text: "교육부와 한국직업능력연구원이 발표한 2024년 초중등 진로교육 현황조사에 따르면, 중학생의 40.0%는 희망 직업이 없다고 답했습니다. 그리고 희망 직업이 없다고 답한 중학생의 51.2%는 그 이유를 '내가 무엇을 좋아하는지 아직 잘 몰라서'라고 말했습니다.",
    },
    {
      kind: "paragraph",
      text: "이 숫자가 말해주는 건 아이들이 무기력하다는 뜻이 아닙니다. 오히려 자기를 설명할 재료가 충분하지 않다는 뜻에 가깝습니다. 직업 이름은 들어봤지만, 내가 어떤 문제에 오래 머무는 사람인지, 어떤 역할에서 살아나는 사람인지는 아직 여러 번 만나보지 못한 것입니다.",
    },
    {
      kind: "paragraph",
      text: "그래서 부모가 '너는 뭘 좋아하니'라고 물을수록 아이가 더 막막해지는 경우가 많습니다. 아직 스스로 답할 만큼 경험이 쌓이지 않았기 때문입니다. 질문보다 먼저 필요한 것은, 아이가 자기 반응을 볼 수 있는 장면의 축적입니다.",
    },
    {
      kind: "subtitle",
      text: "OECD도 좋은 진로교육은 '이른 시기'와 '실제 경험'에서 시작된다고 말합니다",
    },
    {
      kind: "paragraph",
      text: "OECD는 2025년 발표한 진로준비 보고서에서, 전 세계 청소년의 진로 기대가 여전히 좁고 사회적 배경에 따라 쉽게 왜곡될 수 있다고 봤습니다. 또 OECD의 진로준비 프로젝트는 효과적인 진로교육일수록 아이의 관심에 반응하고, 실제 세계와의 만남이 풍부하며, 어린 시절부터 시작된다고 강조합니다.",
    },
    {
      kind: "paragraph",
      text: "이 기준으로 보면 자유학기제 한 학기만으로 충분하다고 말하기는 어렵습니다. 학교는 문을 열어줄 수 있지만, 그 문 안에서 아이가 어떤 표정을 짓는지, 무엇에서 눈빛이 달라지는지, 어떤 선택을 반복하는지까지 길게 비춰주기는 어렵기 때문입니다.",
    },
    {
      kind: "subtitle",
      text: "부모가 집에서 메워야 할 것은 거창한 체험이 아니라, 매일 10분의 탐색 구조입니다",
    },
    {
      kind: "paragraph",
      text: "여기서 많은 부모가 부담을 느낍니다. 대단한 캠프나 비싼 프로그램을 계속 붙여줘야 하나 생각하기 쉽기 때문입니다. 하지만 아이의 자기이해를 만드는 핵심은 '규모'보다 '반복'입니다.",
    },
    {
      kind: "paragraph",
      text: "오늘 필요한 것은 세 가지입니다. 첫째, 아이가 평소 접하지 않던 세계를 짧게라도 만나게 하기. 둘째, 그 안에서 직접 고르게 하기. 셋째, 정답을 평가하지 말고 '이번에도 이런 쪽을 골랐네'라고 패턴을 비춰주기. 이 세 가지만 있어도 진로탐색은 정보 수집이 아니라 자기이해의 경험으로 바뀌기 시작합니다.",
    },
    {
      kind: "paragraph",
      text: "이 구조가 반복되면 아이는 어느 순간 직업 이름보다 먼저 자기 기준을 말하기 시작합니다. '나는 사람 문제를 다루는 게 흥미로워.' '나는 빨리 끝내는 것보다 제대로 완성하는 게 중요해.' 바로 그런 문장이 과목 선택과 진로 선택의 진짜 재료가 됩니다.",
    },
    {
      kind: "subtitle",
      text: "탐이 채우려는 건, 자유학기제 뒤에 남는 이 빈칸입니다",
    },
    {
      kind: "paragraph",
      text: "탐은 학교를 대체하려는 서비스가 아닙니다. 학교가 한 학기 동안 열어준 질문을, 집에서 매일 10분씩 이어가게 해주는 구조에 가깝습니다. 아이는 AI가 만든 다양한 세계와 역할 속에서 선택하고, 그 선택의 패턴을 조금씩 쌓아갑니다.",
    },
    {
      kind: "paragraph",
      text: "중요한 건 정답을 빨리 찾게 하는 것이 아닙니다. 아이가 자기 자신을 더 선명하게 이해하게 하는 것입니다. 자유학기제가 줄어든 시대일수록, 부모에게 필요한 건 더 많은 정보보다 더 자주 비춰볼 수 있는 경험의 구조일지 모릅니다.",
    },
    {
      kind: "link",
      text: "탐의 자유학기제 가이드와 집에서 시작하는 진로탐색 구조 보기",
      url: absoluteUrl("/guide/jayuhakgije"),
    },
  ],
};

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const dryRun = process.env.DRY_RUN === "1";
  await fs.access(IMAGE_PATH);

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    storageState: STATE_PATH,
  });

  const page = await context.newPage();
  const url = await publishPost(page, definitionForRun(), dryRun);

  await fs.writeFile(
    path.join(OUTPUT_DIR, dryRun ? "dry-run-post.json" : "published-post.json"),
    JSON.stringify({ title: post.title, url }, null, 2),
    "utf8",
  );

  if (!dryRun) {
    await captureMobileScreenshot(browser, url);
  }

  await context.close();
  await browser.close();
}

function definitionForRun() {
  return structuredClone(post);
}

async function publishPost(page: Page, definition: PostDefinition, dryRun: boolean) {
  await page.goto(buildNaverBlogWriteUrl(BLOG_ID), {
    waitUntil: "domcontentloaded",
  });
  await waitForEditorReady(page);
  await fillTitle(page, definition.title);

  for (const block of definition.blocks) {
    switch (block.kind) {
      case "image":
        await insertImage(page, block.filePath);
        break;
      case "paragraph":
        await typeParagraph(page, block.text);
        break;
      case "subtitle":
        await typeSubtitle(page, block.text);
        break;
      case "emphasis":
        await typeEmphasisLine(page, block.text);
        break;
      case "quote":
        await insertQuote(page, block.text);
        break;
      case "divider":
        await insertDivider(page);
        break;
      case "link":
        await insertLinkedLine(page, block.text, block.url);
        break;
      default:
        throw new Error(`Unsupported block ${(block as { kind: string }).kind}`);
    }
  }

  await page.screenshot({
    path: path.join(OUTPUT_DIR, dryRun ? "dry-run-editor.png" : "before-publish.png"),
    fullPage: true,
  });
  await fs.writeFile(
    path.join(OUTPUT_DIR, dryRun ? "dry-run-article.json" : "before-publish-article.json"),
    JSON.stringify(await captureArticleState(page), null, 2),
    "utf8",
  );

  if (dryRun) {
    return page.url();
  }

  await openPublishPanel(page);
  await applyTags(page, definition.tags);
  await page.getByRole("button", { name: "발행", exact: true }).nth(1).click();
  await page.waitForURL(/PostView\.naver|m\.blog\.naver\.com/, { timeout: 30000 });
  await page.waitForTimeout(2500);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, "after-publish-desktop.png"),
    fullPage: true,
  });
  await fs.writeFile(
    path.join(OUTPUT_DIR, "published-anchors.json"),
    JSON.stringify(await captureAnchorState(page), null, 2),
    "utf8",
  );

  return page.url();
}

async function captureArticleState(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll("article p")).map((paragraph) => ({
      text: paragraph.textContent,
      className: paragraph.className,
      html: paragraph.innerHTML,
    })),
  );
}

async function captureAnchorState(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll("a")).map((anchor) => ({
      text: anchor.textContent?.trim(),
      href: anchor.getAttribute("href"),
    })),
  );
}

async function captureMobileScreenshot(browser: import("playwright-core").Browser, url: string) {
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

async function waitForEditorReady(page: Page) {
  const articleParagraphs = page.locator("article p");

  for (let attempt = 0; attempt < 20; attempt += 1) {
    await articleParagraphs.first().waitFor({ state: "visible", timeout: 10000 });
    if (await dismissBlockingPopup(page)) {
      await page.waitForTimeout(400);
      continue;
    }

    const restoreVisible = await isVisible(page.getByText("작성 중인 글이 있습니다."));
    const closeVisible = await isVisible(
      page.getByRole("button", { name: "닫기", exact: true }),
    );

    if (restoreVisible) {
      await handleRestoreDraft(page);
      await page.waitForTimeout(400);
      continue;
    }

    if (closeVisible) {
      await dismissHelpOverlay(page);
      await page.waitForTimeout(400);
      continue;
    }

    if ((await articleParagraphs.count()) <= 2) {
      return;
    }

    await page.waitForTimeout(400);
  }

  throw new Error("Editor did not become ready before timeout");
}

async function handleRestoreDraft(page: Page) {
  const cancelButton = page.getByRole("button", { name: "취소", exact: true });
  if (await isVisible(cancelButton)) {
    await cancelButton.click();
    return;
  }

  const continueButton = page.getByRole("button", { name: "확인", exact: true });
  if (await isVisible(continueButton)) {
    await continueButton.click();
  }
}

async function dismissHelpOverlay(page: Page) {
  const closeButton = page.getByRole("button", { name: "닫기", exact: true });
  if (await isVisible(closeButton)) {
    await closeButton.click();
  }
}

async function fillTitle(page: Page, title: string) {
  await dismissBlockingPopup(page);
  const titleParagraph = page.locator("article p").first();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await titleParagraph.click({ force: true });
    await page.waitForTimeout(120);
    await page.keyboard.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
    await page.waitForTimeout(80);
    await page.keyboard.press("Backspace");
    await page.waitForTimeout(80);
    await page.keyboard.insertText(title);
    await page.waitForTimeout(220);

    const currentTitle = (await titleParagraph.textContent())?.trim();
    if (currentTitle === title) {
      return;
    }
  }

  const fallbackTitle = await page.evaluate((nextTitle) => {
    const paragraph = document.querySelector("article p");
    if (!(paragraph instanceof HTMLParagraphElement)) {
      return null;
    }

    const placeholder = paragraph.querySelector(".se-placeholder");
    placeholder?.remove();

    let textNode = paragraph.querySelector("span.__se-node");
    if (!(textNode instanceof HTMLSpanElement)) {
      textNode = document.createElement("span");
      textNode.className = "se-ff-nanumgothic se-fs32 __se-node";
      paragraph.appendChild(textNode);
    }

    textNode.textContent = nextTitle;
    paragraph.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        inputType: "insertText",
        data: nextTitle,
      }),
    );
    paragraph.dispatchEvent(new Event("change", { bubbles: true }));
    return paragraph.textContent?.trim() ?? null;
  }, title);

  if (fallbackTitle === title) {
    await page.waitForTimeout(180);
    return;
  }

  throw new Error(`Failed to fill title: ${title}`);
}

async function focusLastParagraph(page: Page) {
  const paragraph = page.locator("article p").last();
  await paragraph.click({ force: true });
  await page.waitForTimeout(120);
}

async function typeParagraph(page: Page, text: string) {
  await focusLastParagraph(page);
  await page.keyboard.type(text);
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(220);
}

async function typeSubtitle(page: Page, text: string) {
  await focusLastParagraph(page);
  await page.keyboard.type(text);
  await page.waitForTimeout(120);
  await page.locator("button.se-text-format-toolbar-button").first().click();
  await page.getByRole("button", { name: "소제목", exact: true }).click();
  await page.waitForTimeout(150);
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(260);
}

async function typeEmphasisLine(page: Page, text: string) {
  await focusLastParagraph(page);
  await page.keyboard.type(text);
  await selectTypedText(page, text);
  await page.locator("button.se-bold-toolbar-button").last().click();
  await page.waitForTimeout(120);
  await page.keyboard.press("ArrowRight");
  await page.locator("button.se-text-format-toolbar-button").first().click();
  await page.getByRole("button", { name: "소제목", exact: true }).click();
  await page.waitForTimeout(150);
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(260);
}

async function insertDivider(page: Page) {
  await focusLastParagraph(page);
  await page.locator("button.se-insert-horizontal-line-default-toolbar-button").click();
  await page.waitForTimeout(240);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(220);
}

async function insertQuote(page: Page, text: string) {
  await focusLastParagraph(page);
  await page.locator("button.se-insert-quotation-default-toolbar-button").click();
  await page.waitForTimeout(250);
  await focusLastParagraph(page);
  await page.keyboard.type(text);
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(240);
}

async function insertImage(page: Page, filePath: string) {
  await focusLastParagraph(page);
  const [chooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.locator("button.se-image-toolbar-button").click(),
  ]);
  await chooser.setFiles(filePath);
  await page.waitForTimeout(3000);
  await dismissEditorPanels(page);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(240);
}

async function insertLinkedLine(page: Page, text: string, url: string) {
  await focusLastParagraph(page);
  await page.keyboard.type(text);
  await selectTypedText(page, text);
  await page.locator("button.se-link-toolbar-button").last().click();

  const urlInput = page.locator("input.se-custom-layer-link-input").last();
  await urlInput.waitFor({ state: "visible", timeout: 5000 });
  await urlInput.fill(url);
  await page.locator("button.se-custom-layer-link-apply-button").last().click();
  await page.waitForTimeout(160);
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(240);
}

async function selectTypedText(page: Page, text: string) {
  const characterCount = Array.from(text).length;
  for (let i = 0; i < characterCount; i += 1) {
    await page.keyboard.press("Shift+ArrowLeft");
  }
  await page.waitForTimeout(120);
}

async function openPublishPanel(page: Page) {
  await dismissEditorPanels(page);
  await page.getByRole("button", { name: "발행", exact: true }).first().click();
  await page.waitForTimeout(600);
}

async function applyTags(page: Page, tags: string[]) {
  const tagInput = page.getByRole("combobox", {
    name: /태그 입력 \(최대 30개\)/,
  });

  for (const tag of tags) {
    await tagInput.click();
    await page.keyboard.type(tag);
    await page.keyboard.press("Enter");
  }
}

async function dismissBlockingPopup(page: Page) {
  const buttons = [
    page.getByRole("button", { name: "취소", exact: true }),
    page.getByRole("button", { name: "닫기", exact: true }),
    page.getByRole("button", { name: "확인", exact: true }),
  ];

  for (const button of buttons) {
    if (await isVisible(button)) {
      await button.click();
      return true;
    }
  }

  return false;
}

async function dismissEditorPanels(page: Page) {
  await page.keyboard.press("Escape").catch(() => undefined);
  await page.waitForTimeout(120);
  const closeButtons = [
    page.locator('button[aria-label="닫기"]').last(),
    page.locator('button[title="닫기"]').last(),
    page.getByRole("button", { name: "닫기", exact: true }).last(),
  ];

  for (const button of closeButtons) {
    if (await isVisible(button)) {
      await button.click().catch(() => undefined);
      await page.waitForTimeout(120);
    }
  }
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
