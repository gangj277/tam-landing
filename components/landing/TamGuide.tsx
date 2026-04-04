"use client";

import { useInView } from "@/lib/useInView";

const features = [
  {
    title: "주 1회 가이드 세션",
    desc: "매주 1회, 가이드가 아이와 직접 이야기합니다. 월 1회는 대면으로, 나머지는 화상으로 진행합니다. 가르치는 게 아니라, 아이의 생각을 같이 들여다봅니다.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="13" cy="14" r="5" stroke="#4A5FC1" strokeWidth="1.2" fill="#4A5FC1" fillOpacity="0.06"/>
        <circle cx="23" cy="14" r="5" stroke="#E8614D" strokeWidth="1.2" fill="#E8614D" fillOpacity="0.06"/>
        <path d="M13 22c0 3.5 2 6 5 6s5-2.5 5-6" stroke="#D4A853" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 3"/>
        <path d="M16 13h4" stroke="#1A1A2E" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.2"/>
      </svg>
    ),
  },
  {
    title: "매일의 경험 동행",
    desc: "앱에서 매일 10분 새로운 세계를 경험하고, 가이드가 그 흐름을 함께 지켜봅니다. 아이가 혼자가 아닙니다.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="6" y="8" width="24" height="20" rx="3" stroke="#4A5FC1" strokeWidth="1.2" fill="#4A5FC1" fillOpacity="0.04"/>
        <path d="M6 14h24" stroke="#4A5FC1" strokeWidth="0.8" strokeOpacity="0.15"/>
        <circle cx="12" cy="11" r="1" fill="#E8614D" fillOpacity="0.6"/>
        <circle cx="16" cy="11" r="1" fill="#D4A853" fillOpacity="0.6"/>
        <circle cx="20" cy="11" r="1" fill="#4A5FC1" fillOpacity="0.6"/>
        <path d="M11 20h6M11 24h10" stroke="#4A5FC1" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.3"/>
      </svg>
    ),
  },
  {
    title: "부모님 주간 리포트",
    desc: "매주 아이의 경험 요약과 가이드의 관찰 코멘트를 보내드립니다. 시험 점수가 아닌, 아이의 관심과 성장이 보입니다.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M8 28V10a2 2 0 012-2h16a2 2 0 012 2v18l-5-3-5 3-5-3-5 3z" stroke="#E8614D" strokeWidth="1.2" fill="#E8614D" fillOpacity="0.04"/>
        <path d="M13 14h10M13 18h7M13 22h4" stroke="#E8614D" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.3"/>
        <circle cx="24" cy="22" r="3" fill="#D4A853" fillOpacity="0.15" stroke="#D4A853" strokeWidth="0.8"/>
        <path d="M23 22l1 1 2-2" stroke="#D4A853" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function TamGuide() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6">
      <div className="mx-auto max-w-[1120px]">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`flex items-center justify-center gap-3 mb-6 transition-all duration-600 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="w-8 h-[1px] bg-indigo" />
            <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
              탐 가이드
            </span>
            <div className="w-8 h-[1px] bg-indigo" />
          </div>
          <h2
            className={`text-[28px] md:text-[40px] font-bold tracking-[-0.03em] text-navy mb-5 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            AI만으로 끝나지 않습니다
          </h2>
          <p
            className={`text-[15px] md:text-[17px] leading-[1.8] text-text-secondary max-w-[520px] mx-auto transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            주 1회, 전문 가이드가 아이의 경험 여정을 함께 봅니다.
            <br />
            앱 속 경험을 현실의 대화로 연결하고,
            <br />
            부모님에게는 아이의 성장을 전해드립니다.
          </p>
        </div>

        {/* Content — two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 max-w-[960px] mx-auto">
          {/* Left — feature cards */}
          <div className="space-y-5">
            {features.map((f, i) => (
              <div
                key={i}
                className={`bg-card-bg rounded-2xl p-6 md:p-7 border border-border-light/60 flex gap-5 transition-all duration-700 hover:shadow-[0_4px_20px_rgba(26,26,46,0.05)] ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${300 + i * 120}ms` }}
              >
                <div className="flex-shrink-0 mt-1">{f.icon}</div>
                <div>
                  <h3 className="text-[16px] font-bold text-navy mb-2 tracking-[-0.01em]">
                    {f.title}
                  </h3>
                  <p className="text-[14px] leading-[1.75] text-text-secondary">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — weekly session preview mockup */}
          <div
            className={`transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="bg-card-bg rounded-2xl border border-border-light shadow-[0_8px_40px_rgba(26,26,46,0.06)] overflow-hidden h-full">
              {/* Mock header */}
              <div className="px-6 py-4 border-b border-border-light/60 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-indigo/20" />
                <span className="text-[13px] font-semibold text-navy">
                  이번 주 가이드 노트
                </span>
                <span className="text-[11px] text-text-muted ml-auto">
                  3월 4주차
                </span>
              </div>

              <div className="p-6 space-y-5">
                {/* Session summary */}
                <div>
                  <p className="text-[12px] font-semibold text-text-muted tracking-[0.02em] mb-2">
                    세션 요약
                  </p>
                  <p className="text-[13px] leading-[1.7] text-text-secondary">
                    이번 주 서연이는 화성 도시 미션에서 병원을 선택한 이유에 대해
                    &ldquo;당장 아픈 사람이 있는데 나중 일을 먼저 생각하는 건 이상하다&rdquo;고
                    이야기했어요. 자신의 선택에 대한 확신이 분명했습니다.
                  </p>
                </div>

                {/* Observation */}
                <div className="p-4 rounded-xl bg-indigo-light/40 border border-indigo/[0.06]">
                  <p className="text-[12px] font-semibold text-indigo mb-1.5">
                    가이드 관찰
                  </p>
                  <p className="text-[13px] leading-[1.7] text-text-secondary">
                    지난 주보다 AI 도구를 적극적으로 활용하기 시작했어요.
                    특히 &lsquo;다른 시각으로 보기&rsquo; 버튼을 자주 눌러보면서
                    여러 가능성을 비교하는 모습이 인상적이었습니다.
                  </p>
                </div>

                {/* Next week direction */}
                <div>
                  <p className="text-[12px] font-semibold text-text-muted tracking-[0.02em] mb-2">
                    다음 주 방향
                  </p>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-coral mt-2 flex-shrink-0" />
                    <p className="text-[13px] leading-[1.7] text-text-secondary">
                      관점 전환형 미션을 더 경험해보면 좋겠어요.
                      서연이가 자기 관점이 뚜렷한 만큼, 다른 사람의 시선을 더 많이
                      연습하면 사고의 폭이 넓어질 것 같습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing + bottom emphasis */}
        <div
          className={`max-w-[520px] mx-auto mt-14 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <div className="bg-card-bg rounded-2xl border border-border-light p-8 text-center shadow-[0_4px_24px_rgba(26,26,46,0.04)]">
            <p className="text-[13px] font-semibold text-text-muted tracking-[0.02em] mb-3">
              탐 가이드 프로그램
            </p>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-[36px] md:text-[42px] font-extrabold text-navy tracking-[-0.03em]">
                20만원
              </span>
              <span className="text-[15px] text-text-muted font-medium">
                /월
              </span>
            </div>
            <div className="space-y-2 text-[13px] text-text-secondary mb-6">
              <div className="flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#4A5FC1" strokeWidth="1"/><path d="M5 7l1.5 1.5L9 5.5" stroke="#4A5FC1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>매일 AI 경험 미션 제공</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#4A5FC1" strokeWidth="1"/><path d="M5 7l1.5 1.5L9 5.5" stroke="#4A5FC1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>주 1회 가이드 세션 (월 1회 대면 + 3회 화상)</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#4A5FC1" strokeWidth="1"/><path d="M5 7l1.5 1.5L9 5.5" stroke="#4A5FC1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>매주 부모님 리포트 제공</span>
              </div>
            </div>
            <a
              href="/consultation"
              className="inline-flex items-center gap-2 bg-coral text-white text-[15px] font-semibold px-8 py-3.5 rounded-full hover:bg-coral-hover transition-all duration-300 hover:shadow-[0_4px_20px_rgba(232,97,77,0.3)] active:scale-[0.98]"
            >
              상담 신청하기
            </a>
          </div>

          <p className="text-center mt-8 text-[15px] md:text-[17px] leading-[1.8] text-navy/70">
            AI가 경험을 만들고,
            <br />
            <span className="font-semibold text-navy">사람이 그 경험을 의미로 연결합니다.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
