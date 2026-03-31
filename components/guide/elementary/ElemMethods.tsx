"use client";

import { useInView } from "@/lib/useInView";

const methods = [
  {
    color: "coral",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#E8614D" strokeWidth="1.5" />
        <path d="M10 16L14 16M18 16L22 16M16 10L16 14M16 18L16 22" stroke="#E8614D" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "다양한 경험 노출",
    desc: "학원 한두 개 줄이고 그 시간에 새로운 경험을. 박물관, 공방, 봉사활동, 코딩, 요리, 자연탐사... 폭이 중요합니다.",
    tip: "한 분야의 심화보다, 여러 분야의 노출이 이 시기에는 더 중요합니다.",
  },
  {
    color: "indigo",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="6" width="20" height="20" rx="4" stroke="#4A5FC1" strokeWidth="1.5" />
        <path d="M11 16L14 19L21 12" stroke="#4A5FC1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "관찰과 대화",
    desc: "\"뭐가 되고 싶어?\"보다 \"오늘 뭐가 재밌었어?\", \"그건 왜 끌렸어?\". 아이의 반응 패턴을 부모가 기록하면 패턴이 보입니다.",
    tip: "결과가 아닌 과정에 초점을 맞춘 질문이 핵심입니다.",
  },
  {
    color: "gold",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#D4A853" strokeWidth="1.5" />
        <path d="M12 16C12 16 13.5 13 16 13C18.5 13 20 16 20 16" stroke="#D4A853" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="1.5" fill="#D4A853" />
        <circle cx="20" cy="12" r="1.5" fill="#D4A853" />
      </svg>
    ),
    title: "성격검사의 한계 인식",
    desc: "MBTI/홀랜드 검사는 참고만. 이 연령은 성격 형성 중입니다. 고정된 유형으로 규정하는 것은 위험합니다.",
    tip: "검사보다 경험이 더 정확합니다. 검사는 대화의 시작점으로만 활용하세요.",
  },
];

const colorClasses: Record<string, { bg: string; text: string; tipBg: string }> = {
  coral: { bg: "bg-coral/[0.06]", text: "text-coral", tipBg: "bg-coral/[0.04]" },
  indigo: { bg: "bg-indigo/[0.06]", text: "text-indigo", tipBg: "bg-indigo/[0.04]" },
  gold: { bg: "bg-gold/[0.08]", text: "text-gold", tipBg: "bg-gold/[0.06]" },
};

export function ElemMethods() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="methods" ref={ref} className="relative py-20 md:py-28 px-6">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-gold" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-gold">
            진로탐색법
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          효과적인 진로탐색법
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-12 max-w-[560px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          이 시기 진로탐색의 핵심은 세 가지입니다.
        </p>

        {/* 3 method cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {methods.map((method, i) => {
            const colors = colorClasses[method.color];
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
                  {method.icon}
                </div>

                {/* Number tag */}
                <span className={`text-[12px] font-semibold tracking-[0.02em] ${colors.text}`}>
                  방법 {i + 1}
                </span>

                <h3 className="text-[18px] md:text-[20px] font-bold text-navy tracking-[-0.02em] mt-1.5 mb-3">
                  {method.title}
                </h3>

                <p className="text-[14px] md:text-[15px] leading-[1.7] text-text-secondary mb-4">
                  {method.desc}
                </p>

                {/* Tip */}
                <div className={`${colors.tipBg} rounded-xl px-4 py-3`}>
                  <p className="text-[13px] leading-[1.6] text-navy/80">
                    <span className={`font-semibold ${colors.text}`}>TIP</span>{" "}
                    {method.tip}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
