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
  "../output/playwright/naver-blog/editorial-relaunch",
);
const IMAGE_DIR = path.resolve(
  process.cwd(),
  "../output/imagegen/tam-naver-blog-v2",
);

const posts: PostDefinition[] = [
  {
    slug: "01-ai-era-judgment",
    title: "AI 시대 자녀교육, 코딩보다 먼저 물어야 할 단 하나의 질문",
    tags: ["AI교육", "자녀교육", "자기이해", "미래역량", "학부모가이드"],
    blocks: [
      {
        kind: "image",
        filePath: path.join(IMAGE_DIR, "post-01-ai-judgment.png"),
      },
      {
        kind: "paragraph",
        text: "요즘 부모들이 가장 자주 묻는 질문은 거의 비슷합니다. 코딩을 시작해야 하나요, AI 툴을 빨리 익혀야 하나요, 아니면 영어를 더 밀어야 하나요. 불안한 마음으로 교육 정보를 좇다 보면 늘 기술 목록부터 펼치게 됩니다.",
      },
      {
        kind: "paragraph",
        text: "그런데 식탁에서 아이와 마주 앉아 보면 정작 더 중요한 질문은 따로 있습니다. 이 아이는 어떤 문제를 만났을 때 눈빛이 바뀌는가, 무엇을 빨리 해내는 순간보다 어떤 장면에서 오래 붙들고 싶어 하는가, 바로 그 질문입니다.",
      },
      {
        kind: "emphasis",
        text: "AI 시대에 먼저 키워야 할 것은 기술이 아니라, 아이가 자기 기준으로 선택하는 힘입니다.",
      },
      {
        kind: "subtitle",
        text: "부모가 조급할수록 기술부터 붙잡게 됩니다",
      },
      {
        kind: "paragraph",
        text: "그 마음은 너무 자연스럽습니다. 숙제 요약도, 영어 번역도, 보고서 초안도 AI가 해내는 장면을 매일 보니까요. 어른인 우리도 뒤처질까 불안한데, 아이를 키우는 부모가 먼저 조급해지는 건 당연합니다.",
      },
      {
        kind: "paragraph",
        text: "하지만 바로 그 조급함 때문에 교육이 기술 습득 중심으로만 흐르기 쉽습니다. 아이가 무엇에 끌리는지 보기도 전에 코딩, 프롬프트, 자동화 툴을 먼저 붙이면, 아이는 도구를 배우는 데는 익숙해져도 자기 판단을 세우는 연습은 놓치게 됩니다.",
      },
      {
        kind: "paragraph",
        text: "실제로 WEF Future of Jobs Report 2025가 상위 미래 역량으로 함께 짚은 것은 분석적 사고, 창의적 사고뿐 아니라 동기부여와 자기인식입니다. 기술이 세상을 바꿀수록, 결국 더 중요해지는 건 내가 무엇을 원하는지 알고 결정하는 능력이라는 뜻입니다.",
      },
      {
        kind: "subtitle",
        text: "AI는 답을 주지만 방향은 주지 못합니다",
      },
      {
        kind: "paragraph",
        text: "예를 들어 아이가 독후감을 쓰는 상황을 떠올려 보세요. AI는 훨씬 매끄러운 문장을 만들어 줄 수 있습니다. 하지만 어떤 문장을 남기고 어떤 문장을 지울지, 이 책에서 정말 마음에 남은 장면이 무엇인지, 그 질문에는 결국 아이 자신의 기준이 필요합니다.",
      },
      {
        kind: "paragraph",
        text: "코드를 짜는 상황도 마찬가지입니다. AI는 빠르게 결과물을 만들지만, 무엇을 만들고 싶은지 모르는 아이에게 AI는 그저 더 화려한 정답기계가 됩니다. 반대로 자기 기준이 있는 아이는 AI가 준 결과를 고치고, 버리고, 다시 묻습니다. 그 차이가 결국 공부의 깊이와 진로의 방향을 갈라놓습니다.",
      },
      {
        kind: "divider",
      },
      {
        kind: "subtitle",
        text: "집에서 먼저 확인할 세 가지 장면",
      },
      {
        kind: "paragraph",
        text: "첫째, 아이가 시간을 잊고 붙드는 주제를 보세요. 잘하는 것보다 오래 붙드는 것이 더 중요합니다. 오래 붙드는 주제는 대체로 아이의 내적 동기와 연결되어 있습니다.",
      },
      {
        kind: "paragraph",
        text: "둘째, AI가 제시한 답을 그대로 쓰는지, 자기 식으로 바꾸는지 보세요. 수정하는 아이는 이미 자기 기준이 움직이고 있는 겁니다. 그 작은 수정이 AI 리터러시의 시작입니다.",
      },
      {
        kind: "paragraph",
        text: "셋째, 아이가 선택의 이유를 설명할 때 무엇을 말하는지 들어보세요. 재미, 공정함, 완성도, 독창성, 안정감 중 어떤 단어가 자주 나오는지 기록하면 아이의 가치 기준이 보이기 시작합니다.",
      },
      {
        kind: "paragraph",
        text: "부모가 지금 해야 할 일은 도구를 더 빨리 가르치는 것이 아니라, 아이의 기준이 드러나는 장면을 놓치지 않는 것입니다. 기술은 늘 바뀌지만, 자기 기준을 세우는 능력은 오래 남습니다.",
      },
      {
        kind: "link",
        text: "탐의 AI 시대 진로 준비 가이드 읽기",
        url: absoluteUrl("/guide/ai-era-career"),
      },
      {
        kind: "paragraph",
        text: "아이를 더 잘 이해하고 싶은 부모라면, 오늘 저녁부터 질문을 하나만 바꿔보셔도 좋겠습니다. 무엇을 배웠니 대신 무엇이 너를 붙잡았니를 묻는 순간, 기술 교육보다 더 중요한 출발이 시작됩니다.",
      },
    ],
  },
  {
    slug: "02-experience-over-test",
    title: "아이 MBTI보다 중요한 것, 진짜 자기이해는 경험 속에서 보입니다",
    tags: ["자기이해", "성격검사", "경험학습", "학부모가이드", "초등중등교육"],
    blocks: [
      {
        kind: "image",
        filePath: path.join(IMAGE_DIR, "post-02-experience-over-test.png"),
      },
      {
        kind: "paragraph",
        text: "집에서 한 번쯤은 이런 장면이 있었을 겁니다. 성향 검사 결과지를 받아 들고 우리 아이가 원래 이런 성격이었구나 싶어 안도하는 순간 말입니다. 그때는 뭔가 중요한 단서를 찾은 것 같지만, 며칠만 지나면 결과지가 실제 양육 장면을 얼마나 바꿨는지 선명하지 않을 때가 많습니다.",
      },
      {
        kind: "paragraph",
        text: "이유는 간단합니다. 검사는 아이에게 대답을 받지만, 자기이해는 대답보다 반응의 반복에서 생기기 때문입니다. 부모가 정말 봐야 하는 건 검사 결과 한 줄보다, 아이가 낯선 상황에서 무엇을 먼저 선택하는지입니다.",
      },
      {
        kind: "emphasis",
        text: "아이를 이해하는 가장 좋은 방법은 더 많이 묻는 것이 아니라, 더 잘 관찰하는 것입니다.",
      },
      {
        kind: "subtitle",
        text: "결과지는 안도감을 주지만 방향은 주지 못합니다",
      },
      {
        kind: "paragraph",
        text: "성격검사는 한 시점의 스냅샷에 가깝습니다. 그날 기분, 최근의 인간관계, 부모가 옆에 있는지 여부 같은 조건에도 답이 쉽게 흔들립니다. 특히 초등 고학년에서 중학생 시기의 아이들은 자기 자신을 언어로 안정적으로 설명하기보다, 경험 속에서 반응하며 자기를 배워가는 단계에 더 가깝습니다.",
      },
      {
        kind: "paragraph",
        text: "그래서 검사 결과가 틀렸다기보다, 그 결과를 자기이해의 최종본처럼 다루는 순간 문제가 시작됩니다. 부모도 아이도 네 글자 안으로 들어가 버리기 쉽고, 살아 있는 변화의 장면을 놓치게 됩니다.",
      },
      {
        kind: "subtitle",
        text: "경험은 아이의 대답이 아니라 패턴을 드러냅니다",
      },
      {
        kind: "paragraph",
        text: "예를 들어 낯선 활동을 시작할 때 아이가 먼저 규칙을 찾는지, 일단 손부터 움직이는지 보세요. 팀 활동에서 중심에 서는 역할에 끌리는지, 조용히 완성도를 높이는 역할에 안심하는지 보세요. 작은 선택이지만 반복되면 꽤 분명한 결이 드러납니다.",
      },
      {
        kind: "paragraph",
        text: "어떤 아이는 늘 공정함을 먼저 챙깁니다. 어떤 아이는 효율이 깨져도 독창성을 포기하지 않습니다. 또 어떤 아이는 혼자 깊게 파고들 때 가장 안정적입니다. 이런 것은 설문지보다 경험 속에서 더 정확하게 보입니다.",
      },
      {
        kind: "paragraph",
        text: "중요한 건 단 한 번의 반응이 아니라 반복되는 패턴입니다. 아이는 생각해서 자기 자신을 알기보다, 여러 장면 속에서 비슷한 선택을 하며 자기 기준을 조금씩 발견합니다.",
      },
      {
        kind: "divider",
      },
      {
        kind: "subtitle",
        text: "부모가 주말마다 봐야 할 네 가지 장면",
      },
      {
        kind: "paragraph",
        text: "첫째, 낯선 활동 앞에서 아이가 먼저 하는 행동입니다. 질문을 던지는지, 규칙을 확인하는지, 일단 손을 대보는지 보면 사고 방식의 출발점을 읽을 수 있습니다.",
      },
      {
        kind: "paragraph",
        text: "둘째, 계획이 어긋났을 때의 반응입니다. 바로 포기하는지, 다른 길을 찾는지, 도움을 요청하는지에 따라 아이의 회복 방식과 자기조절 방식이 보입니다.",
      },
      {
        kind: "paragraph",
        text: "셋째, 함께하는 과제와 혼자 하는 과제 중 어디에서 에너지가 살아나는지입니다. 사회적 자극이 필요한 아이인지, 혼자 몰입할 때 더 깊어지는 아이인지 이 차이가 꽤 큽니다.",
      },
      {
        kind: "paragraph",
        text: "넷째, 결과보다 무엇을 중요하게 설명하는지입니다. 재미있었어, 예뻤어, 공평했어, 빨랐어 같은 단어가 반복되면 아이가 세계를 해석하는 기준이 드러납니다.",
      },
      {
        kind: "paragraph",
        text: "이 네 가지를 몇 주만 기록해도 부모는 아이를 훨씬 덜 추상적으로 이해하게 됩니다. 그때부터는 검사 결과를 붙들기보다, 실제로 살아 있는 아이를 보게 됩니다.",
      },
      {
        kind: "link",
        text: "탐의 경험 기반 자기이해 글 읽기",
        url: absoluteUrl("/blog/experience-based-self-discovery"),
      },
      {
        kind: "paragraph",
        text: "진짜 자기이해는 딱 맞는 라벨을 빨리 찾는 데서 오지 않습니다. 다양한 장면 속에서 아이가 반복적으로 무엇을 택하는지 차분히 읽어주는 데서 시작됩니다. 부모가 그 패턴을 비춰주는 거울이 되어주면, 아이는 훨씬 자연스럽게 자기 자신을 알아가기 시작합니다.",
      },
    ],
  },
  {
    slug: "03-credit-system-family-questions",
    title: "고교학점제 준비, 과목표보다 먼저 가족이 합의해야 할 3가지 질문",
    tags: ["고교학점제", "과목선택", "자기이해", "학부모가이드", "중학생부모"],
    blocks: [
      {
        kind: "image",
        filePath: path.join(IMAGE_DIR, "post-03-credit-system-criteria.png"),
      },
      {
        kind: "paragraph",
        text: "중학생 자녀를 둔 집에서는 어느 순간 이런 대화가 시작됩니다. 이 과목이 입시에 유리하대, 그 학교는 선택과목 조합을 이렇게 가져간대, 지금부터 뭘 준비해야 하니. 고교학점제가 본격화되면서 부모의 대화도 훨씬 빨리 입시 정보 쪽으로 기울고 있습니다.",
      },
      {
        kind: "paragraph",
        text: "정보를 모으는 건 필요합니다. 다만 순서가 바뀌면 오히려 더 흔들립니다. 과목표를 보기 전에 먼저 필요한 건, 가족이 어떤 기준으로 선택을 할 것인지 합의하는 일입니다.",
      },
      {
        kind: "emphasis",
        text: "고교학점제에서 아이를 덜 흔들리게 만드는 것은 정보의 양이 아니라 선택 기준의 선명함입니다.",
      },
      {
        kind: "subtitle",
        text: "과목 선택이 어려운 건 정보가 부족해서가 아닙니다",
      },
      {
        kind: "paragraph",
        text: "교육부 가이드만 봐도 고교학점제는 2025년부터 전면 시행되고, 학생은 192학점 이상을 이수해야 졸업합니다. 선택과목 구조도 훨씬 넓어졌습니다. 겉보기에는 선택지가 많아져서 좋아 보이지만, 실제 가정에서는 무엇을 기준으로 고를지 더 어려워졌다는 말이 먼저 나옵니다.",
      },
      {
        kind: "paragraph",
        text: "그 이유는 대부분의 갈등이 과목 정보가 아니라 기준 충돌에서 나오기 때문입니다. 아이는 재미를 말하고, 부모는 대입을 걱정하고, 학교는 운영 가능 과목을 이야기합니다. 서로 틀린 말은 아닌데 기준이 다르니, 과목표를 볼수록 오히려 불안이 커집니다.",
      },
      {
        kind: "paragraph",
        text: "그래서 먼저 해야 할 일은 어떤 과목이 유리한지 찾는 것이 아니라, 우리 아이가 어떤 방식의 배움에서 오래 버티고 에너지가 살아나는지 파악하는 것입니다. 그 기준이 있어야 정보가 정리가 됩니다.",
      },
      {
        kind: "subtitle",
        text: "가족이 먼저 합의해야 할 세 가지 질문",
      },
      {
        kind: "paragraph",
        text: "첫째, 이 아이는 무엇을 배울 때 에너지가 생기는가입니다. 개념을 깊게 파고들 때 살아나는지, 직접 만들고 발표할 때 살아나는지부터 다릅니다. 이 차이는 과목 만족도에 큰 영향을 줍니다.",
      },
      {
        kind: "paragraph",
        text: "둘째, 이 아이는 어떤 평가 방식에서 덜 무너지는가입니다. 구조가 분명한 시험형 과목에서 안정감을 느끼는지, 프로젝트와 탐구형 과제에서 더 잘 움직이는지 살펴봐야 합니다. 점수만이 아니라 학습 방식의 적합성을 보는 질문입니다.",
      },
      {
        kind: "paragraph",
        text: "셋째, 대입 유불리와 아이의 적합성이 충돌할 때 우리 가족은 어디까지를 받아들일 것인가입니다. 이 질문이 없으면 마지막 순간마다 외부 정보가 가족의 기준을 대신하게 됩니다. 최소한 한두 과목만큼은 아이가 자기 이유를 설명할 수 있는 선택이어야 합니다.",
      },
      {
        kind: "divider",
      },
      {
        kind: "subtitle",
        text: "중학생 때 해야 할 준비는 과목 공부가 아닙니다",
      },
      {
        kind: "paragraph",
        text: "중학생이 지금부터 해야 할 준비는 과목명 암기가 아닙니다. 오히려 다양한 상황 속에서 무엇을 반복적으로 고르는지 근거를 쌓는 일에 가깝습니다. 어떤 주제에서 집중력이 오래 가는지, 어떤 협업 구조를 편해하는지, 실패했을 때 어떤 방식으로 회복하는지 이런 기록이 나중의 선택 기준이 됩니다.",
      },
      {
        kind: "paragraph",
        text: "그러니 지금의 대화도 달라져야 합니다. 어느 과목이 유리할까보다 어떤 수업에서 네가 더 살아날 것 같니를 먼저 물어보세요. 정보는 나중에도 모을 수 있지만, 아이의 반응 패턴은 일상 속에서만 제대로 읽을 수 있습니다.",
      },
      {
        kind: "link",
        text: "탐의 고교학점제 가이드 읽기",
        url: absoluteUrl("/guide/gogyohakjeomje"),
      },
      {
        kind: "paragraph",
        text: "고교학점제는 결국 아이가 처음으로 자기 설계의 무게를 조금 더 진하게 느끼는 제도입니다. 그래서 과목표보다 먼저 필요한 건, 우리 아이가 어떤 사람인지 가족이 함께 알아가는 시간입니다. 그 시간이 있어야 선택이 덜 흔들리고, 결과도 자기 것이 됩니다.",
      },
    ],
  },
];

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const publishOffset = Number(process.env.PUBLISH_OFFSET || 0);
  const publishLimit = Number(process.env.PUBLISH_LIMIT || posts.length);

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
  const selectedPosts = posts.slice(
    publishOffset,
    publishOffset + publishLimit,
  );

  for (const [localIndex, post] of selectedPosts.entries()) {
    const postIndex = publishOffset + localIndex + 1;
    await publishPost(page, post, postIndex);
    published.push({
      title: post.title,
      url: page.url(),
    });
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, "published-posts.json"),
    JSON.stringify(published, null, 2),
    "utf8",
  );

  await context.close();
  await browser.close();
}

