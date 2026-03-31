"use client";

import { useInView } from "@/lib/useInView";
import CountUpNumber from "@/components/interactive/CountUpNumber";

const stats = [
  {
    end: 90,
    suffix: "%",
    label: "학부모가 고교학점제\n현재 운영방식에 불만족",
    source: "교육을비추다 설문, 741명",
  },
  {
    end: 75.5,
    suffix: "%",
    label: "고1 학생·학부모가\n고교학점제 경험을 부정적으로 평가",
    source: "종로학원, 2025 (470명)",
  },
  {
    end: 68.1,
    suffix: "%",
    label: "과목 선택 시 가장 큰 영향 요인이\n'대입 유불리'라고 응답",
    source: "종로학원, 2025",
  },
];

export function GuideStatsSection() {
  const { ref, isInView } = useInView(0.2);

  return (
    <section ref={ref} className="relative py-20 md:py-28 px-6">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-12 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-coral" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
            현장의 목소리
          </span>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-14">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`group relative bg-card-bg rounded-2xl p-8 md:p-10 border border-border-light/60 transition-all duration-700 hover:shadow-[0_8px_40px_rgba(26,26,46,0.06)] hover:border-border-light ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              {/* Number */}
              <div className="text-[48px] md:text-[56px] font-extrabold tracking-[-0.04em] leading-none text-coral mb-4">
                <CountUpNumber
                  end={Math.floor(stat.end)}
                  suffix={stat.end % 1 !== 0 ? `.${String(stat.end).split(".")[1]}${stat.suffix}` : stat.suffix}
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
                <div className="absolute top-0 right-0 w-[1px] h-8 bg-gradient-to-b from-coral/20 to-transparent" />
                <div className="absolute top-0 right-0 h-[1px] w-8 bg-gradient-to-l from-coral/20 to-transparent" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <p
          className={`text-center text-[17px] md:text-[19px] leading-[1.7] text-navy/80 font-normal max-w-[560px] mx-auto transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          이 숫자들은 학부모의 불안이 아닙니다.
          <br />
          <span className="font-semibold text-navy">현실입니다.</span>
        </p>
      </div>
    </section>
  );
}
