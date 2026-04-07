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
  "../output/playwright/naver-blog/ai-digital-textbook-flagship",
);
const IMAGE_PATH = path.resolve(
  process.cwd(),
  "../output/imagegen/ai-digital-textbook-flagship/ai-digital-textbook-poster-final.png",
);

const post: PostDefinition = {
  title: "AI 디지털교과서 시대, 부모는 무엇을 준비해야 할까요",
  tags: [
    "AI디지털교과서",
    "AI교육",
    "학부모가이드",
    "미래교육",
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
      text: "학교에서 AI 디지털교과서 안내문이 오면, 부모는 대개 비슷한 순서로 불안해집니다. 화면 시간이 더 늘어나는 건 아닐까, 아이가 더 산만해지는 건 아닐까, 개인정보는 괜찮을까, 준비가 덜 된 학교와 더 된 학교 사이 격차가 더 벌어지진 않을까.",
    },
    {
      kind: "paragraph",
      text: "이 반응은 자연스럽습니다. 교과서라는 가장 익숙한 학습 도구가 AI와 만나면, 부모는 기술의 장점보다 먼저 아이가 그 도구를 어떻게 쓰게 될지를 떠올리게 되기 때문입니다. 그래서 지금 필요한 건 찬반을 빨리 정하는 일이 아니라, 무엇을 먼저 준비해야 하는지 기준을 세우는 일에 더 가깝습니다.",
    },
    {
      kind: "emphasis",
      text: "AI 디지털교과서 시대에 부모가 먼저 준비해야 할 것은 기기가 아니라, 아이가 도구를 판단하며 배우는 기준입니다.",
    },
    {
      kind: "divider",
    },
    {
      kind: "subtitle",
      text: "학부모가 먼저 불안해지는 이유는 자연스럽습니다",
    },
    {
      kind: "paragraph",
      text: "AI 디지털교과서는 단순히 종이책이 화면으로 바뀌는 정도의 변화가 아닙니다. 아이의 학습 데이터, 반응 속도, 이해 정도, 추천 경로까지 개입할 수 있는 도구이기 때문에, 부모 입장에서는 훨씬 더 민감하게 느껴질 수밖에 없습니다.",
    },
    {
      kind: "paragraph",
      text: "같은 기술을 두고도 어떤 부모는 맞춤 학습을 기대하고, 어떤 부모는 집중력 저하를 걱정합니다. 그런데 이 두 반응은 사실 같은 질문에서 나옵니다. 우리 아이가 이 도구 앞에서 더 깊게 배우게 될까, 아니면 더 쉽게 의존하게 될까 하는 질문입니다.",
    },
    {
      kind: "paragraph",
      text: "문제는 AI 디지털교과서 논의가 종종 정책 찬반이나 기기 도입 여부에서만 멈춘다는 점입니다. 하지만 집에서 부모가 정말 궁금한 것은 훨씬 구체적입니다. 우리 아이에게는 어떤 사용이 도움이 되고, 어떤 사용은 오히려 생각을 줄이는가 하는 기준입니다.",
    },
    {
      kind: "quote",
      text: "도구가 교실에 들어오는 것보다 더 중요한 건, 우리 아이가 그 도구 앞에서 어떤 방식으로 배우는 아인가를 아는 일입니다.",
    },
    {
      kind: "subtitle",
      text: "교육부가 말한 것도 보급보다 관리 조건이었습니다",
    },
    {
      kind: "paragraph",
      text: "교육부는 2024년 11월 29일 브리핑에서 AI 디지털교과서를 2025년에는 영어, 수학, 정보 교과에 먼저 적용하고, 국어와 기술·가정, 실과는 제외하며, 사회와 과학은 2027년으로 순연한다고 밝혔습니다. 이 발표는 단순 확대가 아니라 현장 부담과 우려를 고려한 조정이 함께 있었다는 뜻이기도 합니다.",
    },
    {
      kind: "paragraph",
      text: "같은 브리핑에서 교육부는 학부모 우려에 대해 아주 구체적으로 답했습니다. 디지털 기기 오용 문제에 대해서는 유해사이트 차단 프로그램, AI 디지털교과서의 수업집중모드, 교사의 모니터링을 통해 엄격히 관리하겠다고 했고, 개인정보보호에 대해서는 모든 AI 디지털교과서가 CSAP 중등급 이상을 획득하고 망 분리를 실시했다고 설명했습니다.",
    },
    {
      kind: "paragraph",
      text: "여기에 2025년 9월 교육부가 제시한 학습지원 소프트웨어 선정 가이드라인을 보면, 개인정보 최소수집, 안전조치, 만 14세 미만 보호, 콘텐츠의 정확성과 연령 적합성, 학교 사용환경 적합성까지 기준으로 삼고 있습니다. 즉, 정부가 강조한 것도 기술 그 자체보다 어떤 조건 아래에서 쓰는가였습니다.",
    },
    {
      kind: "subtitle",
      text: "그래도 교과서가 AI가 된다고 자기주도학습이 저절로 생기진 않습니다",
    },
    {
      kind: "paragraph",
      text: "여기서 부모가 꼭 놓치지 말아야 할 점이 있습니다. AI 디지털교과서는 아이에게 더 맞는 속도와 경로를 제안할 수는 있어도, 왜 이 문제를 배우는지, 어떤 방식으로 이해하는 것이 자신에게 맞는지까지 대신 결정해주지는 못합니다.",
    },
    {
      kind: "paragraph",
      text: "같은 도구를 써도 어떤 아이는 힌트를 보고 자기 말로 다시 정리합니다. 반면 어떤 아이는 정답에 가까운 경로를 빨리 따라가며 스스로 설명하는 단계는 건너뜁니다. 겉으로는 둘 다 열심히 하고 있는 것처럼 보여도, 학습의 깊이는 크게 달라질 수 있습니다.",
    },
    {
      kind: "paragraph",
      text: "Common Sense Media도 부모가 AI를 완벽히 이해해야만 도와줄 수 있는 것은 아니라고 말합니다. 더 중요한 것은 아이와 대화를 열고, AI 결과를 그냥 받는 대신 비교하고 고치고 설명하게 만드는 습관입니다. 결국 기술보다 먼저 필요한 건 판단 구조입니다.",
    },
    {
      kind: "quote",
      text: "AI가 학습을 개인화할 수는 있어도, 그 배움을 자기 것으로 만드는 일은 여전히 아이와 부모의 몫입니다.",
    },
    {
      kind: "subtitle",
      text: "부모가 집에서 먼저 준비해야 할 네 가지",
    },
    {
      kind: "paragraph",
      text: "첫째, 우리 아이가 막히는 순간 어떻게 반응하는지 먼저 보세요. 바로 답을 찾는 편인지, 잠깐이라도 자기 방식으로 정리해보는 편인지에 따라 같은 도구도 완전히 다른 결과를 만듭니다.",
    },
    {
      kind: "paragraph",
      text: "둘째, 새로운 기능이 들어왔을 때 집중이 깊어지는 아이인지, 자극만 많아지는 아이인지 구분해서 봐야 합니다. 화면 노출 시간 자체보다, 그 시간 안에서 아이가 무엇을 하고 있는지가 더 중요합니다.",
    },
    {
      kind: "paragraph",
      text: "셋째, 결과를 빨리 내는 것보다 왜 그렇게 풀었는지를 설명하게 하세요. AI 디지털교과서를 썼더라도 자기 말로 설명하지 못하면 학습은 얇아질 가능성이 큽니다. 반대로 설명할 수 있다면 도구는 오히려 이해를 돕는 계기가 될 수 있습니다.",
    },
    {
      kind: "paragraph",
      text: "넷째, 어떤 과목과 과제에서 아이가 더 살아나는지 관찰하세요. 같은 AI 도구를 써도 어떤 아이는 수학에서 자신감을 얻고, 어떤 아이는 언어 표현에서 더 반응합니다. 이 차이를 보는 것이 이후 학습 전략과 진로 대화의 재료가 됩니다.",
    },
    {
      kind: "subtitle",
      text: "결국 더 중요해지는 것은 아이의 학습 기준과 자기이해입니다",
    },
    {
      kind: "paragraph",
      text: "AI 디지털교과서 시대에는 교과서가 더 똑똑해질 수 있습니다. 하지만 그 똑똑한 도구를 앞에 두고도 어떤 아이는 더 깊이 배우고, 어떤 아이는 더 얕게 소비할 수 있습니다. 그 차이를 만드는 것은 기기 스펙보다 아이 안에 있는 학습 기준입니다.",
    },
    {
      kind: "paragraph",
      text: "그래서 부모가 지금 준비해야 할 것은 사용 금지표가 아니라, 아이가 어떤 방식으로 배우는 사람인지 읽어내는 감각입니다. 막히면 어떻게 반응하는지, 무엇에서 집중이 살아나는지, 어떤 설명 방식이 자기 것이 되는지를 알수록 새로운 도구가 들어와도 방향을 잃지 않습니다.",
    },
    {
      kind: "paragraph",
      text: "탐(TAM)은 바로 그 자기기준을 키우는 경험을 돕기 위해 만들어진 플랫폼입니다. 아이는 매일 10분, AI가 만든 다양한 세계 안에서 역할과 관점과 해결책을 고릅니다. 중요한 것은 정보를 더 많이 넣는 일이 아니라, 선택의 패턴을 통해 나는 어떤 방식으로 배우고 판단하는 사람인가를 알아가는 것입니다. 그 자기이해가 쌓일수록, 아이는 새로운 도구 앞에서도 덜 휘둘리고 더 주도적으로 배웁니다.",
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
