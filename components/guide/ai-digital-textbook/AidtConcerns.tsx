"use client";

import { useInView } from "@/lib/useInView";

const concerns = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect
          x="5"
          y="3"
          width="18"
          height="22"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M12 21H16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="14" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "디지털 과의존",
    stat: "68.3%",
    statLabel: "학부모가 과의존 우려",
    desc: "1인 1기기(태블릿) 지급으로 스크린타임 급증. 수면 방해, 집중력 저하, 우울·불안 증가 가능성.",
    source: "교육부 학부모 모니터단",
    color: "coral",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect
          x="6"
          y="10"
          width="16"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M10 10V7C10 4.79 11.79 3 14 3C16.21 3 18 4.79 18 7V10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="14" cy="18" r="2" fill="currentColor" />
      </svg>
    ),
    title: "개인정보 유출",
    stat: "",
    statLabel: "시선추적 · 안면데이터 수집 사례 발각",
    desc: "학습시간, 성취도, 학습정서까지 수집. EU AI법에서 '고위험'으로 분류되는 민감 정보를 아이로부터 수집.",
    source: "한국대학신문 / 교육플러스",
    color: "coral",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M5 5H13L14 6V22L13 21H6C5.45 21 5 20.55 5 20V5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M23 5H15L14 6V22L15 21H22C22.55 21 23 20.55 23 20V5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "문해력 저하",
    stat: "555→544",
    statLabel: "스웨덴 PIRLS 읽기 점수 하락",
    desc: "국어 교과가 제외된 이유 자체가 문해력 저하 우려. 스웨덴은 디지털교과서 도입 6년 후 종이교과서로 복귀.",
    source: "PIRLS / 교육플러스",
    color: "indigo",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="1.5" fill="currentColor" />
      </svg>
    ),
    title: "시력 건강",
    stat: "61%",
    statLabel: "일본 교육위 시력 저하 우려",
    desc: "장시간 스크린 사용은 시력 저하, 수면 장애, 거북목 증후군을 유발. 성장기 아이에게 특히 영향이 큼.",
    source: "일본 교육위원회 조사",
    color: "gold",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="9" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M7 23C7 19.13 10.13 16 14 16C17.87 16 21 19.13 21 23"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M19 10L22 7M22 10L19 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "교사 역할 변화",
    stat: "85.5%",
    statLabel: "교사가 활용 중단 또는 미활용",
    desc: "OECD: 교사가 AI 데이터에 의존하면 전문적 판단력이 위축되고, 교사-학생 소통이 줄어들 수 있음.",
    source: "감사원 / OECD 2026",
    color: "indigo",
  },
];

const colorClasses: Record<
  string,
  { bg: string; text: string; iconBg: string }
> = {
  coral: {
    bg: "bg-coral/[0.04]",
    text: "text-coral",
    iconBg: "bg-coral/[0.08]",
  },
  indigo: {
    bg: "bg-indigo/[0.04]",
    text: "text-indigo",
    iconBg: "bg-indigo/[0.08]",
  },
  gold: {
    bg: "bg-gold/[0.06]",
    text: "text-gold",
    iconBg: "bg-gold/[0.08]",
  },
};

export function AidtConcerns() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="concerns" ref={ref} className="relative py-20 md:py-28 px-6">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-coral" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
            주요 우려
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          학부모가 우려하는 5가지
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-12 max-w-[600px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          교육부 설문 9개 항목 중 8개에서 부정 응답이 우세했습니다.
        </p>

        {/* Concern cards — 2+3 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-5">
          {concerns.slice(0, 2).map((concern, i) => {
            const colors = colorClasses[concern.color];
            return (
              <div
                key={i}
                className={`bg-card-bg rounded-2xl p-7 md:p-8 border border-border-light/60 transition-all duration-700 hover:shadow-[0_8px_40px_rgba(26,26,46,0.06)] hover:border-border-light ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${300 + i * 120}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${colors.iconBg} ${colors.text} flex items-center justify-center shrink-0`}
                  >
                    {concern.icon}
                  </div>
                  <div>
                    <h3 className="text-[17px] md:text-[18px] font-bold text-navy tracking-[-0.02em]">
                      {concern.title}
                    </h3>
                    {concern.stat && (
                      <span
                        className={`text-[24px] font-extrabold ${colors.text} tracking-[-0.03em]`}
                      >
                        {concern.stat}
                      </span>
                    )}
                    <p
                      className={`text-[13px] font-semibold ${colors.text} mt-0.5`}
                    >
                      {concern.statLabel}
                    </p>
                  </div>
                </div>

                <p className="text-[14px] md:text-[15px] leading-[1.7] text-text-secondary mb-3">
                  {concern.desc}
                </p>

                <span className="text-[11px] font-medium text-text-muted tracking-[0.02em]">
                  {concern.source}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {concerns.slice(2).map((concern, i) => {
            const colors = colorClasses[concern.color];
            return (
              <div
                key={i}
                className={`bg-card-bg rounded-2xl p-6 md:p-7 border border-border-light/60 transition-all duration-700 hover:shadow-[0_8px_40px_rgba(26,26,46,0.06)] hover:border-border-light ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${540 + i * 120}ms` }}
              >
                <div
                  className={`w-10 h-10 rounded-xl ${colors.iconBg} ${colors.text} flex items-center justify-center mb-4`}
                >
                  {concern.icon}
                </div>

                <h3 className="text-[16px] md:text-[17px] font-bold text-navy tracking-[-0.02em] mb-1">
                  {concern.title}
                </h3>
                {concern.stat && (
                  <span
                    className={`text-[20px] font-extrabold ${colors.text} tracking-[-0.02em]`}
                  >
                    {concern.stat}
                  </span>
                )}
                <p
                  className={`text-[12px] font-semibold ${colors.text} mb-3`}
                >
                  {concern.statLabel}
                </p>

                <p className="text-[13px] md:text-[14px] leading-[1.65] text-text-secondary mb-2">
                  {concern.desc}
                </p>

                <span className="text-[11px] font-medium text-text-muted tracking-[0.02em]">
                  {concern.source}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
