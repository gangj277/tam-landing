"use client";

import { useState } from "react";

type Choice = "farm" | "hospital" | null;

export default function MissionDemo() {
  const [choice, setChoice] = useState<Choice>(null);

  const responses: Record<
    "farm" | "hospital",
    { title: string; body: string; insight: string }
  > = {
    farm: {
      title: "농장을 선택했습니다",
      body: "식량이 없으면 모두가 위험하다는 판단이었네요.\n장기적 생존을 먼저 생각하는, 실용적이고 전체를 내다보는 선택입니다.",
      insight: "효율과 전체 이익을 중시하는 성향",
    },
    hospital: {
      title: "병원을 선택했습니다",
      body: "지금 아픈 사람을 먼저 돌봐야 한다는 판단이었네요.\n눈앞의 고통에 먼저 반응하는, 사람을 향한 따뜻한 시선이 느껴집니다.",
      insight: "공감과 즉각적 돌봄을 중시하는 성향",
    },
  };

  return (
    <div className="relative mx-auto max-w-[420px]">
      {/* Phone frame */}
      <div className="relative bg-card-bg rounded-[28px] border border-border-light shadow-[0_12px_48px_rgba(26,26,46,0.1),0_1px_3px_rgba(26,26,46,0.04)] overflow-hidden">
        {/* Status bar mockup */}
        <div className="flex items-center justify-between py-3 px-6">
          <span className="text-[10px] text-text-muted/50 font-medium">9:41</span>
          <div className="w-20 h-1 rounded-full bg-navy/10" />
          <div className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-text-muted/40">
              <rect x="1" y="6" width="2" height="5" rx="0.5" fill="currentColor"/>
              <rect x="4" y="4" width="2" height="7" rx="0.5" fill="currentColor"/>
              <rect x="7" y="2" width="2" height="9" rx="0.5" fill="currentColor"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-8">
          {!choice ? (
            <>
              {/* Scene illustration — Mars landscape */}
              <div className="relative mb-5 rounded-2xl overflow-hidden bg-gradient-to-b from-[#2D1B4E] via-[#4A2C5A] to-[#C2654A] h-[140px]">
                {/* Stars */}
                <div className="absolute top-3 left-6 w-1 h-1 rounded-full bg-white/60" />
                <div className="absolute top-5 right-8 w-0.5 h-0.5 rounded-full bg-white/40" />
                <div className="absolute top-2 right-20 w-0.5 h-0.5 rounded-full bg-white/50" />
                <div className="absolute top-8 left-16 w-0.5 h-0.5 rounded-full bg-white/30" />
                {/* Mars terrain */}
                <svg className="absolute bottom-0 w-full" height="50" viewBox="0 0 420 50" preserveAspectRatio="none">
                  <path d="M0,35 Q60,15 120,30 T240,25 T360,32 T420,28 L420,50 L0,50 Z" fill="#B85A3A" opacity="0.6"/>
                  <path d="M0,42 Q80,30 160,38 T320,35 T420,40 L420,50 L0,50 Z" fill="#A04830" opacity="0.8"/>
                </svg>
                {/* Dome buildings */}
                <svg className="absolute bottom-[18px] left-[20%]" width="48" height="36" viewBox="0 0 48 36" fill="none">
                  <ellipse cx="24" cy="28" rx="20" ry="8" fill="#D4A853" fillOpacity="0.15"/>
                  <path d="M8,28 Q8,8 24,6 Q40,8 40,28" fill="white" fillOpacity="0.12" stroke="white" strokeWidth="0.5" strokeOpacity="0.3"/>
                  <rect x="20" y="22" width="8" height="6" rx="1" fill="#4A5FC1" fillOpacity="0.3"/>
                </svg>
                <svg className="absolute bottom-[18px] right-[22%]" width="32" height="28" viewBox="0 0 32 28" fill="none">
                  <path d="M4,24 Q4,8 16,6 Q28,8 28,24" fill="white" fillOpacity="0.08" stroke="white" strokeWidth="0.5" strokeOpacity="0.2"/>
                  <rect x="13" y="18" width="6" height="6" rx="1" fill="#E8614D" fillOpacity="0.3"/>
                </svg>
                {/* Mission label overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
                  <span className="text-[10px] font-semibold text-white/90 tracking-[0.04em]">
                    오늘의 미션
                  </span>
                </div>
              </div>

              {/* Mission context */}
              <div className="mb-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-[11px] font-bold tracking-[0.04em] text-coral uppercase">
                    DAY 01
                  </span>
                  <div className="w-[1px] h-3 bg-border-light" />
                  <span className="text-[11px] text-text-muted">
                    세계 탐험
                  </span>
                </div>
                <h4 className="text-[18px] font-bold text-navy tracking-[-0.02em] mb-2">
                  화성 첫 도시의 시장
                </h4>
                <p className="text-[14px] leading-[1.75] text-text-secondary">
                  인류 최초의 화성 도시 <span className="font-medium text-navy">아레스</span>를 세운 지 3개월.
                  인구 2,400명이 돔 안에서 살고 있어.
                  그런데 예상보다 빠르게 지하수가 줄어들고 있어.
                </p>
              </div>

              {/* Situation card */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-coral/[0.04] to-indigo/[0.04] border border-navy/[0.06]">
                <div className="flex items-start gap-2.5">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 mt-0.5">
                    <circle cx="9" cy="9" r="7" stroke="#E8614D" strokeWidth="1.2"/>
                    <path d="M9 6v4M9 12.5v.5" stroke="#E8614D" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <div>
                    <p className="text-[13px] font-semibold text-navy mb-1">
                      긴급 보고
                    </p>
                    <p className="text-[12px] leading-[1.65] text-text-secondary">
                      남은 물로는 한 곳에만 우선 공급이 가능합니다.
                      시장으로서 결정을 내려주세요.
                    </p>
                  </div>
                </div>
              </div>

              {/* Choices */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setChoice("farm")}
                  className="group relative p-4 rounded-xl border-2 border-border-light bg-card-bg text-left transition-all duration-200 hover:border-indigo hover:shadow-[0_4px_16px_rgba(74,95,193,0.1)] active:scale-[0.97]"
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-2.5">
                    <rect x="2" y="18" width="28" height="12" rx="2" fill="#4A5FC1" fillOpacity="0.06" stroke="#4A5FC1" strokeWidth="1"/>
                    <path d="M8 18V11l8-6 8 6v7" stroke="#4A5FC1" strokeWidth="1.2" strokeLinejoin="round"/>
                    <path d="M13 18v-4h6v4" stroke="#4A5FC1" strokeWidth="1" strokeLinejoin="round"/>
                    <circle cx="24" cy="7" r="4" stroke="#D4A853" strokeWidth="1" fill="#D4A853" fillOpacity="0.12"/>
                    <path d="M22.5 7h3M24 5.5v3" stroke="#D4A853" strokeWidth="0.8" strokeLinecap="round"/>
                  </svg>
                  <span className="text-[15px] font-bold text-navy block mb-1">
                    농장에 보낸다
                  </span>
                  <span className="text-[12px] text-text-secondary leading-[1.5] block">
                    식량 생산이 멈추면
                    <br />
                    모두가 위험해진다
                  </span>
                  <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-indigo/70 font-medium">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="0.8"/><path d="M3 5h4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/></svg>
                    장기 생존 전략
                  </div>
                </button>

                <button
                  onClick={() => setChoice("hospital")}
                  className="group relative p-4 rounded-xl border-2 border-border-light bg-card-bg text-left transition-all duration-200 hover:border-coral hover:shadow-[0_4px_16px_rgba(232,97,77,0.1)] active:scale-[0.97]"
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-2.5">
                    <rect x="6" y="8" width="20" height="20" rx="3" stroke="#E8614D" strokeWidth="1.2" fill="#E8614D" fillOpacity="0.04"/>
                    <line x1="16" y1="13" x2="16" y2="23" stroke="#E8614D" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="11" y1="18" x2="21" y2="18" stroke="#E8614D" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 8V5a4 4 0 018 0v3" stroke="#E8614D" strokeWidth="1"/>
                  </svg>
                  <span className="text-[15px] font-bold text-navy block mb-1">
                    병원에 보낸다
                  </span>
                  <span className="text-[12px] text-text-secondary leading-[1.5] block">
                    지금 아픈 사람부터
                    <br />
                    먼저 살려야 한다
                  </span>
                  <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-coral/70 font-medium">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="3" fill="currentColor" fillOpacity="0.2"/><circle cx="5" cy="5" r="1.5" fill="currentColor"/></svg>
                    즉각적 돌봄
                  </div>
                </button>
              </div>
            </>
          ) : (
            /* Result */
            <div className="animate-fade-in">
              {/* Choice result */}
              <div className="mb-5 rounded-2xl overflow-hidden">
                <div
                  className="px-5 py-3"
                  style={{
                    background:
                      choice === "farm"
                        ? "linear-gradient(135deg, #4A5FC1 0%, #3A4FA1 100%)"
                        : "linear-gradient(135deg, #E8614D 0%, #C8503E 100%)",
                  }}
                >
                  <p className="text-[14px] font-semibold text-white">
                    {responses[choice].title}
                  </p>
                </div>
                <div className="p-5 bg-card-bg border border-border-light border-t-0 rounded-b-2xl">
                  <p className="text-[13px] leading-[1.75] text-text-secondary whitespace-pre-line mb-4">
                    {responses[choice].body}
                  </p>
                  {/* Insight tag */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-warm">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="5" stroke="#D4A853" strokeWidth="1"/>
                      <path d="M7 4.5v3" stroke="#D4A853" strokeWidth="1.2" strokeLinecap="round"/>
                      <circle cx="7" cy="10" r="0.5" fill="#D4A853"/>
                    </svg>
                    <span className="text-[11px] font-medium text-gold">
                      {responses[choice].insight}
                    </span>
                  </div>
                </div>
              </div>

              {/* Connection message */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-coral/[0.03] to-indigo/[0.03] border border-navy/[0.06] mb-5">
                <p className="text-[14px] leading-[1.75] text-navy">
                  아이도 이런 선택을 <span className="font-bold text-coral">매일</span> 합니다.
                </p>
                <p className="text-[13px] leading-[1.7] text-text-secondary mt-1.5">
                  화성 시장, 해양 탐험가, 미래 학교 설계자...
                  <br />
                  매일 다른 세계에서 내리는 선택들이 쌓여
                  <br />
                  <span className="font-medium text-navy">아이만의 생각 지도</span>가 만들어집니다.
                </p>
              </div>

              <button
                onClick={() => setChoice(null)}
                className="w-full flex items-center justify-center gap-1.5 text-[13px] font-medium text-indigo hover:text-coral transition-colors py-2"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M3 7l3-3M3 7l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                다시 선택해보기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
