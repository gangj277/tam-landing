"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  getQuizBySlug,
  getResultType,
  calculateDnaResult,
  ALL_QUIZZES,
  type Quiz,
  type QuizQuestion,
  type QuizResultType,
} from "@/lib/quiz-data";
import { QuizIcon } from "@/lib/quiz-icons";
import HiddenWorldQuiz from "@/components/hidden-world-quiz";

type Phase = "intro" | "playing" | "calculating" | "result";

export default function QuizPlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();

  // Hidden-world quiz has its own dedicated component
  if (slug === "hidden-world") {
    return <HiddenWorldQuiz />;
  }

  const quiz = getQuizBySlug(slug);

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [resultType, setResultType] = useState<QuizResultType | null>(null);
  const [animating, setAnimating] = useState(false);

  if (!quiz) {
    return (
      <div className="min-h-dvh bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[18px] font-bold text-[#1A1A2E] mb-2">아직 준비 중이에요</p>
          <p className="text-[14px] text-[#8A8A9A] mb-6">이 진단은 곧 공개됩니다.</p>
          <a href="/quiz" className="text-[14px] font-medium text-[#4A5FC1]">
            ← 다른 진단 보기
          </a>
        </div>
      </div>
    );
  }

  const questions = quiz.questions;
  const playableQuestions = questions.filter((q) => q.type !== "reveal");
  const totalPlayable = playableQuestions.length;
  const currentQuestion = questions[currentQ];

  function handleSelect(questionId: string, optionId: string, maxSelect?: number) {
    setAnswers((prev) => {
      const current = prev[questionId] ?? [];
      if (maxSelect && maxSelect > 1) {
        if (current.includes(optionId)) {
          return { ...prev, [questionId]: current.filter((id) => id !== optionId) };
        }
        if (current.length >= maxSelect) return prev;
        return { ...prev, [questionId]: [...current, optionId] };
      }
      return { ...prev, [questionId]: [optionId] };
    });
  }

  function advance() {
    setAnimating(true);
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ((prev) => prev + 1);
      } else {
        setPhase("calculating");
        setTimeout(() => {
          const typeId = calculateDnaResult(answers);
          setResultType(getResultType(quiz!, typeId));
          setPhase("result");
        }, 2200);
      }
      setAnimating(false);
    }, 400);
  }

  function handleSingleSelect(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: [optionId] }));
    setTimeout(advance, 500);
  }

  const progressIndex = questions.slice(0, currentQ + 1).filter((q) => q.type !== "reveal").length;

  return (
    <div className="min-h-dvh bg-[#FAFAF8] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-6 pb-3">
        <div className="max-w-[520px] mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              if (phase === "intro" || phase === "result") router.push("/quiz");
              else if (currentQ > 0) {
                setCurrentQ((p) => p - 1);
              } else {
                setPhase("intro");
              }
            }}
            className="text-[#8A8A9A] text-[14px] tap-highlight flex items-center gap-1"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {phase === "result" ? "목록으로" : "이전"}
          </button>

          {phase === "playing" && (
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium text-[#8A8A9A]">
                {progressIndex}/{totalPlayable}
              </span>
              <div className="w-24 h-1.5 rounded-full bg-[#E8E6E1]">
                <div
                  className="h-full rounded-full bg-[#E8614D] transition-all duration-500"
                  style={{ width: `${(progressIndex / totalPlayable) * 100}%` }}
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#E8614D]/[0.06] flex items-center justify-center text-[#E8614D]">
                <QuizIcon name={quiz.meta.icon} className="[&_svg]:w-8 [&_svg]:h-8" />
              </div>
              <h1 className="text-[24px] md:text-[28px] font-bold text-[#1A1A2E] tracking-[-0.03em] mb-3">
                {quiz.meta.title}
              </h1>
              <p className="text-[15px] text-[#4A4A5A] leading-[1.7] mb-8 max-w-[400px] mx-auto">
                {quiz.meta.subtitle}
              </p>

              <div className="flex items-center justify-center gap-4 mb-10 text-[13px] text-[#8A8A9A]">
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1"/>
                    <path d="M7 4.5v3l2 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                  {quiz.meta.duration}
                </span>
                <span className="w-[1px] h-3 bg-[#E8E6E1]" />
                <span>{quiz.meta.questionCount}문항</span>
                <span className="w-[1px] h-3 bg-[#E8E6E1]" />
                <span>무료</span>
              </div>

              <button
                onClick={() => {
                  setPhase("playing");
                  setCurrentQ(0);
                }}
                className="inline-flex items-center gap-2 bg-[#E8614D] text-white text-[15px] font-semibold px-8 py-3.5 rounded-full hover:bg-[#D4503E] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(232,97,77,0.3)] active:scale-[0.97]"
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
            <div key={currentQuestion.id} className={`page-enter ${animating ? "opacity-0" : ""}`}>
              {/* Reveal (mid-point) */}
              {currentQuestion.type === "reveal" ? (
                <div className="pt-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#4A5FC1]/10 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <circle cx="14" cy="14" r="10" stroke="#4A5FC1" strokeWidth="1.5" strokeDasharray="3 2"/>
                      <circle cx="14" cy="14" r="4" fill="#4A5FC1" fillOpacity="0.2"/>
                      <circle cx="14" cy="14" r="2" fill="#4A5FC1"/>
                    </svg>
                  </div>
                  <h2 className="text-[20px] font-bold text-[#1A1A2E] tracking-[-0.02em] mb-3">
                    {currentQuestion.question}
                  </h2>
                  <p className="text-[14px] text-[#4A4A5A] leading-[1.7] mb-8">
                    {currentQuestion.subtitle}
                  </p>
                  <button
                    onClick={advance}
                    className="inline-flex items-center gap-2 bg-[#4A5FC1] text-white text-[14px] font-semibold px-6 py-3 rounded-full hover:bg-[#3A4FA1] transition-all active:scale-[0.97]"
                  >
                    마지막 질문 보기
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ) : (
                /* Standard question */
                <div className="pt-6">
                  <h2 className="text-[19px] md:text-[21px] font-bold text-[#1A1A2E] tracking-[-0.02em] mb-2 leading-[1.4]">
                    {currentQuestion.question}
                  </h2>
                  {currentQuestion.subtitle && (
                    <p className="text-[13px] text-[#8A8A9A] mb-6">
                      {currentQuestion.subtitle}
                    </p>
                  )}

                  {/* Multi-select grid */}
                  {currentQuestion.type === "multi-select" && (
                    <div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6">
                        {currentQuestion.options.map((opt) => {
                          const selected = (answers[currentQuestion.id] ?? []).includes(opt.id);
                          return (
                            <button
                              key={opt.id}
                              onClick={() =>
                                handleSelect(currentQuestion.id, opt.id, currentQuestion.maxSelect)
                              }
                              className={`p-3.5 rounded-xl text-left transition-all duration-200 active:scale-[0.97] ${
                                selected
                                  ? "bg-[#E8614D]/[0.08] border-2 border-[#E8614D]/40 shadow-[0_2px_8px_rgba(232,97,77,0.08)]"
                                  : "bg-white border-2 border-[#E8E6E1] hover:border-[#E8E6E1]/80"
                              }`}
                            >
                              <span className={`block mb-1 ${selected ? "text-[#E8614D]" : "text-[#4A4A5A]"}`}>
                                <QuizIcon name={opt.icon ?? ""} className="[&_svg]:w-5 [&_svg]:h-5" />
                              </span>
                              <span className={`text-[13px] font-medium leading-tight ${
                                selected ? "text-[#E8614D]" : "text-[#1A1A2E]"
                              }`}>
                                {opt.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-[#8A8A9A]">
                          {(answers[currentQuestion.id] ?? []).length}/{currentQuestion.maxSelect}개 선택
                        </span>
                        <button
                          onClick={advance}
                          disabled={(answers[currentQuestion.id] ?? []).length !== currentQuestion.maxSelect}
                          className="px-5 py-2.5 rounded-full bg-[#E8614D] text-white text-[14px] font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.97]"
                        >
                          다음
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Single select */}
                  {currentQuestion.type === "single" && (
                    <div className="space-y-2.5">
                      {currentQuestion.options.map((opt) => {
                        const selected = (answers[currentQuestion.id] ?? []).includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleSingleSelect(currentQuestion.id, opt.id)}
                            className={`w-full flex items-center gap-3.5 p-4 rounded-xl text-left transition-all duration-200 active:scale-[0.98] ${
                              selected
                                ? "bg-[#E8614D]/[0.06] border-2 border-[#E8614D]/30"
                                : "bg-white border-2 border-[#E8E6E1] hover:border-[#1A1A2E]/10"
                            }`}
                          >
                            <span className={`flex-shrink-0 ${selected ? "text-[#E8614D]" : "text-[#4A4A5A]"}`}>
                              <QuizIcon name={opt.icon ?? ""} className="[&_svg]:w-5 [&_svg]:h-5" />
                            </span>
                            <span className={`text-[14px] font-medium ${
                              selected ? "text-[#E8614D]" : "text-[#1A1A2E]"
                            }`}>
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ─── Calculating ─── */}
          {phase === "calculating" && (
            <div className="pt-20 text-center page-enter">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-[#E8E6E1]" />
                <div className="absolute inset-0 rounded-full border-2 border-[#E8614D] border-t-transparent animate-spin" />
                <div className="absolute inset-2 rounded-full border-2 border-[#4A5FC1] border-b-transparent animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                <div className="absolute inset-0 flex items-center justify-center text-[#E8614D]">
                  <QuizIcon name="dna" className="[&_svg]:w-7 [&_svg]:h-7" />
                </div>
              </div>
              <p className="text-[17px] font-bold text-[#1A1A2E] mb-2">
                몰입 DNA 분석 중...
              </p>
              <p className="text-[13px] text-[#8A8A9A]">
                답변 패턴을 분석하고 있어요.
              </p>
            </div>
          )}

          {/* ─── Result ─── */}
          {phase === "result" && resultType && (
            <div className="page-enter pt-4">
              {/* Result card — screenshot target */}
              <div
                className="rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(26,26,46,0.1)] mb-8"
                id="result-card"
              >
                <div
                  className="px-8 pt-10 pb-8 text-center"
                  style={{ background: `linear-gradient(135deg, ${resultType.color}18, ${resultType.color}08)` }}
                >
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center" style={{ background: `${resultType.color}15`, color: resultType.color }}>
                    <QuizIcon name={resultType.icon} className="[&_svg]:w-8 [&_svg]:h-8" />
                  </div>
                  <p className="text-[12px] font-semibold tracking-[0.06em] uppercase mb-2" style={{ color: resultType.color }}>
                    우리 아이의 몰입 DNA
                  </p>
                  <h2 className="text-[26px] font-extrabold text-[#1A1A2E] tracking-[-0.03em] mb-2">
                    {resultType.name}
                  </h2>
                  <p className="text-[15px] text-[#4A4A5A] font-medium">
                    {resultType.tagline}
                  </p>
                </div>
                <div className="bg-white px-8 py-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-[11px] font-semibold text-[#8A8A9A] tracking-[0.04em] uppercase mb-1">핵심 동력</p>
                      <p className="text-[13px] font-medium text-[#1A1A2E]">{resultType.coreDriver}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#8A8A9A] tracking-[0.04em] uppercase mb-1">몰입 트리거</p>
                      <p className="text-[13px] font-medium text-[#1A1A2E]">{resultType.flowTrigger}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E8E6E1] flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 34 34" fill="none">
                      <path d="M17 2C9.5 2 4 6.5 3 12c-1 5.5 1.5 10 5 13.5C11.5 29 14 31 17 31.5c3 .5 6.5-1 9.5-4S31 21 31 17c0-4-1.5-7.5-4.5-10.5C23.5 3.5 20.5 2 17 2z" fill="#1A1A2E" fillOpacity="0.06"/>
                      <path d="M12 10c2-2 5-1.5 6.5.5s1 5-1 6.5c-2 1.5-3.5 1-4.5-.5S10 12 12 10z" fill="#E8614D" fillOpacity="0.4"/>
                      <path d="M19 13c1.5-1 3.5-.5 4.5 1s.5 4-1 5-3.2.8-4-.5c-.8-1.3-.5-3.5.5-5.5z" fill="#4A5FC1" fillOpacity="0.35"/>
                    </svg>
                    <span className="text-[11px] text-[#8A8A9A]">탐 TAM 몰입 DNA 분석</span>
                  </div>
                </div>
              </div>

              {/* Detailed analysis */}
              <div className="space-y-6 mb-10">
                <div>
                  <h3 className="text-[16px] font-bold text-[#1A1A2E] mb-3">상세 분석</h3>
                  <p className="text-[14px] leading-[1.8] text-[#4A4A5A]">
                    {resultType.description}
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-[#E8E6E1] p-5">
                  <h4 className="text-[13px] font-semibold text-[#8A8A9A] tracking-[0.02em] mb-3">
                    이 유형의 강점
                  </h4>
                  <div className="space-y-2">
                    {resultType.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                          style={{ background: resultType.color }}
                        />
                        <p className="text-[14px] text-[#1A1A2E] leading-[1.6]">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Share + CTA */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `우리 아이 몰입 DNA: ${resultType.name}`,
                        text: `${resultType.tagline} — 탐 TAM 몰입 DNA 분석`,
                        url: window.location.href,
                      }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert("링크가 복사되었습니다!");
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#FEE500] text-[#3C1E1E] text-[14px] font-semibold transition-all active:scale-[0.97]"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 2C5.13 2 2 4.56 2 7.73c0 2.04 1.36 3.83 3.4 4.85l-.86 3.15a.3.3 0 00.45.33L8.6 13.7c.13.01.27.02.4.02 3.87 0 7-2.56 7-5.73S12.87 2 9 2z" fill="#3C1E1E"/>
                  </svg>
                  카카오톡으로 공유하기
                </button>
                <a
                  href="/"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1A1A2E] text-white text-[14px] font-semibold transition-all active:scale-[0.97]"
                >
                  탐 TAM 알아보기
                </a>
                <a
                  href="/signup"
                  className="w-full flex items-center justify-center py-3 text-[13px] font-medium text-[#4A5FC1]"
                >
                  무료로 시작하기 →
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
