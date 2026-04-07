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
  | { kind: "file"; filePath: string }
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
  "../output/playwright/naver-blog/parent-career-conversation-flagship",
);
const IMAGE_PATH = path.resolve(
  process.cwd(),
  "../output/imagegen/parent-career-conversation-flagship/parent-career-conversation-poster-final.png",
);
const PDF_PATH = path.resolve(
  process.cwd(),
  "../output/pdf/naver-blog/parent-career-conversation-question-card.pdf",
);

const post: PostDefinition = {
  title: "아이와 매일 성적 얘기는 하는데, 진로 얘기는 왜 어려울까요",
  tags: ["학부모대화", "진로교육", "자녀교육", "자기이해", "초등고학년", "탐TAM"],
  blocks: [
    {
      kind: "image",
      filePath: IMAGE_PATH,
    },
    {
      kind: "paragraph",
      text: "집에서 가장 자주 오가는 질문은 대개 비슷합니다. \"시험 어땠어?\", \"숙제는 다 했어?\", \"이번엔 몇 점 나왔어?\" 이런 질문은 어렵지 않습니다. 그런데 막상 \"요즘 뭐가 제일 끌려?\", \"어떤 걸 할 때 네가 살아나는 것 같아?\"라고 물으면, 대화가 갑자기 멈춥니다.",
    },
    {
      kind: "paragraph",
      text: "그래서 많은 부모가 이상한 감정에 빠집니다. 분명 매일 대화하는 집인데, 정작 아이가 무엇에 반응하고 어떤 세계에서 살아나는지는 잘 모르겠다는 감정입니다. 대화를 안 하는 게 아닌데도, 정작 중요한 이야기는 비어 있는 느낌 말입니다.",
    },
    {
      kind: "emphasis",
      text: "진로 대화는 답을 주는 대화가 아니라, 아이가 자기 반응을 말해볼 수 있게 여백을 주는 대화입니다.",
    },
    {
      kind: "divider",
    },
    {
      kind: "subtitle",
      text: "성적 대화는 쉬운데, 진로 대화는 왜 이렇게 막힐까요",
    },
    {
      kind: "paragraph",
      text: "성적 이야기는 비교적 분명합니다. 점수, 등급, 숙제, 시험 범위처럼 확인할 수 있는 대상이 있고, 부모도 익숙한 언어가 있습니다. 무엇을 더 해야 하는지, 어디가 부족한지도 비교적 쉽게 말할 수 있습니다.",
    },
    {
      kind: "paragraph",
      text: "반면 진로 대화는 정답이 없습니다. 아이가 무엇을 좋아하는지, 어떤 환경에서 더 살아나는지, 무엇을 반복해서 고르는지는 당장 수치로 확인되지 않습니다. 그래서 부모는 무의식적으로 더 익숙한 대화, 즉 성적과 관리의 언어로 다시 돌아가기 쉽습니다.",
    },
    {
      kind: "paragraph",
      text: "이건 부모가 잘못해서가 아닙니다. 아이를 위해 뭔가 분명한 걸 해주고 싶은 마음, 뒤처지지 않게 돕고 싶은 마음 때문에 더 즉각적으로 확인 가능한 주제로 가는 것이 자연스럽기 때문입니다.",
    },
    {
      kind: "quote",
      text: "부모가 매일 묻는 질문이, 결국 아이가 매일 생각하는 질문이 됩니다.",
    },
    {
      kind: "subtitle",
      text: "최신 조사도 집 안 대화의 방향이 한쪽으로 기울어 있음을 보여줍니다",
    },
    {
      kind: "paragraph",
      text: "교육부의 2025년 초중등 진로교육 현황조사 관련 보도를 보면, 2026년 2월 18일 기준 초등학생의 30.5%가 부모와 공부와 성적에 대해 거의 매일 대화한다고 답했습니다. 반면 흥미, 적성, 희망 직업, 꿈에 대해 거의 매일 이야기한다고 답한 비율은 15.0%였습니다.",
    },
    {
      kind: "paragraph",
      text: "게다가 학업 대화는 5년 전보다 더 늘었습니다. 같은 조사에서 연구진은 학부모와 자녀 간 진로에 관한 대화가 전반적으로 부족하고, 진로보다 학업·성적 중심 대화에 더 집중하는 경향이 확인됐다고 설명했습니다. 즉, 이건 우리 집만의 문제가 아니라 지금 많은 가정에서 공통으로 벌어지는 장면입니다.",
    },
    {
      kind: "paragraph",
      text: "교육부가 2026년 3월 13일 진로교육 내실화 지원 계획을 다시 발표한 것도 같은 맥락에서 볼 수 있습니다. 학교 안의 진로체험과 진로교육을 보강하는 흐름은 이어지고 있지만, 집에서 아이의 반응을 읽는 대화가 부족하면 그 경험은 아이 안에 충분히 남기 어렵습니다.",
    },
    {
      kind: "quote",
      text: "성적은 확인할 수 있지만, 방향감은 함께 읽어줘야 보입니다.",
    },
    {
      kind: "subtitle",
      text: "진로 대화는 길고 거창한 상담이 아니라 짧고 정확한 질문에서 시작됩니다",
    },
    {
      kind: "paragraph",
      text: "부모가 처음부터 완벽한 진로 상담을 할 필요는 없습니다. 오히려 더 좋은 시작은 짧고 가벼운 질문입니다. 오늘 무엇을 잘했는지가 아니라, 무엇에서 시간이 빨리 갔는지. 무엇이 맞았는지가 아니라, 무엇이 다시 해보고 싶은지. 이런 질문이 아이의 자기이해를 조금씩 열어줍니다.",
    },
    {
      kind: "paragraph",
      text: "핵심은 조언을 빨리 주는 것이 아니라, 아이가 자기 반응을 말해보게 하는 것입니다. 그 반응이 반복되면 패턴이 보이고, 그 패턴이 쌓여야 진로 대화도 비로소 현실감을 갖게 됩니다.",
    },
    {
      kind: "subtitle",
      text: "오늘 바로 써볼 10분 질문 카드를 첨부했습니다",
    },
    {
      kind: "paragraph",
      text: "그래서 오늘은 글만 읽고 끝나지 않도록, 바로 꺼내 쓸 수 있는 PDF 질문 카드를 함께 첨부했습니다. 하루 10분이면 충분합니다. 성적 이야기를 멈추라는 뜻이 아니라, 그 사이에 아이의 반응을 묻는 질문을 하나씩 끼워 넣자는 뜻입니다.",
    },
    {
      kind: "file",
      filePath: PDF_PATH,
    },
    {
      kind: "paragraph",
      text: "이 질문 카드는 잔소리처럼 들리지 않도록 짧게 만들었고, 부모가 바로 해석하거나 평가하지 않도록 안내 문구도 함께 넣었습니다. 오늘 저녁 식탁에서 한 질문만 써봐도 대화의 결이 달라질 수 있습니다.",
    },
    {
      kind: "subtitle",
      text: "이런 짧은 대화가 쌓일수록 아이의 자기이해도 선명해집니다",
    },
    {
      kind: "paragraph",
      text: "10~14세는 스스로를 알아가는 감각이 막 자라나는 시기입니다. 이 시기의 아이에게 필요한 것은 빨리 결론을 내리는 대화보다, 다양한 경험 속 반응을 천천히 읽어주는 대화에 가깝습니다. 대화는 그 자체로 답이 아니라, 아이가 자기 안을 들여다보는 연습이 됩니다.",
    },
    {
      kind: "paragraph",
      text: "탐(TAM)은 바로 그 자기이해를 더 쉽게 쌓도록 돕기 위해 만들어진 플랫폼입니다. 아이는 매일 10분, 서로 다른 세계 속에서 선택하고 반응하며, 부모는 그 선택의 패턴을 함께 읽게 됩니다. 질문 카드가 집 안의 시작점이라면, 탐은 그 대화를 이어갈 수 있는 경험의 재료가 됩니다.",
    },
    {
      kind: "link",
      text: "초등 고학년 진로탐색, 집에서 어떻게 시작할지 자세히 보기",
      url: absoluteUrl("/guide/elementary-career-exploration"),
    },
  ],
};

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.access(IMAGE_PATH);
  await fs.access(PDF_PATH);

  const dryRun = process.env.DRY_RUN === "1";
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    storageState: STATE_PATH,
  });

  const page = await context.newPage();
  const url = await publishPost(page, post, dryRun);

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
      case "file":
        await insertFile(page, block.filePath);
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
  await fs.writeFile(
    path.join(OUTPUT_DIR, dryRun ? "dry-run-body.json" : "before-publish-body.json"),
    JSON.stringify(await captureBodyState(page), null, 2),
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
  await fs.writeFile(
    path.join(OUTPUT_DIR, "published-body.json"),
    JSON.stringify(await captureBodyState(page), null, 2),
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

async function captureBodyState(page: Page) {
  return page.evaluate(() => ({
    text: document.body.innerText,
    html: document.querySelector("article")?.innerHTML ?? null,
  }));
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

  const imageButton = page.locator("button.se-image-toolbar-button").first();
  await imageButton.waitFor({ state: "visible", timeout: 10000 });

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const chooserPromise = page.waitForEvent("filechooser", { timeout: 5000 }).catch(() => null);

    await imageButton.focus().catch(() => undefined);
    await page.keyboard.press("Enter").catch(() => undefined);

    const chooser = await chooserPromise;
    if (chooser) {
      await chooser.setFiles(filePath);
      await page.waitForTimeout(3000);
      await dismissBlockingPopup(page);
      await dismissEditorPanels(page);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(240);
      return;
    }

    const fileInput = page.locator('input[type="file"]').last();
    if ((await fileInput.count()) > 0) {
      await fileInput.setInputFiles(filePath);
      await page.waitForTimeout(3000);
      await dismissBlockingPopup(page);
      await dismissEditorPanels(page);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(240);
      return;
    }

    await dismissEditorPanels(page);
    await page.waitForTimeout(400);
  }

  throw new Error(`Failed to upload image: ${filePath}`);
}

async function insertFile(page: Page, filePath: string) {
  await focusLastParagraph(page);
  const fileButton = page.locator("button.se-file-toolbar-button").first();
  await fileButton.waitFor({ state: "visible", timeout: 10000 });
  await fileButton.click();
  await page.waitForTimeout(400);

  const chooserPromise = page.waitForEvent("filechooser", { timeout: 5000 }).catch(() => null);
  await page.getByRole("button", { name: "내 컴퓨터" }).click();
  const chooser = await chooserPromise;

  if (!chooser) {
    throw new Error(`Failed to open file chooser for ${filePath}`);
  }

  await chooser.setFiles(filePath);
  await page.waitForTimeout(4000);
  await page.getByText(path.basename(filePath), { exact: true }).waitFor({ timeout: 10000 });
  await dismissEditorPanels(page);
  await focusLastParagraph(page);
  await page.waitForTimeout(220);
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
  await page.keyboard.press("Escape").catch(() => undefined);
  await page.waitForTimeout(120);
  const closeButtons = [
    page.getByRole("button", { name: "팝업 닫기", exact: true }).last(),
    page.locator('button[aria-label="닫기"]').last(),
    page.locator('button[title="닫기"]').last(),
    page.getByRole("button", { name: "닫기", exact: true }).last(),
    page.getByRole("button", { name: "접기", exact: true }).last(),
  ];

  for (const button of closeButtons) {
    if (await isVisible(button)) {
      await button.click().catch(() => undefined);
      await page.waitForTimeout(120);
    }
  }

  await page.mouse.click(220, 160).catch(() => undefined);
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
