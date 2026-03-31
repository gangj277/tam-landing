"use client";

import { useInView } from "@/lib/useInView";

const limitations = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect
          x="4"
          y="4"
          width="20"
          height="20"
          rx="3"
          stroke="#E8614D"
          strokeWidth="1.5"
        />
        <path
          d="M10 14H18"
          stroke="#E8614D"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "형식적 운영",
    desc: "직업체험의 대부분이 카페, 제과점 일일체험 수준에 머무릅니다. 깊이 있는 진로 탐색이 아닌, 일회성 이벤트로 소비되는 경우가 많습니다.",
    color: "coral" as const,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#4A5FC1" strokeWidth="1.5" />
        <path
          d="M14 8V14"
          stroke="#4A5FC1"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="14" cy="18" r="1" fill="#4A5FC1" />
      </svg>
    ),
    title: "지역 편차",
    desc: "서울과 수도권의 프로그램 질과 농어촌 지역의 격차가 극심합니다. 외부 체험처 접근성에서 이미 불평등이 시작됩니다.",
    color: "indigo" as const,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M8 20V10"
          stroke="#D4A853"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M14 20V14"
          stroke="#D4A853"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M20 20V8"
          stroke="#D4A853"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M4 24H24"
          stroke="#D4A853"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "2년 공백",
    desc: "자유학기(중1)에서 고교학점제(고1) 사이, 중2~중3에는 체계적인 진로탐색 기회가 거의 없습니다. 진로연계학기(중3 2학기)가 신설되었지만, 중2 전체가 공백입니다.",
    color: "gold" as const,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#E8614D" strokeWidth="1.5" />
        <path
          d="M14 8V14L18 16"
          stroke="#E8614D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "탐색 시간 부족",
    desc: "102시간은 주 2~3시간 수준입니다. 의미 있는 자기이해를 만들기에는 턱없이 부족한 시간입니다. 기존 자유학년제 221시간의 절반도 되지 않습니다.",
    color: "coral" as const,
  },
];

const colorClasses = {
  coral: { bg: "bg-coral/[0.06]", text: "text-coral" },
  indigo: { bg: "bg-indigo/[0.06]", text: "text-indigo" },
  gold: { bg: "bg-gold/[0.08]", text: "text-gold" },
};

export function JayuLimitations() {
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
          <div className="w-8 h-[1px] bg-coral" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
            현실적 한계
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          자유학기제의 현실적 한계
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-12 max-w-[560px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          취지는 좋았지만, 현장에서 반복적으로 지적되는 문제들입니다.
        </p>

        {/* 4 limitation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 mb-14">
          {limitations.map((item, i) => {
            const colors = colorClasses[item.color];
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
                <div
                  className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-5`}
                >
                  {item.icon}
                </div>

                <h3 className="text-[18px] md:text-[20px] font-bold text-navy tracking-[-0.02em] mb-3">
                  {item.title}
                </h3>

                <p className="text-[14px] md:text-[15px] leading-[1.7] text-text-secondary">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom bridge */}
        <div
          className={`max-w-[560px] mx-auto text-center transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          <div className="w-10 h-[1px] bg-border-light mx-auto mb-6" />
          <p className="text-[17px] md:text-[19px] leading-[1.7] text-navy/80">
            이 한계를 어떻게 보완할 수 있을까요?
          </p>
        </div>
      </div>
    </section>
  );
}
