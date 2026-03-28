"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getMissionById, getScenarioChain } from "@/lib/dummy-data";
import { CATEGORY_META } from "@/lib/types";
import type { EmotionCard, MethodCard, ScenarioRound, ThinkingToolCard, EpilogueScene } from "@/lib/types";

// ─── Decorative SVGs ───

function StoryDivider({ color }: { color: string }) {
  return (
    <svg width="120" height="16" viewBox="0 0 120 16" fill="none" className="mx-auto my-4">
      <path d="M0 8h50" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="60" cy="8" r="3" fill={color} fillOpacity="0.2" />
      <path d="M70 8h50" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
    </svg>
  );
}

function ChapterDots({
  total,
  current,
  color,
}: {
  total: number;
  current: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="transition-all duration-500 rounded-full"
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            backgroundColor: i <= current ? color : "#E8E6E1",
            opacity: i <= current ? 1 : 0.5,
          }}
        />
      ))}
    </div>
  );
}

function CheckSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="#4A5FC1" />
      <path d="M5.5 9.5L7.5 11.5L12.5 6.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PenSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M11.5 2.5l2 2L5 13H3v-2l8.5-8.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Scenario Narrative Card ───

function NarrativeCard({
  narrative,
  newDilemma,
  color,
  visible,
}: {
  narrative: string;
  newDilemma?: string;
  color: string;
  visible: boolean;
}) {
  const paragraphs = narrative.split("\n\n");

  return (
    <div
      className={`relative rounded-2xl bg-white border border-border-light overflow-hidden transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)" }}
    >
      {/* Colored accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ backgroundColor: color }} />

      <div className="pl-5 pr-5 py-5">
        {/* Status update label */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full animate-breathe" style={{ backgroundColor: color }} />
          <span className="text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color }}>
            상황 업데이트
          </span>
        </div>

        {/* Narrative paragraphs */}
        <div className="space-y-3">
          {paragraphs.map((p, i) => {
            const isQuote = p.startsWith('"') || p.startsWith('"') || p.startsWith('\"');
            return (
              <p
                key={i}
                className={`text-[15px] leading-[1.75] tracking-[-0.01em] ${
                  isQuote
                    ? "text-navy font-semibold pl-3 border-l-2"
                    : "text-text-secondary"
                }`}
                style={isQuote ? { borderColor: color } : undefined}
              >
                {p}
              </p>
            );
          })}
        </div>

        {/* New dilemma */}
        {newDilemma && (
          <div className="mt-5 pt-4 border-t border-border-light">
            <p className="text-[17px] font-bold text-navy tracking-[-0.02em] leading-[1.5]">
              {newDilemma}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Thinking Tool Overlay ───

function ThinkingToolOverlay({
  tool,
  color,
  onClose,
}: {
  tool: ThinkingToolCard;
  color: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-navy/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-10 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{tool.emoji}</span>
            <span className="text-[13px] font-bold tracking-[-0.01em]" style={{ color }}>
              {tool.label}
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-bg-warm flex items-center justify-center tap-highlight">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 8M11 3l-8 8" stroke="#8A8A9A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Tool card narrative */}
        <div className="rounded-xl p-4" style={{ backgroundColor: `${color}08`, border: `1px solid ${color}20` }}>
          {tool.card.narrative.split("\n").map((line, i) => (
            <p
              key={i}
              className={`text-[14px] leading-[1.7] ${
                line.startsWith("→") || line.startsWith("→")
                  ? "font-semibold text-navy mt-2"
                  : "text-text-secondary"
              }`}
            >
              {line}
            </p>
          ))}
        </div>

        <p className="text-[12px] text-text-muted text-center mt-4">
          이건 참고용이야. 네 선택에는 영향 없어.
        </p>
      </div>
    </div>
  );
}

// ─── Reaction Selector ───

function ReactionSelector({
  emotionOptions,
  methodOptions,
  selectedEmotion,
  selectedMethod,
  onSelectEmotion,
  onSelectMethod,
  color,
  visible,
}: {
  emotionOptions: EmotionCard[];
  methodOptions: MethodCard[];
  selectedEmotion: string | null;
  selectedMethod: string | null;
  onSelectEmotion: (id: string) => void;
  onSelectMethod: (id: string) => void;
  color: string;
  visible: boolean;
}) {
  return (
    <div
      className={`space-y-5 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: "200ms" }}
    >
      {/* Emotion row */}
      <div>
        <p className="text-[12px] font-semibold text-text-muted tracking-[0.04em] mb-2.5 uppercase">
          어떤 태도로
        </p>
        <div className="flex gap-2.5">
          {emotionOptions.map((em) => {
            const isSelected = selectedEmotion === em.id;
            return (
              <button
                key={em.id}
                onClick={() => onSelectEmotion(em.id)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-2xl border-2 transition-all duration-300 tap-highlight ${
                  isSelected
                    ? "scale-[1.03] shadow-lg"
                    : "hover:scale-[1.01] bg-white"
                }`}
                style={{
                  borderColor: isSelected ? color : "#E8E6E1",
                  backgroundColor: isSelected ? `${color}10` : "white",
                  boxShadow: isSelected ? `0 4px 20px ${color}20` : undefined,
                }}
              >
                <span className={`text-2xl transition-transform duration-300 ${isSelected ? "scale-110" : ""}`}>
                  {em.emoji}
                </span>
                <span
                  className={`text-[13px] font-semibold tracking-[-0.01em] transition-colors duration-300 ${
                    isSelected ? "" : "text-navy"
                  }`}
                  style={isSelected ? { color } : undefined}
                >
                  {em.label}
                </span>
                {isSelected && (
                  <div className="absolute -top-1 -right-1">
                    <CheckSvg />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Method row */}
      <div>
        <p className="text-[12px] font-semibold text-text-muted tracking-[0.04em] mb-2.5 uppercase">
          어떤 방법으로
        </p>
        <div className="flex gap-2.5">
          {methodOptions.map((mt) => {
            const isSelected = selectedMethod === mt.id;
            return (
              <button
                key={mt.id}
                onClick={() => onSelectMethod(mt.id)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-2xl border-2 transition-all duration-300 tap-highlight ${
                  isSelected
                    ? "scale-[1.03] shadow-lg"
                    : "hover:scale-[1.01] bg-white"
                }`}
                style={{
                  borderColor: isSelected ? color : "#E8E6E1",
                  backgroundColor: isSelected ? `${color}10` : "white",
                  boxShadow: isSelected ? `0 4px 20px ${color}20` : undefined,
                }}
              >
                <span className={`text-2xl transition-transform duration-300 ${isSelected ? "scale-110" : ""}`}>
                  {mt.emoji}
                </span>
                <span
                  className={`text-[13px] font-semibold tracking-[-0.01em] transition-colors duration-300 ${
                    isSelected ? "" : "text-navy"
                  }`}
                  style={isSelected ? { color } : undefined}
                >
                  {mt.label}
                </span>
                {isSelected && (
                  <div className="absolute -top-1 -right-1">
                    <CheckSvg />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Choice Summary Chip ───

function ChoiceSummary({
  emoji,
  emotionLabel,
  methodEmoji,
  methodLabel,
  color,
}: {
  emoji: string;
  emotionLabel: string;
  methodEmoji: string;
  methodLabel: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 py-3 animate-scale-in">
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold"
        style={{ backgroundColor: `${color}12`, color }}
      >
        <span>{emoji}</span>
        {emotionLabel}
      </div>
      <span className="text-text-muted text-[10px]">+</span>
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold"
        style={{ backgroundColor: `${color}12`, color }}
      >
        <span>{methodEmoji}</span>
        {methodLabel}
      </div>
    </div>
  );
}

// ─── Closing Prompt ───

function ClosingPrompt({
  prompt,
  color,
  visible,
  onSubmit,
  onSkip,
}: {
  prompt: string;
  color: string;
  visible: boolean;
  onSubmit: (text: string) => void;
  onSkip: () => void;
}) {
  const [text, setText] = useState("");

  if (!visible) return null;

  return (
    <div className="animate-fade-in-up space-y-3">
      <div className="rounded-2xl p-5 bg-white border border-border-light" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.03)" }}>
        <p className="text-[16px] font-bold text-navy tracking-[-0.02em] mb-4 leading-[1.5]">
          {prompt}
        </p>
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="자유롭게 적어봐..."
            className="w-full h-20 px-4 py-3 rounded-xl bg-bg-warm border border-border-light text-[14px] text-navy placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 transition-shadow"
            style={{ focusRingColor: color } as React.CSSProperties}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1 text-text-muted">
            <PenSvg />
          </div>
        </div>
      </div>
      <div className="flex gap-2.5">
        <button
          onClick={() => onSubmit(text)}
          className="flex-1 py-3.5 rounded-xl text-white font-semibold text-[15px] transition-transform tap-highlight active:scale-[0.97]"
          style={{ backgroundColor: color }}
        >
          다음으로
        </button>
        <button
          onClick={onSkip}
          className="px-5 py-3.5 rounded-xl border border-border-light text-text-muted font-medium text-[14px] transition-colors tap-highlight hover:bg-bg-warm"
        >
          건너뛰기
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════

// ─── Epilogue Scene ───

const MOOD_COLORS: Record<string, { bg: string; border: string; icon: string }> = {
  positive: { bg: "#F0FAF0", border: "#86CEAC", icon: "💚" },
  bittersweet: { bg: "#FFF8F0", border: "#E0C097", icon: "🧡" },
  hopeful: { bg: "#F0F4FF", border: "#94AADC", icon: "💙" },
  tense: { bg: "#FFF5F5", border: "#E09494", icon: "❤️‍🩹" },
};

function EpilogueView({
  epilogue,
  color,
  onComplete,
}: {
  epilogue: EpilogueScene;
  color: string;
  onComplete: () => void;
}) {
  const [revealedScenes, setRevealedScenes] = useState(0);
  const [showClosing, setShowClosing] = useState(false);
  const totalScenes = epilogue.scenes.length;

  useEffect(() => {
    // Reveal scenes one by one
    const timers: ReturnType<typeof setTimeout>[] = [];
    epilogue.scenes.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealedScenes(i + 1), 800 + i * 1800));
    });
    // Show closing line after all scenes
    timers.push(setTimeout(() => setShowClosing(true), 800 + totalScenes * 1800 + 600));
    return () => timers.forEach(clearTimeout);
  }, [epilogue.scenes, totalScenes]);

  return (
    <div className="py-6 space-y-0">
      {/* Title */}
      <div className="text-center mb-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4" style={{ backgroundColor: `${color}10` }}>
          <span className="text-sm">📖</span>
          <span className="text-[11px] font-bold tracking-[0.06em] uppercase" style={{ color }}>
            경험의 결과
          </span>
        </div>
        <h2 className="text-[22px] font-bold text-navy tracking-[-0.03em] leading-[1.3]">
          {epilogue.title}
        </h2>
      </div>

      {/* Timeline scenes */}
      <div className="relative pl-8">
        {/* Timeline line */}
        <div
          className="absolute left-[11px] top-2 bottom-2 w-[2px] rounded-full transition-all duration-1000"
          style={{
            background: `linear-gradient(to bottom, ${color}, ${color}40)`,
            height: revealedScenes > 0 ? `${(revealedScenes / totalScenes) * 100}%` : "0%",
          }}
        />

        <div className="space-y-6">
          {epilogue.scenes.map((scene, i) => {
            const isRevealed = i < revealedScenes;
            const moodStyle = MOOD_COLORS[scene.mood] || MOOD_COLORS.hopeful;

            return (
              <div
                key={i}
                className={`relative transition-all duration-700 ${
                  isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute -left-8 top-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isRevealed ? "scale-100" : "scale-0"
                  }`}
                  style={{ backgroundColor: moodStyle.border }}
                >
                  <span className="text-[10px]">{moodStyle.icon}</span>
                </div>

                {/* Scene card */}
                <div
                  className="rounded-2xl p-5 border transition-all duration-500"
                  style={{
                    backgroundColor: moodStyle.bg,
                    borderColor: `${moodStyle.border}40`,
                    boxShadow: isRevealed ? `0 2px 12px ${moodStyle.border}15` : "none",
                  }}
                >
                  <p className="text-[15px] text-navy leading-[1.8] tracking-[-0.01em]">
                    {scene.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Closing line */}
      <div
        className={`mt-10 text-center transition-all duration-700 ${
          showClosing ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Decorative divider */}
        <svg width="160" height="20" viewBox="0 0 160 20" fill="none" className="mx-auto mb-5">
          <path d="M0 10h65" stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />
          <circle cx="75" cy="10" r="2" fill={color} fillOpacity="0.2" />
          <circle cx="80" cy="10" r="1.5" fill={color} fillOpacity="0.3" />
          <circle cx="85" cy="10" r="2" fill={color} fillOpacity="0.2" />
          <path d="M95 10h65" stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />
        </svg>

        <p className="text-[14px] text-text-secondary leading-[1.7] italic max-w-[300px] mx-auto">
          {epilogue.closingLine}
        </p>

        <button
          onClick={onComplete}
          className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-[15px] transition-all tap-highlight active:scale-[0.97]"
          style={{
            backgroundColor: color,
            boxShadow: `0 6px 24px ${color}30`,
          }}
        >
          다음으로
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

type Phase =
  | { type: "initial-choice" }
  | { type: "scenario"; roundIndex: number; subPhase: "narrative" | "reaction" | "confirmed" }
  | { type: "epilogue" }
  | { type: "epilogue-closing" }
  | { type: "final" }
  | { type: "complete" };

export default function MissionPlayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const mission = getMissionById(id);
  const chain = getScenarioChain(id);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>({ type: "initial-choice" });
  const [selectedInitial, setSelectedInitial] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showNarrative, setShowNarrative] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const [activeTool, setActiveTool] = useState<ThinkingToolCard | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // Choices history for summary chips
  const [choiceHistory, setChoiceHistory] = useState<
    { emotionEmoji: string; emotionLabel: string; methodEmoji: string; methodLabel: string }[]
  >([]);

  const categoryColor = mission ? CATEGORY_META[mission.category].color : "#4A5FC1";
  const totalSteps = chain ? chain.rounds.length + 3 : 5; // initial + rounds + epilogue + final

  const currentStep =
    phase.type === "initial-choice"
      ? 0
      : phase.type === "scenario"
        ? phase.roundIndex + 1
        : phase.type === "epilogue" || phase.type === "epilogue-closing"
          ? totalSteps - 2
          : phase.type === "final"
            ? totalSteps - 1
            : totalSteps;

  // Scroll to bottom on phase changes
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      }, 100);
    }
  }, [phase, showNarrative, showReaction, confirmVisible]);

  if (!mission || !chain) {
    return (
      <div className="flex items-center justify-center min-h-dvh px-6">
        <p className="text-text-muted text-center">미션을 찾을 수 없어요</p>
      </div>
    );
  }

  // ─── Handlers ───

  function handleInitialChoice(choiceId: string) {
    setSelectedInitial(choiceId);
    setTimeout(() => {
      setPhase({ type: "scenario", roundIndex: 0, subPhase: "narrative" });
      setShowNarrative(false);
      setShowReaction(false);
      setSelectedEmotion(null);
      setSelectedMethod(null);
      setTimeout(() => setShowNarrative(true), 400);
      setTimeout(() => setShowReaction(true), 1200);
    }, 600);
  }

  function handleConfirmReaction() {
    if (!chain) return;
    const round = chain.rounds[phase.type === "scenario" ? phase.roundIndex : 0];
    const em = round.emotionOptions.find((e) => e.id === selectedEmotion);
    const mt = round.methodOptions.find((m) => m.id === selectedMethod);

    if (em && mt) {
      setChoiceHistory((prev) => [
        ...prev,
        { emotionEmoji: em.emoji, emotionLabel: em.label, methodEmoji: mt.emoji, methodLabel: mt.label },
      ]);
    }

    if (phase.type !== "scenario" || !chain) return;

    advanceToNextRound(phase.roundIndex);
  }

  function advanceToNextRound(currentRoundIndex: number) {
    if (!chain) return;
    const nextRound = currentRoundIndex + 1;

    if (nextRound < chain.rounds.length) {
      setPhase({ type: "scenario", roundIndex: nextRound, subPhase: "narrative" });
      setShowNarrative(false);
      setShowReaction(false);
      setSelectedEmotion(null);
      setSelectedMethod(null);
      setTimeout(() => setShowNarrative(true), 400);
      setTimeout(() => setShowReaction(true), 1200);
    } else {
      setPhase({ type: "epilogue" });
    }
  }

  // ─── Render ───

  const currentRound: ScenarioRound | null =
    phase.type === "scenario" && chain ? chain.rounds[phase.roundIndex] : null;

  const bothSelected = selectedEmotion !== null && selectedMethod !== null;

  return (
    <div className="min-h-dvh flex flex-col bg-bg-cream">
      {/* ─── Sticky Header ─── */}
      <header
        className="sticky top-0 z-40 px-5 pt-4 pb-3 bg-bg-cream/95 backdrop-blur-md"
        style={{ borderBottom: "1px solid rgba(232,230,225,0.6)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.04em] mb-0.5" style={{ color: categoryColor }}>
              {CATEGORY_META[mission.category].icon} {CATEGORY_META[mission.category].label}
            </p>
            <h1 className="text-[16px] font-bold text-navy tracking-[-0.02em] truncate">
              {mission.title}
            </h1>
          </div>
          <div className="flex-shrink-0 ml-3">
            <ChapterDots total={totalSteps} current={currentStep} color={categoryColor} />
          </div>
        </div>
      </header>

      {/* ─── Scrollable Content ─── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-6 hide-scrollbar">

        {/* ═══ Phase: Initial Choice ═══ */}
        {phase.type === "initial-choice" && (
          <div className="py-6 page-enter">
            {/* Context */}
            <div className="rounded-xl px-4 py-3 mb-5" style={{ backgroundColor: `${categoryColor}08` }}>
              <p className="text-[12px] font-semibold mb-1" style={{ color: categoryColor }}>
                {mission.worldSetting.location} · {mission.worldSetting.era}
              </p>
              <p className="text-[14px] text-text-secondary leading-[1.7]">{mission.situation}</p>
            </div>

            {/* Core question */}
            <h2 className="text-[20px] font-bold text-navy tracking-[-0.02em] leading-[1.45] mb-6">
              {mission.coreQuestion}
            </h2>

            {/* Choice cards */}
            <div className="space-y-3">
              {mission.choices.map((choice, i) => {
                const isSelected = selectedInitial === choice.id;
                const isDisabled = selectedInitial !== null && !isSelected;
                return (
                  <button
                    key={choice.id}
                    onClick={() => !selectedInitial && handleInitialChoice(choice.id)}
                    disabled={!!selectedInitial}
                    className={`relative w-full text-left rounded-2xl border-2 p-4 transition-all duration-500 tap-highlight ${
                      isSelected
                        ? "scale-[1.02] shadow-lg"
                        : isDisabled
                          ? "opacity-40 scale-[0.98]"
                          : "bg-white hover:shadow-md"
                    }`}
                    style={{
                      borderColor: isSelected ? categoryColor : "#E8E6E1",
                      backgroundColor: isSelected ? `${categoryColor}08` : isDisabled ? "#F5F3EE" : "white",
                      animationDelay: `${i * 100}ms`,
                      boxShadow: isSelected ? `0 6px 24px ${categoryColor}18` : undefined,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5 flex-shrink-0">
                        {i === 0 ? "🌾" : i === 1 ? "🏥" : "⚖️"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[15px] font-bold text-navy">{choice.label}</p>
                          {isSelected && <CheckSvg />}
                        </div>
                        <p className="text-[13px] text-text-secondary leading-[1.6] mt-1">{choice.reasoning}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ Phase: Scenario Rounds ═══ */}
        {phase.type === "scenario" && currentRound && (
          <div className="py-6 space-y-5" key={`round-${phase.roundIndex}`}>
            {/* Previous choice summaries */}
            {choiceHistory.map((ch, i) => (
              <ChoiceSummary
                key={i}
                emoji={ch.emotionEmoji}
                emotionLabel={ch.emotionLabel}
                methodEmoji={ch.methodEmoji}
                methodLabel={ch.methodLabel}
                color={categoryColor}
              />
            ))}

            {/* Consequence narrative card */}
            <NarrativeCard
              narrative={currentRound.consequence.narrative}
              newDilemma={currentRound.consequence.newDilemma}
              color={categoryColor}
              visible={showNarrative}
            />

            {/* Reaction selector */}
            {(
              <ReactionSelector
                emotionOptions={currentRound.emotionOptions}
                methodOptions={currentRound.methodOptions}
                selectedEmotion={selectedEmotion}
                selectedMethod={selectedMethod}
                onSelectEmotion={setSelectedEmotion}
                onSelectMethod={setSelectedMethod}
                color={categoryColor}
                visible={showReaction}
              />
            )}

            {/* Confirm button */}
            {bothSelected && (
              <div className="animate-fade-in-up">
                <button
                  onClick={handleConfirmReaction}
                  className="w-full py-4 rounded-xl text-white font-bold text-[15px] tracking-[-0.01em] transition-all tap-highlight active:scale-[0.97]"
                  style={{
                    backgroundColor: categoryColor,
                    boxShadow: `0 4px 20px ${categoryColor}30`,
                  }}
                >
                  이렇게 결정할게
                </button>
              </div>
            )}

            {/* Thinking tools row */}
            {showReaction && (
              <div
                className={`pt-2 transition-all duration-700 ${
                  showReaction ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <div className="w-6 h-[1px] bg-border-light" />
                  <span className="text-[10px] text-text-muted font-medium tracking-[0.06em]">
                    궁금하면 눌러봐
                  </span>
                  <div className="w-6 h-[1px] bg-border-light" />
                </div>
                <div className="flex justify-center gap-2">
                  {currentRound.thinkingTools.map((tool) => (
                    <button
                      key={tool.type}
                      onClick={() => setActiveTool(tool)}
                      className="flex items-center gap-1 px-3 py-2 rounded-full border border-border-light bg-white text-[12px] font-medium text-text-secondary transition-all tap-highlight hover:shadow-sm hover:border-gray-300"
                    >
                      <span className="text-sm">{tool.emoji}</span>
                      {tool.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Optional text input hint */}
            {showReaction && !bothSelected && (
              <div className="flex justify-center pt-1">
                <button className="flex items-center gap-1.5 text-[12px] text-text-muted transition-colors hover:text-text-secondary">
                  <PenSvg />
                  직접 말하고 싶으면
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══ Phase: Epilogue ═══ */}
        {phase.type === "epilogue" && chain && (
          <EpilogueView
            epilogue={chain.epilogue}
            color={categoryColor}
            onComplete={() => {
              // Find closing prompt from the last round
              const lastRound = chain.rounds[chain.rounds.length - 1];
              if (lastRound.closingPrompt) {
                setPhase({ type: "epilogue-closing" });
              } else {
                setPhase({ type: "final" });
                setShowNarrative(false);
                setTimeout(() => setShowNarrative(true), 400);
              }
            }}
          />
        )}

        {/* ═══ Phase: Epilogue Closing (reflection question after seeing results) ═══ */}
        {phase.type === "epilogue-closing" && chain && (
          <div className="py-6 page-enter">
            <ClosingPrompt
              prompt={chain.rounds[chain.rounds.length - 1].closingPrompt || "오늘 경험에서 가장 기억에 남는 순간은?"}
              color={categoryColor}
              visible={true}
              onSubmit={() => {
                setPhase({ type: "final" });
                setShowNarrative(false);
                setTimeout(() => setShowNarrative(true), 400);
              }}
              onSkip={() => {
                setPhase({ type: "final" });
                setShowNarrative(false);
                setTimeout(() => setShowNarrative(true), 400);
              }}
            />
          </div>
        )}

        {/* ═══ Phase: Final (Mirror Transition) ═══ */}
        {phase.type === "final" && (
          <div className="py-8 page-enter">
            {/* Final narrative */}
            <NarrativeCard
              narrative={chain!.finalCard.narrative}
              color={categoryColor}
              visible={showNarrative}
            />

            {/* Transition to mirror */}
            <div
              className={`mt-8 text-center space-y-5 transition-all duration-700 ${
                showNarrative ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto">
                <circle cx="32" cy="32" r="30" stroke={categoryColor} strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.3" />
                <circle cx="32" cy="32" r="20" fill={`${categoryColor}10`} />
                <path d="M24 32l5 5l11-11" stroke={categoryColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div>
                <p className="text-[18px] font-bold text-navy tracking-[-0.02em]">
                  시장으로서의 첫날이 끝났어
                </p>
                <p className="text-[14px] text-text-secondary mt-1.5 leading-[1.6]">
                  네가 내린 {choiceHistory.length + 1}번의 결정이<br />
                  어떤 의미였는지 돌아볼 시간이야
                </p>
              </div>

              <Link
                href={`/mission/${id}/mirror`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-[16px] transition-all tap-highlight active:scale-[0.97]"
                style={{
                  backgroundColor: categoryColor,
                  boxShadow: `0 6px 28px ${categoryColor}30`,
                }}
              >
                오늘의 거울 보러 가기
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M7 4.5l4.5 4.5-4.5 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ─── Thinking Tool Overlay ─── */}
      {activeTool && (
        <ThinkingToolOverlay
          tool={activeTool}
          color={categoryColor}
          onClose={() => setActiveTool(null)}
        />
      )}

      {/* ─── Slide-up animation ─── */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
