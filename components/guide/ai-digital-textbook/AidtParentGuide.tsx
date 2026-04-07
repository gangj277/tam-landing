"use client";

import { useInView } from "@/lib/useInView";

const questions = [
  "우리 아이 학교가 AI 디지털교과서를 채택했는가?",
  "어떤 과목에, 주 몇 시간 사용하는가?",
  "수업 중 유해 사이트 차단과 수업 집중모드가 작동하는가?",
  "학습 데이터는 어디에 저장되고, 제3자에게 제공되는가?",
  "종이 교과서와 병행 비율은 어떻게 되는가?",
];

const homeActions = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 4H14L15 5V19L14 18H5C4.45 18 4 17.55 4 17V4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M20 4H16L15 5V19L16 18H19C19.55 18 20 17.55 20 17V4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "종이 독서 시간 확보",
    desc: "AI 디지털교과서가 줄일 수 있는 문해력을 종이 독서로 보완. 하루 20분 종이책 읽기만으로도 효과가 있습니다.",
    color: "coral",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M9 12L11 14L15 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "AI 없이 풀기 연습",
    desc: "OECD 경고: AI 제거 시 성적 17% 하락. 정기적으로 AI 도움 없이 문제를 풀 수 있는지 확인하세요.",
    color: "indigo",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 7V12L15.5 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "스크린타임 모니터링",
    desc: "수업 외 태블릿 사용을 관찰하고, 잠자기 2시간 전·식사 시간에는 기기 사용을 제한하세요.",
    color: "gold",
  },
];

const colorClasses: Record<string, { bg: string; text: string }> = {
  coral: { bg: "bg-coral/[0.06]", text: "text-coral" },
  indigo: { bg: "bg-indigo/[0.06]", text: "text-indigo" },
  gold: { bg: "bg-gold/[0.08]", text: "text-gold" },
};

export function AidtParentGuide() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="parent-guide" ref={ref} className="relative py-20 md:py-28 px-6">
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
          학부모의 현실적 대응법
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-12 max-w-[600px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          불안에 머물지 말고, 확인하고 행동하세요.
        </p>

        {/* Questions to ask school */}
        <div
          className={`bg-card-bg rounded-2xl p-7 md:p-8 border border-border-light/60 mb-8 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <h3 className="text-[18px] md:text-[20px] font-bold text-navy tracking-[-0.02em] mb-6">
            학교에 확인할 5가지 질문
          </h3>

          <div className="space-y-4">
            {questions.map((q, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-lg bg-indigo/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[13px] font-bold text-indigo">
                    {i + 1}
                  </span>
                </div>
                <p className="text-[15px] leading-[1.65] text-text-secondary">
                  {q}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-border-light/40">
            <p className="text-[13px] leading-[1.65] text-text-muted">
              2025년 법 개정 이후 학교별 자율 채택이므로, 우리 아이 학교가
              사용하는지부터 확인하는 것이 첫 번째입니다.
            </p>
          </div>
        </div>

        {/* Home actions */}
        <div
          className={`transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "450ms" }}
        >
          <p className="text-[13px] font-semibold text-text-muted uppercase tracking-[0.06em] mb-5">
            집에서 할 수 있는 것
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {homeActions.map((action, i) => {
              const colors = colorClasses[action.color];
              return (
                <div
                  key={i}
                  className={`bg-card-bg rounded-2xl p-6 md:p-7 border border-border-light/60 transition-all duration-700 hover:shadow-[0_8px_40px_rgba(26,26,46,0.06)] hover:border-border-light ${
                    isInView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${550 + i * 120}ms` }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center mb-4`}
                  >
                    {action.icon}
                  </div>

                  <h4 className="text-[16px] md:text-[17px] font-bold text-navy tracking-[-0.02em] mb-2">
                    {action.title}
                  </h4>

                  <p className="text-[14px] leading-[1.7] text-text-secondary">
                    {action.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* TAM perspective */}
        <div
          className={`mt-10 bg-navy/[0.03] rounded-2xl p-6 md:p-7 border border-navy/[0.06] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <p className="text-[15px] md:text-[16px] leading-[1.7] text-navy font-medium text-center">
            AI가 학습을 도와주는 시대, 아이에게 진짜 남는 것은
            <br className="hidden sm:block" />
            <span className="text-coral font-bold">
              &ldquo;AI에게 무엇을 시킬지 아는 것&rdquo;
            </span>{" "}
            — 그것은 자기이해에서 시작됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}
