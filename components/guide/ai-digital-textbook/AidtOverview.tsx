"use client";

import { useInView } from "@/lib/useInView";

const comparison = [
  {
    type: "종이 교과서",
    badge: "기존",
    badgeColor: "bg-text-muted/10 text-text-muted",
    items: [
      { label: "소통 방식", value: "일방향 — 읽고 시청" },
      { label: "콘텐츠", value: "텍스트 · 사진 · 표" },
      { label: "학습 진도", value: "전체 학생 동일 진도" },
      { label: "피드백", value: "시험 후 일괄 확인" },
    ],
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M6 6H20C21.1 6 22 6.9 22 8V26L14 22L6 26V6Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M10 12H18M10 16H15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    type: "AI 디지털교과서",
    badge: "2025~",
    badgeColor: "bg-indigo/[0.08] text-indigo",
    items: [
      { label: "소통 방식", value: "쌍방향 — AI에게 질문 가능" },
      { label: "콘텐츠", value: "영상 · 시뮬레이션 · 게이미피케이션" },
      { label: "학습 진도", value: "학생별 맞춤 진도" },
      { label: "피드백", value: "실시간 AI 분석 + 교사 대시보드" },
    ],
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect
          x="6"
          y="6"
          width="20"
          height="20"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="16" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 22C12 19.8 13.8 18 16 18C18.2 18 20 19.8 20 22"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M22 10L24 10M22 14L24 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const features = [
  {
    title: "학습 진단 · 분석",
    desc: "AI가 학생 개별 수준을 실시간 진단",
    color: "indigo",
  },
  {
    title: "맞춤 학습경로 추천",
    desc: "수준에 맞는 문제 · 영상 · 자료 제공",
    color: "coral",
  },
  {
    title: "AI 튜터",
    desc: "모르는 개념에 대해 질문하고 스스로 답을 찾도록 안내",
    color: "gold",
  },
];

const featureColors: Record<string, { bg: string; text: string }> = {
  indigo: { bg: "bg-indigo/[0.06]", text: "text-indigo" },
  coral: { bg: "bg-coral/[0.06]", text: "text-coral" },
  gold: { bg: "bg-gold/[0.08]", text: "text-gold" },
};

export function AidtOverview() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section id="overview" ref={ref} className="relative py-20 md:py-28 px-6">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-indigo" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
            무엇이 다른가
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          AI 디지털교과서란 무엇인가
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-12 max-w-[640px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          종이 교과서를 디지털화한 것이 아닙니다. AI가 학생 개인의 수준을
          분석하고, 맞춤형 학습을 제공하는 새로운 교육 도구입니다.
        </p>

        {/* Comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-12">
          {comparison.map((card, i) => (
            <div
              key={i}
              className={`bg-card-bg rounded-2xl p-7 md:p-8 border border-border-light/60 transition-all duration-700 hover:shadow-[0_8px_40px_rgba(26,26,46,0.06)] ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-navy/[0.04] text-navy/60 flex items-center justify-center">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-[18px] md:text-[20px] font-bold text-navy tracking-[-0.02em]">
                    {card.type}
                  </h3>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${card.badgeColor}`}
                  >
                    {card.badge}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {card.items.map((item, j) => (
                  <div key={j}>
                    <span className="text-[12px] font-semibold text-text-muted uppercase tracking-[0.04em]">
                      {item.label}
                    </span>
                    <p className="text-[15px] leading-[1.6] text-text-secondary mt-0.5">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Arrow between cards (centered, desktop only) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-[calc(50%-20px)] w-10 h-10 rounded-full bg-white border border-border-light shadow-sm items-center justify-center z-10 pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 4L10 8L6 12"
              stroke="#4A5FC1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Key features */}
        <div
          className={`transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <p className="text-[13px] font-semibold text-text-muted uppercase tracking-[0.06em] mb-5">
            핵심 기능 3가지
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const colors = featureColors[f.color];
              return (
                <div
                  key={i}
                  className={`${colors.bg} rounded-xl p-5 border border-transparent`}
                >
                  <h4
                    className={`text-[15px] font-bold ${colors.text} mb-1.5`}
                  >
                    {f.title}
                  </h4>
                  <p className="text-[14px] leading-[1.6] text-text-secondary">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Important note */}
        <div
          className={`mt-8 bg-bg-warm rounded-xl px-6 py-4 border border-border-light/40 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "750ms" }}
        >
          <p className="text-[14px] leading-[1.7] text-text-secondary">
            <span className="font-semibold text-navy">참고:</span> AI
            디지털교과서 도입 후에도 종이 교과서와{" "}
            <span className="font-semibold text-navy">병행 사용</span>이
            원칙입니다. 종이 교과서를 대체하는 것이 아닙니다.
          </p>
        </div>
      </div>
    </section>
  );
}
