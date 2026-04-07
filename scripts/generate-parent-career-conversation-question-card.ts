import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { chromium } from "playwright-core";

const OUTPUT_DIR = path.resolve(process.cwd(), "../output/pdf/naver-blog");
const OUTPUT_PDF = path.join(OUTPUT_DIR, "parent-career-conversation-question-card.pdf");
const OUTPUT_HTML = path.join(OUTPUT_DIR, "parent-career-conversation-question-card.html");

const html = String.raw`<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>부모를 위한 10분 진로 대화 질문 카드</title>
    <style>
      @page {
        size: A4;
        margin: 0;
      }

      :root {
        --navy: #17203d;
        --coral: #e8614d;
        --cream: #f8f3ea;
        --paper: #fcfbf8;
        --text: #1f2432;
        --muted: #677085;
        --border: #dfe3eb;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family:
          "Apple SD Gothic Neo",
          "Pretendard",
          "Noto Sans KR",
          "Malgun Gothic",
          sans-serif;
        background: var(--paper);
        color: var(--text);
      }

      .page {
        width: 210mm;
        min-height: 297mm;
        padding: 18mm 16mm;
        background: var(--paper);
        position: relative;
        overflow: hidden;
        page-break-after: always;
      }

      .page:last-child {
        page-break-after: auto;
      }

      .rule {
        width: 100%;
        height: 5px;
        background: var(--coral);
        margin: 0 0 18px;
      }

      .eyebrow {
        color: var(--coral);
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.02em;
        margin-bottom: 10px;
      }

      h1, h2, h3, p {
        margin: 0;
      }

      h1 {
        color: var(--navy);
        font-size: 34px;
        line-height: 1.22;
        letter-spacing: -0.04em;
        margin-bottom: 14px;
      }

      .subhead {
        color: var(--text);
        font-size: 15px;
        line-height: 1.7;
        max-width: 150mm;
      }

      .intro-card {
        margin-top: 24px;
        border: 1px solid var(--border);
        background: white;
        padding: 18px 18px 16px;
      }

      .intro-card h2,
      .section-title {
        color: var(--navy);
        font-size: 22px;
        line-height: 1.3;
        letter-spacing: -0.03em;
        margin-bottom: 12px;
      }

      .steps {
        display: grid;
        gap: 10px;
      }

      .step {
        display: grid;
        grid-template-columns: 24px 1fr;
        gap: 10px;
        align-items: start;
        font-size: 14px;
        line-height: 1.65;
      }

      .step-num {
        color: var(--coral);
        font-weight: 800;
      }

      .highlight {
        margin-top: 28px;
        background: var(--cream);
        padding: 16px 18px;
        color: var(--navy);
        font-size: 18px;
        line-height: 1.5;
        font-weight: 700;
      }

      .section-lead {
        color: var(--muted);
        font-size: 13px;
        line-height: 1.65;
        margin-bottom: 18px;
      }

      .question-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .question-card {
        border: 1px solid var(--border);
        background: white;
        min-height: 118px;
        padding: 14px 14px 12px;
      }

      .question-label {
        color: var(--coral);
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.04em;
        margin-bottom: 8px;
      }

      .question-title {
        color: var(--navy);
        font-size: 16px;
        line-height: 1.42;
        font-weight: 800;
        letter-spacing: -0.03em;
        margin-bottom: 8px;
      }

      .question-guide {
        color: var(--text);
        font-size: 12.5px;
        line-height: 1.6;
      }

      .tip-list {
        display: grid;
        gap: 10px;
        margin-top: 16px;
      }

      .tip {
        background: white;
        border: 1px solid var(--border);
        padding: 14px 16px;
        font-size: 13px;
        line-height: 1.65;
      }

      .tip strong {
        color: var(--navy);
      }

      .footer-panel {
        margin-top: 24px;
        background: var(--navy);
        color: white;
        padding: 18px;
      }

      .footer-panel h3 {
        font-size: 20px;
        line-height: 1.35;
        letter-spacing: -0.03em;
        margin-bottom: 10px;
      }

      .footer-panel p {
        font-size: 13px;
        line-height: 1.7;
        color: rgba(255, 255, 255, 0.92);
      }

      .brand {
        margin-top: 8px;
        color: #ffd7cf;
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    <section class="page">
      <div class="eyebrow">부모를 위한</div>
      <h1>10분 진로 대화 질문 카드</h1>
      <div class="rule"></div>
      <p class="subhead">
        성적 얘기에서 멈추지 않고, 아이가 스스로를 말해볼 수 있게 돕는
        다섯 가지 질문입니다.
      </p>

      <div class="intro-card">
        <h2>이렇게 써보세요</h2>
        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <div>하루 10분만 잡으세요. 길게 하려 하면 금방 대화가 무거워집니다.</div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div>답을 고쳐주지 말고, 이유를 한 번만 더 물어보세요.</div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div>“잘했어?”보다 “어땠어?”를 먼저 물어보세요.</div>
          </div>
          <div class="step">
            <div class="step-num">4</div>
            <div>바로 조언하지 말고, 반복되는 반응을 기록해보세요.</div>
          </div>
        </div>
      </div>

      <div class="highlight">
        핵심은 정답을 찾는 대화가 아니라, 아이의 반응을 읽는 대화입니다.
      </div>
    </section>

    <section class="page">
      <h2 class="section-title">오늘 바로 써볼 5가지 질문</h2>
      <p class="section-lead">
        아이를 분석하지 말고, 오늘의 반응을 같이 들여다보는 데 집중해보세요.
      </p>

      <div class="question-grid">
        <div class="question-card">
          <div class="question-label">Q1</div>
          <div class="question-title">오늘 시간 가는 줄 몰랐던 순간이 있었어?</div>
          <div class="question-guide">
            잘한 일을 묻기보다, 몰입한 순간을 먼저 물어보세요. 진로 단서는
            성취보다 몰입에서 자주 드러납니다.
          </div>
        </div>

        <div class="question-card">
          <div class="question-label">Q2</div>
          <div class="question-title">오늘 한 것 중 다시 해보고 싶은 건 뭐야?</div>
          <div class="question-guide">
            반복하고 싶은 경험은 아이가 스스로 끌리는 영역을 보여줍니다.
            이유를 한 번 더 물어보는 것이 포인트입니다.
          </div>
        </div>

        <div class="question-card">
          <div class="question-label">Q3</div>
          <div class="question-title">오늘 제일 싫었던 건 뭐였어? 왜 그랬어?</div>
          <div class="question-guide">
            싫어하는 이유를 알면, 아이가 예민하게 반응하는 환경과 조건을 볼 수
            있습니다. 불편도 중요한 데이터입니다.
          </div>
        </div>

        <div class="question-card">
          <div class="question-label">Q4</div>
          <div class="question-title">오늘 너답다고 느껴진 순간이 있었어?</div>
          <div class="question-guide">
            아이 스스로 자기답다고 느끼는 순간은 자기이해의 실마리입니다. 거창한
            장면이 아니어도 괜찮습니다.
          </div>
        </div>

        <div class="question-card" style="grid-column: 1 / -1;">
          <div class="question-label">Q5</div>
          <div class="question-title">다음에 비슷한 일이 오면 어떻게 해보고 싶어?</div>
          <div class="question-guide">
            미래를 향한 작은 수정 질문은 선택 기준을 만듭니다. 조언보다 아이의
            다음 선택 상상을 먼저 들어보세요.
          </div>
        </div>
      </div>
    </section>

    <section class="page">
      <h2 class="section-title">대화할 때 이것만은 기억하세요</h2>
      <div class="tip-list">
        <div class="tip"><strong>답을 바로 평가하지 마세요.</strong> 아이는 순식간에 ‘정답 찾기 모드’로 들어갑니다.</div>
        <div class="tip"><strong>한 번에 오래 하려 하지 마세요.</strong> 10분이면 충분합니다.</div>
        <div class="tip"><strong>성적표 앞에서도 이 질문을 쓸 수 있습니다.</strong> 결과보다 반응을 먼저 물어보면 대화 결이 바뀝니다.</div>
        <div class="tip"><strong>아이가 짧게 답하면 해석하지 마세요.</strong> “그건 왜 그랬어?”를 한 번만 더 물어보는 게 좋습니다.</div>
      </div>

      <div class="footer-panel">
        <h3>진로 대화는 한 번의 정답으로 끝나지 않습니다.</h3>
        <p>
          탐(TAM)은 아이가 매일 10분, 새로운 세계 속에서 선택하고 반응하며
          자기이해의 패턴을 쌓도록 돕습니다. 이 질문 카드는 그 패턴을 집에서
          읽어내기 위한 시작점입니다.
        </p>
        <p class="brand">www.tam-n.com</p>
      </div>
    </section>
  </body>
</html>`;

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(OUTPUT_HTML, html, "utf8");

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "load" });
  await page.pdf({
    path: OUTPUT_PDF,
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  await browser.close();

  console.log(`Wrote ${OUTPUT_HTML}`);
  console.log(`Wrote ${OUTPUT_PDF}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
