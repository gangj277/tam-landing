"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getDeepDive,
  recordDeepDiveStep,
  generatePortfolioSentence,
  completeDeepDiveSession,
} from "@/lib/api-client";
import type { DeepDiveData, DeepDiveStepData, MissionData } from "@/lib/api-client";
import { CATEGORY_META, DEEP_DIVE_STEP_META } from "@/lib/types";
import type { MissionCategory } from "@/lib/types";

// ─── Design tokens ───

const CORAL = "#E8614D";
const INDIGO = "#4A5FC1";
const NAVY = "#1A1A2E";
const GOLD = "#D4A853";
const SAGE = "#6B8F71";

// ─── Custom SVG Icons (warm, rounded, kid-friendly) ───

function BookOpenIcon({ size = 48, color = INDIGO }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Left page */}
      <path d="M24 12C20 9 14 8 8 9v24c6-1 12 0 16 3" fill={`${color}08`} stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      {/* Right page */}
      <path d="M24 12c4-3 10-4 16-3v24c-6-1-12 0-16 3" fill={`${color}08`} stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      {/* Spine */}
      <path d="M24 12v24" stroke={color} strokeWidth="1.2" strokeOpacity="0.3" />
      {/* Text lines left */}
      <path d="M12 16h8M12 20h6M12 24h7" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.35" />
      {/* Text lines right */}
      <path d="M28 16h8M28 20h6M28 24h7" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.35" />
      {/* Sparkle */}
      <circle cx="38" cy="8" r="1.5" fill={GOLD} fillOpacity="0.6" />
      <path d="M38 5v6M35 8h6" stroke={GOLD} strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  );
}

function CheckBurstIcon({ size = 64, color = SAGE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Burst rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="32" y1="32"
          x2={32 + Math.cos((angle * Math.PI) / 180) * 28}
          y2={32 + Math.sin((angle * Math.PI) / 180) * 28}
          stroke={color} strokeWidth="1.2" strokeLinecap="round"
          strokeOpacity="0.15"
        />
      ))}
      {/* Outer ring */}
      <circle cx="32" cy="32" r="24" stroke={color} strokeWidth="2" fill={`${color}10`} />
      {/* Inner filled circle */}
      <circle cx="32" cy="32" r="16" fill={`${color}18`} />
      {/* Checkmark */}
      <path d="M22 32l6 6 14-14" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Tiny celebratory dots */}
      <circle cx="12" cy="14" r="2" fill={GOLD} fillOpacity="0.5" />
      <circle cx="52" cy="18" r="1.5" fill={CORAL} fillOpacity="0.4" />
      <circle cx="50" cy="48" r="2" fill={INDIGO} fillOpacity="0.3" />
      <circle cx="14" cy="46" r="1.5" fill={GOLD} fillOpacity="0.4" />
    </svg>
  );
}

