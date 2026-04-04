"use client";

import { useInView } from "@/lib/useInView";

const comparisons = [
  { before: "1회성 설문지를 작성한다", after: "매일 10분, 다양한 세계를 직접 체험한다" },
  { before: "6가지 유형으로 분류된다", after: "전문가와 깊이 대화하며 스스로 생각을 확장한다" },
  { before: "검사 후 변화를 추적할 방법이 없다", after: "아이의 관심과 사고 패턴이 매주 업데이트된다" },
  { before: "한 장짜리 보고서로 끝난다", after: "부모에게 매주 인사이트 리포트가 전달된다" },
];

export default function ReframingSection() {
  const { ref, isInView } = useInView(0.12);

  return (
    <section ref={ref} className="relative py-24 md:py-36 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[960px]">
        {/* Quote */}
        <div
          className={`relative mb-20 md:mb-24 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Decorative quote mark */}
          <svg
            className="absolute -top-6 -left-2 md:-left-8 w-12 h-12 md:w-16 md:h-16 text-coral/10"
            viewBox="0 0 64 64"
            fill="currentColor"
          >
            <path d="M28 12H8v20c0 11.046 8.954 20 20 20v-8c-6.627 0-12-5.373-12-12h12V12zm28 0H36v20c0 11.046 8.954 20 20 20v-8c-6.627 0-12-5.373-12-12h12V12z" />
          </svg>

          <blockquote className="relative text-center max-w-[640px] mx-auto">
            <p className="text-[20px] md:text-[26px] lg:text-[28px] font-medium leading-[1.6] tracking-[-0.02em] text-navy">
              아이들은 자기 안만 들여다본다고
              <br />
              스스로를 이해하게 되지 않습니다.
            </p>
            <div className="w-12 h-[1.5px] bg-coral/30 mx-auto my-6" />
            <p className="text-[20px] md:text-[26px] lg:text-[28px] font-medium leading-[1.6] tracking-[-0.02em] text-navy">
              세상의 다양한 결을 만나고,
              <br />
              그 앞에서 자기 방식으로 반응할 때
              <br />
              <span className="text-coral font-semibold">
                비로소 자기 자신을 이해하게 됩니다.
              </span>
            </p>
          </blockquote>

          {/* Closing quote mark */}
          <svg
            className="absolute -bottom-4 right-0 md:-right-6 w-12 h-12 md:w-16 md:h-16 text-coral/10 rotate-180"
            viewBox="0 0 64 64"
            fill="currentColor"
          >
            <path d="M28 12H8v20c0 11.046 8.954 20 20 20v-8c-6.627 0-12-5.373-12-12h12V12zm28 0H36v20c0 11.046 8.954 20 20 20v-8c-6.627 0-12-5.373-12-12h12V12z" />
          </svg>
        </div>

        {/* Divider line */}
        <div
          className={`w-full h-[1px] bg-border-light mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          }`}
          style={{ transitionDelay: "300ms" }}
        />

        {/* Comparison table */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-0">
          {/* Before column */}
          <div
            className={`transition-all duration-700 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-text-muted/40" />
              <h3 className="text-[13px] font-semibold tracking-[0.04em] text-text-muted uppercase">
                기존 진로교육
              </h3>
            </div>
            <div className="space-y-4">
              {comparisons.map((c, i) => (
                <div
                  key={i}
                  className="bg-navy/[0.02] border border-navy/[0.04] rounded-xl px-5 py-4 text-[15px] text-text-muted leading-relaxed"
                >
                  {c.before}
                </div>
              ))}
            </div>
          </div>

          {/* Arrow column */}
          <div className="hidden md:flex flex-col items-center justify-center px-8">
            {comparisons.map((_, i) => (
              <div key={i} className="flex-1 flex items-center">
                <svg
                  width="32"
                  height="12"
                  viewBox="0 0 32 12"
                  fill="none"
                  className={`text-coral transition-all duration-500 ${
                    isInView ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: `${600 + i * 100}ms` }}
                >
                  <path
                    d="M0 6h28M24 1l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ))}
          </div>

          {/* After column */}
          <div
            className={`transition-all duration-700 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-coral" />
              <h3 className="text-[13px] font-semibold tracking-[0.04em] text-coral uppercase">
                TAM의 진로탐색
              </h3>
            </div>
            <div className="space-y-4">
              {comparisons.map((c, i) => (
                <div
                  key={i}
                  className="bg-card-bg border border-coral/10 rounded-xl px-5 py-4 text-[15px] text-navy font-medium leading-relaxed shadow-[0_2px_8px_rgba(232,97,77,0.04)]"
                >
                  {c.after}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