async function publishPost(page: Page, post: PostDefinition, index: number) {
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
    path: path.join(postDir, "before-publish.png"),
    fullPage: true,
  });

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
  await page.waitForTimeout(180);
}

async function typeSubtitle(page: Page, text: string) {
  await focusLastParagraph(page);
  await page.keyboard.type(text);
  await selectTypedText(page, text);
  await page.locator("button.se-bold-toolbar-button").last().click();
  await page.waitForTimeout(150);
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(220);
}

async function typeEmphasisLine(page: Page, text: string) {
  await focusLastParagraph(page);
  await page.keyboard.type(text);
  await selectTypedText(page, text);
  await page.locator("button.se-bold-toolbar-button").last().click();
  await page.waitForTimeout(150);
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(220);
}

async function insertDivider(page: Page) {
  await focusLastParagraph(page);
  await page.locator("button.se-insert-horizontal-line-default-toolbar-button").click();
  await page.waitForTimeout(300);
}

async function insertImage(page: Page, filePath: string) {
  await focusLastParagraph(page);
  const [chooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.locator("button.se-image-toolbar-button").click(),
  ]);
  await chooser.setFiles(filePath);
  await page.waitForTimeout(2800);
}

async function insertLinkedLine(page: Page, text: string, url: string) {
  await focusLastParagraph(page);
  await page.keyboard.type(`${text} ${url}`);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(220);
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
