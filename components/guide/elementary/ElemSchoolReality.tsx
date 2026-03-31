"use client";

import { useInView } from "@/lib/useInView";

const limitations = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#E8614D" strokeWidth="1.5" />
        <path d="M12 8V12" stroke="#E8614D" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="16" r="1" fill="#E8614D" />
      </svg>
    ),
    title: "일회성 체험",
    desc: "직업 체험 1-2회로 깊은 이해 어려움. 체험 후 연계 활동이 부족하여 일시적 흥미에 그치는 경우가 많습니다.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="3" stroke="#E8614D" strokeWidth="1.5" />
        <path d="M9 12H15" stroke="#E8614D" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "직업 중심",
    desc: "\"직업 알기\"에 집중되어 있으며, \"나 알기\"에는 미흡합니다. 아이 자신의 성향과 반응 패턴을 발견하는 기회가 부족합니다.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L14.5 8.5L20.5 9L16 13.5L17 19.5L12 17L7 19.5L8 13.5L3.5 9L9.5 8.5L12 3Z" stroke="#E8614D" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    title: "검사 의존",
    desc: "진로적성검사를 실시하지만, 10-14세는 흥미가 유동적이라 안정적 결과를 얻기 어렵습니다. 검사 결과가 아이를 규정할 위험이 있습니다.",
  },
];

export function ElemSchoolReality() {
  const { ref, isInView } = useInView(0.15);

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
            학교 진로교육
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          학교 진로교육의 현실
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-12 max-w-[560px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          학교 진로교육에는 긍정적인 면도 있지만, 구조적 한계가 있습니다.
        </p>

        {/* Positive metrics */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="bg-indigo/[0.04] rounded-2xl p-6 border border-indigo/10">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[36px] md:text-[42px] font-extrabold tracking-[-0.04em] text-indigo leading-none">
                4.08
              </span>
              <span className="text-[16px] font-medium text-indigo">/5</span>
            </div>
            <p className="text-[14px] md:text-[15px] text-text-secondary leading-[1.6]">
              진로활동 만족도
            </p>
            <span className="text-[11px] text-text-muted mt-2 inline-block">
              38,481명 조사, 교육부 2024
            </span>
          </div>

          <div className="bg-indigo/[0.04] rounded-2xl p-6 border border-indigo/10">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[36px] md:text-[42px] font-extrabold tracking-[-0.04em] text-indigo leading-none">
                4.21
              </span>
              <span className="text-[16px] font-medium text-indigo">/5</span>
            </div>
            <p className="text-[14px] md:text-[15px] text-text-secondary leading-[1.6]">
              진로체험 만족도
            </p>
            <span className="text-[11px] text-text-muted mt-2 inline-block">
              38,481명 조사, 교육부 2024
            </span>
          </div>
        </div>

        {/* Limitations */}
        <div
          className={`mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <span className="text-[12px] font-semibold tracking-[0.02em] text-coral">
            구조적 한계
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {limitations.map((item, i) => (
            <div
              key={i}
              className={`bg-card-bg rounded-2xl p-6 md:p-7 border border-border-light/60 transition-all duration-700 hover:shadow-[0_4px_20px_rgba(26,26,46,0.05)] ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${500 + i * 150}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-coral/[0.06] flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-[17px] md:text-[18px] font-bold text-navy tracking-[-0.02em] mb-2">
                {item.title}
              </h3>
              <p className="text-[14px] md:text-[15px] leading-[1.7] text-text-secondary">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
