"use client";

import { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  getMission,
  createSession,
  getSession,
  recordChoice,
  recordReaction,
  recordToolUsage,
  recordClosing,
  completeSession,
  streamScenarioRound,
  generateThinkingTool,
  generateEpilogue,
  generateMirror,
  ApiError,
} from "@/lib/api-client";
import type {
  MissionData,
  GeneratedRound,
  GeneratedEpilogue,
  ThinkingToolCardResult,
} from "@/lib/api-client";
import { CATEGORY_META } from "@/lib/types";

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

// ─── Loading Spinner ───

function LoadingSpinner({ color, text }: { color: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 animate-fade-in">
      <div className="relative w-10 h-10">
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: color, borderRightColor: `${color}40` }}
        />
      </div>
      <p className="text-[13px] text-text-muted">{text}</p>
    </div>
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
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ backgroundColor: color }} />
      <div className="pl-5 pr-5 py-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full animate-breathe" style={{ backgroundColor: color }} />
          <span className="text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color }}>
            상황 업데이트
          </span>
        </div>
        <div className="space-y-3">
          {paragraphs.map((p, i) => {
            const isQuote = p.startsWith('"') || p.startsWith('\u201c') || p.startsWith('\"');
            return (
              <p
                key={i}
                className={`text-[15px] leading-[1.75] tracking-[-0.01em] ${
                  isQuote ? "text-navy font-semibold pl-3 border-l-2" : "text-text-secondary"
                }`}
                style={isQuote ? { borderColor: color } : undefined}
              >
                {p}
              </p>
            );
          })}
        </div>
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
  tool: ThinkingToolCardResult;
  color: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-navy/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards" }}
      >
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
        <div className="rounded-xl p-4" style={{ backgroundColor: `${color}08`, border: `1px solid ${color}20` }}>
          {tool.card.narrative.split("\n").map((line, i) => (
            <p
              key={i}
              className={`text-[14px] leading-[1.7] ${
                line.startsWith("→") || line.startsWith("\u2192") ? "font-semibold text-navy mt-2" : "text-text-secondary"
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

interface OptionCard {
  id: string;
  emoji: string;
  label: string;
  valueTags: string[];
}

function RadioDot({ selected, color }: { selected: boolean; color: string }) {
  return (
    <div
      className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300"
      style={{ borderColor: selected ? color : "#D1D0CC" }}
    >
      <div
        className="w-2.5 h-2.5 rounded-full transition-all duration-300"
        style={{
          backgroundColor: selected ? color : "transparent",
          transform: selected ? "scale(1)" : "scale(0)",
        }}
      />
    </div>
  );
}

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
  emotionOptions: OptionCard[];
  methodOptions: OptionCard[];
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
      {/* Emotion options — vertical list */}
      <div>
        <p className="text-[12px] font-semibold text-text-muted tracking-[0.04em] mb-2.5 uppercase">
          어떤 태도로
        </p>
        <div className="rounded-2xl border border-border-light bg-white overflow-hidden" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}>
          {emotionOptions.map((em, i) => {
            const isSelected = selectedEmotion === em.id;
            return (
              <button
                key={em.id}
                onClick={() => onSelectEmotion(em.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 tap-highlight transition-all duration-200 ${
                  i < emotionOptions.length - 1 ? "border-b border-border-light" : ""
                }`}
                style={{
                  backgroundColor: isSelected ? `${color}08` : "transparent",
                }}
              >
                <span className={`text-2xl flex-shrink-0 transition-transform duration-300 ${isSelected ? "scale-110" : ""}`}>
                  {em.emoji}
                </span>
                <span
                  className={`flex-1 text-left text-[15px] leading-[1.5] tracking-[-0.01em] transition-colors duration-200 ${
                    isSelected ? "font-bold" : "font-medium text-navy"
                  }`}
                  style={isSelected ? { color } : undefined}
                >
                  {em.label}
                </span>
                <RadioDot selected={isSelected} color={color} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Method options — vertical list */}
      <div>
        <p className="text-[12px] font-semibold text-text-muted tracking-[0.04em] mb-2.5 uppercase">
          어떤 방법으로
        </p>
        <div className="rounded-2xl border border-border-light bg-white overflow-hidden" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}>
          {methodOptions.map((mt, i) => {
            const isSelected = selectedMethod === mt.id;
            return (
              <button
                key={mt.id}
                onClick={() => onSelectMethod(mt.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 tap-highlight transition-all duration-200 ${
                  i < methodOptions.length - 1 ? "border-b border-border-light" : ""
                }`}
                style={{
                  backgroundColor: isSelected ? `${color}08` : "transparent",
                }}
              >
                <span className={`text-2xl flex-shrink-0 transition-transform duration-300 ${isSelected ? "scale-110" : ""}`}>
                  {mt.emoji}
                </span>
                <span
                  className={`flex-1 text-left text-[15px] leading-[1.5] tracking-[-0.01em] transition-colors duration-200 ${
                    isSelected ? "font-bold" : "font-medium text-navy"
                  }`}
                  style={isSelected ? { color } : undefined}
                >
                  {mt.label}
                </span>
                <RadioDot selected={isSelected} color={color} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Choice Summary Chip ───

function ChoiceSummary({ emoji, emotionLabel, methodEmoji, methodLabel, color }: {
  emoji: string; emotionLabel: string; methodEmoji: string; methodLabel: string; color: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 py-3 animate-scale-in">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold" style={{ backgroundColor: `${color}12`, color }}>
        <span>{emoji}</span>{emotionLabel}
      </div>
      <span className="text-text-muted text-[10px]">+</span>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold" style={{ backgroundColor: `${color}12`, color }}>
        <span>{methodEmoji}</span>{methodLabel}
      </div>
    </div>
  );
}

// ─── Closing Prompt ───

function ClosingPrompt({ prompt, color, onSubmit, onSkip }: {
  prompt: string; color: string; onSubmit: (text: string) => void; onSkip: () => void;
}) {
  const [text, setText] = useState("");
  return (
    <div className="animate-fade-in-up space-y-3">
      <div className="rounded-2xl p-5 bg-white border border-border-light" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.03)" }}>
        <p className="text-[16px] font-bold text-navy tracking-[-0.02em] mb-4 leading-[1.5]">{prompt}</p>
        <div className="relative">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="자유롭게 적어봐..."
            className="w-full h-20 px-4 py-3 rounded-xl bg-bg-warm border border-border-light text-[14px] text-navy placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 transition-shadow" />
          <div className="absolute right-2 bottom-2 flex items-center gap-1 text-text-muted"><PenSvg /></div>
        </div>
      </div>
      <div className="flex gap-2.5">
        <button onClick={() => onSubmit(text)} className="flex-1 py-3.5 rounded-xl text-white font-semibold text-[15px] transition-transform tap-highlight active:scale-[0.97]" style={{ backgroundColor: color }}>
          다음으로
        </button>
        <button onClick={onSkip} className="px-5 py-3.5 rounded-xl border border-border-light text-text-muted font-medium text-[14px] transition-colors tap-highlight hover:bg-bg-warm">
          건너뛰기
        </button>
      </div>
    </div>
  );
}

// ─── Epilogue Scene ───

const MOOD_COLORS: Record<string, { bg: string; border: string; icon: string }> = {
  positive: { bg: "#F0FAF0", border: "#86CEAC", icon: "💚" },
  bittersweet: { bg: "#FFF8F0", border: "#E0C097", icon: "🧡" },
  hopeful: { bg: "#F0F4FF", border: "#94AADC", icon: "💙" },
  tense: { bg: "#FFF5F5", border: "#E09494", icon: "❤️‍🩹" },
};

function EpilogueView({ epilogue, color, onComplete }: {
  epilogue: GeneratedEpilogue; color: string; onComplete: () => void;
}) {
  const [revealedScenes, setRevealedScenes] = useState(0);
  const [showClosing, setShowClosing] = useState(false);
  const totalScenes = epilogue.scenes.length;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    epilogue.scenes.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealedScenes(i + 1), 800 + i * 1800));
    });
    timers.push(setTimeout(() => setShowClosing(true), 800 + totalScenes * 1800 + 600));
    return () => timers.forEach(clearTimeout);
  }, [epilogue.scenes, totalScenes]);

  return (
    <div className="py-6 space-y-0">
      <div className="text-center mb-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4" style={{ backgroundColor: `${color}10` }}>
          <span className="text-sm">📖</span>
          <span className="text-[11px] font-bold tracking-[0.06em] uppercase" style={{ color }}>경험의 결과</span>
        </div>
        <h2 className="text-[22px] font-bold text-navy tracking-[-0.03em] leading-[1.3]">{epilogue.title}</h2>
      </div>
      <div className="relative pl-8">
        <div className="absolute left-[11px] top-2 bottom-2 w-[2px] rounded-full transition-all duration-1000"
          style={{ background: `linear-gradient(to bottom, ${color}, ${color}40)`, height: revealedScenes > 0 ? `${(revealedScenes / totalScenes) * 100}%` : "0%" }} />
        <div className="space-y-6">
          {epilogue.scenes.map((scene, i) => {
            const isRevealed = i < revealedScenes;
            const moodStyle = MOOD_COLORS[scene.mood] || MOOD_COLORS.hopeful;
            return (
              <div key={i} className={`relative transition-all duration-700 ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                <div className={`absolute -left-8 top-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${isRevealed ? "scale-100" : "scale-0"}`}
                  style={{ backgroundColor: moodStyle.border }}>
                  <span className="text-[10px]">{moodStyle.icon}</span>
                </div>
                <div className="rounded-2xl p-5 border transition-all duration-500"
                  style={{ backgroundColor: moodStyle.bg, borderColor: `${moodStyle.border}40`, boxShadow: isRevealed ? `0 2px 12px ${moodStyle.border}15` : "none" }}>
                  <p className="text-[15px] text-navy leading-[1.8] tracking-[-0.01em]">{scene.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={`mt-10 text-center transition-all duration-700 ${showClosing ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <svg width="160" height="20" viewBox="0 0 160 20" fill="none" className="mx-auto mb-5">
          <path d="M0 10h65" stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />
          <circle cx="75" cy="10" r="2" fill={color} fillOpacity="0.2" />
          <circle cx="80" cy="10" r="1.5" fill={color} fillOpacity="0.3" />
          <circle cx="85" cy="10" r="2" fill={color} fillOpacity="0.2" />
          <path d="M95 10h65" stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />
        </svg>
        <p className="text-[14px] text-text-secondary leading-[1.7] italic max-w-[300px] mx-auto">{epilogue.closingLine}</p>
        <button onClick={onComplete}
          className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-[15px] transition-all tap-highlight active:scale-[0.97]"
          style={{ backgroundColor: color, boxShadow: `0 6px 24px ${color}30` }}>
          다음으로
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// MAIN PAGE — Connected to Backend APIs
// ═══════════════════════════════════════

const TOTAL_ROUNDS = 3;
const CLOSING_PROMPT = "오늘 가장 어려웠던 순간은 언제였어?";

type Phase =
  | { type: "loading" }
  | { type: "error"; message: string }
  | { type: "initial-choice" }
  | { type: "streaming-round"; roundIndex: number }
  | { type: "scenario"; roundIndex: number }
  | { type: "generating-epilogue" }
  | { type: "epilogue" }
  | { type: "epilogue-closing" }
  | { type: "generating-mirror" }
  | { type: "final" }
  | { type: "complete" };

export default function MissionPlayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ─── Data State ───
  const [mission, setMission] = useState<MissionData | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState<GeneratedRound | null>(null);
  const [epilogueData, setEpilogueData] = useState<GeneratedEpilogue | null>(null);
  const [mirrorId, setMirrorId] = useState<string | null>(null);

  // ─── UI State ───
  const [phase, setPhase] = useState<Phase>({ type: "loading" });
  const [selectedInitial, setSelectedInitial] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showNarrative, setShowNarrative] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const [activeTool, setActiveTool] = useState<ThinkingToolCardResult | null>(null);
  const [loadingTool, setLoadingTool] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState<string>(""); // narrative streaming in progress
  const [choiceHistory, setChoiceHistory] = useState<
    { emotionEmoji: string; emotionLabel: string; methodEmoji: string; methodLabel: string }[]
  >([]);

  const categoryColor = mission ? (CATEGORY_META[mission.category as keyof typeof CATEGORY_META]?.color ?? "#4A5FC1") : "#4A5FC1";
  const categoryMeta = mission ? CATEGORY_META[mission.category as keyof typeof CATEGORY_META] : null;
  const totalSteps = TOTAL_ROUNDS + 3; // initial + 3 rounds + epilogue + final

  const currentStep =
    phase.type === "initial-choice" ? 0
    : phase.type === "scenario" || phase.type === "streaming-round" ? (("roundIndex" in phase ? phase.roundIndex : 0) + 1)
    : phase.type === "epilogue" || phase.type === "epilogue-closing" || phase.type === "generating-epilogue" ? totalSteps - 2
    : phase.type === "final" || phase.type === "generating-mirror" ? totalSteps - 1
    : 0;

  // ─── Init: Load mission + create/resume session ───
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { mission: m } = await getMission(id);
        if (cancelled) return;
        setMission(m);
        const { sessionId: sid, reused } = await createSession(m.id);
        if (cancelled) return;
        setSessionId(sid);

        if (reused) {
          // Resume existing session — check how far it got
          try {
            const detail = await getSession(sid);
            if (cancelled) return;
            const session = detail.session as { initialChoiceId?: string; closingResponse?: string };
            const rounds = (detail.generatedRounds ?? []) as GeneratedRound[];
            const reactions = (detail.reactions ?? []) as { roundIndex: number; emotionLabel: string; emotionId: string; methodLabel: string; methodId: string; valueTags: string[] }[];

            if (!session.initialChoiceId) {
              // No choice made yet — start fresh
              setPhase({ type: "initial-choice" });
              return;
            }

            // Reconstruct choice history from saved reactions
            const history = reactions
              .sort((a, b) => a.roundIndex - b.roundIndex)
              .map((r) => {
                const round = rounds.find((rd) => rd.roundIndex === r.roundIndex);
                const em = round?.emotionOptions.find((e) => e.id === r.emotionId);
                const mt = round?.methodOptions.find((m) => m.id === r.methodId);
                return {
                  emotionEmoji: em?.emoji ?? "🤔",
                  emotionLabel: r.emotionLabel,
                  methodEmoji: mt?.emoji ?? "🤝",
                  methodLabel: r.methodLabel,
                };
              });
            setChoiceHistory(history);
            setSelectedInitial(session.initialChoiceId);

            // Determine which round to resume at
            const completedRounds = reactions.length;

            if (detail.epilogue) {
              // Epilogue already done
              if (detail.mirror) {
                // Everything done — go to final
                setShowNarrative(false);
                setPhase({ type: "final" });
                setTimeout(() => setShowNarrative(true), 400);
              } else if (session.closingResponse) {
                // Closing done, need mirror
                setPhase({ type: "generating-mirror" });
              } else {
                // Show epilogue
                setEpilogueData(detail.epilogue as GeneratedEpilogue);
                setPhase({ type: "epilogue" });
              }
            } else if (completedRounds >= TOTAL_ROUNDS) {
              // All reactions done, need epilogue
              setPhase({ type: "generating-epilogue" });
              const { epilogue } = await generateEpilogue(sid);
              if (cancelled) return;
              setEpilogueData(epilogue);
              setPhase({ type: "epilogue" });
            } else {
              // Resume at next round — pass sid explicitly since state may not be set yet
              startRoundStream(completedRounds, sid);
            }
          } catch {
            // If resume fails, just start fresh
            setPhase({ type: "initial-choice" });
          }
        } else {
          setPhase({ type: "initial-choice" });
        }
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          setPhase({ type: "error", message: "로그인이 필요해요" });
        } else {
          setPhase({ type: "error", message: "미션을 불러올 수 없어요" });
        }
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  // Auto-scroll on phase changes
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      }, 100);
    }
  }, [phase, showNarrative, showReaction]);

  // ─── Handlers ───

  // Stream a scenario round: narrative appears progressively, then options pop in
  async function startRoundStream(roundIndex: number, overrideSessionId?: string) {
    const sid = overrideSessionId ?? sessionId;
    if (!sid) return;
    setStreamingText("");
    setCurrentRound(null);
    setSelectedEmotion(null);
    setSelectedMethod(null);
    setShowNarrative(true);
    setShowReaction(false);
    setPhase({ type: "streaming-round", roundIndex });

    await streamScenarioRound(
      sid,
      roundIndex,
      // onNarrative: receives the full narrative text extracted so far
      (narrativeText) => {
        setStreamingText(narrativeText);
      },
      // onComplete: reveal full round with options
      (round) => {
        setCurrentRound(round);
        setStreamingText("");
        setPhase({ type: "scenario", roundIndex });
        setTimeout(() => setShowReaction(true), 300);
      },
      // onError
      (message) => {
        setPhase({ type: "error", message: message || "시나리오를 생성할 수 없어요" });
      },
    );
  }

  async function handleInitialChoice(choiceId: string) {
    if (!sessionId) return;
    setSelectedInitial(choiceId);

    try {
      await recordChoice(sessionId, choiceId);
      setTimeout(() => startRoundStream(0), 600);
    } catch {
      setPhase({ type: "error", message: "선택을 기록할 수 없어요" });
    }
  }

  async function handleConfirmReaction() {
    if (!sessionId || !currentRound || phase.type !== "scenario") return;

    const em = currentRound.emotionOptions.find((e) => e.id === selectedEmotion);
    const mt = currentRound.methodOptions.find((m) => m.id === selectedMethod);
    if (!em || !mt) return;

    // Record reaction — must succeed before proceeding
    const allTags = [...em.valueTags, ...mt.valueTags];
    try {
      await recordReaction(sessionId, phase.roundIndex, em.id, em.label, mt.id, mt.label, allTags);
    } catch {
      setPhase({ type: "error", message: "반응을 기록할 수 없어요. 다시 시도해주세요." });
      return;
    }

    setChoiceHistory((prev) => [
      ...prev,
      { emotionEmoji: em.emoji, emotionLabel: em.label, methodEmoji: mt.emoji, methodLabel: mt.label },
    ]);

    const nextRoundIndex = phase.roundIndex + 1;

    if (nextRoundIndex < TOTAL_ROUNDS) {
      startRoundStream(nextRoundIndex);
    } else {
      // All rounds done → generate epilogue
      setPhase({ type: "generating-epilogue" });
      try {
        const { epilogue } = await generateEpilogue(sessionId);
        setEpilogueData(epilogue);
        setPhase({ type: "epilogue" });
      } catch {
        setPhase({ type: "error", message: "에필로그를 생성할 수 없어요" });
      }
    }
  }

  async function handleThinkingTool(toolType: string) {
    if (!sessionId || phase.type !== "scenario") return;
    setLoadingTool(toolType);

    try {
      await recordToolUsage(sessionId, phase.roundIndex, toolType);
      const { card } = await generateThinkingTool(sessionId, phase.roundIndex, toolType);
      setActiveTool(card);
    } catch {
      // Show inline error
    }
    setLoadingTool(null);
  }

  async function handleClosingSubmit(text: string) {
    if (sessionId && text.trim()) {
      try { await recordClosing(sessionId, text); } catch { /* non-critical */ }
    }
    goToFinal();
  }

  async function goToFinal() {
    if (!sessionId) return;
    setPhase({ type: "generating-mirror" });
    try {
      const { mirror } = await generateMirror(sessionId);
      setMirrorId(mirror.id);
      await completeSession(sessionId, mirror.id);
      setShowNarrative(false);
      setPhase({ type: "final" });
      setTimeout(() => setShowNarrative(true), 400);
    } catch {
      // If mirror fails, still go to final
      setShowNarrative(false);
      setPhase({ type: "final" });
      setTimeout(() => setShowNarrative(true), 400);
    }
  }

  // ─── Render ───

  const bothSelected = selectedEmotion !== null && selectedMethod !== null;

  // Loading / Error states
  if (phase.type === "loading") {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-bg-cream">
        <LoadingSpinner color="#4A5FC1" text="세계를 준비하고 있어..." />
      </div>
    );
  }

  if (phase.type === "error") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-bg-cream px-6 gap-4">
        <p className="text-[15px] text-text-secondary text-center">{phase.message}</p>
        <Link href="/home" className="text-[14px] font-semibold text-coral">홈으로 돌아가기</Link>
      </div>
    );
  }

  if (!mission) return null;

  return (
    <div className="min-h-dvh flex flex-col bg-bg-cream">
      {/* ─── Sticky Header ─── */}
      <header className="sticky top-0 z-40 px-5 pt-4 pb-3 bg-bg-cream/95 backdrop-blur-md" style={{ borderBottom: "1px solid rgba(232,230,225,0.6)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.04em] mb-0.5" style={{ color: categoryColor }}>
              {categoryMeta?.icon} {categoryMeta?.label}
            </p>
            <h1 className="text-[16px] font-bold text-navy tracking-[-0.02em] truncate">{mission.title}</h1>
          </div>
          <div className="flex-shrink-0 ml-3">
            <ChapterDots total={totalSteps} current={currentStep} color={categoryColor} />
          </div>
        </div>
      </header>

      {/* ─── Scrollable Content ─── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-6 hide-scrollbar">

        {/* ═══ Initial Choice ═══ */}
        {phase.type === "initial-choice" && (
          <div className="py-6 page-enter">
            <div className="rounded-xl px-4 py-3 mb-5" style={{ backgroundColor: `${categoryColor}08` }}>
              <p className="text-[12px] font-semibold mb-1" style={{ color: categoryColor }}>
                {mission.worldSetting.location} · {mission.worldSetting.era}
              </p>
              <p className="text-[14px] text-text-secondary leading-[1.7]">{mission.situation}</p>
            </div>
            <h2 className="text-[20px] font-bold text-navy tracking-[-0.02em] leading-[1.45] mb-6">{mission.coreQuestion}</h2>
            <div className="space-y-3">
              {mission.choices.map((choice, i) => {
                const isSelected = selectedInitial === choice.id;
                const isDisabled = selectedInitial !== null && !isSelected;
                return (
                  <button key={choice.id} onClick={() => !selectedInitial && handleInitialChoice(choice.id)} disabled={!!selectedInitial}
                    className={`relative w-full text-left rounded-2xl border-2 p-4 transition-all duration-500 tap-highlight ${isSelected ? "scale-[1.02] shadow-lg" : isDisabled ? "opacity-40 scale-[0.98]" : "bg-white hover:shadow-md"}`}
                    style={{ borderColor: isSelected ? categoryColor : "#E8E6E1", backgroundColor: isSelected ? `${categoryColor}08` : isDisabled ? "#F5F3EE" : "white", boxShadow: isSelected ? `0 6px 24px ${categoryColor}18` : undefined }}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5 flex-shrink-0">{i === 0 ? "🌾" : i === 1 ? "🏥" : "⚖️"}</span>
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

        {/* ═══ Streaming Round — narrative appears progressively ═══ */}
        {phase.type === "streaming-round" && (
          <div className="py-6 space-y-5" key={`streaming-${phase.roundIndex}`}>
            {choiceHistory.map((ch, i) => (
              <ChoiceSummary key={i} emoji={ch.emotionEmoji} emotionLabel={ch.emotionLabel} methodEmoji={ch.methodEmoji} methodLabel={ch.methodLabel} color={categoryColor} />
            ))}
            {/* Streaming narrative card */}
            <div
              className="relative rounded-2xl bg-white border border-border-light overflow-hidden"
              style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ backgroundColor: categoryColor }} />
              <div className="pl-5 pr-5 py-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full animate-breathe" style={{ backgroundColor: categoryColor }} />
                  <span className="text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: categoryColor }}>
                    상황 전개 중...
                  </span>
                </div>
                <p className="text-[15px] leading-[1.75] tracking-[-0.01em] text-text-secondary whitespace-pre-wrap">
                  {streamingText}
                  <span className="inline-block w-0.5 h-4 ml-0.5 bg-navy/40 animate-pulse align-text-bottom" />
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══ Scenario Round ═══ */}
        {phase.type === "scenario" && currentRound && (
          <div className="py-6 space-y-5" key={`round-${phase.roundIndex}`}>
            {choiceHistory.map((ch, i) => (
              <ChoiceSummary key={i} emoji={ch.emotionEmoji} emotionLabel={ch.emotionLabel} methodEmoji={ch.methodEmoji} methodLabel={ch.methodLabel} color={categoryColor} />
            ))}
            <NarrativeCard narrative={currentRound.consequence.narrative} newDilemma={currentRound.consequence.newDilemma} color={categoryColor} visible={showNarrative} />
            <ReactionSelector emotionOptions={currentRound.emotionOptions} methodOptions={currentRound.methodOptions}
              selectedEmotion={selectedEmotion} selectedMethod={selectedMethod} onSelectEmotion={setSelectedEmotion} onSelectMethod={setSelectedMethod}
              color={categoryColor} visible={showReaction} />
            {bothSelected && (
              <div className="animate-fade-in-up">
                <button onClick={handleConfirmReaction}
                  className="w-full py-4 rounded-xl text-white font-bold text-[15px] tracking-[-0.01em] transition-all tap-highlight active:scale-[0.97]"
                  style={{ backgroundColor: categoryColor, boxShadow: `0 4px 20px ${categoryColor}30` }}>
                  이렇게 결정할게
                </button>
              </div>
            )}
            {showReaction && (
              <div className="pt-2 transition-all duration-700 opacity-100" style={{ transitionDelay: "600ms" }}>
                <p className="text-[12px] font-semibold text-text-muted tracking-[0.04em] mb-2.5 uppercase">
                  궁금하면 눌러봐
                </p>
                <div className="rounded-2xl border border-border-light bg-white overflow-hidden" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}>
                  {currentRound.thinkingTools.map((tool, i) => (
                    <button
                      key={tool.type}
                      onClick={() => handleThinkingTool(tool.type)}
                      disabled={loadingTool === tool.type}
                      className={`w-full flex items-center gap-3.5 px-4 py-3.5 tap-highlight transition-all duration-200 disabled:opacity-50 ${
                        i < currentRound.thinkingTools.length - 1 ? "border-b border-border-light" : ""
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">
                        {loadingTool === tool.type ? "⏳" : tool.emoji}
                      </span>
                      <span className="flex-1 text-left text-[14px] font-medium text-text-secondary leading-[1.5]">
                        {tool.label}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 text-text-muted">
                        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ Generating Epilogue ═══ */}
        {phase.type === "generating-epilogue" && (
          <div className="py-6">
            {choiceHistory.map((ch, i) => (
              <ChoiceSummary key={i} emoji={ch.emotionEmoji} emotionLabel={ch.emotionLabel} methodEmoji={ch.methodEmoji} methodLabel={ch.methodLabel} color={categoryColor} />
            ))}
            <LoadingSpinner color={categoryColor} text="네가 만든 이야기를 정리하고 있어..." />
          </div>
        )}

        {/* ═══ Epilogue ═══ */}
        {phase.type === "epilogue" && epilogueData && (
          <EpilogueView epilogue={epilogueData} color={categoryColor}
            onComplete={() => setPhase({ type: "epilogue-closing" })} />
        )}

        {/* ═══ Epilogue Closing ═══ */}
        {phase.type === "epilogue-closing" && (
          <div className="py-6 page-enter">
            <ClosingPrompt prompt={CLOSING_PROMPT} color={categoryColor}
              onSubmit={handleClosingSubmit} onSkip={() => goToFinal()} />
          </div>
        )}

        {/* ═══ Generating Mirror ═══ */}
        {phase.type === "generating-mirror" && (
          <div className="py-6">
            <LoadingSpinner color={categoryColor} text="오늘의 거울을 준비하고 있어..." />
          </div>
        )}

        {/* ═══ Final (Mirror Transition) ═══ */}
        {phase.type === "final" && (
          <div className="py-8 page-enter">
            <NarrativeCard narrative="시장으로서의 첫날이 끝났어.\n\n네가 내린 결정들이 어떤 의미였는지, 거울에서 함께 돌아보자." color={categoryColor} visible={showNarrative} />
            <div className={`mt-8 text-center space-y-5 transition-all duration-700 ${showNarrative ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "600ms" }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto">
                <circle cx="32" cy="32" r="30" stroke={categoryColor} strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.3" />
                <circle cx="32" cy="32" r="20" fill={`${categoryColor}10`} />
                <path d="M24 32l5 5l11-11" stroke={categoryColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <p className="text-[18px] font-bold text-navy tracking-[-0.02em]">오늘의 탐험이 끝났어</p>
                <p className="text-[14px] text-text-secondary mt-1.5 leading-[1.6]">
                  네가 내린 {choiceHistory.length + 1}번의 결정이<br />어떤 의미였는지 돌아볼 시간이야
                </p>
              </div>
              <Link href={`/mission/${id}/mirror`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-[16px] transition-all tap-highlight active:scale-[0.97]"
                style={{ backgroundColor: categoryColor, boxShadow: `0 6px 28px ${categoryColor}30` }}>
                오늘의 거울 보러 가기
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 4.5l4.5 4.5-4.5 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ─── Thinking Tool Overlay ─── */}
      {activeTool && (
        <ThinkingToolOverlay tool={activeTool} color={categoryColor} onClose={() => setActiveTool(null)} />
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
