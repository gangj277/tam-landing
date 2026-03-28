"use client";

import { useState, useEffect, useRef } from "react";
import { SEOYEON_PROFILE, PAST_SESSIONS } from "@/lib/dummy-data";

/* ─── SVG Illustrations ─── */

function ReportHeaderSVG() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <defs>
        <linearGradient id="reportBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A5FC1" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#4A5FC1" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect width="44" height="44" rx="14" fill="url(#reportBg)" />
      {/* Open book */}
      <path d="M11 14 Q22 10 22 10 Q22 10 33 14 L33 32 Q22 28 22 28 Q22 28 11 32 Z" fill="none" stroke="#4A5FC1" strokeWidth="1.5" opacity="0.5" />
      <line x1="22" y1="10" x2="22" y2="28" stroke="#4A5FC1" strokeWidth="1" opacity="0.3" />
      {/* Text lines */}
      <line x1="14" y1="18" x2="19" y2="17" stroke="#4A5FC1" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      <line x1="14" y1="21" x2="18" y2="20" stroke="#4A5FC1" strokeWidth="0.8" opacity="0.25" strokeLinecap="round" />
      <line x1="14" y1="24" x2="19" y2="23.5" stroke="#4A5FC1" strokeWidth="0.8" opacity="0.2" strokeLinecap="round" />
      <line x1="25" y1="17" x2="30" y2="18" stroke="#4A5FC1" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      <line x1="25" y1="20" x2="29" y2="21" stroke="#4A5FC1" strokeWidth="0.8" opacity="0.25" strokeLinecap="round" />
      {/* Star / insight marker */}
      <path d="M22 6 L23 8.5 L25.5 8.5 L23.5 10 L24.3 12.5 L22 11 L19.7 12.5 L20.5 10 L18.5 8.5 L21 8.5 Z" fill="#D4A853" opacity="0.5" />
    </svg>
  );
}

function PatternBadgeSVG({ number }: { number: number }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" fill="#4A5FC1" fillOpacity="0.08" stroke="#4A5FC1" strokeWidth="1.2" strokeOpacity="0.3" />
      <text x="14" y="18" textAnchor="middle" fill="#4A5FC1" fontSize="12" fontWeight="700" opacity="0.7">
        {number}
      </text>
    </svg>
  );
}

function QuoteSVG() {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
      <path
        d="M4 14C4 10.5 6 7.5 10 6L11 8C8.5 9 7.5 10.5 7.5 12H11V18H4V14Z"
        fill="#4A5FC1"
        opacity="0.15"
      />
      <path
        d="M17 14C17 10.5 19 7.5 23 6L24 8C21.5 9 20.5 10.5 20.5 12H24V18H17V14Z"
        fill="#4A5FC1"
        opacity="0.15"
      />
    </svg>
  );
}

function DownloadSVG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2V12M9 12L5 8M9 12L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 14V15C3 15.5523 3.44772 16 4 16H14C14.5523 16 15 15.5523 15 15V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronLeftSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendArrowSVG({ trend }: { trend: "up" | "stable" | "exploring" }) {
  if (trend === "up") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 10 L7 4 L11 10" fill="none" stroke="#4AAF7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (trend === "stable") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <line x1="2" y1="7" x2="12" y2="7" stroke="#D4A853" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 9 Q5 3 7 7 Q9 11 12 5" fill="none" stroke="#4A5FC1" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="5" r="1.5" fill="#4A5FC1" opacity="0.5" />
    </svg>
  );
}

function WorldTagSVG() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <ellipse cx="6" cy="6" rx="2.5" ry="5" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
      <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

/* ─── Data ─── */

const DISCOVERED_PATTERNS = [
  {
    number: 1,
    title: "완성도보다 독특함을 자주 선택했어요",
    detail: "선택의 순간에서 '안전한 정답'보다 '특이한 시도'를 택한 비율이 높았습니다.",
    stat: "5번 중 4번",
    color: "#4A5FC1",
  },
  {
    number: 2,
    title: "다른 사람을 돕는 역할에서 몰입도가 높았어요",
    detail: "리더, 디자이너 등 역할 중 '타인을 위해 일하는' 미션에서 대화량이 가장 많았습니다.",
    stat: "시장, 중재자",
    color: "#E8614D",
  },
  {
    number: 3,
    title: "AI 도구를 적극적으로 활용하기 시작했어요",
    detail: "초반에는 기본 선택만 했지만, 4일차부터 '더 넓혀보기'와 '다른 시각' 도구를 사용하기 시작했습니다.",
    stat: "지난주 대비 2배",
    color: "#D4A853",
  },
];

