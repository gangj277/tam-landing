"use client";

import { useInView } from "@/lib/useInView";

const decideItems = [
  "특정 직업 목표 설정",
  "일찍 방향 고정",
  "다른 가능성 차단",
  "외부 기준 내면화 위험",
  "이 시기에 부적절",
];

const exploreItems = [
  "다양한 경험 시도",
  "열린 가능성 유지",
  "자기 반응 패턴 관찰",
  "내부 기준 형성",
  "이 시기에 적합",
];

export function ElemExploreVsDecide() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section
      id="explore-vs-decide"
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
          <div className="w-8 h-[1px] bg-coral" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
            탐색 vs 결정
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-10 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          진로 &lsquo;결정&rsquo;이 아니라 &lsquo;탐색&rsquo;입니다
        </h2>

        {/* Comparison table */}
        <div
          className={`bg-card-bg rounded-2xl border border-border-light/60 overflow-hidden transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          {/* Header */}
          <div className="grid grid-cols-2">
            <div className="p-4 md:p-5 bg-navy/[0.03] border-b border-r border-border-light">
              <div className="flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5"
                    stroke="#E8614D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-[13px] font-semibold text-coral tracking-[0.02em]">
                  진로 결정
                </span>
              </div>
            </div>
            <div className="p-4 md:p-5 bg-indigo/[0.03] border-b border-border-light">
              <div className="flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M4.5 9L7.5 12L13.5 6"
                    stroke="#4A5FC1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[13px] font-semibold text-indigo tracking-[0.02em]">
                  진로 탐색
                </span>
              </div>
            </div>
          </div>

          {/* Rows */}
          {decideItems.map((decide, i) => (
            <div
              key={i}
              className={`grid grid-cols-2 ${
                i < decideItems.length - 1
                  ? "border-b border-border-light/60"
                  : ""
              } hover:bg-bg-warm/30 transition-colors`}
            >
              <div className="p-4 md:p-5 border-r border-border-light/60 flex items-center">
                <span className="text-[14px] leading-[1.5] text-text-muted">
                  {decide}
                </span>
              </div>
              <div className="p-4 md:p-5 flex items-center">
                <span className="text-[14px] leading-[1.5] text-navy font-medium">
                  {exploreItems[i]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Callout */}
        <div
          className={`mt-10 bg-card-bg border-l-[3px] border-indigo/40 rounded-r-2xl px-6 md:px-8 py-6 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <p className="text-[16px] md:text-[18px] leading-[1.7] text-navy font-medium">
            &ldquo;관심사가 자주 바뀌는 것은 정상이자 건강한 신호입니다.
            <br className="hidden sm:block" />
            다양한 흥미를 시도하고 있다는 의미입니다.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
