"use client";

import { useInView } from "@/lib/useInView";

const steps = [
  {
    num: "1",
    title: "만남",
    desc: "AI가 매일 새로운 세계를 만듭니다.",
    detail: "화성 도시, 법정, 연구소, 사회적 딜레마...",
    color: "coral",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="#E8614D" strokeWidth="1.5" />
        <path d="M14 8v6l4 2" stroke="#E8614D" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="14" r="2" fill="#E8614D" fillOpacity="0.3" />
      </svg>
    ),
  },
  {
    num: "2",
    title: "선택",
    desc: "아이가 역할·관점·해결책을 직접 고릅니다.",
    detail: "정답이 없습니다. 아이의 선택이 곧 답입니다.",
    color: "indigo",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M7 14l5 5L21 9" stroke="#4A5FC1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="3" width="22" height="22" rx="4" stroke="#4A5FC1" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    num: "3",
    title: "발견",
    desc: "선택의 패턴이 쌓입니다.",
    detail: "시스템이 비춰주고, 가이드가 함께 이야기합니다.",
    color: "gold",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="#D4A853" strokeWidth="1.5" />
        <path d="M10 18c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#D4A853" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="11" cy="12" r="1.5" fill="#D4A853" />
        <circle cx="17" cy="12" r="1.5" fill="#D4A853" />
      </svg>
    ),
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; numBg: string }> = {
  coral: { bg: "bg-coral/[0.04]", border: "border-coral/10", text: "text-coral", numBg: "bg-coral" },
  indigo: { bg: "bg-indigo/[0.04]", border: "border-indigo/10", text: "text-indigo", numBg: "bg-indigo" },
  gold: { bg: "bg-gold/[0.06]", border: "border-gold/15", text: "text-gold", numBg: "bg-gold" },
};

export default function HowItWorksCompact() {
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
              작동 방식
            </span>
            <div className="w-8 h-[1px] bg-indigo" />
          </div>
          <h2
            className={`text-[28px] md:text-[40px] font-bold tracking-[-0.03em] text-navy mb-4 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            매일 10분, 이렇게 작동합니다
          </h2>
        </div>

        {/* 3 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {steps.map((step, i) => {
            const colors = colorMap[step.color];
            return (
              <div
                key={i}
                className={`relative ${colors.bg} border ${colors.border} rounded-2xl p-7 md:p-8 transition-all duration-700 hover:shadow-[0_8px_40px_rgba(26,26,46,0.06)] ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${200 + i * 150}ms` }}
              >
                {/* Step number badge */}
                <div className={`w-8 h-8 ${colors.numBg} rounded-full flex items-center justify-center mb-5`}>
                  <span className="text-[14px] font-bold text-white">
                    {step.num}
                  </span>
                </div>

                {/* Icon */}
                <div className="mb-4">{step.icon}</div>

                {/* Title */}
                <h3 className={`text-[20px] font-bold tracking-[-0.02em] mb-2 ${colors.text}`}>
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[15px] leading-[1.65] text-navy font-medium mb-1">
                  {step.desc}
                </p>
                <p className="text-[14px] leading-[1.6] text-text-secondary">
                  {step.detail}
                </p>

                {/* Connecting line (desktop only) */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 md:-right-5 w-8 md:w-10">
                    <svg width="100%" height="12" viewBox="0 0 40 12" fill="none">
                      <path
                        d="M0 6h36M32 2l4 4-4 4"
                        stroke="#E8E6E1"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mission Example */}
        <div
          className={`max-w-[640px] mx-auto transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <div className="bg-card-bg rounded-2xl border border-border-light overflow-hidden shadow-[0_4px_24px_rgba(26,26,46,0.04)]">
            {/* Mission header */}
            <div className="px-6 py-3.5 border-b border-border-light/60 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-coral/30" />
              <span className="text-[12px] font-semibold text-text-muted tracking-[0.02em]">
                미션 예시
              </span>
            </div>

            <div className="p-6 md:p-8">
              <p className="text-[17px] md:text-[19px] leading-[1.7] text-navy font-medium mb-6">
                &ldquo;화성 도시의 시장이 되었습니다.
                <br />
                물이 부족합니다.
                <br />
                <span className="text-coral">농장에 줄까요, 병원에 줄까요?</span>&rdquo;
              </p>

              {/* Next day connection */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-bg-warm border border-border-light/60">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
                  <path d="M10 3v7l5 3" stroke="#4A5FC1" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="10" cy="10" r="8" stroke="#4A5FC1" strokeWidth="1.5" />
                </svg>
                <div>
                  <p className="text-[13px] font-semibold text-indigo mb-0.5">
                    다음 날
                  </p>
                  <p className="text-[14px] leading-[1.65] text-text-secondary">
                    실제 2024 케냐 물 부족 사례.
                    어제 내 선택과 현실을 비교합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
