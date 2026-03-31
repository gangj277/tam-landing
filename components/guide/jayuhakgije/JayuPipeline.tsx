"use client";

import { useInView } from "@/lib/useInView";

const steps = [
  {
    stage: "1",
    period: "중1",
    title: "자유학기제",
    desc: "진로 탐색 시작. 주제선택과 진로탐색 활동을 통해 다양한 분야를 경험합니다.",
    color: "indigo" as const,
  },
  {
    stage: "2",
    period: "중3",
    title: "진로연계학기 (신설)",
    desc: "고교 과목 선택 연습. 고등학교 교육과정을 미리 이해하고 선택을 시뮬레이션합니다.",
    color: "gold" as const,
  },
  {
    stage: "3",
    period: "고1~",
    title: "고교학점제",
    desc: "138개 중 과목 선택. 자기이해를 바탕으로 진로에 맞는 과목을 직접 설계합니다.",
    color: "coral" as const,
  },
];

const colorMap = {
  indigo: {
    bg: "bg-indigo/[0.06]",
    text: "text-indigo",
    border: "border-indigo",
    dot: "bg-indigo",
  },
  gold: {
    bg: "bg-gold/[0.08]",
    text: "text-gold",
    border: "border-gold",
    dot: "bg-gold",
  },
  coral: {
    bg: "bg-coral/[0.06]",
    text: "text-coral",
    border: "border-coral",
    dot: "bg-coral",
  },
};

export function JayuPipeline() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section ref={ref} className="relative py-20 md:py-28 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-indigo" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
            고교학점제 연계
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          탐색에서 선택으로 이어지는 파이프라인
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-12 max-w-[600px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          자유학기제는 고교학점제로 이어지는 진로탐색 파이프라인의 첫 단계입니다.
        </p>

        {/* 3-step flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-10">
          {steps.map((step, i) => {
            const colors = colorMap[step.color];
            return (
              <div
                key={i}
                className={`relative bg-card-bg rounded-2xl p-7 md:p-8 border border-border-light/60 transition-all duration-700 hover:shadow-[0_4px_20px_rgba(26,26,46,0.05)] ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${300 + i * 150}ms` }}
              >
                {/* Step number */}
                <div
                  className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center mb-4`}
                >
                  <span className={`text-[14px] font-bold ${colors.text}`}>
                    {step.stage}
                  </span>
                </div>

                {/* Period tag */}
                <span
                  className={`text-[12px] font-semibold tracking-[0.02em] ${colors.text}`}
                >
                  {step.period}
                </span>

                <h3 className="text-[18px] md:text-[20px] font-bold text-navy tracking-[-0.02em] mt-1.5 mb-3">
                  {step.title}
                </h3>

                <p className="text-[14px] md:text-[15px] leading-[1.7] text-text-secondary">
                  {step.desc}
                </p>

                {/* Arrow connector (desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-border-light"
                    >
                      <path
                        d="M9 6L15 12L9 18"
                        stroke="currentColor"
                        strokeWidth="2"
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

        {/* Bridge text */}
        <div
          className={`mt-10 bg-card-bg border-l-[3px] border-coral/40 rounded-r-2xl px-6 md:px-8 py-6 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <p className="text-[16px] md:text-[17px] leading-[1.7] text-navy font-medium">
            이상적인 파이프라인이지만, 현실에서는...
          </p>
          <p className="text-[14px] md:text-[15px] leading-[1.7] text-text-secondary mt-2">
            자유학기가 102시간으로 축소되고, 중2~중3 사이 탐색 기회가 부재한
            상황에서 이 연결 고리는 제대로 작동하기 어렵습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
