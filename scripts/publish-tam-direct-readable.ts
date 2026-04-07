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
  slug: string;
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
  "../output/playwright/naver-blog/direct-readable",
);
const IMAGE_DIR = path.resolve(
  process.cwd(),
  "../output/imagegen/tam-naver-blog-v2",
);

const posts: PostDefinition[] = [
  {
    slug: "01-ai-era-judgment",
    title: "AI가 다 해주는 시대, 우리 아이에게 진짜 남는 건",
    tags: ["AI교육", "자녀교육", "자기이해", "미래역량", "학부모가이드"],
    blocks: [
      {
        kind: "image",
        filePath: path.join(IMAGE_DIR, "post-01-ai-judgment.png"),
      },
      {
        kind: "paragraph",
        text: "요즘 부모가 가장 자주 하는 질문은 이겁니다. AI가 글도 써주고 숙제도 도와주는데, 이제 우리 아이는 뭘 준비해야 하죠?",
      },
      {
        kind: "paragraph",
        text: "이 질문이 나오는 건 당연합니다. 세상이 너무 빨리 바뀌니까, 부모는 자꾸 기술 목록부터 펼치게 됩니다.",
      },
      {
        kind: "emphasis",
        text: "하지만 아이에게 오래 남는 건 더 빠른 기술이 아니라, 자기 기준으로 선택하는 힘입니다.",
      },
      {
        kind: "divider",
      },
      {
        kind: "subtitle",
        text: "부모가 놓치기 쉬운 첫 장면",
      },
      {
        kind: "paragraph",
        text: "아이에게 정말 중요한 단서는 잘하는 것보다 오래 붙드는 것에 먼저 나타납니다.",
      },
      {
        kind: "paragraph",
        text: "식탁에서 말이 길어지는 주제, 시간이 가는 줄 모르고 붙드는 활동, 스스로 다시 켜보는 콘텐츠가 바로 그 단서입니다.",
      },
      {
        kind: "paragraph",
        text: "기술은 나중에도 배울 수 있지만, 아이가 무엇에 끌리는지 읽는 감각은 부모가 일상에서 먼저 잡아줘야 합니다.",
      },
      {
        kind: "quote",
        text: "AI는 답을 대신 써줄 수 있어도, 무엇을 남길지는 대신 결정해주지 못합니다.",
      },
      {
        kind: "subtitle",
        text: "집에서 먼저 확인할 세 가지",
      },
      {
        kind: "paragraph",
        text: "첫째, 시간을 잊는 주제를 보세요. 오래 붙드는 주제는 대체로 아이의 내적 동기와 연결돼 있습니다.",
      },
      {
        kind: "paragraph",
        text: "둘째, AI가 준 결과를 그대로 쓰는지, 자기 식으로 고치는지 보세요. 수정하는 아이는 이미 자기 기준이 움직이고 있는 겁니다.",
      },
      {
        kind: "paragraph",
        text: "셋째, 선택 이유를 설명할 때 어떤 단어를 반복하는지 들어보세요. 재미, 공정함, 완성도, 독창성 같은 단어는 아이의 가치 기준을 드러냅니다.",
      },
      {
        kind: "subtitle",
        text: "오늘부터 질문을 바꿔보세요",
      },
      {
        kind: "paragraph",
        text: "무엇을 배웠니보다 무엇이 너를 붙잡았니를 먼저 물어보세요. 그 질문이 쌓일수록, 기술 교육보다 먼저 필요한 자기이해가 또렷해집니다.",
      },
      {
        kind: "link",
        text: "탐의 AI 시대 진로 준비 가이드 이어서 보기",
        url: absoluteUrl("/guide/ai-era-career"),
      },
    ],
  },
  {
    slug: "02-experience-over-test",
    title: "성격검사보다 정확한 것, 아이는 경험 속에서 드러납니다",
    tags: ["자기이해", "성격검사", "경험학습", "학부모가이드", "초등중등교육"],
    blocks: [
      {
        kind: "image",
        filePath: path.join(IMAGE_DIR, "post-02-experience-over-test.png"),
      },
      {
        kind: "paragraph",
        text: "검사 결과지가 나온 날, 부모는 잠깐 안심합니다. 우리 아이가 어떤 아이인지 드디어 설명이 되는 것 같기 때문입니다.",
      },
      {
        kind: "paragraph",
        text: "그런데 며칠 지나면 다시 막막해집니다. 결과는 알겠는데, 그래서 지금 이 아이를 어떻게 이해해야 하는지는 여전히 어렵기 때문입니다.",
      },
      {
        kind: "emphasis",
        text: "검사는 이름을 붙여주지만, 경험은 아이의 결을 보여줍니다.",
      },
      {
        kind: "divider",
      },
      {
        kind: "subtitle",
        text: "왜 결과지로는 부족할까",
      },
      {
        kind: "paragraph",
        text: "성격검사는 한 시점의 스냅샷에 가깝습니다. 그날 기분, 최근의 인간관계, 부모의 기대에도 답은 꽤 흔들립니다.",
      },
      {
        kind: "paragraph",
        text: "특히 초등 고학년과 중학생 시기의 아이는 자기 자신을 말로 완성하기보다, 여러 경험 속에서 반응하면서 자기를 알아가는 단계에 더 가깝습니다.",
      },
      {
        kind: "quote",
        text: "검사는 답을 주지만, 반복되는 선택의 패턴까지 대신 보여주지는 못합니다.",
      },
      {
        kind: "subtitle",
        text: "부모가 기록해볼 네 가지",
      },
      {
        kind: "paragraph",
        text: "첫째, 낯선 활동 앞에서의 첫 반응입니다. 질문을 던지는지, 규칙부터 찾는지, 일단 손부터 움직이는지 보세요.",
      },
      {
        kind: "paragraph",
        text: "둘째, 계획이 틀어졌을 때의 회복 방식입니다. 바로 포기하는지, 다른 길을 찾는지, 도움을 요청하는지에 따라 아이의 자기조절 방식이 보입니다.",
      },
      {
        kind: "paragraph",
        text: "셋째, 혼자 할 때와 함께할 때의 에너지 차이입니다. 사회적 자극이 필요한지, 혼자 몰입할 때 더 깊어지는지 이 차이가 큽니다.",
      },
      {
        kind: "paragraph",
        text: "넷째, 결과보다 무엇을 중요하게 설명하는지입니다. 재미, 공정함, 완성도, 속도 중 어떤 단어가 반복되는지 들어보세요.",
      },
      {
        kind: "subtitle",
        text: "해석보다 먼저 필요한 것",
      },
      {
        kind: "paragraph",
        text: "부모가 해야 할 일은 아이를 빨리 규정하는 것이 아니라, 패턴을 차분히 비춰주는 것입니다. 몇 주만 기록해도 결과지보다 훨씬 살아 있는 아이가 보이기 시작합니다.",
      },
      {
        kind: "link",
        text: "탐의 경험 기반 자기이해 글 이어서 보기",
        url: absoluteUrl("/blog/experience-based-self-discovery"),
      },
    ],
  },
  {
    slug: "03-credit-system-family-criteria",
    title: "고교학점제 시대, 과목표보다 먼저 봐야 할 아이의 기준",
    tags: ["고교학점제", "과목선택", "자기이해", "학부모가이드", "중학생부모"],
    blocks: [
      {
        kind: "image",
        filePath: path.join(IMAGE_DIR, "post-03-credit-system-criteria.png"),
      },
      {
        kind: "paragraph",
        text: "고교학점제 이야기가 나오면 집안 대화가 금세 정보전이 됩니다. 어떤 과목이 유리한지, 어떤 조합이 괜찮은지, 벌써부터 불안이 커집니다.",
      },
      {
        kind: "paragraph",
        text: "하지만 과목표를 오래 볼수록 더 흔들리는 집이 많습니다. 정보가 부족해서가 아니라, 선택 기준이 정리되지 않았기 때문입니다.",
      },
      {
        kind: "emphasis",
        text: "과목이 많아질수록 더 먼저 필요한 건 정보가 아니라, 아이의 선택 기준입니다.",
      },
      {
        kind: "divider",
      },
      {
        kind: "subtitle",
        text: "왜 과목표가 더 불안하게 만들까",
      },
      {
        kind: "paragraph",
        text: "고교학점제는 2025년부터 전면 시행됐고, 학생은 192학점 이상을 이수해야 졸업합니다. 제도 자체를 아는 건 필요합니다.",
      },
      {
        kind: "paragraph",
        text: "문제는 대부분의 갈등이 과목 정보가 아니라 기준 충돌에서 나온다는 점입니다. 아이는 재미를 말하고, 부모는 대입을 걱정하고, 학교는 운영 가능 과목을 이야기합니다.",
      },
      {
        kind: "quote",
        text: "과목표를 보기 전에 우리 아이가 어떤 방식의 배움에서 살아나는지 먼저 알아야, 정보도 비로소 정리됩니다.",
      },
      {
        kind: "subtitle",
        text: "가족이 먼저 합의할 세 가지",
      },
      {
        kind: "paragraph",
        text: "첫째, 어떤 수업에서 에너지가 생기는가입니다. 개념을 깊게 파고들 때 살아나는지, 직접 만들고 발표할 때 살아나는지부터 다릅니다.",
      },
      {
        kind: "paragraph",
        text: "둘째, 어떤 평가 방식에서 덜 무너지는가입니다. 시험형 과목에서 안정감을 느끼는지, 탐구형 과제에서 더 잘 움직이는지 살펴봐야 합니다.",
      },
      {
        kind: "paragraph",
        text: "셋째, 대입 유불리와 아이의 적합성이 충돌할 때 어디까지를 받아들일 것인가입니다. 이 질문이 없으면 마지막 순간마다 외부 정보가 가족의 기준을 대신하게 됩니다.",
      },
      {
        kind: "subtitle",
        text: "중학생 때 준비해야 할 것",
      },
      {
        kind: "paragraph",
        text: "지금 필요한 건 과목명 암기가 아닙니다. 어떤 주제에서 집중력이 오래 가는지, 어떤 협업 구조를 편해하는지, 실패했을 때 어떻게 회복하는지 기록하는 일이 더 중요합니다.",
      },
      {
        kind: "paragraph",
        text: "어느 과목이 유리할까보다 어떤 수업에서 네가 더 살아날 것 같니를 먼저 물어보세요. 그 대화가 쌓여야 과목 선택도 자기 것이 됩니다.",
      },
      {
        kind: "link",
        text: "탐의 고교학점제 가이드 이어서 보기",
        url: absoluteUrl("/guide/gogyohakjeomje"),
      },
    ],
  },
];

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const publishOffset = Number(process.env.PUBLISH_OFFSET || 0);
  const publishLimit = Number(process.env.PUBLISH_LIMIT || posts.length);
  const dryRun = process.env.DRY_RUN === "1";
  const selectedPosts = posts.slice(
    publishOffset,
    publishOffset + publishLimit,
  );

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    storageState: STATE_PATH,
  });

  const page = await context.newPage();
  const published: Array<{ title: string; url: string }> = [];

  for (const [localIndex, post] of selectedPosts.entries()) {
    const postIndex = publishOffset + localIndex + 1;
    const result = await publishPost(page, post, postIndex, dryRun);
    published.push({
      title: post.title,
      url: result,
    });
    if (dryRun) {
      break;
    }
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, dryRun ? "dry-run-posts.json" : "published-posts.json"),
    JSON.stringify(published, null, 2),
    "utf8",
  );

  await context.close();
  await browser.close();
}

