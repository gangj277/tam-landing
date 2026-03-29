import { readFile } from "node:fs/promises";
import path from "node:path";

import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont } from "pdf-lib";

import type { ChildProfile, WeeklyReport } from "@/lib/server/types";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 48;
const TOP_MARGIN = 56;
const BOTTOM_MARGIN = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const BODY_FONT_SIZE = 11;
const BODY_LINE_HEIGHT = 18;
const SECTION_GAP = 14;
const HEADING_GAP = 24;

let cachedPretendardFontBytes: Uint8Array | null = null;

async function loadPretendardFontBytes() {
  if (!cachedPretendardFontBytes) {
    cachedPretendardFontBytes = await readFile(
      path.join(process.cwd(), "node_modules", "pretendard", "dist", "public", "variable", "PretendardVariable.ttf"),
    );
  }

  return cachedPretendardFontBytes;
}

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number) {
  const normalized = text.replace(/\r\n/g, "\n").split("\n");
  const lines: string[] = [];

  for (const block of normalized) {
    if (!block.trim()) {
      lines.push("");
      continue;
    }

    let current = "";
    for (const char of block) {
      const candidate = `${current}${char}`;
      if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth || current.length === 0) {
        current = candidate;
        continue;
      }

      lines.push(current);
      current = char;
    }

    if (current) {
      lines.push(current);
    }
  }

  return lines;
}

function createPagedWriter(pdfDoc: PDFDocument, font: PDFFont) {
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let cursorY = PAGE_HEIGHT - TOP_MARGIN;

  const ensureRoom = (lineHeight: number) => {
    if (cursorY - lineHeight < BOTTOM_MARGIN) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      cursorY = PAGE_HEIGHT - TOP_MARGIN;
    }
  };

  const drawLines = (lines: string[], options?: { size?: number; color?: ReturnType<typeof rgb> }) => {
    const size = options?.size ?? BODY_FONT_SIZE;
    const color = options?.color ?? rgb(0.12, 0.13, 0.2);
    const lineHeight = size >= 16 ? size + 8 : BODY_LINE_HEIGHT;

    for (const line of lines) {
      ensureRoom(lineHeight);
      page.drawText(line || " ", {
        x: MARGIN_X,
        y: cursorY,
        size,
        font,
        color,
      });
      cursorY -= lineHeight;
    }
  };

  return {
    heading(text: string) {
      if (cursorY < PAGE_HEIGHT - TOP_MARGIN) {
        cursorY -= 8;
      }
      drawLines([text], { size: 18, color: rgb(0.1, 0.12, 0.24) });
      cursorY -= 6;
    },
    paragraph(text: string) {
      drawLines(wrapText(text, font, BODY_FONT_SIZE, CONTENT_WIDTH));
      cursorY -= SECTION_GAP;
    },
    lines(items: string[]) {
      for (const item of items) {
        drawLines(wrapText(item, font, BODY_FONT_SIZE, CONTENT_WIDTH));
      }
      cursorY -= SECTION_GAP;
    },
    divider() {
      ensureRoom(20);
      page.drawLine({
        start: { x: MARGIN_X, y: cursorY },
        end: { x: PAGE_WIDTH - MARGIN_X, y: cursorY },
        thickness: 1,
        color: rgb(0.86, 0.88, 0.93),
      });
      cursorY -= HEADING_GAP;
    },
  };
}

export async function buildWeeklyReportPdf(report: WeeklyReport, child: ChildProfile) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const pretendardFont = await pdfDoc.embedFont(await loadPretendardFontBytes(), {
    subset: true,
  });

  const writer = createPagedWriter(pdfDoc, pretendardFont);

  writer.heading(`탐 주간 리포트 · ${child.name}`);
  writer.paragraph(
    `주차: ${report.weekStart} ~ ${report.weekEnd} · 생성일: ${new Date(report.generatedAt).toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
    })}`,
  );
  writer.divider();

  writer.heading("이번 주 요약");
  writer.lines([
    `• 완료한 미션: ${report.summary.missionsCompleted}개`,
    `• 누적 시간: ${report.summary.totalMinutes}분`,
    `• 현재 스트릭: ${report.summary.streak}일`,
    `• 탐험한 세계: ${report.summary.worldsExplored.join(", ") || "아직 없음"}`,
  ]);

  writer.heading("발견된 패턴");
  writer.lines(
    report.patterns.flatMap((pattern) => [
      `• ${pattern.title}`,
      `  ${pattern.detail}${pattern.stat ? ` (${pattern.stat})` : ""}`,
    ]),
  );

  writer.heading("관심 영역 변화");
  writer.lines(
    report.interestChanges.map(
      (change) =>
        `• ${change.category}: ${change.currentScore}점 (전주 ${change.previousScore}점, ${change.delta >= 0 ? "+" : ""}${change.delta}, ${change.trend})`,
    ),
  );

  writer.heading("가이드 코멘트");
  writer.paragraph(report.guideComment);

  return await pdfDoc.save();
}
