"use client";

import { useInView } from "@/lib/useInView";

const events = [
  {
    year: "2025 상반기",
    title: "첫 도입",
    items: ["초3-4 · 중1 · 고1", "수학 · 영어 · 정보"],
    status: "활용률 8.1% · 미접속 60%",
    statusColor: "text-coral",
    dotColor: "bg-coral",
    lineColor: "bg-coral/20",
  },
  {
    year: "2025 하반기",
    title: "법적 지위 변경",
    items: [
      '"교과서" → "교육자료"로 격하',
      "의무 채택에서 자율 채택으로",
      "국어 · 기술가정 적용 제외",
    ],
    status: "채택교 58.8% 감소 (4,095→1,686교)",
    statusColor: "text-coral",
    dotColor: "bg-indigo",
    lineColor: "bg-indigo/20",
  },
  {
    year: "2026",
    title: "선도학교 중심 전환",
    items: [
      "선도학교 1,900교 중심 운영",
      "초5-6 · 중2 수학 · 영어 확대",
      '"안전성·효과성 검증 후 확산"',
    ],
    status: "전면 도입 → 단계적 운영으로 전환",
    statusColor: "text-indigo",
    dotColor: "bg-indigo",
    lineColor: "bg-indigo/20",
  },
  {
    year: "2027",
    title: "추가 과목 예정",
    items: [
      "사회 · 과학 추가 (당초 2026 예정)",
      "중3 확대",
      "1년 연기된 상태",
    ],
    status: "일정 미확정",
    statusColor: "text-text-muted",
    dotColor: "bg-border-light",
    lineColor: "bg-border-light",
  },
];

export function AidtTimeline() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section
      id="timeline"
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
            적용 현황
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          계획과 현실 사이
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-14 max-w-[600px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          야심찬 로드맵은 현장의 벽에 부딪혀 크게 조정되었습니다.
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line (desktop) */}
          <div className="hidden md:block absolute left-[140px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-coral/30 via-indigo/30 to-border-light" />

          <div className="space-y-8 md:space-y-10">
            {events.map((event, i) => (
              <div
                key={i}
                className={`relative flex flex-col md:flex-row md:items-start gap-4 md:gap-0 transition-all duration-700 ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${300 + i * 150}ms` }}
              >
                {/* Year label */}
                <div className="md:w-[140px] shrink-0 md:text-right md:pr-8">
                  <span className="text-[15px] md:text-[16px] font-bold text-navy tracking-[-0.01em]">
                    {event.year}
                  </span>
                </div>

                {/* Dot (desktop) */}
                <div className="hidden md:flex absolute left-[140px] -translate-x-1/2 top-1.5 z-10">
                  <div
                    className={`w-3 h-3 rounded-full ${event.dotColor} ring-4 ring-bg-warm`}
                  />
                </div>

                {/* Content card */}
                <div className="md:ml-10 bg-card-bg rounded-2xl p-6 md:p-7 border border-border-light/60 flex-1 hover:shadow-[0_8px_40px_rgba(26,26,46,0.04)] transition-shadow">
                  <h3 className="text-[17px] md:text-[18px] font-bold text-navy tracking-[-0.02em] mb-3">
                    {event.title}
                  </h3>

                  <ul className="space-y-1.5 mb-4">
                    {event.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-[14px] md:text-[15px] leading-[1.6] text-text-secondary"
                      >
                        <span className="mt-2 w-1 h-1 rounded-full bg-text-muted/50 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Status badge */}
                  <div className="pt-3 border-t border-border-light/40">
                    <span
                      className={`text-[13px] font-semibold ${event.statusColor}`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