async function publishPost(
  page: Page,
  post: PostDefinition,
  index: number,
  dryRun: boolean,
) {
  const postDir = path.join(OUTPUT_DIR, `${index}`.padStart(2, "0"));
  await fs.mkdir(postDir, { recursive: true });

  await page.goto(buildNaverBlogWriteUrl(BLOG_ID), {
    waitUntil: "domcontentloaded",
  });
  await waitForEditorReady(page);
  await fillTitle(page, post.title);

  for (const block of post.blocks) {
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
    path: path.join(postDir, dryRun ? "dry-run.png" : "before-publish.png"),
    fullPage: true,
  });
  await fs.writeFile(
    path.join(postDir, dryRun ? "dry-run-article.json" : "before-publish-article.json"),
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
  await applyTags(page, post.tags);

  await page.getByRole("button", { name: "발행", exact: true }).nth(1).click();
  await page.waitForURL(/PostView\.naver|m\.blog\.naver\.com/, {
    timeout: 30000,
  });
  await page.waitForTimeout(2500);
  await page.screenshot({
    path: path.join(postDir, "after-publish.png"),
    fullPage: true,
  });

  return page.url();
}

async function waitForEditorReady(page: Page) {
  const articleParagraphs = page.locator("article p");

  for (let attempt = 0; attempt < 20; attempt += 1) {
    await articleParagraphs.first().waitFor({ state: "visible", timeout: 10000 });

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
  const titleParagraph = page.locator("article p").first();
  await titleParagraph.click();
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
