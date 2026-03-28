"use client";

import { useInView } from "@/lib/useInView";

const comparisons = [
  { before: "정해진 콘텐츠를 소비한다", after: "매일 새로운 세계에 직접 들어간다" },
  { before: "AI가 정답을 알려준다", after: "AI로 가능성을 넓히고, 스스로 고른다" },
  { before: "결과가 항상 같다", after: "내 선택에 따라 결과가 달라진다" },
  { before: "끝나면 남는 게 없다", after: "내 선택의 패턴이 쌓여간다" },
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
                지금 아이들의 디지털 경험
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
                우리가 여는 새로운 경험
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
