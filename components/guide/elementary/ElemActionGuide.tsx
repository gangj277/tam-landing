"use client";

import { useInView } from "@/lib/useInView";

const actions = [
  {
    color: "coral",
    number: "01",
    title: "경험 넓히기",
    desc: "주 1회 새로운 경험 목표. 일상적 체험(요리, 정원, 동물 돌봄)도 포함됩니다.",
    example:
      "이번 주말엔 과학관, 다음 주엔 요리, 그다음 주엔 봉사활동 — 작은 것부터 시작하세요.",
  },
  {
    color: "indigo",
    number: "02",
    title: "관찰 일지",
    desc: "아이가 어떤 활동에 에너지가 올라가는지, 시간 가는 줄 모르는지 기록하세요.",
    example:
      "3개월이면 패턴이 보입니다. \"우리 아이는 만드는 걸 좋아하는구나\" 같은 발견이 시작됩니다.",
  },
  {
    color: "gold",
    number: "03",
    title: "강점 대화",
    desc: "\"넌 이걸 잘하네\"보다 \"넌 이걸 할 때 표정이 다르더라\". 외부 평가가 아닌 내면의 반응을 비춰주세요.",
    example:
      "아이는 자기 안의 변화를 스스로 인식하기 어렵습니다. 부모가 거울이 되어주세요.",
  },
  {
    color: "indigo",
    number: "04",
    title: "\"왜?\"보다 \"어땠어?\"",
    desc: "결과 중심 질문(\"시험 몇 점?\") 대신 과정 중심 질문(\"그건 어떤 느낌이었어?\")을 하세요.",
    example:
      "과정에 집중하는 질문은 아이의 자기 인식을 키우고, 내적 동기를 강화합니다.",
  },
];

const colorClasses: Record<string, { text: string; numBg: string; exBg: string; exBorder: string }> = {
  coral: {
    text: "text-coral",
    numBg: "bg-coral/[0.06]",
    exBg: "bg-coral/[0.03]",
    exBorder: "border-coral/10",
  },
  indigo: {
    text: "text-indigo",
    numBg: "bg-indigo/[0.06]",
    exBg: "bg-indigo/[0.03]",
    exBorder: "border-indigo/10",
  },
  gold: {
    text: "text-gold",
    numBg: "bg-gold/[0.08]",
    exBg: "bg-gold/[0.04]",
    exBorder: "border-gold/10",
  },
};

export function ElemActionGuide() {
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
          부모가 오늘부터 할 수 있는 4가지
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-12 max-w-[560px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          거창한 준비가 아닙니다. 일상에서 시작할 수 있습니다.
        </p>

        {/* Action cards — 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {actions.map((action, i) => {
            const colors = colorClasses[action.color];
            return (
              <div
                key={i}
                className={`bg-card-bg rounded-2xl p-6 md:p-8 border border-border-light/60 transition-all duration-700 hover:shadow-[0_8px_40px_rgba(26,26,46,0.06)] hover:border-border-light ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${300 + i * 120}ms` }}
              >
                {/* Number badge */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl ${colors.numBg} flex items-center justify-center`}
                  >
                    <span className={`text-[14px] font-bold ${colors.text}`}>
                      {action.number}
                    </span>
                  </div>
                  <h3 className="text-[18px] md:text-[20px] font-bold text-navy tracking-[-0.02em]">
                    {action.title}
                  </h3>
                </div>

                <p className="text-[14px] md:text-[15px] leading-[1.7] text-text-secondary mb-4">
                  {action.desc}
                </p>

                {/* Example box */}
                <div
                  className={`${colors.exBg} border ${colors.exBorder} rounded-xl px-4 py-3`}
                >
                  <p className="text-[13px] leading-[1.65] text-navy/80">
                    {action.example}
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
