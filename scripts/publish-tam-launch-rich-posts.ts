import fs from "fs/promises";
import path from "path";

import { chromium, type Locator, type Page } from "playwright-core";

import { buildNaverBlogWriteUrl } from "../lib/naver-blog-automation";
import { absoluteUrl } from "../lib/site";

type Block =
  | { kind: "image"; filePath: string }
  | { kind: "paragraph"; text: string }
  | { kind: "subtitle"; text: string }
  | { kind: "emphasis"; text: string; fontSize: "24" | "28" }
  | { kind: "divider" }
  | { kind: "quote"; text: string }
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
  "../output/playwright/naver-blog/launch-posts",
);
const IMAGE_DIR = path.resolve(
  process.cwd(),
  "../output/imagegen/tam-naver-blog",
);

const posts: PostDefinition[] = [
  {
    slug: "01-ai-era-self-understanding",
    title: "AI 시대 자녀교육, 코딩보다 먼저 필요한 것은 자기이해입니다",
    tags: ["AI교육", "자녀교육", "자기이해", "미래역량", "학부모가이드"],
    blocks: [
      {
        kind: "image",
        filePath: path.join(IMAGE_DIR, "post-01-ai-era.png"),
      },
      {
        kind: "paragraph",
        text: "요즘 부모들은 늘 비슷한 질문 앞에 멈춥니다. AI가 숙제도 돕고, 코딩도 대신하고, 글도 정리해 주는 시대라면 우리 아이는 대체 무엇을 먼저 준비해야 할까요.",
      },
      {
        kind: "paragraph",
        text: "많은 집이 코딩, 영어, 디지털 툴 활용으로 곧바로 달려가지만, 탐이 앱과 가이드에서 계속 강조하는 핵심은 조금 다릅니다. 기술보다 먼저 필요한 것은 아이가 자기 기준을 갖는 힘, 다시 말해 자기이해입니다.",
      },
      {
        kind: "emphasis",
        text: "AI가 대신할 수 없는 것은, 아이가 스스로 방향을 정하는 힘입니다.",
        fontSize: "24",
      },
      {
        kind: "subtitle",
        text: "부모가 더 조급해진 이유",
      },
      {
        kind: "paragraph",
        text: "예전에는 지식을 많이 아는 아이가 앞서간다고 느꼈습니다. 지금은 검색도 요약도 생성도 너무 빨라서, 부모 입장에서는 무엇을 붙잡아야 할지 오히려 더 불안해집니다. 그래서 당장 보이는 기술을 더 빨리 익혀야 한다는 압박이 커집니다.",
      },
      {
        kind: "paragraph",
        text: "그런데 아이가 기술을 익히는 속도와 별개로, 스스로 무엇에 끌리고 무엇을 중요하게 여기는지 모른다면 AI는 도움이 아니라 소음이 되기도 합니다. 추천받은 대로 따라가기 쉽고, 결과를 평가할 기준도 흔들리기 때문입니다.",
      },
      {
        kind: "subtitle",
        text: "AI가 대신하는 것과 남는 것",
      },
      {
        kind: "paragraph",
        text: "AI는 검색, 번역, 초안 작성, 코드 생성처럼 반복 가능하고 구조화된 일을 빠르게 처리합니다. 하지만 무엇을 질문할지, 어떤 결과가 나에게 맞는지, 어디에서 멈추고 다시 고쳐야 하는지는 여전히 사람이 결정해야 합니다.",
      },
      {
        kind: "paragraph",
        text: "결국 앞으로 더 중요한 아이는 시킨 일을 빠르게 끝내는 아이가 아니라, 도구를 앞에 두고도 자기 판단을 잃지 않는 아이입니다. AI를 능숙하게 다루는 것보다 먼저, 자기 기준으로 선택하고 수정하는 감각이 필요합니다.",
      },
      {
        kind: "divider",
      },
      {
        kind: "subtitle",
        text: "WEF가 보여준 신호",
      },
      {
        kind: "paragraph",
        text: "탐의 AI 시대 가이드는 세계경제포럼의 Future of Jobs 2025가 강조한 역량을 함께 봅니다. 분석적 사고와 창의적 사고뿐 아니라, 동기부여와 자기인식이 미래 핵심 역량 상위권에 포함된다는 점이 특히 중요합니다.",
      },
      {
        kind: "paragraph",
        text: "이건 단순히 감성 교육을 하자는 이야기가 아닙니다. AI가 강해질수록, 아이가 어떤 문제를 붙잡고 어떤 방식으로 판단하는지 아는 능력이 더 큰 경쟁력이 된다는 뜻입니다.",
      },
      {
        kind: "paragraph",
        text: "AI를 잘 쓰는 아이보다, AI 앞에서 자기 기준을 잃지 않는 아이가 더 멀리 갑니다.",
      },
      {
        kind: "subtitle",
        text: "집에서 먼저 만들어야 할 기준",
      },
      {
        kind: "paragraph",
        text: "첫째, 정답을 묻기보다 반응을 묻는 질문을 늘려보세요. 오늘 무엇을 배웠는지보다 오늘 어떤 순간이 가장 흥미로웠는지 묻는 질문이 자기이해를 더 빨리 만듭니다.",
      },
      {
        kind: "paragraph",
        text: "둘째, 효율적인 선택만 칭찬하지 말고 아이가 왜 그 선택을 했는지 함께 관찰해 주세요. 독특함을 택했는지, 공정함을 택했는지, 안전함을 택했는지 쌓이다 보면 아이 안의 기준이 보이기 시작합니다.",
      },
      {
        kind: "paragraph",
        text: "셋째, 기술 교육을 자기탐색과 분리하지 마세요. AI를 써보더라도 결과물을 그대로 넘기지 말고, 너라면 무엇을 바꾸고 싶은지 묻는 순간부터 진짜 AI 리터러시가 시작됩니다.",
      },
      {
        kind: "link",
        text: "탐의 AI 시대 진로 준비 가이드 먼저 보기",
        url: absoluteUrl("/guide/ai-era-career"),
      },
      {
        kind: "paragraph",
        text: "탐은 아이가 매일 10분씩 다양한 세계를 만나고, 그 안에서 자기 반응의 패턴을 발견하도록 설계된 경험 기반 플랫폼입니다. 기술을 따라가는 아이보다, 스스로 방향을 정하는 아이를 키우고 싶다면 그 출발점은 자기이해입니다.",
      },
    ],
  },
  {
    slug: "02-elementary-exploration",
    title: "초등 고학년 진로탐색, 꿈을 정하기보다 먼저 넓혀야 하는 이유",
    tags: ["초등진로", "진로탐색", "자기이해", "학부모가이드", "경험학습"],
    blocks: [
      {
        kind: "image",
        filePath: path.join(IMAGE_DIR, "post-02-exploration.png"),
      },
      {
        kind: "paragraph",
        text: "초등 5학년이나 6학년이 되면 부모 마음은 급해집니다. 주변에서는 진로검사도 시키고, 특목고나 영재원 이야기까지 오갑니다. 그래서 우리 아이도 빨리 방향을 정해야 하나 싶어집니다.",
      },
      {
        kind: "paragraph",
        text: "하지만 탐의 초등 고학년 가이드와 블로그가 반복해서 말하는 핵심은 분명합니다. 이 시기는 결정을 밀어붙일 때가 아니라, 아이가 자신을 알아갈 재료를 넓게 쌓아야 할 때입니다.",
      },
      {
        kind: "emphasis",
        text: "초등 고학년에게 필요한 것은 빠른 결정이 아니라, 넓은 탐색과 반복 관찰입니다.",
        fontSize: "24",
      },
      {
        kind: "subtitle",
        text: "왜 꿈이 자주 바뀌는 것이 정상일까요",
      },
      {
        kind: "paragraph",
        text: "이 시기의 아이는 흥미와 자기개념이 빠르게 움직입니다. 오늘은 과학자가 좋고 다음 달에는 디자이너가 좋아질 수 있습니다. 부모가 보기엔 일관성이 없어 보여도, 아이 안에서는 자기 반응을 탐색하는 중요한 과정이 진행되고 있습니다.",
      },
      {
        kind: "paragraph",
        text: "문제는 이 변화를 불안으로 읽어버리는 순간입니다. 꿈이 자주 바뀐다는 이유로 결정을 서두르면, 아이는 자신의 반응을 탐색하기보다 어른이 만족할 만한 답을 찾는 데 익숙해집니다.",
      },
      {
        kind: "subtitle",
        text: "성격검사보다 경험이 더 강한 이유",
      },
      {
        kind: "paragraph",
        text: "탐의 기존 블로그 글에서도 다뤘듯, 설문형 성격검사는 한 시점의 스냅샷을 줄 뿐입니다. 특히 10세에서 14세 사이는 아직 자기 자신을 안정적으로 설명하기 어려워서, 검사 결과보다 최근 기분이나 사회적으로 바람직한 답이 더 크게 반영되기 쉽습니다.",
      },
      {
        kind: "paragraph",
        text: "반대로 경험 기반 탐색은 다릅니다. 아이가 여러 세계와 역할을 만나고 그 안에서 직접 선택할 때, 말로 설명하지 못하던 가치관과 선호가 행동으로 드러납니다. 공정함을 택하는지, 완성도보다 독창성을 택하는지, 혼자 깊게 파는 것을 좋아하는지가 경험 속에서 보이기 시작합니다.",
      },
      {
        kind: "divider",
      },
      {
        kind: "subtitle",
        text: "부모가 해야 할 일은 정답 제시가 아니라 관찰입니다",
      },
      {
        kind: "paragraph",
        text: "아이의 선택을 바로 해석해 주기보다, 반복되는 패턴을 비춰주는 것이 더 중요합니다. 요즘 이런 역할에 자주 끌리더라, 이번에도 비슷한 분위기를 골랐더라, 이런 식의 관찰 언어가 아이의 자기이해를 키웁니다.",
      },
      {
        kind: "paragraph",
        text: "아이는 질문에 답하면서 자기를 알기보다, 여러 경험 속에서 반응한 흔적을 통해 자기를 알아갑니다.",
      },
      {
        kind: "subtitle",
        text: "집에서 바로 해볼 수 있는 탐색 구조",
      },
      {
        kind: "paragraph",
        text: "첫째, 익숙한 활동만 반복하지 말고 낯선 세계를 작은 단위로라도 자주 보여주세요. 역할놀이, 전시, 프로젝트, 짧은 시뮬레이션처럼 부담이 적은 경험도 충분히 의미가 있습니다.",
      },
      {
        kind: "paragraph",
        text: "둘째, 무엇을 잘했는지보다 무엇에서 에너지가 올라갔는지 보세요. 시간 가는 줄 몰랐던 순간, 스스로 더 해보고 싶어 한 장면을 기록하는 편이 훨씬 정확한 단서가 됩니다.",
      },
      {
        kind: "paragraph",
        text: "셋째, 진로를 하나로 압축하려 하지 말고 탐색의 폭을 유지하세요. 넓게 만나고, 반복 패턴을 읽고, 그다음에야 선택이 조금씩 선명해집니다.",
      },
      {
        kind: "link",
        text: "탐의 초등 고학년 진로탐색 가이드 보기",
        url: absoluteUrl("/guide/elementary-career-exploration"),
      },
      {
        kind: "paragraph",
        text: "탐은 아이가 매일 새로운 세계에서 짧고 밀도 있게 반응하며 자기 패턴을 발견하도록 돕습니다. 초등 고학년의 진로탐색은 꿈을 확정하는 프로젝트가 아니라, 가능성을 넓히는 과정이어야 합니다.",
      },
    ],
  },
  {
    slug: "03-credit-system-choice-criteria",
    title: "고교학점제 준비, 과목 정보보다 먼저 필요한 건 선택 기준입니다",
    tags: ["고교학점제", "과목선택", "자기이해", "중학생부모", "학부모가이드"],
    blocks: [
      {
        kind: "image",
        filePath: path.join(IMAGE_DIR, "post-03-credit-system.png"),
      },
      {
        kind: "paragraph",
        text: "고교학점제 이야기가 본격화되면서 많은 부모가 과목 목록부터 확인합니다. 어떤 과목이 대입에 유리한지, 무엇을 선택해야 후회가 적은지 정보를 모으기 시작합니다.",
      },
      {
        kind: "paragraph",
        text: "물론 제도를 아는 것은 필요합니다. 하지만 탐의 고교학점제 가이드와 블로그가 계속 강조하는 건, 과목 정보보다 먼저 선택의 기준이 필요하다는 점입니다. 기준이 없으면 정보가 많을수록 더 흔들리기 쉽습니다.",
      },
      {
        kind: "emphasis",
        text: "고교학점제의 핵심은 과목을 많이 아는 것이 아니라, 자기 기준으로 고를 수 있는 상태를 만드는 것입니다.",
        fontSize: "24",
      },
      {
        kind: "subtitle",
        text: "왜 과목 선택이 더 어려워졌을까요",
      },
      {
        kind: "paragraph",
        text: "2025년 전면 시행된 고교학점제에서는 학생이 192학점을 채우기 위해 다양한 선택과목을 직접 설계해야 합니다. 공통과목만 따라가는 구조가 아니라, 진로와 적성에 맞는 조합을 스스로 구성해야 하는 구조가 된 것입니다.",
      },
      {
        kind: "paragraph",
        text: "문제는 대부분의 아이가 아직 자기 기준을 충분히 갖지 못한 채 이 선택 앞에 선다는 점입니다. 실제로 많은 학생이 진로와 적성보다 대입 유불리 같은 외부 신호에 더 크게 흔들립니다. 선택의 자유가 늘었지만 선택의 기준은 충분히 길러지지 않은 셈입니다.",
      },
      {
        kind: "subtitle",
        text: "자유학기제 축소가 남긴 빈칸",
      },
      {
        kind: "paragraph",
        text: "중학교 자유학기제는 원래 진로탐색의 기회를 넓히는 장치였습니다. 그런데 최근에는 자유학년제가 사라지고 운영 시간이 축소되면서, 아이가 넓게 경험하고 자기 반응을 해석할 시간도 함께 줄어들었습니다.",
      },
      {
        kind: "paragraph",
        text: "즉 고등학교에서는 더 많은 선택을 요구받는데, 그 선택을 준비하는 탐색 시간은 오히려 줄어든 모순이 생겼습니다. 그래서 더더욱 가정 안에서 아이의 자기이해를 보완해 주는 구조가 필요합니다.",
      },
      {
        kind: "divider",
      },
      {
        kind: "subtitle",
        text: "부모가 먼저 봐야 할 세 가지 기준",
      },
      {
        kind: "paragraph",
        text: "첫째, 아이가 어떤 주제에서 에너지가 올라가는지 보세요. 성적보다 먼저 봐야 할 것은 깊게 파고들고 싶어 하는 주제의 결입니다. 관심이 없는 과목은 좋은 정보가 있어도 오래 버티기 어렵습니다.",
      },
      {
        kind: "paragraph",
        text: "둘째, 아이의 결정 방식이 어떤지 살펴보세요. 구조가 분명한 과목에서 안정감을 느끼는지, 프로젝트형 과목에서 더 살아나는지에 따라 선택의 만족도가 크게 달라집니다.",
      },
      {
        kind: "paragraph",
        text: "셋째, 외부 기준과 내부 기준을 분리해 주세요. 대입 전략은 필요하지만, 그것만으로 과목을 고르면 아이는 선택을 자기 것으로 느끼지 못합니다. 최소한 하나 이상의 선택은 아이 스스로 납득할 수 있는 이유 위에 올라가야 합니다.",
      },
      {
        kind: "paragraph",
        text: "과목 선택은 정보 게임이 아니라 자기이해를 기반으로 한 설계 게임에 가깝습니다.",
      },
      {
        kind: "subtitle",
        text: "지금부터 준비할 수 있는 현실적인 방법",
      },
      {
        kind: "paragraph",
        text: "중학생 때부터 과목표를 외울 필요는 없습니다. 대신 아이가 다양한 상황에서 어떤 선택을 하고 어떤 역할에서 힘이 나는지 차근히 기록해 두세요. 고1 말의 과목 선택은 결국 그동안 쌓인 자기이해의 총합에서 나옵니다.",
      },
      {
        kind: "paragraph",
        text: "아이와 대화할 때도 무엇이 유리한지부터 묻기보다, 어떤 수업이 재미있을 것 같은지, 어떤 방식으로 배우는 게 편한지부터 물어보는 편이 좋습니다. 그 답이 쌓여야 나중에 제도 정보도 제대로 소화됩니다.",
      },
      {
        kind: "link",
        text: "탐의 고교학점제 가이드 먼저 읽기",
        url: absoluteUrl("/guide/gogyohakjeomje"),
      },
      {
        kind: "paragraph",
        text: "탐은 아이가 여러 세계 안에서 반복적으로 선택하고, 그 패턴을 부모와 함께 읽어낼 수 있도록 돕습니다. 고교학점제 준비의 본질도 결국 같습니다. 과목 정보보다 먼저, 아이가 자기 기준을 만들 수 있는 시간을 확보하는 것부터 시작해야 합니다.",
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

async function publishPost(
  page: Page,
  post: PostDefinition,
  index: number,
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
        await typeEmphasisLine(page, block.text, block.fontSize);
        break;
      case "divider":
        await insertDivider(page);
        break;
      case "quote":
        await insertQuote(page, block.text);
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

async function typeEmphasisLine(page: Page, text: string, fontSize: "24" | "28") {
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

async function insertQuote(page: Page, text: string) {
  await focusLastParagraph(page);
  await page.locator("button.se-insert-quotation-default-toolbar-button").click();
  await page.waitForTimeout(250);
  await focusLastParagraph(page);
  await page.keyboard.type(text);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(220);
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
