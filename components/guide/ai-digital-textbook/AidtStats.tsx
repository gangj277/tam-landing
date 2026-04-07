"use client";

import { useInView } from "@/lib/useInView";
import CountUpNumber from "@/components/interactive/CountUpNumber";

const stats = [
  {
    end: 68.3,
    suffix: "%",
    label: "학부모가 디지털 기기\n과의존 문제를 우려",
    source: "교육부 학부모 모니터단 2025",
    color: "coral" as const,
  },
  {
    end: 8.1,
    suffix: "%",
    label: "10일 이상 실제\n활용한 학생 비율",
    source: "감사원 2025",
    color: "coral" as const,
  },
  {
    end: 85.5,
    suffix: "%",
    label: "교사가 활용을\n중단하거나 미활용",
    source: "감사원 2025",
    color: "indigo" as const,
  },
];

const colorMap = {
  coral: {
    number: "text-coral",
    corner: "from-coral/20",
  },
  indigo: {
    number: "text-indigo",
    corner: "from-indigo/20",
  },
};

export function AidtStats() {
  const { ref, isInView } = useInView(0.2);

  return (
    <section id="survey" ref={ref} className="relative py-20 md:py-28 px-6">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-coral" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
            현실 점검
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          숫자가 말하는 현실
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-12 max-w-[600px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          1조 4,093억원이 투입되었지만, 현장의 목소리는 다릅니다.
        </p>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-14">
          {stats.map((stat, i) => {
            const colors = colorMap[stat.color];
            return (
              <div
                key={i}
                className={`group relative bg-card-bg rounded-2xl p-8 md:p-10 border border-border-light/60 transition-all duration-700 hover:shadow-[0_8px_40px_rgba(26,26,46,0.06)] hover:border-border-light ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${300 + i * 150}ms` }}
              >
                {/* Number */}
                <div
                  className={`text-[48px] md:text-[56px] font-extrabold tracking-[-0.04em] leading-none ${colors.number} mb-4`}
                >
                  <CountUpNumber
                    end={stat.end}
                    suffix={stat.suffix}
                    trigger={isInView}
                  />
                </div>

                {/* Description */}
                <p className="text-[14px] md:text-[15px] leading-[1.65] text-text-secondary whitespace-pre-line mb-4">
                  {stat.label}
                </p>

                {/* Source */}
                <span className="text-[11px] font-medium text-text-muted tracking-[0.02em]">
                  {stat.source}
                </span>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
                  <div
                    className={`absolute top-0 right-0 w-[1px] h-8 bg-gradient-to-b ${colors.corner} to-transparent`}
                  />
                  <div
                    className={`absolute top-0 right-0 h-[1px] w-8 bg-gradient-to-l ${colors.corner} to-transparent`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Budget callout */}
        <div
          className={`bg-coral/[0.04] rounded-2xl p-6 md:p-7 border border-coral/10 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "750ms" }}
        >
          <p className="text-[15px] md:text-[16px] leading-[1.7] text-navy text-center font-medium">
            투입 예산{" "}
            <span className="text-coral font-bold">1조 4,093억원</span> ·
            미접속 학생{" "}
            <span className="text-coral font-bold">60%</span> · 채택교{" "}
            <span className="text-coral font-bold">58.8% 감소</span>
            <br />
            <span className="text-text-secondary font-normal text-[14px]">
              (2023~2025 감사원 조사 기준)
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
