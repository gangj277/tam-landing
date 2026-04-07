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
  "../output/playwright/naver-blog/ai-homework-boundaries-flagship",
);
const IMAGE_PATH = path.resolve(
  process.cwd(),
  "../output/imagegen/tam-naver-blog-v4/ai-homework-boundary-hero.png",
);

const post: PostDefinition = {
  title: "AI로 숙제하는 아이, 부모는 어디까지 허용해야 할까요",
  tags: [
    "AI숙제",
    "ChatGPT숙제",
    "AI리터러시",
    "자녀교육",
    "자기이해",
    "탐TAM",
  ],
  blocks: [
    {
      kind: "paragraph",
      text: "저녁 9시, 아이가 국어 수행평가 초안을 보여줍니다. 문장은 또렷하고 구조도 정리돼 있는데, 부모는 한눈에 알아차립니다. 이건 아이가 생각을 잘한 결과인지, 아니면 ChatGPT가 너무 잘 써준 결과인지 헷갈리는 순간입니다.",
    },
    {
      kind: "paragraph",
      text: "많은 부모가 여기서 두 갈래로 흔들립니다. 이제는 시대가 바뀌었으니 그냥 허용해야 하나, 아니면 생각하는 힘이 무너질까 봐 강하게 막아야 하나. 그런데 이 둘 다 핵심을 조금 비껴갑니다.",
    },
    {
      kind: "emphasis",
      text: "AI를 허용할지보다 먼저 정해야 할 것은, 아이 대신 생각하게 둘 것인가입니다.",
    },
    {
      kind: "divider",
    },
    {
      kind: "subtitle",
      text: "이미 시작된 현실입니다, 아이들은 집에서 AI로 숙제를 합니다",
    },
    {
      kind: "paragraph",
      text: "2026년 2월 공개된 Pew Research Center 조사에 따르면, 미국 13~17세 청소년의 54%는 AI 챗봇을 숙제 도움에 사용해본 적이 있다고 답했습니다. 더 눈에 띄는 숫자는 따로 있습니다. 10명 중 1명은 숙제의 전부 또는 대부분을 챗봇 도움으로 한다고 답했습니다.",
    },
    {
      kind: "paragraph",
      text: "2024년 Common Sense Media와 Ipsos 조사도 비슷한 흐름을 보여줍니다. 청소년의 40%가 학교 과제에 생성형 AI를 사용한다고 답했고, 생성형 AI를 쓴 청소년의 부모 중 37%만이 자기 아이가 이미 AI를 사용했다고 알고 있었습니다.",
    },
    {
      kind: "paragraph",
      text: "즉, AI 숙제는 일부 얼리어답터의 이야기가 아닙니다. 이미 집 안으로 들어와 있는데, 부모의 기준과 대화 방식이 그 속도를 따라가지 못하는 경우가 더 많습니다.",
    },
    {
      kind: "quote",
      text: "문제는 AI가 빠르다는 사실보다, 부모가 아이의 사용 방식을 모른 채 넘어가기 쉽다는 점입니다.",
    },
    {
      kind: "subtitle",
      text: "정말 위험한 건 사용 자체가 아니라 '생각을 외주화'하는 순간입니다",
    },
    {
      kind: "paragraph",
      text: "UNESCO는 2023년 생성형 AI 교육 가이드에서, GenAI가 인간의 사고를 대신해서는 안 된다고 분명히 말합니다. 또 사용자는 AI의 출력을 빠르지만 자주 불완전한 정보로 보고 비판적으로 다뤄야 한다고 정리합니다.",
    },
    {
      kind: "paragraph",
      text: "미국 교육부 역시 AI의 교육적 활용에서 가장 중요한 기준을 'humans in the loop'로 설명합니다. AI 도구는 설명 가능해야 하고, 사람이 판단을 유지하며 필요할 때는 결과를 덮어쓸 수 있어야 한다는 뜻입니다.",
    },
    {
      kind: "paragraph",
      text: "이 기준을 숙제에 그대로 옮기면 단순합니다. 아이가 막히자마자 AI에게 정답을 받아 적으면, 아이는 공부를 한 것이 아니라 사고의 출발점을 외주화한 셈이 됩니다. 반대로 먼저 자기 식으로 생각하고, 그다음 AI를 비교와 수정의 도구로 쓰면 완전히 다른 학습이 됩니다.",
    },
    {
      kind: "subtitle",
      text: "학교도 이제는 '무조건 금지'보다 기준을 세우는 쪽으로 움직입니다",
    },
    {
      kind: "paragraph",
      text: "한국 교육부는 2025년 12월 23일, 수행평가 시 AI 활용을 일률적으로 금지하기보다 안전하고 교육적으로 활용하도록 관리 방안을 마련했다고 발표했습니다. 핵심은 사용 범위 설정, 활용 과정 표기, 사전교육, 개인정보 보호, 그리고 교사가 수행 과정을 직접 관찰할 수 있는 활동 중심 평가입니다.",
    },
    {
      kind: "paragraph",
      text: "이 흐름이 의미하는 바는 분명합니다. 이제 어른들의 과제는 '한 번도 쓰지 않게 만들기'가 아니라, 어디까지 도움을 받고 어디서부터 자기 생각이 들어가야 하는지 기준을 세우는 일에 더 가깝습니다.",
    },
    {
      kind: "subtitle",
      text: "그래서 집에서 먼저 세워야 할 경계는 세 가지입니다",
    },
    {
      kind: "paragraph",
      text: "첫째, AI는 '시작 전 정답기계'가 아니라 '생각 후 조력자'로만 쓰게 하세요. 글쓰기라면 먼저 아이 생각으로 세 줄 초안이라도 적게 하고, 수학이라면 어디서 막혔는지까지는 스스로 표시하게 한 뒤 AI를 켜는 편이 좋습니다.",
    },
    {
      kind: "paragraph",
      text: "둘째, AI를 썼다면 결과보다 수정 흔적을 남기게 하세요. 어느 문장을 그대로 썼고, 어디를 고쳤고, 왜 바꿨는지를 자기 말로 설명하게 하면 AI 사용은 cheating보다 편집과 판단의 훈련에 가까워집니다.",
    },
    {
      kind: "paragraph",
      text: "셋째, AI는 답을 대신 쓰게 하기보다 질문을 넓히는 데 더 많이 쓰게 하세요. 반대 의견 찾기, 더 쉬운 예시 요청하기, 스스로 쓴 글의 약점 점검받기, 연습문제 만들기 같은 용도는 사고를 줄이기보다 넓히는 쪽에 가깝습니다.",
    },
    {
      kind: "quote",
      text: "AI를 잘 쓰는 아이는 대개 AI를 많이 쓰는 아이가 아니라, AI 결과를 자기 기준으로 고쳐 쓸 수 있는 아이입니다.",
    },
    {
      kind: "subtitle",
      text: "오늘 저녁, 이렇게 물어보면 됩니다",
    },
    {
      kind: "paragraph",
      text: "\"AI가 해준 부분이 어디야?\"라고 몰아붙이기보다 \"이 답 중에서 너는 어디를 바꿨고 왜 바꿨어?\"라고 물어보세요. 사용 사실보다 판단 기준이 먼저 드러납니다.",
    },
    {
      kind: "paragraph",
      text: "\"처음부터 AI를 켰어?\" 대신 \"처음 생각은 네가 쓰고, 다듬는 데 AI를 쓴 거야?\"라고 물어보세요. 아이가 사고를 시작했는지, 시작부터 맡겨버렸는지 구분하는 질문입니다.",
    },
    {
      kind: "paragraph",
      text: "\"다음에는 AI 쓰지 마\"보다 \"다음번에는 먼저 네 생각 세 줄을 적고, 그다음 AI 답과 비교해볼래?\"가 훨씬 현실적입니다. 금지보다 더 오래 가는 습관을 만들기 쉽기 때문입니다.",
    },
    {
      kind: "subtitle",
      text: "결국 AI 시대 공부에서 더 중요해지는 건 자기이해입니다",
    },
    {
      kind: "paragraph",
      text: "AI의 답은 대체로 그럴듯합니다. 그래서 더 위험합니다. 그럴듯한 답을 보고도 '이건 내 생각과 다르다', '이 문장은 너무 나답지 않다', '이 방향은 내가 중요하게 여기는 기준과 안 맞다'고 말하려면 아이 안에 이미 자기 기준이 있어야 합니다.",
    },
    {
      kind: "paragraph",
      text: "그래서 AI 시대 교육의 핵심은 도구를 무조건 늦게 접하게 하는 데만 있지 않습니다. 아이가 어떤 문제에 끌리고, 무엇을 중요하게 여기고, 어떤 방식으로 생각하는 사람인지 더 선명하게 알게 해주는 경험을 꾸준히 주는 데 있습니다.",
    },
    {
      kind: "paragraph",
      text: "탐(TAM)은 바로 그 지점을 돕기 위해 만들어진 경험 플랫폼입니다. 아이는 매일 10분, AI가 만든 다양한 세계 안에서 역할과 관점과 해결책을 고릅니다. 중요한 건 정답을 빨리 맞히는 것이 아니라, 선택의 패턴을 통해 '나는 어떤 사람인가'를 알아가는 것입니다. 그 자기 기준이 생길수록 아이는 AI를 덜 두려워하고, 동시에 덜 맹신하게 됩니다.",
    },
    {
      kind: "paragraph",
      text: "부모가 지금 세워줘야 할 건 완벽한 통제 규칙이 아닐 수 있습니다. 아이가 AI와 함께 공부하더라도 자기 생각의 주인이 남아 있게 하는 경계, 그리고 그 경계를 스스로 설명할 수 있게 하는 대화가 더 중요합니다. 그 힘이 결국 공부 습관도, 미래의 선택도 바꾸기 시작합니다.",
    },
    {
      kind: "link",
      text: "AI 시대, 우리 아이가 자기 기준을 키우는 방법 자세히 보기",
      url: absoluteUrl("/guide/ai-era-career"),
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
  console.log("[publish] open editor");
  await page.goto(buildNaverBlogWriteUrl(BLOG_ID), {
    waitUntil: "domcontentloaded",
  });
  await waitForEditorReady(page);
  console.log("[publish] fill title");
  await fillTitle(page, definition.title);

  for (const [index, block] of definition.blocks.entries()) {
    console.log(`[publish] block ${index + 1}/${definition.blocks.length}: ${block.kind}`);
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

  console.log("[publish] open publish panel");
  await openPublishPanel(page);
  console.log("[publish] apply tags");
  await applyTags(page, definition.tags);
  console.log("[publish] click final publish");
  await page.getByRole("button", { name: "발행", exact: true }).last().click({ force: true });
  try {
    await page.waitForURL(/PostView\.naver|m\.blog\.naver\.com/, { timeout: 30000 });
  } catch (error) {
    await fs.writeFile(
      path.join(OUTPUT_DIR, "publish-timeout-state.json"),
      JSON.stringify(
        {
          url: page.url(),
          buttons: await page.evaluate(() =>
            Array.from(document.querySelectorAll("button"))
              .map((button) => button.textContent?.trim())
              .filter((text): text is string => Boolean(text)),
          ),
          textSample: await page.evaluate(() => document.body.innerText.slice(0, 3000)),
        },
        null,
        2,
      ),
      "utf8",
    );
    await page.screenshot({
      path: path.join(OUTPUT_DIR, "publish-timeout.png"),
      fullPage: true,
    });

    const confirmButton = page.getByRole("button", { name: "확인", exact: true }).last();
    if (await isVisible(confirmButton)) {
      console.log("[publish] timeout fallback: click 확인");
      await confirmButton.click({ force: true });
    }

    const publishButtons = page.getByRole("button", { name: "발행", exact: true });
    const publishButtonCount = await publishButtons.count();
    if (publishButtonCount > 0) {
      console.log("[publish] timeout fallback: click last visible 발행");
      await publishButtons.last().click({ force: true }).catch(() => undefined);
    }

    await page.waitForURL(/PostView\.naver|m\.blog\.naver\.com/, { timeout: 30000 });
  }
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
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(260);
}

async function typeEmphasisLine(page: Page, text: string) {
  await focusLastParagraph(page);
  await page.keyboard.type(text);
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(260);
}

async function insertDivider(page: Page) {
  await focusLastParagraph(page);
  await page.keyboard.type("----------");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(220);
}

async function insertQuote(page: Page, text: string) {
  await focusLastParagraph(page);
  await page.keyboard.type(`"${text}"`);
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(240);
}

async function insertImage(page: Page, filePath: string) {
  await focusLastParagraph(page);

  const imageButton = page.locator("button.se-image-toolbar-button").first();
  await imageButton.waitFor({ state: "visible", timeout: 10000 });

  for (let attempt = 0; attempt < 3; attempt += 1) {
    console.log(`[publish] image upload attempt ${attempt + 1}`);
    const chooserPromise = page
      .waitForEvent("filechooser", { timeout: 5000 })
      .catch(() => null);

    await imageButton.focus().catch(() => undefined);
    await page.keyboard.press("Enter").catch(() => undefined);

    const chooser = await chooserPromise;
    if (chooser) {
      console.log("[publish] filechooser received");
      await chooser.setFiles(filePath);
      console.log("[publish] files selected");
      await page.waitForTimeout(3000);
      await dismissBlockingPopup(page);
      await dismissEditorPanels(page);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(240);
      console.log("[publish] image inserted via filechooser");
      return;
    }

    const fileInput = page.locator('input[type="file"]').last();
    if ((await fileInput.count()) > 0) {
      console.log("[publish] fallback file input found");
      await fileInput.setInputFiles(filePath);
      await page.waitForTimeout(3000);
      await dismissBlockingPopup(page);
      await dismissEditorPanels(page);
      await page.keyboard.press("Enter");
      await page.waitForTimeout(240);
      console.log("[publish] image inserted via fallback input");
      return;
    }

    console.log("[publish] image upload attempt missed chooser and input");
    await dismissEditorPanels(page);
    await page.waitForTimeout(400);
  }

  throw new Error(`Failed to upload image: ${filePath}`);
}

async function insertLinkedLine(page: Page, text: string, url: string) {
  await focusLastParagraph(page);
  await page.keyboard.type(`${text}: ${url}`);
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
  const topPublishButton = page.getByRole("button", { name: "발행", exact: true }).first();
  const tagInput = page.getByRole("combobox", {
    name: /태그 입력 \(최대 30개\)/,
  });

  const openStrategies: Array<() => Promise<void>> = [
    async () => {
      await topPublishButton.click({ force: true });
    },
    async () => {
      await topPublishButton.focus().catch(() => undefined);
      await page.keyboard.press("Enter").catch(() => undefined);
    },
    async () => {
      const box = await topPublishButton.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      }
    },
  ];

  for (let attempt = 0; attempt < openStrategies.length; attempt += 1) {
    await dismissBlockingPopup(page);
    await dismissEditorPanels(page);
    await openStrategies[attempt]();
    await page.waitForTimeout(1200);

    if (await isVisible(tagInput)) {
      return;
    }
  }

  throw new Error("Failed to open publish panel");
}

async function applyTags(page: Page, tags: string[]) {
  const tagInput = page.getByRole("combobox", {
    name: /태그 입력 \(최대 30개\)/,
  });

  if (!(await isVisible(tagInput))) {
    throw new Error("Tag input is not visible; publish panel did not open");
  }

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
