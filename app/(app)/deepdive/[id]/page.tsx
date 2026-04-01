"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getDeepDive,
  streamDeepDiveTurn,
  recordDeepDiveTurn,
  completeDeepDive,
  type DeepDiveData,
  type DeepDiveTurnData,
} from "@/lib/api-client";

// ─── Types ───

type Phase = "loading" | "chatting" | "complete";

interface ChatMessage {
  id: string;
  role: "expert" | "child";
  text: string;
  isStreaming?: boolean;
}

// ─── Main Component ───

export default function DeepDivePlayPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("loading");
  const [deepDive, setDeepDive] = useState<DeepDiveData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [showInteraction, setShowInteraction] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [portfolioText, setPortfolioText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  }, []);

  // ─── Load deep dive data ───
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { deepDive: dd } = await getDeepDive(id);
        setDeepDive(dd);

        if (dd.status === "completed") {
          // Rebuild messages from completed turns
          const msgs: ChatMessage[] = [];
          for (const turn of dd.turns) {
            if (turn.expertMessage) {
              msgs.push({
                id: `expert-${turn.turnIndex}`,
                role: "expert",
                text: turn.expertMessage,
              });
            }
            if (turn.selectedOptionId && turn.options) {
              const opt = turn.options.find((o) => o.id === turn.selectedOptionId);
              if (opt) {
                msgs.push({
                  id: `child-${turn.turnIndex}`,
                  role: "child",
                  text: opt.label,
                });
              }
            } else if (turn.textResponse) {
              msgs.push({
                id: `child-${turn.turnIndex}`,
                role: "child",
                text: turn.textResponse,
              });
            }
          }
          setMessages(msgs);
          setPortfolioText(dd.portfolioEntry ?? "");
          setPhase("complete");
          return;
        }

        // Find where we left off
        const firstUnplayedTurn = dd.turns.findIndex((t) => !t.expertMessage);
        const startTurn = firstUnplayedTurn === -1 ? dd.turns.length : firstUnplayedTurn;

        // Rebuild already-played messages
        const msgs: ChatMessage[] = [];
        for (let i = 0; i < startTurn; i++) {
          const turn = dd.turns[i];
          if (turn.expertMessage) {
            msgs.push({
              id: `expert-${turn.turnIndex}`,
              role: "expert",
              text: turn.expertMessage,
            });
          }
          if (turn.selectedOptionId && turn.options) {
            const opt = turn.options.find((o) => o.id === turn.selectedOptionId);
            if (opt) {
              msgs.push({
                id: `child-${turn.turnIndex}`,
                role: "child",
                text: opt.label,
              });
            }
          } else if (turn.textResponse) {
            msgs.push({
              id: `child-${turn.turnIndex}`,
              role: "child",
              text: turn.textResponse,
            });
          }
        }
        setMessages(msgs);
        setCurrentTurnIndex(startTurn);
        setPhase("chatting");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      }
    })();
  }, [id]);

  // ─── Auto-trigger streaming when entering a new turn ───
  useEffect(() => {
    if (phase !== "chatting" || !deepDive || isStreaming || currentTurnIndex >= 5) return;

    const turn = deepDive.turns[currentTurnIndex];
    if (!turn) return;

    // If this turn already has a response, skip streaming
    if (turn.expertMessage) {
      // Expert message already present, show interaction
      setShowInteraction(true);
      return;
    }

    // Stream the expert message
    streamExpertMessage(currentTurnIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentTurnIndex, deepDive]);

  // ─── Stream expert message ───
  const streamExpertMessage = useCallback(async (turnIndex: number) => {
    if (!deepDive || isStreaming) return;
    setIsStreaming(true);
    setShowInteraction(false);

    const streamingMsgId = `expert-${turnIndex}`;

    // Add placeholder message
    setMessages((prev) => [
      ...prev,
      { id: streamingMsgId, role: "expert", text: "", isStreaming: true },
    ]);
    scrollToBottom();

    await streamDeepDiveTurn(
      deepDive.id,
      turnIndex,
      // onToken
      (text: string) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingMsgId ? { ...m, text } : m,
          ),
        );
        scrollToBottom();
      },
      // onComplete
      (message: string) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingMsgId
              ? { ...m, text: message, isStreaming: false }
              : m,
          ),
        );
        setIsStreaming(false);

        // Update the deep dive data locally
        setDeepDive((prev) => {
          if (!prev) return prev;
          const newTurns = [...prev.turns];
          if (newTurns[turnIndex]) {
            newTurns[turnIndex] = { ...newTurns[turnIndex], expertMessage: message };
          }
          return { ...prev, turns: newTurns };
        });

        setShowInteraction(true);
        scrollToBottom();
      },
      // onError
      (err: Error) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingMsgId
              ? { ...m, text: "메시지를 불러올 수 없었어요...", isStreaming: false }
              : m,
          ),
        );
        setIsStreaming(false);
        setError(err.message);
      },
    );
  }, [deepDive, isStreaming, scrollToBottom]);

  // ─── Handle option selection ───
  const handleOptionSelect = useCallback(async (optionId: string, label: string) => {
    if (!deepDive) return;
    setShowInteraction(false);

    // Add child message
    setMessages((prev) => [
      ...prev,
      { id: `child-${currentTurnIndex}`, role: "child", text: label },
    ]);
    scrollToBottom();

    // Record on server
    try {
      await recordDeepDiveTurn(deepDive.id, currentTurnIndex, optionId);
    } catch {
      // Non-critical, continue
    }

    // Advance
    const nextTurn = currentTurnIndex + 1;
    if (nextTurn >= 5) {
      // All turns done, complete
      setPhase("complete");
    } else {
      setCurrentTurnIndex(nextTurn);
    }
  }, [deepDive, currentTurnIndex, scrollToBottom]);

  // ─── Handle text submission ───
  const handleTextSubmit = useCallback(async () => {
    if (!deepDive || !textInput.trim()) return;
    setShowInteraction(false);

    const text = textInput.trim();
    setTextInput("");

    setMessages((prev) => [
      ...prev,
      { id: `child-${currentTurnIndex}`, role: "child", text },
    ]);
    scrollToBottom();

    try {
      await recordDeepDiveTurn(deepDive.id, currentTurnIndex, undefined, text);
    } catch {
      // Non-critical
    }

    const nextTurn = currentTurnIndex + 1;
    if (nextTurn >= 5) {
      setPhase("complete");
    } else {
      setCurrentTurnIndex(nextTurn);
    }
  }, [deepDive, currentTurnIndex, textInput, scrollToBottom]);

  // ─── Handle portfolio submission ───
  const handlePortfolioSubmit = useCallback(async () => {
    if (!deepDive) return;
    const text = portfolioText.trim();
    if (!text) return;

    // Record the portfolio turn response
    try {
      await recordDeepDiveTurn(deepDive.id, currentTurnIndex, undefined, text);
    } catch {
      // Non-critical
    }

    // Add child message
    setMessages((prev) => [
      ...prev,
      { id: `child-${currentTurnIndex}`, role: "child", text },
    ]);

    // Complete the deep dive
    try {
      await completeDeepDive(deepDive.id, text);
    } catch {
      // Non-critical
    }

    setPhase("complete");
    scrollToBottom();
  }, [deepDive, currentTurnIndex, portfolioText, scrollToBottom]);

  // ─── Current turn ───
  const currentTurn: DeepDiveTurnData | undefined = deepDive?.turns[currentTurnIndex];

  // ─── Loading ───
  if (phase === "loading") {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#FAFAF8]">
        {error ? (
          <div className="text-center px-6">
            <p className="text-red-500 mb-2">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="text-indigo-600 underline"
            >
              홈으로 돌아가기
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">전문가와 연결 중...</p>
          </div>
        )}
      </div>
    );
  }

  // ─── Render ───
  return (
    <div className="min-h-dvh flex flex-col bg-[#FAFAF8]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {deepDive && (
            <>
              {/* Expert avatar */}
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-indigo-700">
                  {deepDive.expert.name[0]}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {deepDive.expert.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {deepDive.expert.role} &middot; {deepDive.expert.organization}
                </p>
              </div>
            </>
          )}
          {/* Progress */}
          <div className="ml-auto flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < currentTurnIndex
                    ? "bg-indigo-500"
                    : i === currentTurnIndex && phase === "chatting"
                      ? "bg-indigo-300"
                      : i <= 4 && phase === "complete"
                        ? "bg-indigo-500"
                        : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4"
      >
        <div className="max-w-lg mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "child" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "expert" && deepDive && (
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1 mr-2">
                  <span className="text-xs font-bold text-indigo-700">
                    {deepDive.expert.name[0]}
                  </span>
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "expert"
                    ? "bg-white border border-indigo-100 text-gray-800"
                    : "bg-indigo-500 text-white"
                }`}
              >
                {msg.text || (msg.isStreaming && (
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                ))}
                {msg.text && msg.text.split("\n").map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Interaction area */}
          {phase === "chatting" && showInteraction && currentTurn && !isStreaming && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 pt-2">
              {/* Reaction / Comparison / Reflection options */}
              {(currentTurn.interactionType === "reaction" ||
                currentTurn.interactionType === "comparison" ||
                currentTurn.interactionType === "reflection") &&
                currentTurn.options && (
                <div className="space-y-2">
                  {currentTurn.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt.id, opt.label)}
                      className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 hover:border-indigo-300 hover:bg-indigo-50 transition-colors active:scale-[0.98]"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Text input */}
              {currentTurn.interactionType === "text" && (
                <div className="space-y-3">
                  {/* Scaffold chips */}
                  <div className="flex flex-wrap gap-2">
                    {["나는 ~라고 생각해", "왜냐하면 ~", "만약에 ~라면"].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => setTextInput((prev) => prev + chip.replace("~", ""))}
                        className="px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <textarea
                      ref={textareaRef}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleTextSubmit();
                        }
                      }}
                      placeholder="네 생각을 자유롭게 써봐..."
                      className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
                      rows={2}
                    />
                    <button
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim()}
                      className="self-end px-4 py-3 bg-indigo-500 text-white rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-indigo-600 transition-colors"
                    >
                      보내기
                    </button>
                  </div>
                </div>
              )}

              {/* Portfolio input */}
              {currentTurn.interactionType === "portfolio" && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600 text-lg">&#9733;</span>
                    <p className="text-sm font-semibold text-amber-800">
                      나의 한 줄 포트폴리오
                    </p>
                  </div>
                  <textarea
                    value={portfolioText}
                    onChange={(e) => setPortfolioText(e.target.value)}
                    placeholder="오늘 대화에서 가장 기억에 남는 것을 한 줄로..."
                    className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl text-sm resize-none focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                    rows={2}
                  />
                  <button
                    onClick={handlePortfolioSubmit}
                    disabled={!portfolioText.trim()}
                    className="w-full py-3 bg-amber-500 text-white rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-amber-600 transition-colors"
                  >
                    포트폴리오에 저장하기
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Completion card */}
          {phase === "complete" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 text-center space-y-4">
                <div className="text-3xl">&#127942;</div>
                <h3 className="text-lg font-bold text-gray-900">
                  대화 완료!
                </h3>
                {(portfolioText || deepDive?.portfolioEntry) && (
                  <div className="bg-white/80 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">나의 포트폴리오</p>
                    <p className="text-sm font-medium text-gray-800">
                      &ldquo;{portfolioText || deepDive?.portfolioEntry}&rdquo;
                    </p>
                  </div>
                )}
                {deepDive && (
                  <p className="text-xs text-gray-500">
                    {deepDive.expert.name} ({deepDive.expert.role})과의 대화
                  </p>
                )}
                <button
                  onClick={() => router.push("/")}
                  className="w-full py-3 bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors"
                >
                  홈으로 돌아가기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