function ArrowRightIcon({ size = 18, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M7 4l5 5-5 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackArrowIcon({ size = 20, color = "#8A8A9A" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M12 4l-5 6 5 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocumentStarIcon({ size = 28, color = GOLD }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect x="4" y="2" width="20" height="24" rx="3" stroke={color} strokeWidth="1.4" fill={`${color}08`} />
      <path d="M9 9h10M9 13h8M9 17h5" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4" />
      {/* Star */}
      <path d="M20 20l1.2 2.5 2.8.4-2 2 .5 2.7-2.5-1.3-2.5 1.3.5-2.7-2-2 2.8-.4L20 20z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

function GlobeNewsIcon({ size = 20, color = INDIGO }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="1.3" />
      <ellipse cx="10" cy="10" rx="4" ry="8" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
      <path d="M2 10h16" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
    </svg>
  );
}

function LightbulbIcon({ size = 20, color = GOLD }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2a5.5 5.5 0 00-2 10.6V15h4v-2.4A5.5 5.5 0 0010 2z" stroke={color} strokeWidth="1.3" fill={`${color}10`} />
      <path d="M8 17h4M8.5 15h3" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function QuoteIcon({ size = 16, color = INDIGO }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 10c0-3 2-5 4-6l1 1.5C6.5 6.5 5.5 8 6 9.5h1.5V13H3v-3zm6 0c0-3 2-5 4-6l1 1.5C12.5 6.5 11.5 8 12 9.5h1.5V13H9v-3z" fill={color} fillOpacity="0.2" />
    </svg>
  );
}

// ─── Encouraging micro-copy (randomly picked per transition) ───

const ENCOURAGEMENTS = {
  afterCase: ["좋아, 잘 읽었어!", "재미있는 이야기지?", "흥미롭지? 이제 생각해보자!"],
  afterQuestion: ["멋진 생각이야!", "좋은 선택이었어!", "네 생각이 궁금했어!"],
  afterOpinion: ["와, 정말 좋은 의견이다!", "네 생각이 멋져!", "진짜 잘 정리했어!"],
};

function pickRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Step progress (warmer, more visual) ───

function StepProgress({
  steps,
  currentIndex,
  color,
}: {
  steps: { type: string; label: string }[];
  currentIndex: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1 justify-center">
      {steps.map((step, i) => (
        <div key={step.type} className="flex items-center gap-1">
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full transition-all duration-500 text-[11px] font-semibold"
            style={{
              backgroundColor: i < currentIndex ? `${color}18` : i === currentIndex ? `${color}12` : "transparent",
              color: i <= currentIndex ? color : "#B5B3AE",
              border: `1.5px solid ${i <= currentIndex ? `${color}30` : "#E8E6E1"}`,
              transform: i === currentIndex ? "scale(1.05)" : "scale(1)",
            }}
          >
            {i < currentIndex ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" fill={color} fillOpacity="0.15" />
                <path d="M3.5 6l1.8 1.8 3.2-3.2" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : i === currentIndex ? (
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
            ) : null}
            <span>{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="w-2.5 h-px transition-colors duration-500"
              style={{ backgroundColor: i < currentIndex ? `${color}40` : "#E8E6E1" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Transition encouragement toast ───

function EncouragementToast({ text, color }: { text: string; color: string }) {
  return (
    <div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up"
      style={{ animationDuration: "0.5s" }}
    >
      <div
        className="px-5 py-2.5 rounded-full text-[14px] font-bold text-white"
        style={{
          backgroundColor: color,
          boxShadow: `0 4px 24px ${color}40`,
        }}
      >
        {text}
      </div>
    </div>
  );
}

// ─── Phase types ───

type Phase = "loading" | "intro" | "case" | "question" | "opinion" | "portfolio" | "complete";

const STEP_TYPE_TO_PHASE: Record<string, Phase> = {
  case: "case",
  question: "question",
  opinion: "opinion",
  portfolio: "portfolio",
};

interface QuestionItem {
  id: string;
  text: string;
  options?: { id: string; label: string }[];
  followUpPrompt?: string;
}

// ─── Main Page ───

export default function DeepDivePlayPage() {
  const params = useParams();
  const router = useRouter();
  const deepDiveId = params.id as string;

  const [phase, setPhase] = useState<Phase>("loading");
  const [deepDive, setDeepDive] = useState<DeepDiveData | null>(null);
  const [linkedMission, setLinkedMission] = useState<MissionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [followUpText, setFollowUpText] = useState("");
  const [opinionValue, setOpinionValue] = useState("");
  const [opinionReason, setOpinionReason] = useState("");
  const [portfolioText, setPortfolioText] = useState("");
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [finalPortfolio, setFinalPortfolio] = useState("");

  const [visible, setVisible] = useState(false);
  const [encouragement, setEncouragement] = useState<{ text: string; color: string } | null>(null);
  const encouragementTimer = useRef<NodeJS.Timeout | null>(null);

  const categoryMeta = linkedMission ? CATEGORY_META[linkedMission.category as MissionCategory] : null;
  const accentColor = categoryMeta?.color ?? INDIGO;

  const stepsMeta = Object.entries(DEEP_DIVE_STEP_META).map(([type, meta]) => ({
    type,
    label: meta.label,
  }));

  // ─── Encouragement flash ───

  const showEncouragement = useCallback((text: string, color: string) => {
    setEncouragement({ text, color });
    if (encouragementTimer.current) clearTimeout(encouragementTimer.current);
    encouragementTimer.current = setTimeout(() => setEncouragement(null), 2000);
  }, []);

  // ─── Phase transitions ───

  const transitionTo = useCallback((nextPhase: Phase, encourageKey?: keyof typeof ENCOURAGEMENTS) => {
    setVisible(false);
    if (encourageKey) {
      showEncouragement(pickRandom(ENCOURAGEMENTS[encourageKey]), accentColor);
    }
    const timeout = setTimeout(() => {
      setPhase(nextPhase);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [accentColor, showEncouragement]);

  // ─── Load data ───

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getDeepDive(deepDiveId);
        if (cancelled) return;
        setDeepDive(res.deepDive);
        setLinkedMission(res.linkedMission ?? null);
        const dd = res.deepDive;
        if (dd.status === "completed") {
          setFinalPortfolio(dd.portfolioEntry ?? "");
          setPhase("complete");
          requestAnimationFrame(() => setVisible(true));
          return;
        }
        const firstIncomplete = dd.steps.find((s) => s.response === null);
        if (!firstIncomplete) {
          setPhase("portfolio");
          requestAnimationFrame(() => setVisible(true));
          return;
        }
        const stepPhase = STEP_TYPE_TO_PHASE[firstIncomplete.type];
        if (stepPhase && firstIncomplete.stepIndex > 0) {
          setPhase(stepPhase);
        } else {
          setPhase("intro");
        }
        requestAnimationFrame(() => setVisible(true));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "데이터를 불러올 수 없어요");
          setPhase("intro");
          requestAnimationFrame(() => setVisible(true));
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [deepDiveId]);

  // ─── Parsers ───

  const parseQuestions = useCallback((step: DeepDiveStepData): QuestionItem[] => {
    try {
      const parsed = JSON.parse(step.prompt);
      if (Array.isArray(parsed)) {
        return parsed.map((q: Record<string, unknown>, i: number) => ({
          id: (q.id as string) ?? `q${i}`,
          text: (q.prompt as string) ?? (q.text as string) ?? "",
          options: Array.isArray(q.options) ? (q.options as { id: string; label: string }[]) : undefined,
          followUpPrompt: (q.followUpPrompt as string) ?? undefined,
        }));
      }
    } catch { /* fallback */ }
    return [{ id: "q0", text: step.prompt, options: step.options }];
  }, []);

  const parseOpinionData = useCallback((step: DeepDiveStepData): { template: string; scaffolds: string[] } => {
    try {
      const parsed = JSON.parse(step.prompt);
      return { template: parsed.template ?? step.prompt, scaffolds: Array.isArray(parsed.scaffolds) ? parsed.scaffolds : [] };
    } catch {
      return { template: step.prompt, scaffolds: [] };
    }
  }, []);

  const getStep = useCallback((index: number): DeepDiveStepData | undefined => {
    return deepDive?.steps.find((s) => s.stepIndex === index);
  }, [deepDive]);

  // ─── Handlers ───

  const handleCaseRead = async () => {
    if (!deepDive || submitting) return;
    setSubmitting(true);
    try {
      await recordDeepDiveStep(deepDive.id, 0, "read");
      transitionTo("question", "afterCase");
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했어요");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuestionAnswer = (questionId: string, answer: string) => {
    setQuestionAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleQuestionNext = async () => {
    const step = getStep(1);
    if (!step || !deepDive) return;
    const questions = parseQuestions(step);
    const currentQ = questions[currentQuestionIdx];
    if (currentQ.followUpPrompt || !currentQ.options?.length) {
      if (followUpText.trim()) {
        setQuestionAnswers((prev) => ({ ...prev, [currentQ.id]: followUpText.trim() }));
        setFollowUpText("");
      }
    }
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setSubmitting(true);
      try {
        const finalAnswers = { ...questionAnswers };
        if ((currentQ.followUpPrompt || !currentQ.options?.length) && followUpText.trim()) {
          finalAnswers[currentQ.id] = followUpText.trim();
        }
        await recordDeepDiveStep(deepDive.id, 1, JSON.stringify(finalAnswers));
        transitionTo("opinion", "afterQuestion");
      } catch (err) {
        setError(err instanceof Error ? err.message : "저장에 실패했어요");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleOpinionSubmit = async () => {
    if (!deepDive || submitting || !opinionValue.trim() || !opinionReason.trim()) return;
    setSubmitting(true);
    try {
      await recordDeepDiveStep(deepDive.id, 2, JSON.stringify({ value: opinionValue.trim(), reason: opinionReason.trim() }));
      transitionTo("portfolio", "afterOpinion");
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했어요");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (phase !== "portfolio" || !deepDive || portfolioText) return;
    let cancelled = false;
    async function generate() {
      setPortfolioLoading(true);
      try {
        const res = await generatePortfolioSentence(deepDive!.id);
        if (!cancelled) setPortfolioText(res.portfolioSentence);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "문장 생성에 실패했어요");
          setPortfolioText("");
        }
      } finally {
        if (!cancelled) setPortfolioLoading(false);
      }
    }
    generate();
    return () => { cancelled = true; };
  }, [phase, deepDive, portfolioText]);

  const handlePortfolioSave = async () => {
    if (!deepDive || submitting || !portfolioText.trim()) return;
    setSubmitting(true);
    try {
      await completeDeepDiveSession(deepDive.id, portfolioText.trim());
      setFinalPortfolio(portfolioText.trim());
      transitionTo("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했어요");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Shared: animated wrapper ───

  const AnimatedContent = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <div
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );

  // ─── Shared: sticky header ───

  const PhaseHeader = ({ stepIndex, onBack }: { stepIndex: number; onBack?: () => void }) => (
    <header
      className="sticky top-0 z-40 px-4 pt-3 pb-2.5 backdrop-blur-md"
      style={{ backgroundColor: "rgba(250,250,248,0.92)", borderBottom: "1px solid rgba(232,230,225,0.5)" }}
    >
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} className="p-1 -ml-1 tap-highlight">
            <BackArrowIcon size={20} />
          </button>
        )}
        <div className="flex-1">
          <StepProgress steps={stepsMeta} currentIndex={stepIndex} color={accentColor} />
        </div>
      </div>
    </header>
  );

  // ─── Shared: primary CTA button ───

  const PrimaryButton = ({ onClick, disabled, label, loading }: { onClick: () => void; disabled?: boolean; label: string; loading?: boolean }) => (
    <div className="px-5 pb-8 pt-4" style={{ backgroundColor: "rgba(250,250,248,0.95)" }}>
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-[16px] transition-all duration-300 active:scale-[0.97] disabled:opacity-40"
        style={{ backgroundColor: !disabled && !loading ? CORAL : "#C4C3BF", boxShadow: !disabled && !loading ? "0 4px 20px rgba(232,97,77,0.25)" : "none" }}
      >
        {loading ? (
          <div className="w-5 h-5 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: "white", borderRightColor: "rgba(255,255,255,0.4)" }} />
        ) : (
          <>
            <span>{label}</span>
            <ArrowRightIcon size={18} />
          </>
        )}
      </button>
    </div>
  );

  // ═══════════════════════════════════════
  // RENDER PHASES
  // ═══════════════════════════════════════

  if (phase === "loading") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-bg-cream gap-4">
        <div className="animate-breathe"><BookOpenIcon size={48} color={INDIGO} /></div>
        <p className="text-[14px] text-text-muted animate-pulse">탐구 자료를 불러오고 있어...</p>
      </div>
    );
  }

  if (!deepDive || !linkedMission) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-bg-cream px-6">
        <p className="text-[14px] text-text-muted text-center">딥다이브를 찾을 수 없어요.</p>
      </div>
    );
  }

  return (
    <>
      {/* Encouragement toast */}
      {encouragement && <EncouragementToast text={encouragement.text} color={encouragement.color} />}

      {/* Error banner */}
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-[380px] w-[calc(100%-40px)] animate-fade-in-up">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-border-light" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke={CORAL} strokeWidth="1.5" />
              <path d="M9 5.5v4" stroke={CORAL} strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="9" cy="12.5" r="0.75" fill={CORAL} />
            </svg>
            <p className="flex-1 text-[13px] text-text-secondary">{error}</p>
            <button onClick={() => setError(null)} className="text-text-muted">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ─── INTRO ─── */}
      {phase === "intro" && (
        <div className="min-h-dvh flex flex-col bg-bg-cream">
          <header className="px-5 pt-6 pb-3">
            {categoryMeta && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold mb-3" style={{ backgroundColor: categoryMeta.lightBg, color: categoryMeta.color }}>
                <span>{categoryMeta.icon}</span>
                <span>{categoryMeta.label}</span>
              </div>
            )}
            <p className="text-[13px] text-text-muted font-medium mb-0.5">어제의 미션</p>
            <h1 className="text-[20px] font-bold text-navy leading-[1.35] tracking-[-0.02em]">{linkedMission.title}</h1>
          </header>

          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">
            <AnimatedContent>
              <BookOpenIcon size={56} color={accentColor} />
            </AnimatedContent>

            <AnimatedContent delay={150}>
              <div className="text-center space-y-2.5">
                <h2 className="text-[22px] font-bold text-navy tracking-[-0.03em] leading-[1.3]">{deepDive.title}</h2>
                <p className="text-[15px] text-text-secondary leading-[1.7]">
                  어제 경험한 세계와 비슷한<br />현실 이야기를 찾아볼 거야
                </p>
              </div>
            </AnimatedContent>

            <AnimatedContent delay={300}>
              <div className="flex items-center gap-3 text-[13px] text-text-muted">
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="#8A8A9A" strokeWidth="1.2" />
                    <path d="M7 4v3.5l2.5 1.5" stroke="#8A8A9A" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  약 5분
                </span>
                <span className="w-px h-3 bg-border-light" />
                <span>4단계 탐구</span>
              </div>
            </AnimatedContent>

            <AnimatedContent delay={420}>
              <div className="w-full max-w-[260px] space-y-1.5 mt-2">
                {stepsMeta.map((step, i) => (
                  <div key={step.type} className="flex items-center gap-3 py-2 px-3 rounded-xl" style={{ backgroundColor: i === 0 ? `${accentColor}06` : "transparent" }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold flex-shrink-0" style={{ backgroundColor: `${accentColor}12`, color: accentColor }}>
                      {i + 1}
                    </div>
                    <span className="text-[14px] text-text-secondary font-medium">{step.label}</span>
                  </div>
                ))}
              </div>
            </AnimatedContent>
          </div>

          <PrimaryButton onClick={() => transitionTo("case")} label="탐구 시작하기" />
        </div>
      )}

      {/* ─── CASE (Step 0) ─── */}
      {phase === "case" && (() => {
        const rc = deepDive.realWorldCase;
        const step = getStep(0);
        return (
          <div className="min-h-dvh flex flex-col bg-bg-cream">
            <PhaseHeader stepIndex={0} onBack={() => transitionTo("intro")} />
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <AnimatedContent>
                {/* Bridge text */}
                <div className="flex items-start gap-2.5 mb-5">
                  <GlobeNewsIcon size={18} color={accentColor} />
                  <p className="text-[14px] text-text-muted leading-[1.7] flex-1">
                    {step && step.prompt.length < 300 ? step.prompt : "실제 세상에서 일어난 비슷한 이야기를 읽어보자."}
                  </p>
                </div>
              </AnimatedContent>

              <AnimatedContent delay={200}>
                <div className="rounded-2xl bg-white border border-border-light overflow-hidden" style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.04)" }}>
                  <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}60)` }} />
                  <div className="px-5 py-5">
                    <h3 className="text-[18px] font-bold text-navy leading-[1.45] tracking-[-0.02em] mb-4">{rc.headline}</h3>
                    <div className="space-y-3 mb-5">
                      {rc.context.split(/\n\n|\. /).filter(Boolean).map((para, i) => (
                        <p key={i} className="text-[15px] text-text-secondary leading-[1.85] tracking-[-0.01em]">
                          {para.endsWith(".") ? para : `${para}.`}
                        </p>
                      ))}
                    </div>

                    {/* Key question — highlighted */}
                    <div className="rounded-xl p-4 flex gap-3" style={{ backgroundColor: `${accentColor}06`, border: `1px solid ${accentColor}12` }}>
                      <QuoteIcon size={16} color={accentColor} />
                      <p className="text-[15px] font-medium leading-[1.7] flex-1" style={{ color: NAVY }}>
                        {rc.keyQuestion}
                      </p>
                    </div>

                    {rc.source && <p className="text-[11px] text-text-muted mt-3 text-right">출처: {rc.source}</p>}
                  </div>
                </div>
              </AnimatedContent>
            </div>
            <PrimaryButton onClick={handleCaseRead} disabled={submitting} loading={submitting} label="다 읽었어" />
          </div>
        );
      })()}

      {/* ─── QUESTION (Step 1) ─── */}
      {phase === "question" && (() => {
        const step = getStep(1);
        if (!step) return null;
        const questions = parseQuestions(step);
        const currentQ = questions[currentQuestionIdx];
        const isFollowUp = !!currentQ?.followUpPrompt || (currentQ && !currentQ.options?.length);
        const currentAnswer = questionAnswers[currentQ?.id ?? ""];
        const canProceed = isFollowUp ? followUpText.trim().length > 0 || (currentAnswer?.length ?? 0) > 0 : !!currentAnswer;

        return (
          <div className="min-h-dvh flex flex-col bg-bg-cream">
            <PhaseHeader stepIndex={1} onBack={() => transitionTo("case")} />
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <AnimatedContent>
                {/* Sub-progress */}
                <div className="flex items-center gap-2 mb-6">
                  {questions.map((_, qi) => (
                    <div
                      key={qi}
                      className="h-1.5 flex-1 rounded-full transition-all duration-500"
                      style={{ backgroundColor: qi < currentQuestionIdx ? accentColor : qi === currentQuestionIdx ? `${accentColor}50` : "#E8E6E1" }}
                    />
                  ))}
                  <span className="text-[12px] text-text-muted font-medium ml-1">{currentQuestionIdx + 1}/{questions.length}</span>
                </div>

                {currentQ && (
                  <div>
                    <p className="text-[18px] font-bold text-navy leading-[1.5] tracking-[-0.02em] mb-6">{currentQ.text}</p>

                    {!isFollowUp && currentQ.options && currentQ.options.length > 0 ? (
                      <div className="space-y-3">
                        {currentQ.options.map((opt, oi) => {
                          const isSelected = currentAnswer === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleQuestionAnswer(currentQ.id, opt.id)}
                              className="w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-300 active:scale-[0.98]"
                              style={{
                                backgroundColor: isSelected ? `${INDIGO}08` : "white",
                                borderColor: isSelected ? INDIGO : "#E8E6E1",
                                boxShadow: isSelected ? `0 0 0 1px ${INDIGO}15, 0 4px 16px ${INDIGO}10` : "0 1px 6px rgba(0,0,0,0.03)",
                                animationDelay: `${oi * 60}ms`,
                              }}
                            >
                              <div className="flex items-center gap-3">
                                {/* Radio circle */}
                                <div
                                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300"
                                  style={{ borderColor: isSelected ? INDIGO : "#D1D0CB" }}
                                >
                                  {isSelected && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: INDIGO }} />}
                                </div>
                                <span className={`text-[15px] leading-[1.6] ${isSelected ? "font-semibold text-navy" : "text-text-secondary"}`}>
                                  {opt.label}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div>
                        {currentQ.followUpPrompt && <p className="text-[13px] text-text-muted mb-3">{currentQ.followUpPrompt}</p>}
                        <textarea
                          value={followUpText}
                          onChange={(e) => setFollowUpText(e.target.value)}
                          placeholder="여기에 자유롭게 적어봐..."
                          className="w-full px-4 py-4 rounded-2xl border-2 border-border-light bg-white text-[15px] text-navy leading-[1.7] placeholder:text-text-muted/40 focus:outline-none resize-none transition-all duration-200"
                          style={{ borderColor: followUpText ? `${INDIGO}40` : undefined, boxShadow: followUpText ? `0 0 0 1px ${INDIGO}15` : undefined }}
                          rows={4}
                        />
                        <p className="text-[11px] text-text-muted mt-1.5 text-right">{followUpText.length}자</p>
                      </div>
                    )}
                  </div>
                )}
              </AnimatedContent>
            </div>
            <PrimaryButton
              onClick={handleQuestionNext}
              disabled={!canProceed || submitting}
              loading={submitting}
              label={currentQuestionIdx < questions.length - 1 ? "다음 질문" : "다음으로"}
            />
          </div>
        );
      })()}

      {/* ─── OPINION (Step 2) ─── */}
      {phase === "opinion" && (() => {
        const step = getStep(2);
        const opinionData = step ? parseOpinionData(step) : { template: "", scaffolds: [] };
        const scaffolds = opinionData.scaffolds;
        const canSubmit = opinionValue.trim().length > 0 && opinionReason.trim().length > 0;

        return (
          <div className="min-h-dvh flex flex-col bg-bg-cream">
            <PhaseHeader stepIndex={2} onBack={() => transitionTo("question")} />
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <AnimatedContent>
                <div className="flex items-center gap-2 mb-5">
                  <LightbulbIcon size={20} color={accentColor} />
                  <p className="text-[14px] text-text-muted font-medium">네 생각을 정리해보자</p>
                </div>

                {/* Template display */}
                <div className="rounded-2xl bg-white border border-border-light px-5 py-5 mb-5" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.03)" }}>
                  <p className="text-[16px] text-navy leading-[1.8] mb-6 font-medium">
                    이 상황에서 가장 중요한 건{" "}
                    <span className="inline-block min-w-[60px] border-b-2 border-dashed mx-0.5" style={{ borderColor: `${accentColor}40`, color: accentColor }}>
                      {opinionValue || <span className="text-text-muted/30">___</span>}
                    </span>
                    {" "}라고 생각해.
                    <br />
                    왜냐하면{" "}
                    <span className="inline-block min-w-[80px] border-b-2 border-dashed mx-0.5" style={{ borderColor: `${accentColor}40`, color: accentColor }}>
                      {opinionReason || <span className="text-text-muted/30">___</span>}
                    </span>
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-text-muted tracking-[0.04em] mb-2">가장 중요한 건...</label>
                      <input
                        type="text"
                        value={opinionValue}
                        onChange={(e) => setOpinionValue(e.target.value)}
                        maxLength={30}
                        placeholder="예: 모든 사람의 안전"
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-border-light bg-bg-cream/30 text-[15px] text-navy placeholder:text-text-muted/35 focus:outline-none transition-all duration-200"
                        style={{ borderColor: opinionValue ? `${accentColor}35` : undefined, boxShadow: opinionValue ? `0 0 0 1px ${accentColor}10` : undefined }}
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-text-muted tracking-[0.04em] mb-2">왜냐하면...</label>
                      <textarea
                        value={opinionReason}
                        onChange={(e) => setOpinionReason(e.target.value)}
                        maxLength={150}
                        placeholder="예: 한 사람이라도 다치면 좋은 결정이 아니니까"
                        className="w-full px-4 py-3.5 rounded-xl border-2 border-border-light bg-bg-cream/30 text-[15px] text-navy leading-[1.7] placeholder:text-text-muted/35 focus:outline-none resize-none transition-all duration-200"
                        style={{ borderColor: opinionReason ? `${accentColor}35` : undefined, boxShadow: opinionReason ? `0 0 0 1px ${accentColor}10` : undefined }}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Tappable scaffolds */}
                {scaffolds.length > 0 && (
                  <div className="rounded-xl p-4" style={{ backgroundColor: `${accentColor}05`, border: `1px solid ${accentColor}10` }}>
                    <p className="text-[12px] font-semibold text-text-muted mb-2.5">
                      힌트가 필요하면 눌러봐
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {scaffolds.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => { if (!opinionValue) setOpinionValue(s); }}
                          className="text-[13px] px-3 py-1.5 rounded-lg border transition-all duration-200 active:scale-[0.96]"
                          style={{
                            borderColor: `${accentColor}20`,
                            color: accentColor,
                            backgroundColor: opinionValue === s ? `${accentColor}10` : "white",
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </AnimatedContent>
            </div>
            <PrimaryButton onClick={handleOpinionSubmit} disabled={!canSubmit || submitting} loading={submitting} label="다음으로" />
          </div>
        );
      })()}

      {/* ─── PORTFOLIO (Step 3) ─── */}
      {phase === "portfolio" && (
        <div className="min-h-dvh flex flex-col bg-bg-cream">
          <PhaseHeader stepIndex={3} />
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <AnimatedContent>
              <div className="flex items-center gap-2.5 mb-5">
                <DocumentStarIcon size={24} color={GOLD} />
                <p className="text-[14px] text-text-muted font-medium">오늘의 기록 만들기</p>
              </div>

              <p className="text-[15px] text-text-secondary leading-[1.7] mb-5">
                네 생각을 한 문장으로 정리해봤어.<br />마음에 들면 그대로, 고치고 싶으면 수정해도 돼.
              </p>

              {portfolioLoading ? (
                <div className="rounded-2xl bg-white border border-border-light px-5 py-10 flex flex-col items-center gap-4" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
                  <div className="animate-breathe"><DocumentStarIcon size={32} color={GOLD} /></div>
                  <p className="text-[14px] text-text-muted animate-pulse">네 생각을 정리하고 있어...</p>
                </div>
              ) : (
                <div className="rounded-2xl bg-white border border-border-light overflow-hidden" style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.04)" }}>
                  <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD}60)` }} />
                  <div className="px-5 py-5">
                    <textarea
                      value={portfolioText}
                      onChange={(e) => setPortfolioText(e.target.value)}
                      className="w-full text-[16px] text-navy leading-[1.85] tracking-[-0.01em] font-medium bg-transparent focus:outline-none resize-none"
                      rows={4}
                      placeholder="포트폴리오 문장이 여기에 표시돼요..."
                    />
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-light/60">
                      <span className="text-[11px] text-text-muted">자유롭게 수정할 수 있어</span>
                      <span className="text-[11px] text-text-muted">{portfolioText.length}자</span>
                    </div>
                  </div>
                </div>
              )}
            </AnimatedContent>
          </div>
          <div className="px-5 pb-8 pt-4" style={{ backgroundColor: "rgba(250,250,248,0.95)" }}>
            <button
              onClick={handlePortfolioSave}
              disabled={!portfolioText.trim() || submitting || portfolioLoading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-[16px] transition-all duration-300 active:scale-[0.97] disabled:opacity-40"
              style={{ backgroundColor: portfolioText.trim() && !portfolioLoading ? CORAL : "#C4C3BF", boxShadow: portfolioText.trim() && !portfolioLoading ? "0 4px 20px rgba(232,97,77,0.25)" : "none" }}
            >
              {submitting ? (
                <div className="w-5 h-5 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: "white", borderRightColor: "rgba(255,255,255,0.4)" }} />
              ) : (
                <span>이대로 저장할게</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ─── COMPLETE ─── */}
      {phase === "complete" && (
        <div className="min-h-dvh flex flex-col items-center justify-center bg-bg-cream px-6">
          <div className="flex flex-col items-center gap-6 text-center transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? "scale(1)" : "scale(0.92)" }}>
            <div className="animate-scale-in">
              <CheckBurstIcon size={72} color={SAGE} />
            </div>

            <div className="space-y-2">
              <h1 className="text-[26px] font-bold text-navy tracking-[-0.03em]">오늘의 탐구 완료!</h1>
              <p className="text-[15px] text-text-secondary">훌륭해, 또 하나의 기록이 쌓였어</p>
            </div>

            {finalPortfolio && (
              <div className="w-full rounded-2xl bg-white border border-border-light px-5 py-5 animate-fade-in-up" style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.04)", animationDelay: "200ms", animationFillMode: "backwards" }}>
                <div className="flex items-center gap-2 mb-3">
                  <DocumentStarIcon size={18} color={GOLD} />
                  <span className="text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: GOLD }}>오늘의 기록</span>
                </div>
                <p className="text-[15px] text-navy leading-[1.85] tracking-[-0.01em] font-medium">{finalPortfolio}</p>
              </div>
            )}

            <button
              onClick={() => router.push("/home")}
              className="w-full max-w-[280px] flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-[16px] transition-all duration-300 active:scale-[0.97] animate-fade-in-up"
              style={{ backgroundColor: CORAL, boxShadow: "0 4px 20px rgba(232,97,77,0.25)", animationDelay: "400ms", animationFillMode: "backwards" }}
            >
              <span>홈으로 돌아가기</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
