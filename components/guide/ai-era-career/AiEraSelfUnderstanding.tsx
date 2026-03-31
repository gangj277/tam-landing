"use client";

import { useInView } from "@/lib/useInView";

const steps = [
  {
    title: "자기이해",
    desc: "내가 뭘 좋아하고 잘하는지 앎",
    color: "bg-indigo",
  },
  {
    title: "내재적 동기",
    desc: "좋아하는 걸 하니 몰입함",
    color: "bg-coral",
  },
  {
    title: "깊은 전문성",
    desc: "오래 몰입하니 전문가가 됨",
    color: "bg-gold",
  },
  {
    title: "AI 시대 가치",
    desc: "AI가 못하는 깊이를 가진 사람",
    color: "bg-navy",
  },
];

const sources = [
  "Csikszentmihalyi Flow 이론",
  "Deci & Ryan 자기결정이론",
  "Savickas Career Adaptability",
];

export function AiEraSelfUnderstanding() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section id="self-understanding" ref={ref} className="relative py-20 md:py-28 px-6">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-indigo" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
            자기이해
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          왜 자기이해가 핵심인가
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-12 max-w-[600px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          자기이해는 AI 시대의 가장 근본적인 경쟁력입니다.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Flow diagram */}
          <div
            className={`bg-card-bg rounded-2xl p-7 md:p-8 border border-border-light/60 transition-all duration-700 ${
              isInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="space-y-0">
              {steps.map((step, i) => (
                <div key={i}>
                  {/* Step card */}
                  <div className="flex items-start gap-4">
                    {/* Step indicator */}
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center`}
                      >
                        <span className="text-[14px] font-bold text-white">
                          {i + 1}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className="w-[2px] h-8 bg-border-light mt-1" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pt-1.5 pb-4">
                      <h3 className="text-[16px] md:text-[17px] font-bold text-navy tracking-[-0.02em] mb-1">
                        {step.title}
                      </h3>
                      <p className="text-[14px] md:text-[15px] leading-[1.65] text-text-secondary">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side note + sources */}
          <div className="space-y-5">
            <div
              className={`bg-indigo/[0.04] rounded-2xl p-6 border border-indigo/10 transition-all duration-700 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "450ms" }}
            >
              <div className="flex items-start gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="shrink-0 mt-0.5"
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="#4A5FC1"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 6V10.5M10 13V13.5"
                    stroke="#4A5FC1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <p className="text-[14px] md:text-[15px] leading-[1.7] text-navy/80">
                  AI에게 좋은 질문을 하려면, 먼저{" "}
                  <span className="font-semibold text-navy">
                    &lsquo;내가 무엇을 원하는지&rsquo;
                  </span>{" "}
                  알아야 합니다.
                </p>
              </div>
            </div>

            {/* Sources */}
            <div
              className={`bg-card-bg rounded-2xl p-6 border border-border-light/60 transition-all duration-700 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "550ms" }}
            >
              <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-text-muted mb-3 block">
                참고 문헌
              </span>
              <ul className="space-y-2">
                {sources.map((source, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-[13px] text-text-secondary"
                  >
                    <span className="w-1 h-1 rounded-full bg-indigo/40 shrink-0" />
                    {source}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
