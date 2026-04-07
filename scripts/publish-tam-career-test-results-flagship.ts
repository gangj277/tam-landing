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
  "../output/playwright/naver-blog/career-test-results-flagship",
);
const IMAGE_PATH = path.resolve(
  process.cwd(),
  "../output/imagegen/career-test-results-flagship/career-test-results-poster-final.png",
);

const post: PostDefinition = {
  title: "아이 진로검사 결과지, 어디까지 믿어도 될까요",
  tags: [
    "진로검사",
    "커리어넷",
    "진로심리검사",
    "학부모가이드",
    "자기이해",
    "탐TAM",
  ],
  blocks: [
    {
      kind: "image",
      filePath: IMAGE_PATH,
    },
    {
      kind: "paragraph",
      text: "커리어넷이나 학교 진로검사 결과지를 출력한 저녁, 부모는 잠깐 멈추게 됩니다. 종이 위에는 선명하게 유형명이 적혀 있는데, 정작 아이는 고개를 갸웃합니다. \"잘 모르겠어. 완전히 나 같진 않은데.\" 결과지가 생기면 오히려 질문이 더 많아지는 순간입니다.",
    },
    {
      kind: "paragraph",
      text: "이때 많은 부모가 두 갈래로 갑니다. 어떤 부모는 결과를 믿고 빨리 방향을 잡아주고 싶어 하고, 어떤 부모는 검사 자체가 무의미하다고 접어버립니다. 그런데 둘 다 조금은 아쉽습니다. 진로검사 결과지는 버릴 종이도, 아이를 정의하는 정답지도 아니기 때문입니다.",
    },
    {
      kind: "emphasis",
      text: "진로검사 결과지는 아이를 설명하는 결론이 아니라, 아이를 더 잘 관찰하기 위한 출발점입니다.",
    },
    {
      kind: "divider",
    },
    {
      kind: "subtitle",
      text: "진로검사는 이미 학교에서 아주 많이 쓰는 도구입니다",
    },
    {
      kind: "paragraph",
      text: "커리어넷 공식 가이드는 직업세계가 빠르게 변하는 만큼 청소년이 자신의 특성을 파악하고 적합한 진로를 설계하도록 돕는 일이 중요하다고 설명합니다. 실제로 중·고등학생용 진로심리검사는 학교 현장에서 연간 이용건수가 200만 건을 넘을 만큼 널리 활용되고 있습니다. 그만큼 많은 부모와 교사가 이 결과지를 중요한 단서로 보고 있다는 뜻입니다.",
    },
    {
      kind: "paragraph",
      text: "그리고 그 자체는 나쁜 일이 아닙니다. 같은 가이드는 진로심리검사가 학생의 자기이해를 돕고, 관련 의사결정을 내리는 데 참고할 수 있는 정보를 준다고 말합니다. 문제는 검사가 쓸모 있느냐 없느냐가 아니라, 우리가 결과지를 어떤 방식으로 읽느냐에 있습니다.",
    },
    {
      kind: "quote",
      text: "문제는 검사를 하는 데 있지 않습니다. 결과지를 아이의 정체성처럼 읽어버리는 순간부터 어긋나기 시작합니다.",
    },
    {
      kind: "subtitle",
      text: "공식 가이드도 결과를 절대적 진단으로 보지 말라고 말합니다",
    },
    {
      kind: "paragraph",
      text: "커리어넷 `진로심리검사 해석상담 가이드`는 아주 분명합니다. 진로심리검사만으로 학생의 특성을 모두 파악할 수 있는 것은 아니므로, 직업카드 탐색 같은 기타 질적인 활동을 병행하라고 안내합니다. 즉, 결과지만으로 아이를 설명하려 하지 말고 실제 대화와 경험을 함께 봐야 한다는 뜻입니다.",
    },
    {
      kind: "paragraph",
      text: "같은 가이드는 검사 결과가 절대적인 진단이나 예측을 해주는 것은 아니므로 참고자료로만 활용할 수 있도록 안내해야 한다고 적습니다. 검사 결과표에 함께 제시되는 직업이나 학과 역시 학생에게 개별화된 정답이 아니라 대표 예시이므로, 과도하게 의미를 두거나 지나치게 의존하지 말라고도 설명합니다.",
    },
    {
      kind: "paragraph",
      text: "이 공식 안내를 부모 입장에서 다시 읽어보면 질문이 바뀝니다. \"우리 아이는 예술형이니까 이 길이 맞아\"가 아니라, \"이 결과 중에서 실제 생활 속에서 반복해서 보이는 부분은 무엇이고, 아닌 부분은 무엇일까\"를 먼저 봐야 한다는 뜻입니다.",
    },
    {
      kind: "subtitle",
      text: "왜 결과지가 실제 아이와 어긋나 보일 때가 많을까요",
    },
    {
      kind: "paragraph",
      text: "청소년기는 원래 흔들리는 시기입니다. 커리어넷 공식 가이드도 청소년기에는 진로를 성급하게 결정하기보다 상황을 살펴보며 결정을 유예하는 것이 더 현명할 수도 있다고 안내합니다. 아이가 아직 변하고 있다는 뜻이고, 그래서 한 번의 검사 결과로 정체성을 고정하는 방식이 더 위험해질 수 있습니다.",
    },
    {
      kind: "paragraph",
      text: "OECD가 2025년 발표한 `The State of Global Teenage Career Preparation`에 따르면, OECD 평균에서 15세 학생의 39%는 자신의 진로 기대가 불분명하다고 답했고, 33%는 학교가 직업에 유용한 것을 가르쳐주지 않았다고 느꼈습니다. 이 수치는 진로 불확실성이 우리 아이만의 문제가 아니라는 사실을 보여줍니다. 오히려 이 시기의 흔들림은 정상에 가깝습니다.",
    },
    {
      kind: "paragraph",
      text: "게다가 설문형 검사는 지금 이 순간의 자기인식, 최근 경험, 보여주고 싶은 모습에 영향을 받기 쉽습니다. 그래서 결과지가 아이를 아예 틀리게 보여준다기보다, 살아 있는 아이의 일부만 잘라 보여주는 스냅샷에 가깝다고 보는 편이 정확합니다.",
    },
    {
      kind: "quote",
      text: "불확실한 시기의 아이에게 필요한 것은 더 강한 라벨이 아니라, 더 많은 탐색과 더 정교한 관찰입니다.",
    },
    {
      kind: "subtitle",
      text: "결과지를 제대로 쓰는 부모는 네 가지를 다르게 봅니다",
    },
    {
      kind: "paragraph",
      text: "첫째, 유형명을 결론이 아니라 가설로 읽습니다. \"너는 이 유형이야\"라고 닫아버리기보다 \"이 부분은 어디서 그렇게 느꼈을까\"라고 열어두는 질문이 더 중요합니다.",
    },
    {
      kind: "paragraph",
      text: "둘째, 결과를 실제 장면과 연결합니다. 학교 프로젝트를 할 때, 친구와 역할을 나눌 때, 시간을 잊고 몰입할 때, 아이가 어떤 방식으로 반응했는지와 결과지를 나란히 놓고 봐야 합니다. 종이 위 점수보다 생활 속 장면이 훨씬 많은 정보를 줍니다.",
    },
    {
      kind: "paragraph",
      text: "셋째, 높은 점수만 보지 않고 어긋나는 부분도 함께 봅니다. 아이가 결과를 보며 강하게 고개를 젓는 대목, 의외라고 느끼는 항목, 설명하고 싶어하는 부분이 바로 대화의 핵심입니다. 맞는 부분만큼 안 맞는 부분도 아이를 이해하는 데 중요합니다.",
    },
    {
      kind: "paragraph",
      text: "넷째, 결과를 다음 경험 설계에 씁니다. 예를 들어 사회적 흥미가 높게 나왔다면 곧장 진로를 정하는 대신, 발표 역할을 맡겨보거나 인터뷰 프로젝트를 해보거나 사람을 돕는 작은 활동을 붙여보세요. 결과지는 방향을 확정하는 도장이 아니라 다음 실험을 고르는 지도에 가깝습니다.",
    },
    {
      kind: "subtitle",
      text: "결국 아이를 더 정확하게 보여주는 건 반복된 경험의 패턴입니다",
    },
    {
      kind: "paragraph",
      text: "OECD는 학생들의 더 나은 진로 준비가 명확한 계획 자체보다, 진로 대화와 직업세계 접점, 일 경험 같은 반복된 탐색 활동과 연결된다고 설명합니다. 즉, 아이가 자기 미래를 더 선명하게 이해하게 만드는 것은 이름표 하나보다 여러 번의 접촉과 선택, 그리고 그 선택을 돌아보는 과정입니다.",
    },
    {
      kind: "paragraph",
      text: "그래서 진로검사 결과지와 가장 잘 맞는 보완재는 더 많은 정보가 아니라 더 다양한 경험입니다. 결과를 보고 끝내지 않고, 아이가 어떤 세계에 끌리는지, 어떤 선택을 반복하는지, 무엇에서 살아나는지를 몇 번이고 비교해볼 때 비로소 자기이해가 입체적으로 생깁니다.",
    },
    {
      kind: "paragraph",
      text: "탐(TAM)은 바로 그 과정을 돕기 위해 만들어진 경험형 자기이해 플랫폼입니다. 아이는 매일 10분, 서로 다른 세계와 역할 속에서 고르고 반응합니다. 중요한 것은 검사처럼 한 번 답하는 일이 아니라, 수십 번의 선택이 쌓이며 나는 무엇에 끌리고 어떤 판단을 반복하는 사람인가를 스스로 발견하는 것입니다. 그래서 탐은 진로검사를 대체하기보다, 결과지를 훨씬 더 정확하게 읽게 해주는 경험의 층을 더합니다.",
    },
    {
      kind: "link",
      text: "검사 결과지보다 더 정확한 자기이해, 경험으로 시작하는 방법 보기",
      url: absoluteUrl("/blog/experience-based-self-discovery"),
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

  const imageButton = page.locator("button.se-image-toolbar-button").first();
  await imageButton.waitFor({ state: "visible", timeout: 10000 });

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const chooserPromise = page
      .waitForEvent("filechooser", { timeout: 5000 })
      .catch(() => null);

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
