"use client";

import { useInView } from "@/lib/useInView";

const steps = [
  {
    period: "초등 5~6학년",
    accent: false,
    title: "다양한 경험에 노출",
    desc: "여러 분야의 활동에 참여하며 아이의 관심사와 반응 패턴을 관찰하는 시기입니다. 아직 진로를 정할 필요 없이, 넓고 다양한 세계를 만나는 것이 핵심입니다.",
    tag: "탐 TAM 타깃 시작점",
  },
  {
    period: "중학교 1학년",
    accent: false,
    title: "자유학기제",
    desc: "주제선택과 진로탐색 활동을 통해 관심 분야를 넓힙니다. 다만 2025년부터 170시간 → 102시간으로 축소, 활동도 4개 → 2개로 줄어 실질적 탐색 기회가 감소했습니다.",
    tag: "축소된 현실: 170 → 102시간",
  },
  {
    period: "중학교 3학년",
    accent: true,
    title: "진로연계학기 (신설)",
    desc: "고교 교육과정을 미리 이해하고, 과목 선택을 연습하는 새로운 학기입니다. 고교학점제와 자유학기제의 빈 공간을 채우기 위해 도입되었습니다.",
    tag: null,
  },
  {
    period: "고등학교 1학년",
    accent: true,
    title: "공통과목 이수 + 과목 선택 시작",
    desc: "공통과목을 이수하면서, 고1 말부터 고2에 수강할 선택과목을 결정합니다. 이 시점에서 자기이해가 부족하면 '입시 유불리'에만 의존하게 됩니다.",
    tag: "핵심 결정 시점",
  },
  {
    period: "고등학교 2~3학년",
    accent: false,
    title: "선택과목 본격 이수",
    desc: "선택한 일반/진로/융합 과목을 이수합니다. 자기이해를 바탕으로 선택한 학생은 동기를 유지하지만, 기준 없이 선택한 학생은 '생각보다 적성에 안 맞아서' 후회하는 경우가 많습니다.",
    tag: null,
  },
];

export function CreditSystemTimeline() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="timeline" ref={ref} className="relative py-20 md:py-28 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-coral" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
            준비 타임라인
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          고교학점제, 언제부터 준비할까?
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-12 max-w-[560px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          과목 선택은 고1 말이지만, 선택의 &apos;기준&apos;을 만드는 건 훨씬 이전부터
          시작됩니다.
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] md:left-[23px] top-0 bottom-0 w-[2px] bg-border-light" />

          <div className="space-y-8">
            {steps.map((step, i) => (
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
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 ${
                      step.accent
                        ? "bg-coral border-coral text-white"
                        : "bg-card-bg border-border-light text-indigo"
                    }`}
                  >
                    <span className="text-[12px] md:text-[13px] font-bold">
                      {i + 1}
                    </span>
                  </div>
                </div>

                {/* Content card */}
                <div className="flex-1 bg-card-bg rounded-2xl p-5 md:p-7 border border-border-light/60 hover:shadow-[0_4px_20px_rgba(26,26,46,0.05)] transition-shadow">
                  <span
                    className={`text-[12px] font-semibold tracking-[0.02em] ${
                      step.accent ? "text-coral" : "text-indigo"
                    }`}
                  >
                    {step.period}
                  </span>
                  <h3 className="text-[17px] md:text-[19px] font-bold text-navy tracking-[-0.02em] mt-1 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[14px] md:text-[15px] leading-[1.7] text-text-secondary">
                    {step.desc}
                  </p>
                  {step.tag && (
                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded-full text-[12px] font-medium ${
                        step.accent
                          ? "bg-coral/[0.08] text-coral"
                          : "bg-indigo/[0.06] text-indigo"
                      }`}
                    >
                      {step.tag}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
