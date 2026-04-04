"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getDeepDive,
  streamDeepDiveChat,
  submitDeepDivePortfolio,
  type DeepDiveData,
  type AgentStateData,
} from "@/lib/api-client";

// ═══════════════════════════════════════════════════
// Design tokens
// ═══════════════════════════════════════════════════

const CREAM = "#FAFAF8";
const NAVY = "#1A1A2E";
const INDIGO = "#4A5FC1";
const CORAL = "#E8614D";
const GOLD = "#D4A853";
const SAGE = "#6B8F71";

// ═══════════════════════════════════════════════════
// Sub-components — all defined OUTSIDE the main component
// ═══════════════════════════════════════════════════

function ExpertAvatar({ name, color }: { name: string; color: string }) {
  return (
    <div className="relative flex-shrink-0">
      {/* Gradient ring */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${color}25, ${color}08)`,
          border: `1.5px solid ${color}30`,
        }}
      >
        <span
          className="text-[13px] font-bold"
          style={{ color }}
        >
          {name[0]}
        </span>
      </div>
      {/* Online dot */}
      <div
        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
        style={{ backgroundColor: SAGE, borderColor: CREAM }}
      />
    </div>
  );
}

function TypingIndicator({ color }: { color: string }) {
  return (
    <div className="flex items-end gap-2 animate-fade-in">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 opacity-50"
        style={{ background: `${color}15` }}
      >
        <span className="text-[11px] font-bold" style={{ color }}>...</span>
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-md"
        style={{ background: "white", border: `1px solid ${color}12` }}
      >
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-[6px] h-[6px] rounded-full"
              style={{
                backgroundColor: `${color}50`,
                animation: `typingBounce 1.2s ease-in-out infinite`,
                animationDelay: `${i * 200}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ExpertBubble({ text, isStreaming, color }: { text: string; isStreaming?: boolean; color: string }) {
  return (
    <div
      className="max-w-[82%] px-4 py-3 rounded-2xl rounded-bl-md text-[14px] leading-[1.75] tracking-[-0.01em]"
      style={{
        background: "white",
        border: `1px solid ${color}10`,
        color: NAVY,
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
      }}
    >
      {!text && isStreaming ? (
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-[6px] h-[6px] rounded-full"
              style={{
                backgroundColor: `${color}50`,
                animation: `typingBounce 1.2s ease-in-out infinite`,
                animationDelay: `${i * 200}ms`,
              }}
            />
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
          className="inline-block w-[2px] h-[14px] ml-0.5 align-text-bottom"
          style={{ backgroundColor: `${color}60`, animation: "cursorBlink 0.8s step-end infinite" }}
        />
      )}
    </div>
  );
}

function ChildBubble({ text }: { text: string }) {
  return (
    <div
      className="max-w-[78%] px-4 py-3 rounded-2xl rounded-br-md text-[14px] leading-[1.7] tracking-[-0.01em] text-white"
      style={{
        background: `linear-gradient(135deg, ${INDIGO}, ${INDIGO}dd)`,
        boxShadow: `0 2px 8px ${INDIGO}25`,
      }}
    >
      {text}
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

  // Auto-resize textarea on value change
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [value]);

  return (
    <div
      className="flex-shrink-0 z-30 px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] animate-fade-in"
      style={{ borderTop: "1px solid #E8E6E1", background: `${CREAM}f0`, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
    >
      {/* Scaffold chips */}
      {scaffolds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {scaffolds.map((s) => (
            <button
              key={s}
              onClick={() => onScaffoldClick(s)}
              className="px-3 py-1 rounded-full text-[12px] font-medium transition-colors active:scale-[0.96]"
              style={{
                background: `${color}08`,
                color,
                border: `1px solid ${color}20`,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2 items-end">
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
          className="flex-1 px-4 py-2.5 rounded-2xl text-[14px] leading-[1.6] resize-none focus:outline-none transition-all duration-200 disabled:opacity-50"
          style={{
            background: "white",
            border: `1.5px solid ${value ? `${color}40` : "#E8E6E1"}`,
            color: NAVY,
            boxShadow: value ? `0 0 0 2px ${color}10` : "none",
            minHeight: "42px",
            maxHeight: "120px",
          }}
          rows={1}
        />
        <button
          onClick={onSubmit}
          disabled={!value.trim() || disabled}
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 disabled:opacity-30"
          style={{ background: value.trim() && !disabled ? color : "#D1D0CB" }}
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
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          border: `1.5px solid ${GOLD}30`,
          boxShadow: `0 2px 12px ${GOLD}12`,
        }}
      >
        {/* Gold shimmer bar */}
        <div
          className="h-1"
          style={{ background: `linear-gradient(90deg, ${GOLD}40, ${GOLD}, ${GOLD}40)` }}
        />
        <div className="px-4 py-4 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1l2 4.5h4.5L10.5 8.5l1.5 4.5L8 10.5 4 13l1.5-4.5L1.5 5.5H6L8 1z" fill={GOLD} fillOpacity="0.3" stroke={GOLD} strokeWidth="1" />
            </svg>
            <span className="text-[12px] font-bold tracking-wider uppercase" style={{ color: GOLD }}>
              나의 포트폴리오
            </span>
          </div>
          <p className="text-[13px] leading-[1.7] mb-3" style={{ color: "#8A8A9A" }}>
            오늘 대화에서 알게 된 것을 한 줄로 정리해봐!
          </p>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="오늘의 대화를 한 줄로 정리해봐..."
            className="w-full text-[15px] leading-[1.8] font-medium bg-transparent focus:outline-none resize-none"
            style={{ color: NAVY }}
            rows={3}
          />
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${GOLD}15` }}>
            <span className="text-[11px]" style={{ color: `${GOLD}90` }}>수정할 수 있어</span>
            <span className="text-[11px]" style={{ color: `${GOLD}90` }}>{value.length}자</span>
          </div>
        </div>
      </div>
      <button
        onClick={onSubmit}
        disabled={!value.trim()}
        className="w-full mt-3 py-3.5 rounded-2xl text-[15px] font-bold text-white transition-all duration-200 active:scale-[0.97] disabled:opacity-40"
        style={{
          background: value.trim() ? CORAL : "#C4C3BF",
          boxShadow: value.trim() ? `0 3px 16px ${CORAL}30` : "none",
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
    <div className="px-4 pb-6 animate-fade-in-up" style={{ animationDuration: "0.6s" }}>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: `1.5px solid ${SAGE}25`, boxShadow: `0 4px 24px ${SAGE}10` }}
      >
        {/* Green gradient bar */}
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${SAGE}60, ${SAGE}, ${SAGE}60)` }} />
        <div className="px-5 py-6 bg-white text-center">
          {/* Check icon */}
          <div className="mx-auto mb-3">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" fill={`${SAGE}12`} stroke={SAGE} strokeWidth="1.5" />
              <path d="M15 24l6 6 12-12" stroke={SAGE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Celebration dots */}
              <circle cx="8" cy="12" r="2" fill={GOLD} fillOpacity="0.5" />
              <circle cx="40" cy="16" r="1.5" fill={CORAL} fillOpacity="0.4" />
              <circle cx="38" cy="38" r="2" fill={INDIGO} fillOpacity="0.3" />
              <circle cx="10" cy="36" r="1.5" fill={GOLD} fillOpacity="0.4" />
            </svg>
          </div>
          <h3 className="text-[18px] font-bold mb-1" style={{ color: NAVY }}>대화 완료!</h3>
          <p className="text-[13px] mb-4" style={{ color: "#8A8A9A" }}>
            {expertName} ({expertRole})과의 대화
          </p>

          {/* Insights count */}
          {insightCount > 0 && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4"
              style={{ background: `${INDIGO}08`, border: `1px solid ${INDIGO}15` }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.8 2.8l1.4 1.4M9.8 9.8l1.4 1.4M11.2 2.8l-1.4 1.4M4.2 9.8l-1.4 1.4" stroke={INDIGO} strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <span className="text-[12px] font-semibold" style={{ color: INDIGO }}>
                {insightCount}개의 인사이트 발견
              </span>
            </div>
          )}

          {portfolioText && (
            <div
              className="rounded-xl px-4 py-3 mb-5 text-left"
              style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}15` }}
            >
              <p className="text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: GOLD }}>나의 기록</p>
              <p className="text-[14px] leading-[1.75] font-medium" style={{ color: NAVY }}>
                &ldquo;{portfolioText}&rdquo;
              </p>
            </div>
          )}

          <button
            onClick={onGoHome}
            className="w-full py-3.5 rounded-2xl text-[15px] font-bold text-white transition-all active:scale-[0.97]"
            style={{ background: CORAL, boxShadow: `0 3px 16px ${CORAL}30` }}
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Depth Progress Bar
// ═══════════════════════════════════════════════════

function DepthBar({ turnCount }: { turnCount: number }) {
  const widthPct = Math.min((turnCount / 12) * 100, 100);
  const opacity = turnCount <= 4 ? 0.3 : turnCount <= 8 ? 0.6 : 1;

  return (
    <div className="h-[3px] w-full" style={{ background: `${INDIGO}08` }}>
      <div
        className="h-full rounded-r-full"
        style={{
          width: `${widthPct}%`,
          background: INDIGO,
          opacity,
          transition: "all 500ms ease-out",
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Custom CSS keyframes (injected via style tag)
// ═══════════════════════════════════════════════════

function ChatStyles() {
  return (
    <style>{`
      @keyframes typingBounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-4px); }
      }
      @keyframes cursorBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes msgEnter {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .msg-enter {
        animation: msgEnter 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      .animate-slide-up {
        animation: slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
    `}</style>
  );
}

// ═══════════════════════════════════════════════════
// First-response scaffold chips
// ═══════════════════════════════════════════════════

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

export default function DeepDivePlayPage() {
  const { id } = useParams<{ id: string }>();
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

  // Auto-scroll
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  // ─── Load data ───
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const dd = await getDeepDive(id);
        if (!dd) {
          setError("대화를 불러올 수 없어요");
          return;
        }
        setDeepDive(dd);
        setAgentState(dd.agentState);

        // Rebuild messages from existing data
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

        // If portfolio was requested but not yet submitted
        if (dd.agentState.portfolioRequested && !dd.portfolioEntry) {
          setPhase("portfolio");
          return;
        }

        setPhase("chatting");
      } catch (err) {
        setError(err instanceof Error ? err.message : "불러올 수 없어요");
      }
    })();
  }, [id]);

  // ─── Auto-trigger first expert message if no messages exist ───
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

  // ─── Auto-scroll on new messages ───
  useEffect(() => {
    scrollToBottom();
  }, [messages, showTyping, scrollToBottom]);

  // ─── Stream expert message ───
  const streamExpertResponse = useCallback(async (childMessage: string | null) => {
    if (!deepDive || isStreaming) return;
    setIsStreaming(true);
    setShowTyping(true);

    // Brief typing indicator delay
    await new Promise((r) => setTimeout(r, 800));
    setShowTyping(false);

    const msgId = `expert-${Date.now()}`;
    setMessages((prev) => [...prev, { id: msgId, role: "expert", text: "", isStreaming: true }]);

    await streamDeepDiveChat(
      deepDive.id,
      childMessage,
      // onToken: update the streaming expert message
      (text) => {
        setMessages((prev) =>
          prev.map((m) => m.id === msgId ? { ...m, text } : m),
        );
      },
      // onComplete: finalize expert message and update agent state
      (data) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, text: data.message, isStreaming: false } : m,
          ),
        );
        setAgentState(data.agentState);
        setIsStreaming(false);

        // Check if the conversation should transition to portfolio
        if (data.isEnding) {
          // Small delay for the user to read the last message
          setTimeout(() => {
            setPhase("portfolio");
          }, 1200);
        }
      },
      // onError
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

  // ─── Handle child text submit ───
  const handleTextSubmit = useCallback(() => {
    if (!deepDive || !textInput.trim() || isStreaming) return;
    const text = textInput.trim();
    setTextInput("");

    // Add child message to UI
    const childMsgId = `child-${Date.now()}`;
    setMessages((prev) => [...prev, { id: childMsgId, role: "child", text }]);

    // Trigger expert response with the child's message
    streamExpertResponse(text);
  }, [deepDive, textInput, isStreaming, streamExpertResponse]);

  // ─── Handle scaffold chip click (prefill only, no submit) ───
  const handleScaffoldClick = useCallback((scaffold: string) => {
    setTextInput(scaffold);
  }, []);

  // ─── Handle portfolio submit ───
  const handlePortfolioSubmit = useCallback(async () => {
    if (!deepDive || !portfolioText.trim()) return;
    const text = portfolioText.trim();
    try {
      await submitDeepDivePortfolio(deepDive.id, text);
    } catch {
      // Allow completion even if save fails (optimistic)
    }
    setPhase("complete");
  }, [deepDive, portfolioText]);

  // Determine if we should show scaffold chips (only when first expert message is done, no child messages yet)
  const expertMessages = messages.filter((m) => m.role === "expert");
  const childMessages = messages.filter((m) => m.role === "child");
  const showScaffolds =
    phase === "chatting" &&
    expertMessages.length === 1 &&
    !expertMessages[0]?.isStreaming &&
    childMessages.length === 0;

  // ─── Loading ───
  if (phase === "loading") {
    return (
      <div className="h-dvh flex flex-col items-center justify-center" style={{ background: CREAM }}>
        <ChatStyles />
        {error ? (
          <div className="text-center px-6">
            <p className="text-[14px] mb-3" style={{ color: CORAL }}>{error}</p>
            <button onClick={() => router.push("/home")} className="text-[14px] font-semibold" style={{ color: INDIGO }}>
              홈으로
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-12 h-12">
              <div
                className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
                style={{ borderTopColor: INDIGO, borderRightColor: `${INDIGO}40` }}
              />
            </div>
            <p className="text-[14px]" style={{ color: "#8A8A9A" }}>전문가와 연결하고 있어...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col overflow-hidden" style={{ background: CREAM }}>
      <ChatStyles />

      {/* ─── Header ─── */}
      <header
        className="sticky top-0 z-20"
        style={{
          background: `${CREAM}ee`,
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(232,230,225,0.5)",
        }}
      >
        <div className="px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            {/* Back button */}
            <button onClick={() => router.push("/home")} className="p-1 -ml-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 4l-6 6 6 6" stroke="#8A8A9A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {deepDive && (
              <>
                <ExpertAvatar name={deepDive.expert.name} color={accentColor} />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold truncate" style={{ color: NAVY }}>
                    {deepDive.expert.name}
                  </p>
                  <p className="text-[11px] truncate" style={{ color: "#8A8A9A" }}>
                    {deepDive.expert.role} · {deepDive.expert.organization}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Depth progress bar */}
        <DepthBar turnCount={agentState?.turnCount ?? 0} />
      </header>

      {/* ─── Chat messages ─── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-5 space-y-4 pb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "child" ? "justify-end" : "items-end gap-2"} msg-enter`}>
              {msg.role === "expert" && deepDive && (
                <ExpertAvatar name={deepDive.expert.name} color={accentColor} />
              )}
              {msg.role === "expert" ? (
                <ExpertBubble text={msg.text} isStreaming={msg.isStreaming} color={accentColor} />
              ) : (
                <ChildBubble text={msg.text} />
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {showTyping && <TypingIndicator color={accentColor} />}

          {/* Portfolio phase */}
          {phase === "portfolio" && (
            <PortfolioCard
              value={portfolioText}
              onChange={setPortfolioText}
              onSubmit={handlePortfolioSubmit}
            />
          )}

          {/* Completion */}
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
      </div>

      {/* ─── Bottom input bar (always visible during chatting phase) ─── */}
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
