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
  "../output/playwright/naver-blog/private-education-career-blur-flagship",
);
const IMAGE_PATH = path.resolve(
  process.cwd(),
  "../output/imagegen/private-education-career-blur-flagship/private-education-career-blur-poster-final.png",
);

const post: PostDefinition = {
  title: "사교육은 늘었는데, 왜 우리 아이 진로는 더 흐릴까요",
  tags: [
    "사교육비",
    "학부모가이드",
    "자녀교육",
    "진로탐색",
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
      text: "저녁 9시, 학원 가방을 내려놓은 아이에게 부모가 묻습니다. \"그래서 넌 요즘 뭘 좋아해?\" 그런데 아이는 잠깐 생각하다가 말합니다. \"잘 모르겠어.\" 시간표는 빼곡하고, 하는 건 분명 많은데, 방향은 오히려 더 흐린 느낌이 드는 순간입니다.",
    },
    {
      kind: "paragraph",
      text: "이 감정은 이상한 게 아닙니다. 부모는 뒤처지게 하고 싶지 않아서 더 넣고, 더 채우고, 더 대비하게 됩니다. 그런데 어느 순간 깨닫게 됩니다. 배운 것은 많은데, 정작 아이가 어떤 사람인지, 어떤 세계에서 살아나는지는 더 선명해지지 않았다는 사실을요.",
    },
    {
      kind: "emphasis",
      text: "아이의 방향감은 시간표의 밀도가 아니라, 어떤 경험에서 살아나는지 읽어낼 때 선명해집니다.",
    },
    {
      kind: "divider",
    },
    {
      kind: "subtitle",
      text: "부모가 더 넣게 되는 이유는 자연스럽습니다",
    },
    {
      kind: "paragraph",
      text: "지금 부모 세대는 이미 알고 있습니다. 기회는 준비된 아이에게 더 많이 간다는 것을요. 그래서 영어도, 수학도, 독서도, 코딩도 놓치고 싶지 않습니다. 아이가 아직 어려도 미리 길을 열어주고 싶은 마음은 사랑에 가깝습니다.",
    },
    {
      kind: "paragraph",
      text: "문제는 이 전략이 성적 관리에는 도움을 줄 수 있어도, 자기이해와 진로 방향감까지 자동으로 만들어주진 않는다는 점입니다. 바쁘게 움직이는 것과 스스로 방향을 아는 것은 전혀 다른 문제입니다.",
    },
    {
      kind: "paragraph",
      text: "부모 입장에서 더 답답한 건, 아이가 분명 열심히 사는데도 \"나는 뭘 좋아하는지 모르겠어\", \"잘하는 건 있는데 뭘 해야 할지 모르겠어\"라는 말을 계속 듣게 된다는 점입니다. 이때 필요한 건 더 많은 입력이 아니라, 지금 빠져 있는 조각이 무엇인지 보는 일입니다.",
    },
    {
      kind: "quote",
      text: "문제는 아이가 바쁘지 않아서가 아니라, 자기 반응을 읽을 틈이 없다는 데 있습니다.",
    },
    {
      kind: "subtitle",
      text: "총액이 줄었다는 뉴스가 안심이 안 되는 이유",
    },
    {
      kind: "paragraph",
      text: "교육부는 2026년 3월 12일, 2025년 초중고 사교육비 조사 결과를 공식 발표했습니다. 같은 결과를 인용한 보도에 따르면 사교육비 총액은 27조 5,351억 원으로 줄었지만, 참여 학생의 월평균 사교육비는 60만 4천 원으로 처음 60만 원을 넘었습니다. 기사 헤드라인만 보면 줄었다고 느낄 수 있지만, 실제로 돈을 쓰고 있는 부모의 체감은 그만큼 가볍지 않다는 뜻입니다.",
    },
    {
      kind: "paragraph",
      text: "교육부가 2026년 4월 1일 사교육비 경감 정책 방안을 다시 발표하면서 강조한 것도 비슷했습니다. 공교육 안에서 자기주도학습 능력을 키우고, 진로·진학 설계와 학업 설계 상담을 더 촘촘히 지원하겠다는 내용이 들어갔습니다. 정부도 결국 더 많은 수업을 넣는 것만으로는 방향 문제가 풀리지 않는다는 점을 보고 있는 셈입니다.",
    },
    {
      kind: "paragraph",
      text: "여기에 OECD가 2025년 5월 20일 발표한 보고서를 보면, OECD 평균에서 15세 학생의 39%는 자신의 진로 기대가 불분명하다고 답했고, 33%는 학교가 직업에 유용한 것을 가르쳐주지 않았다고 느꼈습니다. 결국 많이 배우는 것과 어디로 가는지 아는 것은 아직 자동으로 연결되지 않습니다. 그래서 지금 필요한 질문은 \"무엇을 더 시킬까\"가 아니라 \"무엇이 빠져 있길래 이렇게 많이 해도 아이가 자기를 모를까\"입니다.",
    },
    {
      kind: "quote",
      text: "총액이 줄어도 부모의 불안이 줄지 않는 이유는, 아이의 방향감이 수업량이 아니라 자기 기준에서 나오기 때문입니다.",
    },
    {
      kind: "subtitle",
      text: "더 많이 배우는 것과 더 잘 아는 것은 다릅니다",
    },
    {
      kind: "paragraph",
      text: "학원과 과외는 대개 이미 정해진 목표를 향해 효율적으로 가도록 설계됩니다. 시험 범위를 소화하고, 약한 단원을 보완하고, 성과를 올리는 데에는 분명 강합니다. 하지만 자기이해는 다른 방식으로 생깁니다. 새로운 세계를 만나고, 선택하고, 반응하고, 그 패턴을 돌아볼 때 생깁니다.",
    },
    {
      kind: "paragraph",
      text: "그래서 바쁜 아이일수록 오히려 자기 반응을 읽을 시간이 부족해질 수 있습니다. 무엇을 잘했는지는 남지만, 무엇에서 살아났는지, 어떤 상황에서 스스로 움직였는지는 흐려집니다. 진로를 선명하게 만드는 건 성취 목록만이 아니라, 반복해서 드러나는 반응의 패턴입니다.",
    },
    {
      kind: "paragraph",
      text: "정보와 수업이 많아질수록 더 먼저 필요한 건 선택 기준입니다. 이 활동은 왜 하는지, 아이가 여기서 실제로 어떤 반응을 보이는지, 이 경험이 아이를 좁히는지 넓히는지를 보지 않으면, 부모는 총액 뉴스와 상관없이 계속 막막해집니다. 많이 쓰는 문제보다, 많이 쓰고도 방향이 안 보이는 문제가 더 아프기 때문입니다.",
    },
    {
      kind: "quote",
      text: "정보와 수업이 많아질수록 더 먼저 필요한 건 선택 기준과 자기이해입니다.",
    },
    {
      kind: "subtitle",
      text: "사교육 루프를 끊기 위해 부모가 먼저 볼 네 가지",
    },
    {
      kind: "paragraph",
      text: "첫째, 오늘 아이가 가장 오래 한 활동이 아이가 고른 것인지, 시킨 것인지 구분해서 보세요. 시킨 활동만 가득하면 성취는 쌓일 수 있어도 방향감은 잘 생기지 않습니다.",
    },
    {
      kind: "paragraph",
      text: "둘째, 시간 가는 줄 몰랐던 순간이 이번 주에 있었는지 물어보세요. 진로는 보통 잘한 것보다, 몰입했던 순간에서 더 자주 단서를 줍니다.",
    },
    {
      kind: "paragraph",
      text: "셋째, 결과보다 반응을 기억하는 활동이 있었는지 보세요. 점수나 완성도는 남았는데 아이 표정과 에너지가 기억나지 않는다면, 진로 대화의 재료가 부족한 상태일 수 있습니다.",
    },
    {
      kind: "paragraph",
      text: "넷째, 일정표 안에 처음 해보는 경험이 하나라도 있는지 확인하세요. 익숙한 반복은 실력을 키울 수 있지만, 낯선 경험은 자기이해를 키웁니다. 방향감은 보통 이 두 번째에서 시작됩니다.",
    },
    {
      kind: "subtitle",
      text: "결국 방향감을 만드는 건 자기이해와 탐색 경험입니다",
    },
    {
      kind: "paragraph",
      text: "아이에게 필요한 건 무조건 덜 시키는 것이 아닙니다. 무엇을 줄이고 무엇을 남길지, 그리고 무엇을 새로 넣을지를 다시 설계하는 일입니다. 진로를 선명하게 만드는 경험은 대개 더 높은 난도의 수업이 아니라, 아이가 스스로 선택하고 반응을 확인할 수 있는 탐색형 경험에서 시작됩니다.",
    },
    {
      kind: "paragraph",
      text: "특히 초등 고학년에서 중1 사이에는 진로를 좁히기보다 넓히는 것이 더 중요합니다. 다양한 경험 속에서 아이가 어떤 세계에 끌리는지, 어떤 역할에서 살아나는지, 무엇을 반복해서 고르는지 볼 수 있어야 이후 선택도 건강해집니다.",
    },
    {
      kind: "paragraph",
      text: "탐(TAM)은 바로 그 탐색형 자기이해를 돕기 위해 만들어진 플랫폼입니다. 아이는 매일 10분, 서로 다른 세계 안에서 역할과 관점과 해결책을 고릅니다. 중요한 건 더 많이 배우는 일이 아니라, 어떤 상황에서 스스로 살아나고 어떤 선택을 반복하는지를 부모와 함께 읽어내는 것입니다. 그 패턴이 쌓일수록, 아이의 방향감은 학원 스케줄보다 훨씬 더 선명해집니다.",
    },
    {
      kind: "link",
      text: "초등 고학년 진로탐색, 무엇부터 시작해야 할지 자세히 보기",
      url: absoluteUrl("/guide/elementary-career-exploration"),
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
