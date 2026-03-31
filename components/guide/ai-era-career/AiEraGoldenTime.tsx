"use client";

import { useInView } from "@/lib/useInView";

const evidences = [
  {
    theorist: "에릭슨",
    title: "근면성 \u2192 정체성 전환기",
    desc: "\u201C나는 뭘 잘하나\u201D에서 \u201C나는 누구인가\u201D로",
    color: "coral",
  },
  {
    theorist: "피아제",
    title: "형식적 조작기 시작",
    desc: "추상적 사고, \u201C만약 ~라면?\u201D 가능",
    color: "indigo",
  },
  {
    theorist: "Harter",
    title: "자아개념 급격 분화",
    desc: "학업적/사회적/신체적 자아가 분리",
    color: "gold",
  },
  {
    theorist: "Hidi & Renninger",
    title: "흥미 발달 전환기",
    desc: "상황적 흥미 \u2192 지속적 개인적 흥미",
    color: "coral",
  },
  {
    theorist: "뇌과학",
    title: "전전두엽 급속 발달",
    desc: "계획, 의사결정, 자기조절 담당 영역",
    color: "indigo",
  },
];

const colorClasses: Record<string, { bg: string; text: string; dot: string }> = {
  coral: { bg: "bg-coral/[0.06]", text: "text-coral", dot: "bg-coral" },
  indigo: { bg: "bg-indigo/[0.06]", text: "text-indigo", dot: "bg-indigo" },
  gold: { bg: "bg-gold/[0.08]", text: "text-gold", dot: "bg-gold" },
};

export function AiEraGoldenTime() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="golden-time" ref={ref} className="relative py-20 md:py-28 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-gold" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-gold">
            골든타임
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          10-14세가 골든타임인 이유
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-10 max-w-[600px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          발달심리학과 뇌과학이 공통으로 가리키는 시기입니다.
        </p>

        {/* Evidence cards — vertical stack */}
        <div className="space-y-4 mb-10">
          {evidences.map((ev, i) => {
            const colors = colorClasses[ev.color];
            return (
              <div
                key={i}
                className={`bg-card-bg rounded-2xl p-6 md:p-7 border border-border-light/60 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-700 hover:shadow-[0_8px_40px_rgba(26,26,46,0.06)] hover:border-border-light ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${300 + i * 100}ms` }}
              >
                {/* Theorist badge */}
                <div
                  className={`px-3.5 py-1.5 rounded-lg ${colors.bg} shrink-0`}
                >
                  <span
                    className={`text-[13px] font-semibold ${colors.text}`}
                  >
                    {ev.theorist}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-[15px] md:text-[16px] font-bold text-navy tracking-[-0.02em] mb-0.5">
                    {ev.title}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-text-secondary">
                    {ev.desc}
                  </p>
                </div>

                {/* Number */}
                <div className="sm:text-right shrink-0">
                  <span className="text-[24px] font-extrabold tracking-[-0.03em] text-navy/10">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div
          className={`bg-gold/[0.06] rounded-2xl p-6 md:p-7 border border-gold/15 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <p className="text-[15px] md:text-[16px] leading-[1.7] text-navy text-center font-medium">
            이 시기에{" "}
            <span className="text-gold font-bold">다양한 경험 + 자기 성찰</span>{" "}
            ={" "}
            <span className="text-navy font-bold">평생의 열정 영역 발견</span>
          </p>
        </div>
      </div>
    </section>
  );
}
