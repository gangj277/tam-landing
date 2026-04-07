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
  "../output/playwright/naver-blog/future-jobs-flagship",
);
const IMAGE_PATH = path.resolve(
  process.cwd(),
  "../output/imagegen/tam-naver-blog-v2/post-02-experience-over-test.png",
);

const post: PostDefinition = {
  title: "우리 아이는 아직 이름 없는 직업을 갖게 될 수 있습니다, 그래서 더 중요한 준비",
  tags: [
    "미래직업",
    "AI시대교육",
    "자녀진로",
    "자기이해",
    "진로탐색",
    "학부모가이드",
  ],
  blocks: [
    {
      kind: "image",
      filePath: IMAGE_PATH,
    },
    {
      kind: "paragraph",
      text: "학교에서 장래희망을 적어오라는 숙제가 나오면, 부모는 본능적으로 익숙한 직업 이름부터 떠올립니다. 의사, 교사, 개발자, 연구원처럼 지금 존재하는 직업 중에서 아이에게 맞는 답을 고르려 하게 됩니다.",
    },
    {
      kind: "paragraph",
      text: "그런데 AI 시대에는 이 방식 자체가 점점 덜 맞아갑니다. 우리 아이가 어른이 되어 본격적으로 일할 무렵에는, 지금은 이름조차 없는 일이 더 많아질 수 있기 때문입니다.",
    },
    {
      kind: "emphasis",
      text: "미래 직업을 맞히는 교육보다, 아직 이름 없는 일 앞에서도 자기 기준으로 선택하는 힘을 키우는 교육이 더 중요합니다.",
    },
    {
      kind: "divider",
    },
    {
      kind: "subtitle",
      text: "왜 미래 직업 리스트는 자꾸 빗나갈까",
    },
    {
      kind: "paragraph",
      text: "20년 전만 해도 앱 개발자, 크리에이터 이코노미 매니저, 프롬프트 엔지니어 같은 이름은 지금처럼 익숙하지 않았습니다. 기술이 바뀔 때마다 직업 이름도, 필요한 역할도 함께 바뀝니다.",
    },
    {
      kind: "paragraph",
      text: "LinkedIn의 2026년 보고서는 오늘 채용된 미국 전문가의 20% 이상이 2000년에는 존재하지 않던 직함을 가지고 있다고 말합니다. World Economic Forum의 Future of Jobs Report 2025는 2030년까지 전 세계적으로 1억7000만 개의 새로운 역할이 생기고, 9200만 개는 사라질 것으로 봅니다.",
    },
    {
      kind: "paragraph",
      text: "그러니 부모가 해야 할 일은 미래 유망직업 리스트를 외우는 일이 아닙니다. 리스트가 바뀔 때마다 흔들리지 않을 기준을 아이 안에 만드는 일입니다.",
    },
    {
      kind: "quote",
      text: "직업 이름이 불확실할수록, 아이 안의 기준은 더 중요해집니다.",
    },
    {
      kind: "subtitle",
      text: "그럼 대체 무엇을 준비시켜야 할까",
    },
    {
      kind: "paragraph",
      text: "정답은 생각보다 단순합니다. 아이가 무엇에 끌리는지, 어떤 문제를 만났을 때 눈빛이 바뀌는지, 낯선 상황에서 어떤 선택을 하는지를 더 잘 알게 해주는 준비입니다.",
    },
    {
      kind: "paragraph",
      text: "AI는 답을 빠르게 만들어주지만 방향을 대신 정해주지는 못합니다. 같은 도구를 써도 누군가는 더 깊게 파고들고, 누군가는 금세 흥미를 잃습니다. 그 차이를 만드는 건 기술 숙련도보다 자기이해입니다.",
    },
    {
      kind: "paragraph",
      text: "결국 미래에 강한 아이는 가장 빠르게 답을 외우는 아이보다, 낯선 세계를 만나도 스스로 의미를 찾고 자기 식으로 선택할 수 있는 아이일 가능성이 큽니다.",
    },
    {
      kind: "subtitle",
      text: "미래 직업 앞에서 결국 드러나는 세 가지",
    },
    {
      kind: "paragraph",
      text: "첫째, 아이가 어떤 문제에 오래 머무는가입니다. 사람의 감정을 다루는 문제에 끌리는지, 구조를 설계하는 문제에 끌리는지, 상상한 것을 만드는 과정에 끌리는지에 따라 미래 역할도 달라집니다.",
    },
    {
      kind: "paragraph",
      text: "둘째, 아이가 불확실한 상황에서 어떻게 반응하는가입니다. 정답이 없는 문제를 만나면 질문을 던지는지, 겁을 먹는지, 실험을 시작하는지 보면 아이의 학습 방식과 회복 방식이 드러납니다.",
    },
    {
      kind: "paragraph",
      text: "셋째, 아이가 무엇을 선택의 기준으로 삼는가입니다. 재미, 공정함, 완성도, 영향력, 안정감 중 무엇이 자주 반복되는지 알면, 직업 이름이 바뀌어도 아이의 방향감은 덜 흔들립니다.",
    },
    {
      kind: "subtitle",
      text: "문제는 아이가 이런 기준을 발견할 기회가 너무 적다는 것입니다",
    },
    {
      kind: "paragraph",
      text: "현실의 아이들은 학교, 학원, 숙제, 시험 사이를 왕복하는 시간이 많습니다. 그 구조 안에서는 정답을 맞히는 경험은 많아도, 처음 보는 세계를 만나고 자기 반응을 읽는 경험은 생각보다 적습니다.",
    },
    {
      kind: "paragraph",
      text: "그래서 초등 고학년부터 중학생 시기에는 더더욱 다양한 경험이 중요합니다. 이 시기는 진로를 확정하는 때가 아니라, 자기 반응 패턴을 쌓아가며 '나는 어떤 상황에서 살아나는 사람인가'를 발견하는 골든타임에 가깝습니다.",
    },
    {
      kind: "quote",
      text: "아이는 설명을 통해서보다, 선택과 반응의 반복을 통해 자기 자신을 더 정확하게 알아갑니다.",
    },
    {
      kind: "subtitle",
      text: "그래서 지금 필요한 건 예측이 아니라 경험 설계입니다",
    },
    {
      kind: "paragraph",
      text: "부모가 모든 미래 직업을 미리 설명해줄 수는 없습니다. 대신 아이가 다양한 세계를 만나고, 그 안에서 역할을 고르고, 선택 이유를 돌아보게 도와줄 수는 있습니다. 그 경험이 쌓이면 직업 이름보다 더 오래 가는 자기 기준이 생깁니다.",
    },
    {
      kind: "paragraph",
      text: "탐(TAM)은 바로 그 지점을 돕기 위해 만들어진 경험 플랫폼입니다. 아이는 매일 10분, AI가 만든 새로운 세계를 만납니다. 법정, 연구소, 사회적 딜레마, 창작 현장 같은 낯선 장면 안에서 스스로 역할과 관점과 해결책을 고릅니다. 그 선택의 패턴이 쌓일수록, 부모도 아이도 '이 아이는 이런 세계에서 살아나는구나'를 더 선명하게 보게 됩니다.",
    },
    {
      kind: "paragraph",
      text: "미래 직업의 이름은 바뀔 수 있습니다. 하지만 아이가 자신을 이해하고, 낯선 변화 속에서도 스스로 방향을 잡는 힘은 훨씬 오래 남습니다. 부모가 지금 아이에게 줄 수 있는 가장 큰 준비는 그래서 정답표가 아니라, 자기 자신을 발견하는 경험일지도 모릅니다.",
    },
    {
      kind: "link",
      text: "탐의 AI 시대 진로 준비 가이드 자세히 보기",
      url: absoluteUrl("/guide/ai-era-career"),
    },
  ],
};

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

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
    path: path.join(OUTPUT_DIR, dryRun ? "dry-run.png" : "before-publish.png"),
    fullPage: true,
  });
  await fs.writeFile(
    path.join(OUTPUT_DIR, dryRun ? "dry-run-article.json" : "before-publish-article.json"),
    JSON.stringify(
      await page.evaluate(() =>
        Array.from(document.querySelectorAll("article p")).map((paragraph) => ({
          text: paragraph.textContent,
          className: paragraph.className,
          html: paragraph.innerHTML,
        })),
      ),
      null,
      2,
    ),
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
    path: path.join(OUTPUT_DIR, "after-publish.png"),
    fullPage: true,
  });

  return page.url();
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
  await titleParagraph.click({ force: true });
  await page.keyboard.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
  await page.keyboard.type(title);
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
