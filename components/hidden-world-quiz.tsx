"use client";

import { useState } from "react";
import { QuizIcon } from "@/lib/quiz-icons";
import { ALL_QUIZZES } from "@/lib/quiz-data";
import {
  HW_QUESTIONS,
  calculateMidReveal,
  calculateHWResult,
  ZONE_COPY,
  DIMENSION_LABELS,
  type HWAnswerPair,
  type HWResult,
  type ZoneLevel,
} from "@/lib/hidden-world-quiz";

type Phase = "intro" | "playing" | "mid-reveal" | "calculating" | "result";
type AnswerRound = "child" | "parent";

const meta = ALL_QUIZZES.find((q) => q.slug === "hidden-world")!;

// Zone color map
const ZONE_COLORS: Record<ZoneLevel, { bg: string; border: string; text: string; dot: string }> = {
  green: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  yellow: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
  red: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", dot: "bg-rose-500" },
};

export default function HiddenWorldQuiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [round, setRound] = useState<AnswerRound>("child");
  const [answers, setAnswers] = useState<Record<string, HWAnswerPair>>({});
  const [tempChildAnswer, setTempChildAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<HWResult | null>(null);
  const [animating, setAnimating] = useState(false);

  const totalQuestions = HW_QUESTIONS.length;
  const currentQuestion = HW_QUESTIONS[currentQ];

  // After Q5 (index 4), show mid-reveal before Q6
  const MID_REVEAL_AFTER = 4;

  function handleOptionSelect(optionId: string) {
    if (round === "child") {
      // Store child prediction temporarily, switch to parent round
      setTempChildAnswer(optionId);
      setAnimating(true);
      setTimeout(() => {
        setRound("parent");
        setAnimating(false);
      }, 400);
    } else {
      // Store complete pair, advance to next question
      const pair: HWAnswerPair = {
        childPrediction: tempChildAnswer!,
        parentWish: optionId,
      };
      const newAnswers = { ...answers, [currentQuestion.id]: pair };
      setAnswers(newAnswers);
      setTempChildAnswer(null);

      setAnimating(true);
      setTimeout(() => {
        // Check if we just finished Q5 → mid-reveal
        if (currentQ === MID_REVEAL_AFTER) {
          setPhase("mid-reveal");
        } else if (currentQ < totalQuestions - 1) {
          setCurrentQ((prev) => prev + 1);
          setRound("child");
        } else {
          // All questions done → calculate
          setPhase("calculating");
          setTimeout(() => {
            const hwResult = calculateHWResult(newAnswers);
            setResult(hwResult);
            setPhase("result");
          }, 2500);
        }
        setAnimating(false);
      }, 400);
    }
  }

  function handleMidRevealContinue() {
    setCurrentQ(MID_REVEAL_AFTER + 1);
    setRound("child");
    setPhase("playing");
  }

  function goBack() {
    if (phase === "intro" || phase === "result") {
      window.location.href = "/quiz";
      return;
    }
    if (phase === "mid-reveal") {
      setPhase("playing");
      setCurrentQ(MID_REVEAL_AFTER);
      setRound("child");
      return;
    }
    if (round === "parent") {
      setRound("child");
      setTempChildAnswer(null);
      return;
    }
    if (currentQ > 0) {
      setCurrentQ((p) => p - 1);
      setRound("child");
      setTempChildAnswer(null);
    } else {
      setPhase("intro");
    }
  }

  // Progress: count sub-steps (each question has 2 rounds)
  const totalSteps = totalQuestions * 2;
  const currentStep = currentQ * 2 + (round === "parent" ? 1 : 0);
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-dvh bg-[#FAFAF8] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-6 pb-3">
        <div className="max-w-[520px] mx-auto flex items-center justify-between">
          <button
            onClick={goBack}
            className="text-[#8A8A9A] text-[14px] flex items-center gap-1"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path
                d="M13 4l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {phase === "result" ? "목록으로" : "이전"}
          </button>

          {phase === "playing" && (
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium text-[#8A8A9A]">
                Q{currentQ + 1}/{totalQuestions}
              </span>
              <div className="w-24 h-1.5 rounded-full bg-[#E8E6E1]">
                <div
                  className="h-full rounded-full bg-[#4A5FC1] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-6 pt-4 pb-12">
        <div className="w-full max-w-[520px]">
          {/* ─── Intro ─── */}
          {phase === "intro" && (
            <div className="page-enter text-center pt-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#4A5FC1]/[0.06] flex items-center justify-center text-[#4A5FC1]">
                <QuizIcon
                  name="hidden"
                  className="[&_svg]:w-8 [&_svg]:h-8"
                />
              </div>
              <h1 className="text-[24px] md:text-[28px] font-bold text-[#1A1A2E] tracking-[-0.03em] mb-3 leading-[1.35]">
                엄마(아빠)는 모르는
                <br />
                우리 아이의 숨겨진 세계
              </h1>
              <p className="text-[15px] text-[#4A4A5A] leading-[1.7] mb-4 max-w-[400px] mx-auto">
                나는 우리 아이를 얼마나 알고 있을까?
              </p>

              {/* How it works */}
              <div className="bg-white rounded-xl border border-[#E8E6E1] p-5 mb-8 text-left max-w-[400px] mx-auto">
                <p className="text-[13px] font-semibold text-[#1A1A2E] mb-3">
                  이 진단은 이렇게 진행돼요
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#4A5FC1]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[11px] font-bold text-[#4A5FC1]">1</span>
                    </div>
                    <p className="text-[13px] text-[#4A4A5A] leading-[1.6]">
                      각 질문에 <strong className="text-[#1A1A2E]">두 번</strong> 답합니다
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#E8614D]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[11px] font-bold text-[#E8614D]">A</span>
                    </div>
                    <p className="text-[13px] text-[#4A4A5A] leading-[1.6]">
                      &quot;아이라면 뭐라고 답할까?&quot;
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#D4A853]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[11px] font-bold text-[#D4A853]">B</span>
                    </div>
                    <p className="text-[13px] text-[#4A4A5A] leading-[1.6]">
                      &quot;부모인 나는 뭘 바라는가?&quot;
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#6B8F71]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[11px] font-bold text-[#6B8F71]">!</span>
                    </div>
                    <p className="text-[13px] text-[#4A4A5A] leading-[1.6]">
                      두 답의 <strong className="text-[#1A1A2E]">차이</strong>가 곧 결과입니다
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mb-8 text-[13px] text-[#8A8A9A]">
                <span className="flex items-center gap-1.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <circle
                      cx="7"
                      cy="7"
                      r="5.5"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                    <path
                      d="M7 4.5v3l2 1"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                    />
                  </svg>
                  {meta.duration}
                </span>
                <span className="w-[1px] h-3 bg-[#E8E6E1]" />
                <span>{meta.questionCount}문항</span>
                <span className="w-[1px] h-3 bg-[#E8E6E1]" />
                <span>무료</span>
              </div>

              <button
                onClick={() => {
                  setPhase("playing");
                  setCurrentQ(0);
                  setRound("child");
                }}
                className="inline-flex items-center gap-2 bg-[#4A5FC1] text-white text-[15px] font-semibold px-8 py-3.5 rounded-full hover:bg-[#3A4FA1] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(74,95,193,0.3)] active:scale-[0.97]"
              >
                시작하기
              </button>

              <p className="text-[12px] text-[#8A8A9A] mt-6">
                응답은 저장되지 않으며, 결과는 참고용입니다.
              </p>
            </div>
          )}

          {/* ─── Playing ─── */}
          {phase === "playing" && currentQuestion && (
            <div
              key={`${currentQuestion.id}-${round}`}
              className={`page-enter ${animating ? "opacity-0" : ""}`}
            >
              <div className="pt-4">
                {/* Round indicator */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-4">
                    {round === "child" ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4A5FC1]/[0.08] text-[#4A5FC1]">
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.3"/>
                          <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                        </svg>
                        <span className="text-[12px] font-semibold">아이의 마음</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4A853]/[0.08] text-[#D4A853]">
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                          <path d="M10 17s-7-4.5-7-8.5C3 5.5 5.5 3 7.5 3c1.5 0 2.5 1 2.5 1s1-1 2.5-1c2 0 4.5 2.5 4.5 5.5S10 17 10 17z" stroke="currentColor" strokeWidth="1.3"/>
                        </svg>
                        <span className="text-[12px] font-semibold">나의 바람</span>
                      </div>
                    )}
                    <span className="text-[11px] text-[#8A8A9A]">
                      {round === "child"
                        ? `Q${currentQ + 1} — 1/2`
                        : `Q${currentQ + 1} — 2/2`}
                    </span>
                  </div>

                  {/* Dimension badge */}
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F0EFE9] text-[11px] text-[#8A8A9A] font-medium mb-3">
                    {DIMENSION_LABELS[currentQuestion.dimension]}
                  </div>
                </div>

                {/* Question */}
                <h2 className="text-[19px] md:text-[21px] font-bold text-[#1A1A2E] tracking-[-0.02em] mb-2 leading-[1.4]">
                  {currentQuestion.question}
                </h2>
                <p className="text-[14px] text-[#4A4A5A] mb-6 leading-[1.6]">
                  {round === "child"
                    ? currentQuestion.childPrompt
                    : currentQuestion.parentPrompt}
                </p>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt) => {
                    const isSelected =
                      round === "child"
                        ? tempChildAnswer === opt.id
                        : false;

                    const accentColor =
                      round === "child" ? "#4A5FC1" : "#D4A853";

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleOptionSelect(opt.id)}
                        className={`w-full flex items-center gap-3.5 p-4 rounded-xl text-left transition-all duration-200 active:scale-[0.98] ${
                          isSelected
                            ? `bg-opacity-[0.06] border-2 shadow-sm`
                            : "bg-white border-2 border-[#E8E6E1] hover:border-[#1A1A2E]/10"
                        }`}
                        style={
                          isSelected
                            ? {
                                backgroundColor: `${accentColor}0F`,
                                borderColor: `${accentColor}4D`,
                              }
                            : undefined
                        }
                      >
                        <span
                          className="flex-shrink-0"
                          style={{
                            color: isSelected ? accentColor : "#4A4A5A",
                          }}
                        >
                          <QuizIcon
                            name={opt.icon}
                            className="[&_svg]:w-5 [&_svg]:h-5"
                          />
                        </span>
                        <span
                          className={`text-[14px] font-medium ${
                            isSelected ? "" : "text-[#1A1A2E]"
                          }`}
                          style={
                            isSelected ? { color: accentColor } : undefined
                          }
                        >
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Subtle hint about what comes next */}
                {round === "child" && (
                  <p className="text-[11px] text-[#B0B0B0] mt-4 text-center">
                    선택 후, 같은 질문에 대한 부모님의 바람을 여쭤볼게요
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ─── Mid-Quiz Reveal ─── */}
          {phase === "mid-reveal" && (
            <div className="page-enter pt-12 text-center">
              {(() => {
                const reveal = calculateMidReveal(answers);
                return (
                  <>
                    <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#4A5FC1]/10 flex items-center justify-center">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                      >
                        <circle
                          cx="14"
                          cy="14"
                          r="10"
                          stroke="#4A5FC1"
                          strokeWidth="1.5"
                          strokeDasharray="3 2"
                        />
                        <circle
                          cx="14"
                          cy="14"
                          r="4"
                          fill="#4A5FC1"
                          fillOpacity="0.2"
                        />
                        <circle cx="14" cy="14" r="2" fill="#4A5FC1" />
                      </svg>
                    </div>

                    <h2 className="text-[20px] font-bold text-[#1A1A2E] tracking-[-0.02em] mb-3 leading-[1.4]">
                      {reveal.message}
                    </h2>
                    <p className="text-[14px] text-[#4A4A5A] leading-[1.7] mb-4 max-w-[380px] mx-auto">
                      {reveal.subMessage}
                    </p>

                    {/* Mini gap visualization */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                      {["hw-q1", "hw-q2", "hw-q3", "hw-q4", "hw-q5"].map(
                        (qId, i) => {
                          const pair = answers[qId];
                          const isMatch =
                            pair &&
                            pair.childPrediction === pair.parentWish;
                          return (
                            <div key={qId} className="text-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ${
                                  isMatch
                                    ? "bg-emerald-100 text-emerald-600"
                                    : "bg-rose-100 text-rose-500"
                                }`}
                              >
                                {i + 1}
                              </div>
                              <p className="text-[10px] text-[#8A8A9A] mt-1">
                                {isMatch ? "일치" : "차이"}
                              </p>
                            </div>
                          );
                        }
                      )}
                    </div>

                    <p className="text-[13px] text-[#8A8A9A] mb-6">
                      다음 질문들은 조금 더 깊이 들어갑니다.
                      <br />
                      여기서부터가 진짜 이해도 테스트예요.
                    </p>

                    <button
                      onClick={handleMidRevealContinue}
                      className="inline-flex items-center gap-2 bg-[#4A5FC1] text-white text-[14px] font-semibold px-6 py-3 rounded-full hover:bg-[#3A4FA1] transition-all active:scale-[0.97]"
                    >
                      계속하기
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M3 7h8M8 4l3 3-3 3"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </>
                );
              })()}
            </div>
          )}

          {/* ─── Calculating ─── */}
          {phase === "calculating" && (
            <div className="pt-20 text-center page-enter">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-[#E8E6E1]" />
                <div
                  className="absolute inset-0 rounded-full border-2 border-[#4A5FC1] border-t-transparent animate-spin"
                />
                <div
                  className="absolute inset-2 rounded-full border-2 border-[#D4A853] border-b-transparent animate-spin"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "1.5s",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-[#4A5FC1]">
                  <QuizIcon
                    name="hidden"
                    className="[&_svg]:w-7 [&_svg]:h-7"
                  />
                </div>
              </div>
              <p className="text-[17px] font-bold text-[#1A1A2E] mb-2">
                이해도 지도 그리는 중...
              </p>
              <p className="text-[13px] text-[#8A8A9A]">
                부모님의 예측과 바람의 간극을 분석하고 있어요.
              </p>
            </div>
          )}

          {/* ─── Result ─── */}
          {phase === "result" && result && (
            <div className="page-enter pt-4">
              {/* Main result card — shareable */}
              <div
                className="rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(26,26,46,0.1)] mb-8"
                id="result-card"
              >
                {/* Score header */}
                <div className="px-8 pt-10 pb-6 text-center bg-gradient-to-br from-[#4A5FC1]/[0.06] to-[#D4A853]/[0.04]">
                  <p className="text-[12px] font-semibold tracking-[0.06em] uppercase mb-4 text-[#4A5FC1]">
                    우리 아이 이해도
                  </p>

                  {/* Big percentage */}
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg
                      viewBox="0 0 120 120"
                      className="w-full h-full -rotate-90"
                    >
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="#E8E6E1"
                        strokeWidth="8"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="#4A5FC1"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(result.understandingScore / 100) * 327} 327`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[36px] font-extrabold text-[#1A1A2E] tracking-[-0.04em]">
                        {result.understandingScore}
                        <span className="text-[18px] font-bold text-[#8A8A9A]">
                          %
                        </span>
                      </span>
                    </div>
                  </div>

                  <h2 className="text-[22px] font-extrabold text-[#1A1A2E] tracking-[-0.03em] mb-2">
                    {result.headline}
                  </h2>
                </div>

                {/* 3-Zone Map */}
                <div className="bg-white px-6 py-5">
                  <p className="text-[12px] font-semibold text-[#8A8A9A] tracking-[0.04em] uppercase mb-4 text-center">
                    이해도 지도
                  </p>
                  <div className="space-y-3">
                    {result.dimensions.map((dim) => {
                      const colors = ZONE_COLORS[dim.zone];
                      return (
                        <div
                          key={dim.dimension}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border ${colors.bg} ${colors.border}`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full flex-shrink-0 ${colors.dot}`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between">
                              <span className="text-[13px] font-semibold text-[#1A1A2E]">
                                {dim.dimensionLabel}
                              </span>
                              <span
                                className={`text-[11px] font-semibold ${colors.text}`}
                              >
                                {dim.zoneLabel}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* TAM branding */}
                  <div className="mt-4 pt-3 border-t border-[#E8E6E1] flex items-center justify-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 34 34"
                      fill="none"
                    >
                      <path
                        d="M17 2C9.5 2 4 6.5 3 12c-1 5.5 1.5 10 5 13.5C11.5 29 14 31 17 31.5c3 .5 6.5-1 9.5-4S31 21 31 17c0-4-1.5-7.5-4.5-10.5C23.5 3.5 20.5 2 17 2z"
                        fill="#1A1A2E"
                        fillOpacity="0.06"
                      />
                      <path
                        d="M12 10c2-2 5-1.5 6.5.5s1 5-1 6.5c-2 1.5-3.5 1-4.5-.5S10 12 12 10z"
                        fill="#E8614D"
                        fillOpacity="0.4"
                      />
                      <path
                        d="M19 13c1.5-1 3.5-.5 4.5 1s.5 4-1 5-3.2.8-4-.5c-.8-1.3-.5-3.5.5-5.5z"
                        fill="#4A5FC1"
                        fillOpacity="0.35"
                      />
                    </svg>
                    <span className="text-[11px] text-[#8A8A9A]">
                      탐 TAM 이해도 진단
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed analysis per dimension */}
              <div className="space-y-4 mb-8">
                <h3 className="text-[16px] font-bold text-[#1A1A2E]">
                  상세 분석
                </h3>
                <p className="text-[14px] leading-[1.8] text-[#4A4A5A] -mt-1">
                  {result.description}
                </p>

                {result.dimensions.map((dim) => {
                  const colors = ZONE_COLORS[dim.zone];
                  const copy = ZONE_COPY[dim.zone];
                  return (
                    <div
                      key={dim.dimension}
                      className="bg-white rounded-xl border border-[#E8E6E1] p-5"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${colors.dot}`}
                        />
                        <h4 className="text-[14px] font-bold text-[#1A1A2E]">
                          {dim.dimensionLabel}
                        </h4>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
                        >
                          {dim.zoneLabel}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#4A4A5A] leading-[1.7] mb-3">
                        {dim.insight}
                      </p>
                      <div className="flex items-start gap-2 pt-3 border-t border-[#F0EFE9]">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          className="flex-shrink-0 mt-0.5"
                        >
                          <path
                            d="M3 7h8M8 4l3 3-3 3"
                            stroke="#4A5FC1"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-[12px] text-[#4A5FC1] font-medium">
                          {copy.action}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Question-by-question gap breakdown */}
              <div className="mb-8">
                <h3 className="text-[16px] font-bold text-[#1A1A2E] mb-4">
                  질문별 결과
                </h3>
                <div className="space-y-2">
                  {HW_QUESTIONS.map((q, i) => {
                    const pair = answers[q.id];
                    const isMatch =
                      pair && pair.childPrediction === pair.parentWish;
                    const childOpt = q.options.find(
                      (o) => o.id === pair?.childPrediction
                    );
                    const parentOpt = q.options.find(
                      (o) => o.id === pair?.parentWish
                    );

                    return (
                      <div
                        key={q.id}
                        className="bg-white rounded-xl border border-[#E8E6E1] p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                              isMatch
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-rose-100 text-rose-500"
                            }`}
                          >
                            {i + 1}
                          </span>
                          <span className="text-[12px] text-[#8A8A9A] flex-1 truncate">
                            {q.question}
                          </span>
                          <span
                            className={`text-[11px] font-semibold ${
                              isMatch
                                ? "text-emerald-600"
                                : "text-rose-500"
                            }`}
                          >
                            {isMatch ? "일치" : "차이"}
                          </span>
                        </div>
                        {!isMatch && childOpt && parentOpt && (
                          <div className="flex gap-2 mt-2">
                            <div className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#4A5FC1]/[0.04] text-[11px]">
                              <span className="text-[#4A5FC1] font-semibold">
                                아이 예측:
                              </span>{" "}
                              <span className="text-[#4A4A5A]">
                                {childOpt.label}
                              </span>
                            </div>
                            <div className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#D4A853]/[0.04] text-[11px]">
                              <span className="text-[#D4A853] font-semibold">
                                나의 바람:
                              </span>{" "}
                              <span className="text-[#4A4A5A]">
                                {parentOpt.label}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TAM soft-sell */}
              <div className="bg-[#1A1A2E] rounded-2xl p-6 mb-8 text-center">
                <p className="text-[13px] text-[#8A8A9A] mb-2">
                  아이의 &apos;미지의 영역&apos;을 발견하는 가장 좋은 방법은
                </p>
                <p className="text-[16px] font-bold text-white leading-[1.5] mb-1">
                  아이 스스로 다양한 세계를 경험하게 하는 것
                </p>
                <p className="text-[13px] text-[#8A8A9A] mb-5">
                  {result.cta}
                </p>
                <a
                  href="/consultation"
                  className="inline-flex items-center gap-2 bg-white text-[#1A1A2E] text-[14px] font-semibold px-6 py-3 rounded-full transition-all active:scale-[0.97]"
                >
                  탐 TAM 사전신청하기
                </a>
              </div>

              {/* Share + CTA */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => {
                    const text = result.shareText;
                    const url = window.location.href;
                    if (navigator.share) {
                      navigator
                        .share({ title: "우리 아이 이해도 진단", text, url })
                        .catch(() => {});
                    } else {
                      navigator.clipboard.writeText(`${text}\n${url}`);
                      alert("링크가 복사되었습니다!");
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#FEE500] text-[#3C1E1E] text-[14px] font-semibold transition-all active:scale-[0.97]"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M9 2C5.13 2 2 4.56 2 7.73c0 2.04 1.36 3.83 3.4 4.85l-.86 3.15a.3.3 0 00.45.33L8.6 13.7c.13.01.27.02.4.02 3.87 0 7-2.56 7-5.73S12.87 2 9 2z"
                      fill="#3C1E1E"
                    />
                  </svg>
                  카카오톡으로 공유하기
                </button>
                <button
                  onClick={() => {
                    setPhase("intro");
                    setCurrentQ(0);
                    setRound("child");
                    setAnswers({});
                    setTempChildAnswer(null);
                    setResult(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white border-2 border-[#E8E6E1] text-[#1A1A2E] text-[14px] font-semibold transition-all active:scale-[0.97]"
                >
                  다시 해보기
                </button>
                <a
                  href="/quiz"
                  className="w-full flex items-center justify-center py-3 text-[13px] font-medium text-[#4A5FC1]"
                >
                  다른 진단 보기
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
