"use client";

import { useInView } from "@/lib/useInView";

const facts = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M14 4V24M8 14H20"
          stroke="#4A5FC1"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="14" cy="14" r="12" stroke="#4A5FC1" strokeWidth="1.5" />
      </svg>
    ),
    number: "+7,800만",
    source: "WEF 2025",
    headline: "2030년까지 순증 일자리",
    desc: "AI가 직업을 없앤다? 사실은 더 많이 만듭니다.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12" stroke="#4A5FC1" strokeWidth="1.5" />
        <path
          d="M10 14.5L13 17.5L18.5 11"
          stroke="#4A5FC1"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    number: "5% 미만",
    source: "McKinsey 2024",
    headline: "AI로 100% 대체 가능한 직업 비율",
    desc: "대부분의 직업은 사라지지 않고 변합니다.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12" stroke="#4A5FC1" strokeWidth="1.5" />
        <path
          d="M9 18L14 8L19 18"
          stroke="#4A5FC1"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.5 15H17.5"
          stroke="#4A5FC1"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    number: "39%",
    source: "WEF 2025",
    headline: "2030년까지 변환되는 기존 스킬",
    desc: "직업이 바뀌는 게 아니라, 필요한 능력이 바뀝니다.",
  },
];

export function AiEraNumbers() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section id="numbers" ref={ref} className="relative py-20 md:py-28 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-indigo" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
            AI 시대 숫자
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          숫자로 보는 AI 시대
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-12 max-w-[560px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          뉴스의 공포와 달리, 데이터는 다른 이야기를 합니다.
        </p>

        {/* Fact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {facts.map((fact, i) => (
            <div
              key={i}
              className={`bg-card-bg rounded-2xl p-7 border border-border-light/60 transition-all duration-700 hover:shadow-[0_8px_40px_rgba(26,26,46,0.06)] hover:border-border-light ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-indigo/[0.06] flex items-center justify-center mb-5">
                {fact.icon}
              </div>

              {/* Number */}
              <div className="text-[28px] md:text-[32px] font-extrabold tracking-[-0.03em] text-indigo leading-none mb-1">
                {fact.number}
              </div>

              {/* Source */}
              <span className="text-[11px] font-medium text-text-muted tracking-[0.02em]">
                {fact.source}
              </span>

              {/* Headline */}
              <h3 className="text-[16px] md:text-[17px] font-bold text-navy tracking-[-0.02em] mt-4 mb-2">
                {fact.headline}
              </h3>

              {/* Desc */}
              <p className="text-[14px] md:text-[15px] leading-[1.7] text-text-secondary">
                {fact.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
