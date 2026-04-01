"use client";

import { useInView } from "@/lib/useInView";

const trustCards = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4L6 9v7c0 7.2 4.3 13.9 10 16 5.7-2.1 10-8.8 10-16V9L16 4z" stroke="#4A5FC1" strokeWidth="1.5" fill="#4A5FC1" fillOpacity="0.06" />
        <path d="M12 16l3 3 5-6" stroke="#4A5FC1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "안전한 AI",
    desc: "다층 안전 필터로 부적절한 콘텐츠를 차단합니다. AI는 답을 주지 않고, 가능성만 열어줍니다.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="11" stroke="#E8614D" strokeWidth="1.5" fill="#E8614D" fillOpacity="0.06" />
        <path d="M16 10v6l4 2" stroke="#E8614D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "하루 10분",
    desc: "한 번의 경험은 10분이면 끝납니다. 끝없이 빠져드는 디자인이 아닙니다. 짧고 강하게, 매일.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="12" r="5" stroke="#D4A853" strokeWidth="1.5" fill="#D4A853" fillOpacity="0.06" />
        <path d="M8 26c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#D4A853" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 12h4" stroke="#D4A853" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "평가하지 않습니다",
    desc: "점수, 등급, 순위가 없습니다. 선택을 판단하지 않고, 패턴만 비춰줍니다.",
  },
];

export default function TrustSection() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6">
      <div className="mx-auto max-w-[1120px]">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className={`flex items-center justify-center gap-3 mb-6 transition-all duration-600 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="w-8 h-[1px] bg-indigo" />
            <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
              신뢰와 안전
            </span>
            <div className="w-8 h-[1px] bg-indigo" />
          </div>
          <h2
            className={`text-[28px] md:text-[40px] font-bold tracking-[-0.03em] text-navy transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            부모님이 안심할 수 있는 이유
          </h2>
        </div>

        {/* Trust cards — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[960px] mx-auto mb-14">
          {trustCards.map((card, i) => (
            <div
              key={i}
              className={`bg-card-bg rounded-2xl p-7 border border-border-light/60 transition-all duration-700 hover:shadow-[0_4px_20px_rgba(26,26,46,0.05)] ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${200 + i * 120}ms` }}
            >
              <div className="mb-4">{card.icon}</div>
              <h3 className="text-[16px] font-bold text-navy mb-3 tracking-[-0.01em]">
                {card.title}
              </h3>
              <p className="text-[14px] leading-[1.7] text-text-secondary">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Founder 1-line */}
        <div
          className={`max-w-[640px] mx-auto text-center transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-border-light" />
            <span className="text-[11px] font-semibold text-text-muted tracking-[0.06em] uppercase">
              만든 사람
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-border-light" />
          </div>
          <p className="text-[15px] leading-[1.7] text-text-secondary">
            연세대 23학번, B2B AI 소프트웨어 2년 운영, CREAI+IT 창립.
            <br />
            <span className="font-medium text-navy">
              모든 아이가 자기만의 정체성을 발견하고, 그 정체성으로 살아가는 세상을 열고 싶습니다.
            </span>
          </p>
          <p className="text-[13px] text-text-muted mt-2">
            — 강지민, 탐 TAM 대표
          </p>
        </div>
      </div>
    </section>
  );
}