const EXPLORED_WORLDS = [
  "화성 도시",
  "동물구조센터",
  "초등학교 급식실",
  "중학교 교실",
  "우리 집",
  "놀이공원",
  "광고 회사",
];

const DELTA_LABELS: Record<string, string> = {
  up: "+7",
  stable: "유지",
  exploring: "탐색 중",
};

const BAR_COLORS = ["#4A5FC1", "#E8614D", "#D4A853", "#4A5FC1"];

const GUIDE_COMMENT =
  "서연이는 '지금 눈앞의 사람'을 먼저 생각하는 경향이 있습니다. 효율보다 공감을 선택하는 순간이 많았고, 한번 내린 결정은 끝까지 밀고 나가는 모습을 보여주었습니다. 아직 탐험 초반이지만, 자기 기준이 서서히 만들어지고 있는 모습이 인상적입니다.";

/* ─── Component ─── */

export default function ParentPage() {
  const profile = SEOYEON_PROFILE;
  const [mounted, setMounted] = useState(false);
  const [barsVisible, setBarsVisible] = useState(false);
  const barSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBarsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const currentRef = barSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div className="page-enter px-5 pt-14 pb-6">
      {/* ── Header ── */}
      <div
        className={`mb-7 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <ReportHeaderSVG />
          <div>
            <h1 className="text-[20px] font-bold text-navy tracking-tight">
              서연이의 탐험 리포트
            </h1>
            <p className="text-[12px] text-text-muted">
              2024년 3월 4주차
            </p>
          </div>
        </div>
      </div>

      {/* ── Weekly Summary Card ── */}
      <div
        className={`mb-6 ${mounted ? "animate-fade-in-up delay-100" : "opacity-0"}`}
        style={{ animationFillMode: "both" }}
      >
        <div className="bg-card-bg rounded-2xl px-5 py-5 border border-border-light shadow-sm">
          <h2 className="text-[14px] font-bold text-navy mb-4">
            이번 주 요약
          </h2>

          {/* Stats row */}
          <div className="flex gap-4 mb-4">
            <div className="text-center flex-1">
              <p className="text-[24px] font-bold text-indigo">{profile.stats.totalMissions}</p>
              <p className="text-[11px] text-text-muted">미션 완료</p>
            </div>
            <div className="w-[1px] bg-border-light" />
            <div className="text-center flex-1">
              <p className="text-[24px] font-bold text-coral">{profile.stats.totalMinutes}분</p>
              <p className="text-[11px] text-text-muted">총 탐험 시간</p>
            </div>
            <div className="w-[1px] bg-border-light" />
            <div className="text-center flex-1">
              <p className="text-[24px] font-bold text-gold">{profile.stats.currentStreak}일</p>
              <p className="text-[11px] text-text-muted">연속 참여</p>
            </div>
          </div>

          {/* Explored worlds tags */}
          <div>
            <p className="text-[11px] font-semibold text-text-muted mb-2">탐험한 세계</p>
            <div className="flex flex-wrap gap-1.5">
              {EXPLORED_WORLDS.map((world) => (
                <span
                  key={world}
                  className="inline-flex items-center gap-1 text-[11px] text-indigo bg-indigo-light px-2.5 py-1 rounded-lg"
                >
                  <WorldTagSVG />
                  {world}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Discovered Patterns ── */}
      <div
        className={`mb-6 ${mounted ? "animate-fade-in-up delay-200" : "opacity-0"}`}
        style={{ animationFillMode: "both" }}
      >
        <h2 className="text-[15px] font-bold text-navy mb-1">
          발견된 패턴
        </h2>
        <p className="text-[12px] text-text-muted mb-4">
          서연이의 선택과 대화에서 관찰된 특성입니다
        </p>

        <div className="flex flex-col gap-3">
          {DISCOVERED_PATTERNS.map((pattern, idx) => (
            <div
              key={pattern.number}
              className={`bg-card-bg rounded-2xl px-4 py-4 border border-border-light shadow-sm ${mounted ? "animate-fade-in-up" : "opacity-0"}`}
              style={{
                animationDelay: `${300 + idx * 120}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <PatternBadgeSVG number={pattern.number} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-navy leading-snug mb-1.5">
                    {pattern.title}
                  </p>
                  <p className="text-[12px] text-text-secondary leading-relaxed mb-2">
                    {pattern.detail}
                  </p>
                  <span
                    className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                    style={{
                      background: `${pattern.color}12`,
                      color: pattern.color,
                    }}
                  >
                    {pattern.stat}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Interest Area Changes ── */}
      <div
        ref={barSectionRef}
        className={`mb-6 ${mounted ? "animate-fade-in-up delay-500" : "opacity-0"}`}
        style={{ animationFillMode: "both" }}
      >
        <h2 className="text-[15px] font-bold text-navy mb-1">
          관심 영역 변화
        </h2>
        <p className="text-[12px] text-text-muted mb-4">
          지난주 대비 서연이의 관심 영역 변화입니다
        </p>

        <div className="bg-card-bg rounded-2xl px-5 py-5 border border-border-light shadow-sm">
          <div className="flex flex-col gap-5">
            {profile.interestMap.map((area, idx) => (
              <div key={area.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold text-navy">
                    {area.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                      style={{
                        background: area.trend === "up"
                          ? "#E8F5E9"
                          : area.trend === "stable"
                            ? "#FFF8E1"
                            : "#EEF0F9",
                        color: area.trend === "up"
                          ? "#4AAF7A"
                          : area.trend === "stable"
                            ? "#D4A853"
                            : "#4A5FC1",
                      }}
                    >
                      {DELTA_LABELS[area.trend]}
                    </span>
                    <TrendArrowSVG trend={area.trend} />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-bg-warm rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: barsVisible ? `${area.score}%` : "0%",
                        background: BAR_COLORS[idx],
                        transition: `width 1s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 150}ms`,
                        opacity: 0.75,
                      }}
                    />
                  </div>
                  <span
                    className="text-[13px] font-bold w-10 text-right"
                    style={{ color: BAR_COLORS[idx] }}
                  >
                    {area.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Guide Comment ── */}
      <div
        className={`mb-7 ${mounted ? "animate-fade-in-up delay-600" : "opacity-0"}`}
        style={{ animationFillMode: "both" }}
      >
        <h2 className="text-[15px] font-bold text-navy mb-3">
          가이드의 관찰
        </h2>

        <div className="relative bg-indigo-light rounded-2xl px-5 py-5 border border-border-light shadow-sm overflow-hidden">
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-[0.04]">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="80" cy="0" r="60" fill="#4A5FC1" />
            </svg>
          </div>

          <div className="mb-3">
            <QuoteSVG />
          </div>

          <p className="text-[13px] text-navy leading-[1.8] relative z-10">
            {GUIDE_COMMENT}
          </p>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border-light">
            <div className="w-7 h-7 rounded-full bg-indigo flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1 L8.5 5 L13 5.5 L9.5 8.5 L10.5 13 L7 10.5 L3.5 13 L4.5 8.5 L1 5.5 L5.5 5 Z" fill="#FFF" opacity="0.9" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-indigo">TAM 가이드</p>
              <p className="text-[10px] text-text-muted">서연이의 AI 탐험 동반자</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Actions ── */}
      <div
        className={`flex gap-3 ${mounted ? "animate-fade-in-up delay-700" : "opacity-0"}`}
        style={{ animationFillMode: "both" }}
      >
        <button className="flex-1 flex items-center justify-center gap-2 bg-card-bg text-text-secondary font-semibold text-[13px] py-3.5 rounded-xl border border-border-light shadow-sm active:bg-bg-warm transition-colors tap-highlight">
          <ChevronLeftSVG />
          이전 주 보기
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-card-bg text-text-secondary font-semibold text-[13px] py-3.5 rounded-xl border border-border-light shadow-sm active:bg-bg-warm transition-colors tap-highlight">
          <DownloadSVG />
          PDF 다운로드
        </button>
      </div>
    </div>
  );
}
