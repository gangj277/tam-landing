"use client";

import { useInView } from "@/lib/useInView";

const solutions = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#4A5FC1" strokeWidth="1.5" />
        <path
          d="M16 10V16L20 18"
          stroke="#4A5FC1"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="2" fill="#4A5FC1" />
      </svg>
    ),
    principle: "다양한 경험에 노출",
    title: "매일 10분, 새로운 세계",
    desc: "AI가 만든 다양한 시나리오 — 법정, 연구소, 사회적 딜레마, 창작 현장 — 에서 아이는 평소 접하지 못한 세계를 경험합니다. 이 넓은 노출이 자기이해의 첫 걸음입니다.",
    color: "indigo",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M8 16L14 22L24 10"
          stroke="#E8614D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="4"
          y="4"
          width="24"
          height="24"
          rx="4"
          stroke="#E8614D"
          strokeWidth="1.5"
        />
      </svg>
    ),
    principle: "선택의 연습",
    title: "매 시나리오에서 선택",
    desc: "아이는 시나리오 안에서 어떤 역할을, 어떤 관점을, 어떤 해결책을 선택할지 스스로 결정합니다. 138개 과목 앞에서 선택하기 전에, '선택하는 근육'을 기릅니다.",
    color: "coral",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#D4A853" strokeWidth="1.5" />
        <path
          d="M12 20C12 20 13.5 17 16 17C18.5 17 20 20 20 20"
          stroke="#D4A853"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="13" r="1.5" fill="#D4A853" />
        <circle cx="20" cy="13" r="1.5" fill="#D4A853" />
      </svg>
    ),
    principle: "패턴을 비춰주기",
    title: "주간 리포트로 발견",
    desc: "시스템이 아이의 선택 패턴을 분석하고, 주 1회 가이드가 함께 이야기합니다. '이번에도 사람을 돕는 역할을 골랐네요' — 아이는 자기 안의 경향성을 스스로 발견합니다.",
    color: "gold",
  },
];

const colorClasses: Record<string, { bg: string; text: string }> = {
  indigo: { bg: "bg-indigo/[0.06]", text: "text-indigo" },
  coral: { bg: "bg-coral/[0.06]", text: "text-coral" },
  gold: { bg: "bg-gold/[0.08]", text: "text-gold" },
};

export function TamSolutionCards() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="relative py-20 md:py-28 px-6">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-indigo" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
            준비의 핵심
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          초등~중학교 때 할 수 있는
          <br className="hidden sm:block" />
          가장 중요한 준비
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-12 max-w-[560px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          고교학점제의 진짜 준비는 과목 정보를 외우는 게 아닙니다.
          아이가 자기 자신을 알아가는 것입니다.
        </p>

        {/* 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {solutions.map((sol, i) => {
            const colors = colorClasses[sol.color];
            return (
              <div
                key={i}
                className={`bg-card-bg rounded-2xl p-7 md:p-8 border border-border-light/60 transition-all duration-700 hover:shadow-[0_8px_40px_rgba(26,26,46,0.06)] hover:border-border-light ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${300 + i * 150}ms` }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-5`}>
                  {sol.icon}
                </div>

                {/* Principle tag */}
                <span className={`text-[12px] font-semibold tracking-[0.02em] ${colors.text}`}>
                  {sol.principle}
                </span>

                <h3 className="text-[18px] md:text-[20px] font-bold text-navy tracking-[-0.02em] mt-1.5 mb-3">
                  {sol.title}
                </h3>

                <p className="text-[14px] md:text-[15px] leading-[1.7] text-text-secondary">
                  {sol.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
