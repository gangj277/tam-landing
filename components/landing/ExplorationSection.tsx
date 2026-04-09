"use client";

import Link from "next/link";
import { useInView } from "@/lib/useInView";

const benefits = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="#E8614D" strokeWidth="1.3" />
        <path d="M5.5 8l2 2 3-3.5" stroke="#E8614D" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "매일 새로운 세계와 역할 부여",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="#E8614D" strokeWidth="1.3" />
        <path d="M5.5 8l2 2 3-3.5" stroke="#E8614D" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "정답 없는 선택 — 아이의 답이 곧 답",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="#E8614D" strokeWidth="1.3" />
        <path d="M5.5 8l2 2 3-3.5" stroke="#E8614D" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "선택 패턴이 쌓여 자기이해로 연결",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="#E8614D" strokeWidth="1.3" />
        <path d="M5.5 8l2 2 3-3.5" stroke="#E8614D" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "하루 10분, 중독 없는 설계",
  },
];

export default function ExplorationSection() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="relative py-24 md:py-36 px-6 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full bg-coral/[0.02] blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-[1120px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* LEFT — Visual: Mission example card */}
          <div
            className={`transition-all duration-700 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            {/* Benefits list */}
            <div className="mb-8">
              <p className="text-[13px] font-semibold text-coral tracking-[0.04em] mb-5">
                아이의 매일이 달라집니다
              </p>
              <div className="space-y-3">
                {benefits.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5"
                  >
                    {b.icon}
                    <span className="text-[14px] text-navy/70">{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission card mockup */}
            <div className="bg-card-bg rounded-2xl border border-border-light shadow-[0_12px_48px_rgba(26,26,46,0.08)] overflow-hidden">
              {/* Header */}
              <div className="px-6 py-3.5 border-b border-border-light/60 flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-coral/40" />
                <span className="text-[12px] font-semibold text-text-muted tracking-[0.02em]">
                  오늘의 미션
                </span>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-[18px] md:text-[20px] leading-[1.65] text-navy font-medium mb-5">
                  &ldquo;화성 도시의 시장이 되었습니다.
                  <br />
                  물이 부족합니다.
                  <br />
                  <span className="text-coral font-semibold">농장에 줄까요, 병원에 줄까요?</span>&rdquo;
                </p>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-bg-warm border border-border-light/60">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 text-indigo">
                    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M9 5.5v4l3 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  <p className="text-[13px] text-text-secondary leading-[1.6]">
                    <span className="font-semibold text-indigo">다음 날</span> — 실제 케냐 물 부족 사례와 내 선택을 비교합니다
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Copy */}
          <div
            className={`transition-all duration-700 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-[1.5px] bg-coral" />
              <span className="text-[12px] font-semibold tracking-[0.06em] uppercase text-coral">
                AI 탐험 미션
              </span>
            </div>

            <h2 className="text-[28px] md:text-[40px] lg:text-[44px] font-bold tracking-[-0.03em] leading-[1.2] text-navy mb-6">
              매일 10분,
              <br />
              새로운 세계에서
              <br />
              자기 자신을 만납니다
            </h2>

            <p className="text-[15px] md:text-[17px] leading-[1.75] text-text-secondary mb-8 max-w-[420px]">
              설문지 한 장이 아닙니다.
              <br />
              다양한 세계를 경험하고, 딜레마 앞에서 선택하며,
              그 패턴 속에서 아이만의 관심과 가능성이 드러납니다.
            </p>

            <Link
              href="/consultation"
              className="inline-flex items-center gap-2 bg-coral text-white text-[15px] font-semibold px-8 py-3.5 rounded-full hover:bg-coral-hover transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(232,97,77,0.3)] active:scale-[0.98]"
            >
              상담 신청하기
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
