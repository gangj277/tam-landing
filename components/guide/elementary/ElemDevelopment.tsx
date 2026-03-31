"use client";

import { useInView } from "@/lib/useInView";

const theories = [
  {
    color: "coral",
    theory: "Super 진로발달이론",
    stage: "환상기 → 흥미기 → 능력기",
    ages: "~10세 → 11-12세 → 13-14세",
    simple:
      "\"되고 싶은 것\"에서 \"좋아하는 것 / 잘하는 것\"으로 기준이 바뀌는 시기",
    detail:
      "초등 고학년은 막연한 동경에서 벗어나 자신의 흥미를 기준으로 미래를 상상하기 시작합니다. 아이의 관심사가 구체적으로 변하는 것은 건강한 발달의 신호입니다.",
  },
  {
    color: "indigo",
    theory: "피아제 형식적 조작기",
    stage: "추상적 사고의 시작",
    ages: "11세~",
    simple: "\"만약 내가 ~라면?\"이라는 가정적 사고가 가능해지는 시기",
    detail:
      "구체적인 경험을 넘어 가설을 세우고 추론할 수 있게 됩니다. 미래의 나를 상상하고, 다양한 가능성을 머릿속에서 시뮬레이션할 수 있는 인지적 기반이 마련됩니다.",
  },
  {
    color: "gold",
    theory: "에릭슨 심리사회적 발달",
    stage: "근면성 → 정체성 전환기",
    ages: "10-12세",
    simple: "\"뭘 잘하나\"에서 \"나는 누구인가\"로 질문이 바뀌는 시기",
    detail:
      "초등 고학년은 '잘하는 것'에 대한 자신감(근면성)이 쌓이면서 동시에 '나는 어떤 사람인가'라는 정체성 질문이 시작되는 전환점입니다. 자아정체성 형성의 씨앗이 심어지는 때입니다.",
  },
  {
    color: "indigo",
    theory: "Harter 자아개념 분화",
    stage: "다차원적 자아의 출현",
    ages: "10-12세",
    simple: "학업적·사회적·신체적 자아가 분리되기 시작하는 시기",
    detail:
      "\"나는 수학은 잘하지만 운동은 잘 못해\"처럼 영역별로 다른 자아개념을 갖게 됩니다. 이 시기의 자아개념이 이후 진로 선택에 장기적인 영향을 미칩니다.",
  },
];

const colorClasses: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  coral: {
    bg: "bg-coral/[0.04]",
    text: "text-coral",
    border: "border-coral/20",
    dot: "bg-coral",
  },
  indigo: {
    bg: "bg-indigo/[0.04]",
    text: "text-indigo",
    border: "border-indigo/20",
    dot: "bg-indigo",
  },
  gold: {
    bg: "bg-gold/[0.06]",
    text: "text-gold",
    border: "border-gold/20",
    dot: "bg-gold",
  },
};

export function ElemDevelopment() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="development" ref={ref} className="relative py-20 md:py-28 px-6">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-indigo" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
            발달 특성
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          이 시기 아이의 특징
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-12 max-w-[600px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          발달심리학이 말하는 10-12세. 이 시기가 진로탐색에 왜 중요한지, 네 가지 이론으로 살펴봅니다.
        </p>

        {/* Timeline cards */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] md:left-[23px] top-0 bottom-0 w-[2px] bg-border-light" />

          <div className="space-y-6">
            {theories.map((item, i) => {
              const colors = colorClasses[item.color];
              return (
                <div
                  key={i}
                  className={`relative flex gap-5 md:gap-7 transition-all duration-700 ${
                    isInView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${300 + i * 150}ms` }}
                >
                  {/* Dot */}
                  <div className="relative z-10 shrink-0">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 bg-card-bg ${colors.border}`}
                    >
                      <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                    </div>
                  </div>

                  {/* Content card */}
                  <div className="flex-1 bg-card-bg rounded-2xl p-5 md:p-7 border border-border-light/60 hover:shadow-[0_4px_20px_rgba(26,26,46,0.05)] transition-shadow">
                    {/* Theory name + ages */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-[12px] font-semibold tracking-[0.02em] ${colors.text}`}>
                        {item.theory}
                      </span>
                      <span className="text-[11px] text-text-muted px-2 py-0.5 rounded-full bg-bg-warm">
                        {item.ages}
                      </span>
                    </div>

                    {/* Stage */}
                    <h3 className="text-[17px] md:text-[19px] font-bold text-navy tracking-[-0.02em] mb-1.5">
                      {item.stage}
                    </h3>

                    {/* Simple explanation */}
                    <div className={`${colors.bg} rounded-xl px-4 py-3 mb-3 border ${colors.border}`}>
                      <p className="text-[14px] md:text-[15px] leading-[1.6] font-medium text-navy">
                        {item.simple}
                      </p>
                    </div>

                    {/* Detail */}
                    <p className="text-[14px] md:text-[15px] leading-[1.7] text-text-secondary">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
