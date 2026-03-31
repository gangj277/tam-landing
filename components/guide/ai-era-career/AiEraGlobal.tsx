"use client";

import { useInView } from "@/lib/useInView";

const countries = [
  {
    flag: "\uD83C\uDDEB\uD83C\uDDEE",
    country: "\uD540\uB780\uB4DC",
    approach: "\uD604\uC0C1 \uAE30\uBC18 \uD559\uC2B5",
    desc: "AI\uB97C \uBCC4\uB3C4 \uAD50\uACFC\uAC00 \uC544\uB2CC \uC2E4\uC81C \uD604\uC0C1 \uD0D0\uAD6C\uC5D0 \uD1B5\uD569. \u201C\uAE30\uC220\uC774 \uC544\uB2C8\uB77C \uC0AC\uACE0\uBC29\uC2DD\uC744 \uAC00\uB974\uCE5C\uB2E4\u201D",
    color: "indigo",
  },
  {
    flag: "\uD83C\uDDF8\uD83C\uDDEC",
    country: "\uC2F1\uAC00\uD3EC\uB974",
    approach: "AI for Students \uD504\uB808\uC784\uC6CC\uD06C",
    desc: "\uCD08\uB4F1(\uC778\uC2DD) \u2192 \uC911\uB4F1(\uD65C\uC6A9) \u2192 \uACE0\uB4F1(\uC2EC\uD654) \uB2E8\uACC4\uC801 \uB85C\uB4DC\uB9F5",
    color: "coral",
  },
  {
    flag: "\uD83C\uDDEA\uD83C\uDDEA",
    country: "\uC5D0\uC2A4\uD1A0\uB2C8\uC544",
    approach: "ProgeTiger",
    desc: "\uC720\uCE58\uC6D0\uBD80\uD130 \uB514\uC9C0\uD138/\uD504\uB85C\uADF8\uB798\uBC0D\uC801 \uC0AC\uACE0 \uAD50\uC721",
    color: "gold",
  },
];

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  indigo: {
    bg: "bg-indigo/[0.04]",
    text: "text-indigo",
    border: "border-indigo/15",
  },
  coral: {
    bg: "bg-coral/[0.04]",
    text: "text-coral",
    border: "border-coral/15",
  },
  gold: {
    bg: "bg-gold/[0.06]",
    text: "text-gold",
    border: "border-gold/15",
  },
};

export function AiEraGlobal() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section ref={ref} className="relative py-20 md:py-28 px-6">
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
          해외는 이미 하고 있다
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-10 max-w-[600px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          교육 선진국들의 AI 교육 접근법
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
                  <span
                    className={`text-[13px] font-semibold ${colors.text}`}
                  >
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
            선진국 모두{" "}
            <span className="text-indigo font-bold">
              &lsquo;코딩 기술&rsquo;이 아닌 &lsquo;사고방식 + 리터러시 +
              윤리&rsquo;
            </span>
            에 초점
          </p>
        </div>
      </div>
    </section>
  );
}
