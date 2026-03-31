"use client";

import { useInView } from "@/lib/useInView";

const cards = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect
          x="6"
          y="4"
          width="20"
          height="24"
          rx="3"
          stroke="#4A5FC1"
          strokeWidth="1.5"
        />
        <path d="M11 10H21" stroke="#4A5FC1" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 14H21" stroke="#4A5FC1" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 18H17" stroke="#4A5FC1" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    principle: "정보 수집",
    title: "우리 학교 자유학기 파악하기",
    desc: "학교알리미에서 자유학기 편성표를 확인하고, 학교 교육과정 설명회에 참석하세요. 어떤 주제선택 프로그램이 개설되는지, 진로체험은 어디로 가는지 미리 파악하면 아이와 함께 준비할 수 있습니다.",
    color: "indigo" as const,
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#E8614D" strokeWidth="1.5" />
        <path
          d="M12 16L16 12L20 16"
          stroke="#E8614D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 12V22"
          stroke="#E8614D"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    principle: "경험 확장",
    title: "학교 밖 체험으로 보완하기",
    desc: "학교 자유학기만으로는 부족합니다. 박물관, 공방, 지역사회 프로그램 등 학교 밖 체험을 적극 활용하세요. 다양한 분야에 노출될수록 아이의 관심사와 반응 패턴이 뚜렷해집니다.",
    color: "coral" as const,
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#D4A853" strokeWidth="1.5" />
        <path
          d="M12 20C12 20 13.5 17 16 17C18.5 17 20 20 20 20"
          stroke="#D4A853"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="13" r="1.5" fill="#D4A853" />
        <circle cx="20" cy="13" r="1.5" fill="#D4A853" />
      </svg>
    ),
    principle: "자기이해 기회",
    title: "아이의 반응을 함께 관찰하기",
    desc: "\u201C뭐가 재밌었어?\u201D가 아닌 \u201C어떤 순간에 집중했어?\u201D를 물어보세요. 아이의 반응 패턴을 함께 관찰하는 것이 진로탐색의 시작입니다. TAM과 같은 일상적 탐색 경험을 활용하면 매일 10분씩 다양한 세계를 만나며 자기이해를 쌓을 수 있습니다.",
    color: "gold" as const,
  },
];

const colorClasses: Record<string, { bg: string; text: string }> = {
  indigo: { bg: "bg-indigo/[0.06]", text: "text-indigo" },
  coral: { bg: "bg-coral/[0.06]", text: "text-coral" },
  gold: { bg: "bg-gold/[0.08]", text: "text-gold" },
};

export function JayuParentGuide() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="relative py-20 md:py-28 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-indigo" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
            부모가 할 수 있는 것
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          학부모가 지금 할 수 있는 3가지
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-12 max-w-[560px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          제도의 한계를 탓하기보다, 가정에서 보완할 수 있는 현실적인 방법입니다.
        </p>

        {/* 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {cards.map((card, i) => {
            const colors = colorClasses[card.color];
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
                  {card.icon}
                </div>

                {/* Principle tag */}
                <span
                  className={`text-[12px] font-semibold tracking-[0.02em] ${colors.text}`}
                >
                  {card.principle}
                </span>

                <h3 className="text-[18px] md:text-[20px] font-bold text-navy tracking-[-0.02em] mt-1.5 mb-3">
                  {card.title}
                </h3>

                <p className="text-[14px] md:text-[15px] leading-[1.7] text-text-secondary">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
