"use client";

import { useInView } from "@/lib/useInView";

const grades = [
  { grade: "1등급", percent: 10, width: "10%", color: "bg-coral" },
  { grade: "2등급", percent: 24, width: "24%", color: "bg-coral/70" },
  { grade: "3등급", percent: 32, width: "32%", color: "bg-coral/50" },
  { grade: "4등급", percent: 24, width: "24%", color: "bg-coral/35" },
  { grade: "5등급", percent: 10, width: "10%", color: "bg-coral/20" },
];

export function GradingSystemVisual() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section id="grading" ref={ref} className="relative py-20 md:py-28 px-6">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-gold" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-gold">
            평가 체계
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-10 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          달라진 성적 평가, 한눈에 보기
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Card 1: 5등급 상대평가 */}
          <div
            className={`bg-card-bg rounded-2xl p-7 md:p-8 border border-border-light/60 transition-all duration-700 ${
              isInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[13px] font-semibold text-coral tracking-[0.02em]">
                공통 + 일반선택
              </span>
            </div>
            <h3 className="text-[20px] font-bold text-navy tracking-[-0.02em] mb-5">
              5등급 상대평가
            </h3>

            {/* Visual grade bars */}
            <div className="flex w-full h-12 rounded-xl overflow-hidden mb-4">
              {grades.map((g, i) => (
                <div
                  key={i}
                  className={`${g.color} flex items-center justify-center transition-all duration-1000 ${
                    isInView ? "" : "!w-0"
                  }`}
                  style={{
                    width: isInView ? g.width : "0%",
                    transitionDelay: `${400 + i * 100}ms`,
                  }}
                >
                  <span className="text-[11px] font-bold text-white/90 whitespace-nowrap">
                    {g.percent}%
                  </span>
                </div>
              ))}
            </div>

            {/* Labels */}
            <div className="flex justify-between text-[12px] text-text-muted mb-6">
              {grades.map((g, i) => (
                <span key={i} className="text-center flex-1">
                  {g.grade}
                </span>
              ))}
            </div>

            <p className="text-[14px] leading-[1.65] text-text-secondary">
              기존 9등급에서 5등급으로 단순화되었습니다. 성취도 A~E도 함께
              표기되어, 절대적 학업 수준도 확인할 수 있습니다.
            </p>
          </div>

          {/* Card 2: 절대평가 */}
          <div
            className={`bg-card-bg rounded-2xl p-7 md:p-8 border border-border-light/60 transition-all duration-700 ${
              isInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "350ms" }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[13px] font-semibold text-indigo tracking-[0.02em]">
                진로 + 융합선택
              </span>
            </div>
            <h3 className="text-[20px] font-bold text-navy tracking-[-0.02em] mb-5">
              성취도 절대평가
            </h3>

            {/* Achievement grades */}
            <div className="flex gap-3 mb-6">
              {["A", "B", "C", "D", "E"].map((g, i) => (
                <div
                  key={g}
                  className={`flex-1 h-12 rounded-xl flex items-center justify-center border transition-all duration-700 ${
                    i === 0
                      ? "bg-indigo/10 border-indigo/20"
                      : "bg-bg-warm border-border-light/60"
                  } ${
                    isInView
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-90"
                  }`}
                  style={{ transitionDelay: `${400 + i * 80}ms` }}
                >
                  <span
                    className={`text-[16px] font-bold ${
                      i === 0 ? "text-indigo" : "text-text-muted"
                    }`}
                  >
                    {g}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[14px] leading-[1.65] text-text-secondary mb-6">
              진로선택과 융합선택 과목은 등급 경쟁 없이 성취도만 평가합니다.
              도전적인 과목을 선택해도 등급 부담이 없어, 진짜 관심 분야에 집중할 수 있습니다.
            </p>

            {/* Callout */}
            <div className="bg-indigo/[0.04] border-l-[3px] border-indigo/30 rounded-r-xl px-5 py-4">
              <p className="text-[13px] font-semibold text-indigo mb-1">
                입시에서의 의미
              </p>
              <p className="text-[13px] leading-[1.6] text-text-secondary">
                대학들은 성취도 절대평가 과목에서 어떤 과목을 선택했는지,
                그 과목에서 어떤 성취를 보였는지를 종합적으로 평가합니다.
                "쉬운 과목" 대신 "자기 진로에 맞는 과목"을 선택하는 것이 유리합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
