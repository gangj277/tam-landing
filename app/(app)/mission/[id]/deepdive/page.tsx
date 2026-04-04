"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  getDeepDive,
  createDeepDive,
  streamDeepDiveChat,
  submitDeepDivePortfolio,
  type DeepDiveData,
  type AgentStateData,
} from "@/lib/api-client";

// ═══════════════════════════════════════════════════
// Design tokens — "Warm Observatory"
// ═══════════════════════════════════════════════════

const BG = "#F7F5F0";
const BG_CHAT = "#F2EFE9";
const NAVY = "#1A1A2E";
const INDIGO = "#4A5FC1";
const CORAL = "#E8614D";
const GOLD = "#D4A853";
const SAGE = "#6B8F71";
const EXPERT_BUBBLE_BG = "rgba(255,255,255,0.82)";
const EXPERT_BUBBLE_BORDER = "rgba(74,95,193,0.08)";

// ═══════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════

function ExpertAvatar({ name, color, size = 36 }: { name: string; color: string; size?: number }) {
  const fontSize = size < 32 ? 11 : 14;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {/* Outer glow ring — pulses */}
      <div
        className="absolute inset-[-3px] rounded-full"
        style={{
          background: `conic-gradient(from 120deg, ${color}30, ${color}08, ${color}25, ${color}05, ${color}30)`,
          animation: "avatarSpin 8s linear infinite",
        }}
      />
      {/* Inner circle */}
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(145deg, ${color}18, ${color}06)`,
          border: `1.5px solid ${color}22`,
          backdropFilter: "blur(4px)",
        }}
      >
        <span className="font-bold" style={{ color, fontSize }}>{name[0]}</span>
      </div>
      {/* Online indicator */}
      <div
        className="absolute -bottom-0.5 -right-0.5 rounded-full border-2"
        style={{
          width: size < 32 ? 8 : 10,
          height: size < 32 ? 8 : 10,
          backgroundColor: SAGE,
          borderColor: BG,
          boxShadow: `0 0 6px ${SAGE}60`,
        }}
      />
    </div>
  );
}

function TypingIndicator({ color }: { color: string }) {
  return (
    <div className="flex items-end gap-2.5 msg-enter">
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 opacity-40"
        style={{ background: `${color}12` }}>
        <span className="text-[10px] font-bold" style={{ color }}>...</span>
      </div>
      <div className="px-4 py-3.5 rounded-2xl rounded-bl-sm"
        style={{
          background: EXPERT_BUBBLE_BG,
          backdropFilter: "blur(12px)",
          border: `1px solid ${EXPERT_BUBBLE_BORDER}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
        }}>
        <div className="flex gap-[6px] items-center h-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-[5px] h-[5px] rounded-full"
              style={{
                backgroundColor: `${color}55`,
                animation: `typingBounce 1.4s ease-in-out infinite`,
                animationDelay: `${i * 180}ms`,
              }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ExpertBubble({ text, isStreaming, color }: { text: string; isStreaming?: boolean; color: string }) {
  return (
    <div
      className="max-w-[82%] px-4 py-3 rounded-2xl rounded-bl-sm text-[14px] leading-[1.8] tracking-[-0.01em]"
      style={{
        background: EXPERT_BUBBLE_BG,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${EXPERT_BUBBLE_BORDER}`,
        color: NAVY,
        boxShadow: "0 2px 16px rgba(0,0,0,0.025), 0 0 0 0.5px rgba(255,255,255,0.5) inset",
      }}
    >
      {!text && isStreaming ? (
        <div className="flex gap-[6px] items-center h-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-[5px] h-[5px] rounded-full"
              style={{
                backgroundColor: `${color}55`,
                animation: `typingBounce 1.4s ease-in-out infinite`,
                animationDelay: `${i * 180}ms`,
              }} />
          ))}
        </div>
      ) : (
        text.split("\n").map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {line}
          </span>
        ))
      )}
      {isStreaming && text && (
        <span
          className="inline-block w-[2px] h-[15px] ml-0.5 align-text-bottom rounded-full"
          style={{ backgroundColor: `${color}70`, animation: "cursorBlink 0.9s step-end infinite" }}
        />
      )}
    </div>
  );
}

function ChildBubble({ text }: { text: string }) {
  return (
    <div
      className="max-w-[78%] px-4 py-3 rounded-2xl rounded-br-sm text-[14px] leading-[1.75] tracking-[-0.01em] text-white"
      style={{
        background: `linear-gradient(140deg, ${INDIGO}, #5B6FD4)`,
        boxShadow: `0 3px 14px ${INDIGO}22, 0 0 0 0.5px ${INDIGO}40 inset`,
      }}
    >
      {text}
    </div>
  );
}

function TurnDivider({ turn }: { turn: number }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${INDIGO}12, transparent)` }} />
      <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full"
        style={{ color: `${INDIGO}50`, background: `${INDIGO}06` }}>
        {turn}번째 대화
      </span>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${INDIGO}12, transparent)` }} />
    </div>
  );
}

