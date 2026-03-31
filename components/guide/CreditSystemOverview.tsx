"use client";

import { useInView } from "@/lib/useInView";

const facts = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M14 3L17.5 10L25 11L19.5 16.5L21 24L14 20L7 24L8.5 16.5L3 11L10.5 10L14 3Z"
          stroke="#E8614D"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
    number: "192",
    unit: "학점",
    title: "졸업 요건",
    desc: "교과 174학점 + 창의적 체험활동 18학점",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect
          x="4"
          y="6"
          width="20"
          height="16"
          rx="2"
          stroke="#4A5FC1"
          strokeWidth="1.5"
        />
        <path d="M4 11H24" stroke="#4A5FC1" strokeWidth="1.5" />
        <path d="M10 11V22" stroke="#4A5FC1" strokeWidth="1.5" />
      </svg>
    ),
    number: "2025",
    unit: "년",
    title: "전면 시행",
    desc: "모든 고등학교에서 의무 적용",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#D4A853" strokeWidth="1.5" />
        <path
          d="M14 8V14L18 16"
          stroke="#D4A853"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    number: "138",
    unit: "개",
    title: "선택과목",
    desc: "일반 36 + 진로 64 + 융합 38개 과목",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M7 20L12 8L17 16L21 12L24 18"
          stroke="#4A5FC1"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M4 24H24" stroke="#4A5FC1" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    number: "5",
    unit: "등급",
    title: "평가 체계 개편",
    desc: "9등급 → 5등급 + 성취도 A~E 병기",
  },
];

export function CreditSystemOverview() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section id="overview" ref={ref} className="relative py-20 md:py-28 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-indigo" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
            고교학점제란
          </span>
        </div>

        {/* Definition */}
        <div
          className={`max-w-[680px] mb-14 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <h2 className="text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4">
            학생이 직접 과목을 선택하는 시대
          </h2>
          <p className="text-[16px] md:text-[17px] leading-[1.75] text-text-secondary">
            고교학점제는 학생이 진로와 적성에 따라 과목을 선택하고, 이수 기준에
            도달하면 학점을 부여받아 졸업하는 제도입니다. 정해진 시간표를 따르던
            기존 방식에서, 대학처럼 자신의 시간표를 직접 설계하는 방식으로
            바뀌었습니다.
          </p>
        </div>

        {/* 4 fact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {facts.map((fact, i) => (
            <div
              key={i}
              className={`bg-card-bg rounded-2xl p-7 md:p-8 border border-border-light/60 transition-all duration-700 hover:shadow-[0_4px_20px_rgba(26,26,46,0.05)] ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + i * 120}ms` }}
            >
              <div className="mb-4">{fact.icon}</div>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-[36px] md:text-[42px] font-extrabold tracking-[-0.04em] leading-none text-navy">
                  {fact.number}
                </span>
                <span className="text-[16px] font-semibold text-text-muted">
                  {fact.unit}
                </span>
              </div>
              <p className="text-[15px] font-semibold text-navy mb-1">
                {fact.title}
              </p>
              <p className="text-[14px] leading-[1.6] text-text-secondary">
                {fact.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
