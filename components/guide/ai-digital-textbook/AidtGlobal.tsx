"use client";

import { useInView } from "@/lib/useInView";

const countries = [
  {
    flag: "\uD83C\uDDF8\uD83C\uDDEA",
    country: "스웨덴",
    approach: "도입 → 실패 → 종이 복귀",
    desc: "2017년 디지털교과서 전면 도입. 6년 후 읽기 점수 555→544점 하락(PIRLS). 2023년 종이교과서 복귀에 823억원 투입. 유치원 디지털 학습까지 중단.",
    color: "coral",
  },
  {
    flag: "\uD83C\uDDEB\uD83C\uDDEE",
    country: "핀란드",
    approach: "PISA 급락 · 종이교과서 선호",
    desc: "디지털교육 확산 후 PISA 독해·수학 순위 급락. 교육국장: \"학생들의 주의력 저하와 산만함 두드러졌다.\" 학부모 70%, 교사 80%가 종이교과서 선호.",
    color: "indigo",
  },
  {
    flag: "\uD83C\uDDFA\uD83C\uDDF3",
    country: "OECD",
    approach: "\"거짓 숙달의 신기루\" 경고",
    desc: "AI 접근 시 성적 48~127% 향상, 그러나 AI 제거 시 17% 하락. \"속도보다 신중함, 효율보다 형평, 기술보다 교육적 가치를 우선할 것.\"",
    color: "gold",
  },
];

const colorClasses: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  coral: {
    bg: "bg-coral/[0.04]",
    text: "text-coral",
    border: "border-coral/15",
  },
  indigo: {
    bg: "bg-indigo/[0.04]",
    text: "text-indigo",
    border: "border-indigo/15",
  },
  gold: {
    bg: "bg-gold/[0.06]",
    text: "text-gold",
    border: "border-gold/15",
  },
};

export function AidtGlobal() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section
      id="global"
      ref={ref}
      className="relative py-20 md:py-28 px-6 bg-bg-warm"
    >
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-indigo" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
            해외 사례
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          먼저 도입한 나라들은 어떻게 됐나
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-10 max-w-[600px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          디지털교과서를 일찍 도입한 선진국들의 경험은 의미심장합니다.
        </p>

        {/* Country cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-8">
          {countries.map((c, i) => {
            const colors = colorClasses[c.color];
            return (
              <div
                key={i}
                className={`bg-card-bg rounded-2xl p-7 border border-border-light/60 transition-all duration-700 hover:shadow-[0_8px_40px_rgba(26,26,46,0.06)] hover:border-border-light ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${300 + i * 150}ms` }}
              >
                {/* Flag + Country */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[28px]">{c.flag}</span>
                  <span className="text-[17px] md:text-[18px] font-bold text-navy tracking-[-0.02em]">
                    {c.country}
                  </span>
                </div>

                {/* Approach badge */}
                <div
                  className={`inline-block px-3 py-1.5 rounded-lg ${colors.bg} border ${colors.border} mb-4`}
                >
                  <span className={`text-[13px] font-semibold ${colors.text}`}>
                    {c.approach}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[14px] md:text-[15px] leading-[1.7] text-text-secondary">
                  {c.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Common insight */}
        <div
          className={`bg-indigo/[0.04] rounded-2xl p-6 md:p-7 border border-indigo/10 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <p className="text-[15px] md:text-[16px] leading-[1.7] text-navy text-center font-medium">
            OECD 핵심 권고:{" "}
            <span className="text-indigo font-bold">
              &ldquo;AI를 쓰느냐보다, 어떻게 배우게 하느냐가 교육 미래를
              좌우한다&rdquo;
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
