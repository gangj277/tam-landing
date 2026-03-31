"use client";

import { useInView } from "@/lib/useInView";

const concerns = [
  { label: "입시 과목 쏠림", percent: 28.2, color: "bg-coral" },
  { label: "교육격차 심화 우려", percent: 21.7, color: "bg-indigo" },
  { label: "교사 부족", percent: 18.7, color: "bg-gold" },
  { label: "사교육 부담 증가", percent: 15.4, color: "bg-navy/60" },
];

export function ParentConcernsChart() {
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
          <div className="w-8 h-[1px] bg-coral" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
            학부모 우려
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          학부모가 가장 걱정하는 것
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-12 max-w-[560px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          고교학점제에 대한 학부모 설문에서 반복적으로 나타나는 우려입니다.
        </p>

        {/* Bar chart */}
        <div className="max-w-[680px] space-y-5 mb-14">
          {concerns.map((item, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ${
                isInView
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-6"
              }`}
              style={{ transitionDelay: `${300 + i * 120}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[15px] font-medium text-navy">
                  {item.label}
                </span>
                <span className="text-[15px] font-bold text-navy">
                  {item.percent}%
                </span>
              </div>
              <div className="w-full h-3 bg-bg-warm rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                  style={{
                    width: isInView ? `${(item.percent / 30) * 100}%` : "0%",
                    transitionDelay: `${400 + i * 120}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bridge text */}
        <div
          className={`max-w-[560px] mx-auto text-center transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          <div className="w-10 h-[1px] bg-border-light mx-auto mb-6" />
          <p className="text-[17px] md:text-[19px] leading-[1.7] text-navy/80">
            이 모든 우려의 근본 원인은 하나입니다.
            <br />
            <span className="font-semibold text-coral">
              아이가 자기 자신을 모른 채 선택을 강요받는 것.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
