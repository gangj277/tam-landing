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
  "../output/playwright/naver-blog/tam-launch-free-trial-flagship",
);
const IMAGE_PATH = path.resolve(
  process.cwd(),
  "../output/imagegen/tam-launch-free-trial-flagship/launch-free-trial-poster.png",
);

const post: PostDefinition = {
  title: "[학부모 필독] AI 시대, 우리 아이를 더 잘 이해하는 한 달: 탐 1개월 무료체험 36가정 모집",
  tags: ["학부모필독", "무료체험", "자기이해", "진로탐색", "AI교육", "초등고학년", "중학생부모", "탐TAM"],
  blocks: [
    {
      kind: "image",
      filePath: IMAGE_PATH,
    },
    {
      kind: "paragraph",
      text: "요즘 뭐가 제일 재밌어? 라고 물으면 아이가 잠깐 생각하다가 말합니다. 모르겠어. 부모는 그 짧은 답 앞에서 이상하게 더 불안해집니다. 학원도 알아보고, 진로검사도 해보고, AI 교육 이야기도 챙겨보는데 정작 우리 아이가 어떤 결의 사람인지는 더 흐릿하게 느껴지기 때문입니다.",
    },
    {
      kind: "paragraph",
      text: "지금 부모에게 필요한 건 정보를 하나 더 모으는 일이 아닐지 모릅니다. 오히려 더 먼저 필요한 건, 우리 아이가 낯선 상황에서 무엇을 고르고 무엇에 오래 머무는지 읽을 기준입니다. 그 기준이 없으면 코딩도, 진로캠프도, 적성검사도 결국 조각난 정보로만 남기 쉽습니다.",
    },
    {
      kind: "emphasis",
      text: "이건 진로를 빨리 정하게 만드는 한 달이 아닙니다. 아이가 어떤 결의 사람인지 읽기 시작하는 한 달입니다.",
    },
    {
      kind: "divider",
    },
    {
      kind: "subtitle",
      text: "왜 지금 부모가 더 불안한가",
    },
    {
      kind: "paragraph",
      text: "AI는 직업과 역할의 지도를 빠르게 바꾸고 있습니다. World Economic Forum이 2025년 발표한 Future of Jobs Report에서도 기술 변화 속에서 인간에게 더 중요해지는 역량으로 판단력, 창의성, 회복력, 학습 민첩성을 다시 강조했습니다. 부모 입장에서는 자연스럽게 질문이 생깁니다. 그럼 우리 아이는 무엇을 준비해야 하지?",
    },
    {
      kind: "paragraph",
      text: "문제는 준비해야 할 것이 늘어날수록 오히려 기준은 더 흐려진다는 점입니다. OECD는 2025년 보고서에서 여전히 많은 청소년이 자신의 진로를 또렷하게 설명하지 못하고, 학교 밖 현실 세계와 연결되는 탐색 경험이 충분하지 않다고 짚었습니다. 한국에서도 2024 초중등 진로교육 현황조사에서 중학생 40.0%가 희망직업이 없다고 답했고, 그 이유 1위는 내가 무엇을 좋아하는지 아직 잘 몰라서였습니다.",
    },
    {
      kind: "paragraph",
      text: "그러니 지금 부모의 막막함은 이상한 게 아닙니다. 세상이 너무 빨리 바뀌고 있고, 정보는 넘치는데 정작 아이를 읽는 기준은 학교나 가정 어디에서도 충분히 만들어주지 못하고 있기 때문입니다.",
    },
    {
      kind: "quote",
      text: "세상이 바뀌는 속도보다 더 무서운 건, 아이를 읽을 기준이 없는 것입니다.",
    },
    {
      kind: "subtitle",
      text: "적성검사 한 번으로는 안 보이는 아이의 결",
    },
    {
      kind: "paragraph",
      text: "많은 부모가 적성검사 결과지를 받아들고도 마음이 개운하지 않다고 말합니다. 결과가 틀려서가 아니라, 종이 한 장으로는 살아 있는 아이가 잘 읽히지 않기 때문입니다. 아이는 한 번의 응답보다 반복되는 선택 속에서 더 선명하게 드러납니다.",
    },
    {
      kind: "paragraph",
      text: "낯선 세계에 들어갔을 때 아이는 안전을 먼저 고르는지, 도전을 먼저 고르는지, 사람을 먼저 살피는지, 문제를 먼저 푸는지 다르게 반응합니다. 같은 상황에서도 아이는 어떤 역할에는 오래 머물고 어떤 역할에서는 금방 흥미를 잃습니다. 그 반복이 쌓여야 비로소 아이의 결이 보입니다.",
    },
    {
      kind: "paragraph",
      text: "그래서 중요한 건 미래 직업을 맞히는 것이 아니라, 아이가 어떤 상황에서 살아나는지 읽을 수 있는 데이터를 경험으로 쌓는 일입니다. 그 경험이 있어야 부모도 아이도 진로를 이야기할 때 막연함 대신 기준을 가질 수 있습니다.",
    },
    {
      kind: "quote",
      text: "적성검사는 한 번 답하지만, 아이는 매일 다르게 살아납니다.",
    },
    {
      kind: "subtitle",
      text: "탐은 이 한 달을 어떻게 설계했는가",
    },
    {
      kind: "paragraph",
      text: "탐은 아이에게 정답을 가르치기보다, 매일 10분 새로운 세계를 건넵니다. 화성 도시, 법정, 연구소, 사회적 딜레마 같은 상황 안에서 아이는 역할과 관점과 해결책을 스스로 고릅니다. 같은 아이여도 어떤 날은 사람을 돕는 선택을 하고, 어떤 날은 구조를 먼저 바꾸려 하고, 어떤 날은 끝까지 파고듭니다.",
    },
    {
      kind: "paragraph",
      text: "탐의 자체 AI는 그 선택을 점수처럼 줄 세우지 않습니다. 대신 아이가 무엇에 끌리고, 어떤 방식으로 판단하며, 어떤 세계에서 에너지가 살아나는지 패턴으로 읽어줍니다. 부모는 주간 리포트로 그 흐름을 함께 보고, 아이는 스스로도 내 반응이 어떤 사람을 말해주는지 조금씩 이해하게 됩니다.",
    },
    {
      kind: "subtitle",
      text: "이번 한 달에는 주 1회 멘토링 가이드도 함께 들어갑니다",
    },
    {
      kind: "paragraph",
      text: "이번 무료체험은 계정만 열어두는 체험이 아닙니다. 명문대 학생 멘토가 주 1회 20~30분 가이드 구조를 함께 제공하고, 부모가 아이를 어떤 질문으로 도와주면 좋은지도 연결합니다. 앱에서 벌어진 선택을 경험으로 끝내지 않고, 실제 대화와 해석으로 이어주는 것이 이 한 달의 핵심입니다.",
    },
    {
      kind: "emphasis",
      text: "탐은 아이를 평가하는 서비스가 아니라, 아이를 읽기 시작하는 서비스입니다.",
    },
    {
      kind: "divider",
    },
    {
      kind: "subtitle",
      text: "이번 1개월 무료체험에 포함되는 것",
    },
    {
      kind: "paragraph",
      text: "하루 10분, AI가 만드는 새로운 상황 속 탐험형 미션이 열립니다.",
    },
    {
      kind: "paragraph",
      text: "아이의 선택 패턴을 읽는 자체 AI 분석과 주간 관찰 리포트가 함께 제공됩니다.",
    },
    {
      kind: "paragraph",
      text: "주 1회 20~30분, 명문대 학생 멘토의 가이드와 부모 연결이 이어집니다.",
    },
    {
      kind: "paragraph",
      text: "무엇보다 아이가 어떤 상황에서 살아나는지 함께 읽어보는 한 달의 기록이 남습니다.",
    },
    {
      kind: "subtitle",
      text: "왜 선착순 36가정만 먼저 여나요",
    },
    {
      kind: "paragraph",
      text: "이번 모집은 많은 계정을 한꺼번에 열어두는 이벤트가 아닙니다. 실제로 아이의 흐름을 읽고, 부모와 연결하고, 멘토링까지 붙는 경험 품질을 지키려면 초반에는 소수 가정에 집중하는 것이 맞다고 판단했습니다. 그래서 이번에는 선착순 36가정만 먼저 받습니다.",
    },
    {
      kind: "paragraph",
      text: "무료체험이지만 가볍게 흘러가게 만들고 싶지 않았습니다. 정말 아이를 더 잘 이해하고 싶은 부모에게, 한 달 동안 제대로 경험해볼 수 있는 구조를 주고 싶었습니다.",
    },
    {
      kind: "quote",
      text: "이번 한 달은 결제 전 체험이 아니라, 우리 아이를 보는 기준을 다시 세우는 작은 실험입니다.",
    },
    {
      kind: "subtitle",
      text: "이런 부모님이라면 이번 모집을 그냥 지나치지 마세요",
    },
    {
      kind: "paragraph",
      text: "아이가 장래희망을 자주 바꾸는데, 그게 불안하게 느껴지는 부모.",
    },
    {
      kind: "paragraph",
      text: "성적 이야기는 자주 하지만, 정작 아이가 무엇에서 살아나는지는 잘 모르겠는 부모.",
    },
    {
      kind: "paragraph",
      text: "AI 시대에 무엇을 더 시켜야 할지 막막해서 정보만 쌓여가는 부모.",
    },
    {
      kind: "paragraph",
      text: "적성검사 결과지를 받아도 여전히 우리 아이가 어떤 결의 사람인지 감이 잡히지 않는 부모.",
    },
    {
      kind: "paragraph",
      text: "사전 신청을 남겨주시면 영업일 기준 1~2일 안에 연락드리고, 아이 연령과 현재 고민을 바탕으로 가장 적절한 시작 흐름을 함께 안내해드립니다.",
    },
    {
      kind: "paragraph",
      text: "선착순 36가정이 채워지면 이번 1개월 무료체험 모집은 마감됩니다. 아이를 더 잘 이해하고 싶은 마음이 이미 시작됐다면, 이번 한 달을 그냥 지나치지 않으셨으면 합니다.",
    },
    {
      kind: "paragraph",
      text: "탐은 더 많은 정보를 주는 서비스가 아니라, 우리 아이를 읽을 단서를 더 많이 남겨주는 서비스입니다.",
    },
    {
      kind: "link",
      text: "선착순 36가정, 탐 1개월 무료체험 사전 신청하기",
      url: absoluteUrl("/"),
    },
  ],
};

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.access(IMAGE_PATH);

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
