"use client";

import { useInView } from "@/lib/useInView";

const rows = [
  {
    label: "운영 기간",
    before: "1년 (자유학년)",
    after: "1학기 (중1 1학기만)",
  },
  {
    label: "운영 시간",
    before: "221시간",
    after: "102시간",
  },
  {
    label: "활동 영역",
    before: "4개 (주제선택/진로탐색/예술체육/동아리)",
    after: "2개 (주제선택/진로탐색)",
  },
  {
    label: "내신",
    before: "1년간 미반영",
    after: "2학기부터 반영",
  },
  {
    label: "내신 비율",
    before: "\u2014",
    after: "중1 10% + 중2 40% + 중3 50%",
  },
];

export function JayuChanges() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section id="changes" ref={ref} className="relative py-20 md:py-28 px-6">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-coral" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
            2025 변경사항
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-10 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          자유학년제 vs 자유학기제 (2025~)
        </h2>

        {/* Comparison table */}
        <div
          className={`bg-card-bg rounded-2xl border border-border-light/60 overflow-hidden transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[180px_1fr_1fr] border-b border-border-light">
            <div className="p-4 md:p-5 bg-bg-warm/50" />
            <div className="p-4 md:p-5 bg-bg-warm/50 border-l border-border-light">
              <span className="text-[13px] font-semibold text-text-muted tracking-[0.02em]">
                기존 (자유학년제)
              </span>
            </div>
            <div className="p-4 md:p-5 bg-coral/[0.04] border-l border-border-light">
              <span className="text-[13px] font-semibold text-coral tracking-[0.02em]">
                2025~ (자유학기제)
              </span>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[180px_1fr_1fr] ${
                i < rows.length - 1 ? "border-b border-border-light/60" : ""
              } hover:bg-bg-warm/30 transition-colors`}
            >
              <div className="p-4 md:p-5 flex items-center">
                <span className="text-[14px] font-semibold text-navy">
                  {row.label}
                </span>
              </div>
              <div className="p-4 md:p-5 border-l border-border-light/60 flex items-center">
                <span className="text-[14px] leading-[1.5] text-text-muted">
                  {row.before}
                </span>
              </div>
              <div className="p-4 md:p-5 border-l border-border-light/60 flex items-center">
                <span className="text-[14px] leading-[1.5] text-navy font-medium">
                  {row.after}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
