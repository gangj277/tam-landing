"use client";

import { useInView } from "@/lib/useInView";

const actions = [
  {
    number: "01",
    title: "코딩보다 우선할 것",
    desc: "다양한 경험, 독서, 자기 탐색, 프로젝트 기반 학습. 코딩은 흥미 있으면 해도 되지만 강제하지 마세요.",
    color: "coral",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12" stroke="#E8614D" strokeWidth="1.5" />
        <path
          d="M10 14L13 17L18 11"
          stroke="#E8614D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "AI 활용 경험",
    desc: "AI 도구를 \u201C소비\u201D가 아닌 \u201C창작\u201D에 사용하는 경험. 아이가 자기 아이디어를 AI와 함께 실현해보기.",
    color: "indigo",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect
          x="4"
          y="4"
          width="20"
          height="20"
          rx="4"
          stroke="#4A5FC1"
          strokeWidth="1.5"
        />
        <path
          d="M10 14H18M14 10V18"
          stroke="#4A5FC1"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "대화의 기술",
    desc: "\u201C뭐가 되고 싶어?\u201D보다 \u201C오늘 뭐가 재밌었어?\u201D, \u201C그건 왜 끌렸어?\u201D. 아이의 반응 패턴을 함께 관찰.",
    color: "gold",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M6 20V8C6 6.89543 6.89543 6 8 6H20C21.1046 6 22 6.89543 22 8V16C22 17.1046 21.1046 18 20 18H10L6 20Z"
          stroke="#D4A853"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M11 11H17M11 14H15"
          stroke="#D4A853"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const colorClasses: Record<string, { bg: string; text: string }> = {
  coral: { bg: "bg-coral/[0.06]", text: "text-coral" },
  indigo: { bg: "bg-indigo/[0.06]", text: "text-indigo" },
  gold: { bg: "bg-gold/[0.08]", text: "text-gold" },
};

export function AiEraParentGuide() {
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
          <div className="w-8 h-[1px] bg-gold" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-gold">
            실천 가이드
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          부모의 실질적 가이드
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-12 max-w-[560px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          오늘부터 시작할 수 있는 3가지 실천 방향
        </p>

        {/* Action cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {actions.map((action, i) => {
            const colors = colorClasses[action.color];
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
                  {action.icon}
                </div>

                {/* Number */}
                <span
                  className={`text-[12px] font-semibold tracking-[0.02em] ${colors.text}`}
                >
                  {action.number}
                </span>

                <h3 className="text-[18px] md:text-[20px] font-bold text-navy tracking-[-0.02em] mt-1.5 mb-3">
                  {action.title}
                </h3>

                <p className="text-[14px] md:text-[15px] leading-[1.7] text-text-secondary">
                  {action.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