function TextInputBar({
  value,
  onChange,
  onSubmit,
  disabled,
  scaffolds,
  onScaffoldClick,
  color,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  scaffolds: string[];
  onScaffoldClick: (s: string) => void;
  color: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [value]);

  return (
    <div
      className="flex-shrink-0 z-30 px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
      style={{
        background: `linear-gradient(to top, ${BG}f8, ${BG}e8)`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid rgba(232,230,225,0.5)`,
      }}
    >
      {/* Scaffold chips */}
      {scaffolds.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {scaffolds.map((s) => (
            <button
              key={s}
              onClick={() => onScaffoldClick(s)}
              className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 active:scale-[0.94]"
              style={{
                background: `linear-gradient(135deg, ${color}0a, ${color}04)`,
                color,
                border: `1px solid ${color}18`,
                boxShadow: `0 1px 4px ${color}08`,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2.5 items-end">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!disabled && value.trim()) onSubmit();
            }
          }}
          placeholder="네 생각을 자유롭게 적어봐..."
          disabled={disabled}
          className="flex-1 px-4 py-2.5 rounded-2xl text-[14px] leading-[1.6] resize-none focus:outline-none transition-all duration-300 disabled:opacity-40"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            border: `1.5px solid ${value ? `${color}35` : "rgba(232,230,225,0.7)"}`,
            color: NAVY,
            boxShadow: value
              ? `0 0 0 3px ${color}08, 0 2px 8px rgba(0,0,0,0.03)`
              : "0 1px 4px rgba(0,0,0,0.02)",
            minHeight: "44px",
            maxHeight: "120px",
          }}
          rows={1}
        />
        <button
          onClick={onSubmit}
          disabled={!value.trim() || disabled}
          className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 disabled:opacity-25"
          style={{
            background: value.trim() && !disabled
              ? `linear-gradient(140deg, ${color}, #5B6FD4)`
              : "#D8D6D0",
            boxShadow: value.trim() && !disabled
              ? `0 3px 14px ${color}30`
              : "none",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 9h12M11 5l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function PortfolioCard({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="animate-slide-up">
      <div className="rounded-2xl overflow-hidden"
        style={{
          border: `1.5px solid ${GOLD}28`,
          boxShadow: `0 4px 24px ${GOLD}10, 0 0 0 0.5px ${GOLD}15 inset`,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
        }}>
        {/* Golden shimmer bar */}
        <div className="h-1 animate-shimmer"
          style={{ background: `linear-gradient(90deg, ${GOLD}30, ${GOLD}90, ${GOLD}30)`, backgroundSize: "200% 100%" }} />
        <div className="px-5 py-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `${GOLD}12` }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M8 1l2 4.5h4.5L10.5 8.5l1.5 4.5L8 10.5 4 13l1.5-4.5L1.5 5.5H6L8 1z" fill={GOLD} fillOpacity="0.4" stroke={GOLD} strokeWidth="0.8" />
              </svg>
            </div>
            <span className="text-[13px] font-bold tracking-wide" style={{ color: GOLD }}>
              나의 포트폴리오
            </span>
          </div>
          <p className="text-[13px] leading-[1.7] mb-4" style={{ color: "#8A8A9A" }}>
            오늘 대화에서 가장 기억에 남는 걸 한 줄로 적어봐!
          </p>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="오늘의 발견을 한 줄로..."
            className="w-full text-[15px] leading-[1.8] font-medium bg-transparent focus:outline-none resize-none"
            style={{ color: NAVY }}
            rows={3}
          />
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${GOLD}12` }}>
            <span className="text-[11px]" style={{ color: `${GOLD}80` }}>언제든 수정 가능</span>
            <span className="text-[11px] font-medium" style={{ color: `${GOLD}90` }}>{value.length}자</span>
          </div>
        </div>
      </div>
      <button
        onClick={onSubmit}
        disabled={!value.trim()}
        className="w-full mt-3 py-3.5 rounded-2xl text-[15px] font-bold text-white transition-all duration-300 active:scale-[0.97] disabled:opacity-35"
        style={{
          background: value.trim() ? `linear-gradient(140deg, ${CORAL}, #D45040)` : "#C4C3BF",
          boxShadow: value.trim() ? `0 4px 20px ${CORAL}28` : "none",
        }}
      >
        저장하기
      </button>
    </div>
  );
}

function CompletionBanner({
  expertName,
  expertRole,
  portfolioText,
  insightCount,
  onGoHome,
}: {
  expertName: string;
  expertRole: string;
  portfolioText: string;
  insightCount: number;
  onGoHome: () => void;
}) {
  return (
    <div className="pb-4 animate-fade-in-up" style={{ animationDuration: "0.6s" }}>
      <div className="rounded-2xl overflow-hidden"
        style={{
          border: `1.5px solid ${SAGE}20`,
          boxShadow: `0 6px 32px ${SAGE}10`,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
        }}>
        <div className="h-1.5 animate-shimmer"
          style={{ background: `linear-gradient(90deg, ${SAGE}50, ${SAGE}, ${SAGE}50)`, backgroundSize: "200% 100%" }} />
        <div className="px-5 py-6 text-center">
          {/* Celebration icon */}
          <div className="mx-auto mb-4 relative w-16 h-16">
            <div className="absolute inset-0 rounded-full" style={{ background: `${SAGE}08`, animation: "celebratePulse 2s ease-in-out infinite" }} />
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="relative">
              <circle cx="32" cy="32" r="26" fill={`${SAGE}10`} stroke={SAGE} strokeWidth="1.5" />
              <path d="M20 32l8 8 16-16" stroke={SAGE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* Floating particles */}
            <div className="absolute top-0 left-0 w-2 h-2 rounded-full" style={{ background: GOLD, opacity: 0.6, animation: "floatParticle 3s ease-in-out infinite" }} />
            <div className="absolute top-2 right-0 w-1.5 h-1.5 rounded-full" style={{ background: CORAL, opacity: 0.5, animation: "floatParticle 3s ease-in-out infinite 0.5s" }} />
            <div className="absolute bottom-0 right-2 w-2 h-2 rounded-full" style={{ background: INDIGO, opacity: 0.4, animation: "floatParticle 3s ease-in-out infinite 1s" }} />
          </div>

          <h3 className="text-[19px] font-bold mb-1" style={{ color: NAVY }}>대화 완료!</h3>
          <p className="text-[13px] mb-5" style={{ color: "#8A8A9A" }}>{expertName} ({expertRole})과의 대화</p>

          {insightCount > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
              style={{ background: `${INDIGO}06`, border: `1px solid ${INDIGO}12` }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.8 2.8l1.4 1.4M9.8 9.8l1.4 1.4M11.2 2.8l-1.4 1.4M4.2 9.8l-1.4 1.4" stroke={INDIGO} strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span className="text-[12px] font-bold" style={{ color: INDIGO }}>{insightCount}개의 인사이트 발견</span>
            </div>
          )}

          {portfolioText && (
            <div className="rounded-xl px-4 py-3.5 mb-5 text-left"
              style={{ background: `${GOLD}06`, border: `1px solid ${GOLD}12` }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: GOLD }}>나의 기록</p>
              <p className="text-[14px] leading-[1.8] font-medium" style={{ color: NAVY }}>&ldquo;{portfolioText}&rdquo;</p>
            </div>
          )}

          <button onClick={onGoHome}
            className="w-full py-3.5 rounded-2xl text-[15px] font-bold text-white transition-all duration-300 active:scale-[0.97]"
            style={{
              background: `linear-gradient(140deg, ${CORAL}, #D45040)`,
              boxShadow: `0 4px 20px ${CORAL}25`,
            }}>
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

function DepthBar({ turnCount }: { turnCount: number }) {
  const pct = Math.min((turnCount / 12) * 100, 100);
  const label = turnCount <= 3 ? "시작" : turnCount <= 7 ? "깊어지는 중" : turnCount <= 10 ? "거의 다 왔어" : "마무리";

  return (
    <div className="px-4 py-2 flex items-center gap-3">
      <div className="flex-1 h-[5px] rounded-full overflow-hidden" style={{ background: `${INDIGO}08` }}>
        <div
          className="h-full rounded-full relative"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${INDIGO}60, ${INDIGO})`,
            transition: "width 600ms cubic-bezier(0.22, 1, 0.36, 1)",
            boxShadow: `0 0 8px ${INDIGO}30`,
          }}
        >
          {/* Glow tip */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{ background: "white", boxShadow: `0 0 6px ${INDIGO}80`, animation: "depthGlow 2s ease-in-out infinite" }} />
        </div>
      </div>
      <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: `${INDIGO}70` }}>
        {label}
      </span>
    </div>
  );
}

function ChatStyles() {
  return (
    <style>{`
      @keyframes typingBounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-5px); }
      }
      @keyframes cursorBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes msgEnter {
        from { opacity: 0; transform: translateY(14px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(28px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes avatarSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes depthGlow {
        0%, 100% { opacity: 0.6; transform: translateY(-50%) scale(1); }
        50% { opacity: 1; transform: translateY(-50%) scale(1.4); }
      }
      @keyframes celebratePulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.15); opacity: 0.6; }
      }
      @keyframes floatParticle {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-8px) scale(1.2); }
      }
      @keyframes ambientDrift {
        0% { transform: translate(0, 0); }
        33% { transform: translate(12px, -8px); }
        66% { transform: translate(-6px, 6px); }
        100% { transform: translate(0, 0); }
      }
      .msg-enter {
        animation: msgEnter 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      .animate-slide-up {
        animation: slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      /* hide scrollbar but keep scrolling */
      .chat-scroll::-webkit-scrollbar { display: none; }
      .chat-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  );
}

const FIRST_RESPONSE_SCAFFOLDS = ["와 진짜요?", "어떤 일을 하세요?", "재밌겠다!"];

// ═══════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════

type Phase = "loading" | "chatting" | "portfolio" | "complete";

interface ChatMessage {
  id: string;
  role: "expert" | "child";
  text: string;
  isStreaming?: boolean;
}

export default function MissionDeepDivePage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const deepDiveId = searchParams.get("dd");
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("loading");
  const [deepDive, setDeepDive] = useState<DeepDiveData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [agentState, setAgentState] = useState<AgentStateData | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [portfolioText, setPortfolioText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const hasTriggeredFirstStream = useRef(false);
  const accentColor = INDIGO;

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  // ─── Load data ───
  // Supports two entry modes:
  // 1. ?dd=xxx — load existing deep dive directly
  // 2. ?session=xxx — create or resume a deep dive for this mission+session
  const sessionParam = searchParams.get("session");

  useEffect(() => {
    if (!deepDiveId && !sessionParam) {
      setError("딥다이브 ID가 없어요");
      return;
    }
    (async () => {
      try {
        let ddId = deepDiveId;

        // If coming via session param, create/resume deep dive first
        if (!ddId && sessionParam) {
          const result = await createDeepDive(id, sessionParam);
          ddId = result.deepDiveId;
        }

        if (!ddId) {
          setError("딥다이브를 시작할 수 없어요");
          return;
        }

        const dd = await getDeepDive(ddId);
        if (!dd) {
          setError("대화를 불러올 수 없어요");
          return;
        }
        setDeepDive(dd);
        setAgentState(dd.agentState);

        const msgs: ChatMessage[] = dd.messages.map((m) => ({
          id: m.id,
          role: m.role,
          text: m.content,
        }));
        setMessages(msgs);

        if (dd.status === "completed") {
          setPortfolioText(dd.portfolioEntry ?? "");
          setPhase("complete");
          return;
        }

        if (dd.agentState.portfolioRequested && !dd.portfolioEntry) {
          setPhase("portfolio");
          return;
        }

        setPhase("chatting");
      } catch (err) {
        setError(err instanceof Error ? err.message : "불러올 수 없어요");
      }
    })();
  }, [deepDiveId, sessionParam, id]);

  // ─── Auto-trigger first expert message ───
  useEffect(() => {
    if (
      phase !== "chatting" ||
      !deepDive ||
      isStreaming ||
      hasTriggeredFirstStream.current ||
      messages.length > 0
    ) return;

    hasTriggeredFirstStream.current = true;
    streamExpertResponse(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, deepDive, messages.length]);

  // ─── Auto-scroll ───
  useEffect(() => {
    scrollToBottom();
  }, [messages, showTyping, scrollToBottom]);

  // ─── Stream expert message ───
  const streamExpertResponse = useCallback(async (childMessage: string | null) => {
    if (!deepDive || isStreaming) return;
    setIsStreaming(true);
    setShowTyping(true);

    await new Promise((r) => setTimeout(r, 800));
    setShowTyping(false);

    const msgId = `expert-${Date.now()}`;
    setMessages((prev) => [...prev, { id: msgId, role: "expert", text: "", isStreaming: true }]);

    await streamDeepDiveChat(
      deepDive.id,
      childMessage,
      (text) => {
        setMessages((prev) =>
          prev.map((m) => m.id === msgId ? { ...m, text } : m),
        );
      },
      (data) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, text: data.message, isStreaming: false } : m,
          ),
        );
        setAgentState(data.agentState);
        setIsStreaming(false);

        if (data.isEnding) {
          setTimeout(() => {
            setPhase("portfolio");
          }, 1200);
        }
      },
      (err) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, text: "메시지를 불러올 수 없었어요...", isStreaming: false } : m,
          ),
        );
        setIsStreaming(false);
        setError(err.message);
      },
    );
  }, [deepDive, isStreaming]);

  const handleTextSubmit = useCallback(() => {
    if (!deepDive || !textInput.trim() || isStreaming) return;
    const text = textInput.trim();
    setTextInput("");

    const childMsgId = `child-${Date.now()}`;
    setMessages((prev) => [...prev, { id: childMsgId, role: "child", text }]);
    streamExpertResponse(text);
  }, [deepDive, textInput, isStreaming, streamExpertResponse]);

  const handleScaffoldClick = useCallback((scaffold: string) => {
    setTextInput(scaffold);
  }, []);

  const handlePortfolioSubmit = useCallback(async () => {
    if (!deepDive || !portfolioText.trim()) return;
    try {
      await submitDeepDivePortfolio(deepDive.id, portfolioText.trim());
    } catch {
      // Allow completion even if save fails
    }
    setPhase("complete");
  }, [deepDive, portfolioText]);

  const expertMessages = messages.filter((m) => m.role === "expert");
  const childMessages = messages.filter((m) => m.role === "child");
  const showScaffolds =
    phase === "chatting" &&
    expertMessages.length === 1 &&
    !expertMessages[0]?.isStreaming &&
    childMessages.length === 0;

  // Calculate turn numbers for dividers
  const turnNumber = Math.ceil(messages.filter((m) => m.role === "expert").length);

  // ─── Loading ───
  if (phase === "loading") {
    return (
      <div className="h-dvh flex flex-col items-center justify-center overflow-hidden" style={{ background: BG }}>
        <ChatStyles />
        {error ? (
          <div className="text-center px-6">
            <p className="text-[14px] mb-3" style={{ color: CORAL }}>{error}</p>
            <button onClick={() => router.push("/home")} className="text-[14px] font-semibold" style={{ color: INDIGO }}>
              홈으로
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            {/* Animated loading orb */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, ${INDIGO}40, transparent, ${INDIGO}40)`,
                  animation: "avatarSpin 1.5s linear infinite",
                }} />
              <div className="absolute inset-[3px] rounded-full flex items-center justify-center"
                style={{ background: BG }}>
                <div className="w-3 h-3 rounded-full" style={{ background: INDIGO, opacity: 0.6, animation: "depthGlow 1.5s ease-in-out infinite" }} />
              </div>
            </div>
            <p className="text-[14px] font-medium" style={{ color: "#8A8A9A" }}>전문가와 연결하고 있어...</p>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // MAIN LAYOUT — fixed shell, only chat area scrolls
  // ═══════════════════════════════════════════════════

  return (
    <div className="h-dvh flex flex-col overflow-hidden" style={{ background: BG }}>
      <ChatStyles />

      {/* Ambient background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[200px] h-[200px] rounded-full opacity-[0.04]"
          style={{ background: `radial-gradient(circle, ${INDIGO}, transparent)`, top: "10%", right: "-5%", animation: "ambientDrift 20s ease-in-out infinite" }} />
        <div className="absolute w-[160px] h-[160px] rounded-full opacity-[0.03]"
          style={{ background: `radial-gradient(circle, ${CORAL}, transparent)`, bottom: "20%", left: "-8%", animation: "ambientDrift 25s ease-in-out infinite 5s" }} />
        <div className="absolute w-[120px] h-[120px] rounded-full opacity-[0.03]"
          style={{ background: `radial-gradient(circle, ${GOLD}, transparent)`, top: "50%", right: "10%", animation: "ambientDrift 18s ease-in-out infinite 8s" }} />
      </div>

      {/* ─── FIXED HEADER ─── */}
      <header className="flex-shrink-0 z-20 relative"
        style={{
          background: `linear-gradient(to bottom, ${BG}f8, ${BG}e0)`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(232,230,225,0.4)",
        }}>
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/home")} className="p-1.5 -ml-1 rounded-xl transition-colors active:bg-black/5">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 4l-6 6 6 6" stroke="#8A8A9A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {deepDive && (
              <>
                <ExpertAvatar name={deepDive.expert.name} color={accentColor} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold truncate" style={{ color: NAVY }}>
                    {deepDive.expert.name}
                  </p>
                  <p className="text-[11px] truncate" style={{ color: "#9A9AAA" }}>
                    {deepDive.expert.role} · {deepDive.expert.organization}
                  </p>
                </div>

                {/* Turn counter badge */}
                <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{ background: `${INDIGO}08`, border: `1px solid ${INDIGO}10` }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: INDIGO, opacity: 0.5 }} />
                  <span className="text-[10px] font-semibold" style={{ color: `${INDIGO}80` }}>
                    {agentState?.turnCount ?? 0}/12
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        <DepthBar turnCount={agentState?.turnCount ?? 0} />
      </header>

      {/* ─── SCROLLABLE CHAT AREA ─── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll relative z-10"
        style={{ background: BG_CHAT }}>
        {/* Subtle top gradient fade */}
        <div className="sticky top-0 h-4 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, ${BG_CHAT}, transparent)` }} />

        <div className="max-w-lg mx-auto px-4 pb-5 space-y-3">
          {messages.map((msg, i) => {
            // Show turn divider before every expert message after the first pair
            const showDivider = msg.role === "expert" && i > 1;
            const expertIdx = messages.slice(0, i + 1).filter(m => m.role === "expert").length;

            return (
              <div key={msg.id}>
                {showDivider && <TurnDivider turn={expertIdx} />}
                <div className={`flex ${msg.role === "child" ? "justify-end" : "items-end gap-2.5"} msg-enter`}>
                  {msg.role === "expert" && deepDive && (
                    <ExpertAvatar name={deepDive.expert.name} color={accentColor} size={28} />
                  )}
                  {msg.role === "expert" ? (
                    <ExpertBubble text={msg.text} isStreaming={msg.isStreaming} color={accentColor} />
                  ) : (
                    <ChildBubble text={msg.text} />
                  )}
                </div>
              </div>
            );
          })}

          {showTyping && <TypingIndicator color={accentColor} />}

          {phase === "portfolio" && (
            <PortfolioCard
              value={portfolioText}
              onChange={setPortfolioText}
              onSubmit={handlePortfolioSubmit}
            />
          )}

          {phase === "complete" && deepDive && (
            <CompletionBanner
              expertName={deepDive.expert.name}
              expertRole={deepDive.expert.role}
              portfolioText={portfolioText || deepDive.portfolioEntry || ""}
              insightCount={agentState?.insightCount ?? 0}
              onGoHome={() => router.push("/home")}
            />
          )}
        </div>

        {/* Bottom padding for breathing room */}
        <div className="h-3" />
      </div>

      {/* ─── FIXED BOTTOM INPUT BAR ─── */}
      {phase === "chatting" && (
        <TextInputBar
          value={textInput}
          onChange={setTextInput}
          onSubmit={handleTextSubmit}
          disabled={isStreaming}
          scaffolds={showScaffolds ? FIRST_RESPONSE_SCAFFOLDS : []}
          onScaffoldClick={handleScaffoldClick}
          color={accentColor}
        />
      )}
    </div>
  );
}
