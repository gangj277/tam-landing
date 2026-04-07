/**
 * TAM (탐) AI Prompt Builders
 *
 * 5 prompt builders for the interactive scenario pipeline.
 * All functions are pure — no DB access, no side effects.
 * Each returns { systemPrompt, userPrompt } for callOpenRouter.
 */

import type {
  Mission,
  MissionSession,
  GeneratedScenarioRound,
  SessionReaction,
  ExpansionToolType,
  DifficultyType,
} from "../../types";

// ═══════════════════════════════════════
// SHARED HELPERS
// ═══════════════════════════════════════

export const DIFFICULTY_GUIDANCE: Record<DifficultyType, string> = {
  "value-conflict":
    "두 선택 모두 진심으로 좋은 이유가 있어야 해. 어느 쪽도 명백히 옳지 않아. 선택할수록 반대편 가치의 무게가 느껴져야 해.",
  dilemma:
    "어떤 선택을 해도 무언가를 잃어. 완벽한 답은 없어. 그 '잃는 것'의 무게를 구체적으로 보여줘.",
  "creative-judgment":
    "정답이 없는 창작 판단이야. 어떤 방향이든 '왜 이게 좋은지' 스스로 발견하게 해.",
  "perspective-shift":
    "같은 사건이 다른 사람에게는 완전히 다르게 느껴진다는 걸 보여줘. 새 시점이 열릴 때마다 이전 판단이 흔들려야 해.",
  "emotional-immersion":
    "머리보다 가슴으로 먼저 느끼게 해. 표정, 목소리, 침묵 같은 감각적 디테일을 넣어.",
  observation:
    "자세히 볼수록 보이는 것이 있어. 당연한 것을 낯설게 바라보는 시선을 유도해.",
  "problem-discovery":
    "문제를 푸는 것보다 '진짜 문제가 뭔지' 발견하는 과정이야. 표면 아래 숨은 원인을 향해 파고들어.",
  expression:
    "느낌을 말이나 형태로 바꾸는 도전이야. '왜 이렇게 표현했는지'를 스스로 발견하게 해.",
  comprehensive:
    "여러 관점, 여러 가치, 여러 방법을 동시에 고려해야 해. 단순한 답이 아니라 복합적인 판단을 이끌어.",
};

export function getEscalationGuidance(roundIndex: number, followUpAngles: string[]): string {
  const angle = (i: number) => followUpAngles[i] ?? followUpAngles[followUpAngles.length - 1] ?? "";
  if (roundIndex === 0) {
    return `[1턴: 진입 — 기(起)]\n아이의 선택이 가장 가까운 사람·상황에 즉각 영향을 준다. 눈앞에 보이는 변화를 감각적으로 보여줘.\n서사 방향 힌트: ${angle(0)}`;
  }
  if (roundIndex === 1) {
    return `[2턴: 심화 — 승(承)]\n1턴 선택의 여파가 예상 못한 곳에 번진다. 새로운 이해관계자가 등장하거나 숨어있던 문제가 드러나.\n서사 방향 힌트: ${angle(1)}`;
  }
  if (roundIndex === 2) {
    return `[3턴: 전환점 — 전(轉)]\n가치가 정면 충돌하는 순간. 이전 선택들이 만든 긴장이 최고조에 달해. 가장 어려운 딜레마를 던져.\n서사 방향 힌트: ${angle(2)}`;
  }
  if (roundIndex === 3) {
    return `[4턴: 행동 — 전→결]\n아이의 결정에 세계가 반응한다. 예상 못한 반발이나 부작용이 드러나고, 아이가 직접 수습하거나 새로운 방법을 찾아야 해.\n서사 방향 힌트: ${angle(3)}`;
  }
  return `[5턴: 마무리 — 결(結)]\n개인의 선택을 넘어 '이런 상황이 왜 생기는지' 시스템적 질문으로 확대해. 아이가 '나 하나의 결정'이 아니라 '이 세계의 구조'를 보게 해. 여운이 남는 마무리.\n서사 방향 힌트: ${angle(4)}`;
}

export const TOOL_TYPE_GUIDANCE: Record<ExpansionToolType, string> = {
  broaden:
    "아이가 고르지 않은 길의 가능성을 힌트로 2줄 제시하되, 결론은 남겨둬. 장면을 구체적으로 그리되 마지막은 아이에게 열린 질문으로. 예: '→ 너라면 이 상황에서 어떻게 했을 것 같아?' AI가 답을 주는 게 아니라, 아이가 상상하게 만드는 것이 목적.",
  reframe:
    "다른 인물의 이름을 부르고, 그 사람의 상황과 감정을 2줄로 생생하게 설정해. 그리고 '이 사람이 너의 선택을 보면 뭐라고 할까?'로 마무리. 아이가 직접 타인의 관점을 구성하게 해. 속마음을 AI가 다 써주지 말고, 아이가 추측하게 남겨둬.",
  subvert:
    "가정 하나를 뒤집어 놓아('만약 ~가 사실이 아니라면?'). 뒤집힌 세계를 2줄로 그리고, '그러면 네 선택은 어떻게 달라질까?'로 마무리. 아이가 직접 결론을 내리게 남겨둬. 놀라움은 주되, 답은 주지 마.",
};

export const TOOL_LABELS: Record<ExpansionToolType, string> = {
  broaden: "만약에...",
  reframe: "그 사람은...",
  subvert: "전혀 다르게",
};

export const TOOL_EMOJIS: Record<ExpansionToolType, string> = {
  broaden: "🔭",
  reframe: "🔄",
  subvert: "🌀",
};

/**
 * Builds the "story so far" recap block shared across prompts.
 * Provides full narrative continuity so the AI can reference specific past events.
 */
export function buildStoryRecap(
  mission: Mission,
  session: MissionSession,
  rounds: GeneratedScenarioRound[],
  reactions: SessionReaction[],
): string {
  const lines: string[] = [];

  // Initial choice
  const initialChoice = mission.choices.find((c) => c.id === session.initialChoiceId);
  lines.push(`초기 선택: "${session.initialChoiceLabel ?? "선택함"}"`);
  if (initialChoice?.reasoning) {
    lines.push(`  이유: ${initialChoice.reasoning}`);
  }

  // Each completed round
  for (const round of rounds) {
    const reaction = reactions.find((r) => r.roundIndex === round.roundIndex);
    lines.push("");
    lines.push(`--- ${round.roundIndex + 1}라운드 ---`);
    lines.push(`상황: ${round.consequence.narrative}`);
    if (round.consequence.newDilemma) {
      lines.push(`딜레마: ${round.consequence.newDilemma}`);
    }
    if (reaction) {
      lines.push(`아이의 반응: 태도 "${reaction.emotionLabel}" + 방법 "${reaction.methodLabel}"`);
      lines.push(`가치 태그: ${reaction.valueTags.join(", ")}`);
    }
  }

  return lines.join("\n");
}
