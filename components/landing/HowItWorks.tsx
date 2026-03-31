"use client";

import { useInView } from "@/lib/useInView";

const days = [
  {
    type: "mission" as const,
    label: "미션",
    title: "화성 첫 도시의 시장",
    desc: "물이 부족한 화성 도시에서 시장이 되어 농장과 병원 중 어디에 먼저 물을 보낼지 결정한다.",
    tags: ["판타지 세계", "역할 놀이", "가치 선택"],
    color: "#4A5FC1",
  },
  {
    type: "deepdive" as const,
    label: "딥다이브",
    title: "실제 가뭄 지역의 자원 배분",
    desc: "2024년 케냐의 물 부족 위기 — 실제로 어떻게 배분을 결정했을까? 어제 화성에서 내린 결정과 비교하며 자기 생각을 정리한다.",
    tags: ["현실 사례", "탐구 정리", "포트폴리오"],
    color: "#E8614D",
  },
  {
    type: "mission" as const,
    label: "미션",
    title: "동물구조센터 브랜딩 디자이너",
    desc: "아무도 모르는 동물구조센터를 사람들이 관심 갖게 만들 포스터를 만든다. 귀엽게 갈까, 진지하게 갈까?",
    tags: ["판타지 세계", "창작 판단", "소통"],
    color: "#4A5FC1",
  },
  {
    type: "deepdive" as const,
    label: "딥다이브",
    title: "실제 NGO는 어떻게 관심을 끌까?",
    desc: "유니세프, 그린피스가 쓰는 실제 캠페인 전략을 살펴보고, 어제 만든 포스터 접근법과 비교하며 의견을 정리한다.",
    tags: ["현실 사례", "분석", "포트폴리오"],
    color: "#E8614D",
  },
];

export default function HowItWorks() {
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
            <div className="w-8 h-[1px] bg-coral" />
            <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
              작동 방식
            </span>
            <div className="w-8 h-[1px] bg-coral" />
          </div>
          <h2
            className={`text-[28px] md:text-[40px] font-bold tracking-[-0.03em] text-navy mb-5 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            하루는 탐험, 다음 날은 탐구
          </h2>
          <p
            className={`text-[15px] md:text-[17px] leading-[1.8] text-text-secondary max-w-[520px] mx-auto transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            판타지 세계에서 발견한 관심을,
            <br />
            다음 날 현실 사례로 깊이 있게 탐구합니다.
            <br />
            <span className="text-navy font-medium">이 두 가지가 쌓여 진로 탐색 포트폴리오가 됩니다.</span>
          </p>
        </div>

        {/* Alternating timeline */}
        <div
          className={`max-w-[800px] mx-auto transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4A5FC1]" />
              <span className="text-[13px] font-medium text-text-secondary">미션 — 판타지 세계</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#E8614D]" />
              <span className="text-[13px] font-medium text-text-secondary">딥다이브 — 현실 탐구</span>
            </div>
          </div>

          {/* Day cards */}
          <div className="space-y-4">
            {days.map((day, i) => (
              <div
                key={i}
                className={`relative flex gap-4 md:gap-6 transition-all duration-700 ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${500 + i * 120}ms` }}
              >
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center flex-shrink-0 pt-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-bold text-white" style={{ background: day.color }}>
                    {day.type === "mission" ? "M" : "D"}
                  </div>
                  {i < days.length - 1 && (
                    <div className="w-[2px] flex-1 mt-2 rounded-full" style={{ background: `${days[i + 1].color}20` }} />
                  )}
                </div>

                {/* Card */}
                <div className={`flex-1 bg-card-bg rounded-2xl border p-5 md:p-6 mb-2 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(26,26,46,0.05)] ${
                  day.type === "mission" ? "border-[#4A5FC1]/10" : "border-[#E8614D]/10"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] font-bold tracking-[0.06em] uppercase px-2 py-0.5 rounded"
                      style={{ color: day.color, background: `${day.color}10` }}
                    >
                      Day {i + 1} · {day.label}
                    </span>
                  </div>
                  <h3 className="text-[16px] font-bold text-navy tracking-[-0.01em] mb-2">
                    {day.title}
                  </h3>
                  <p className="text-[13px] leading-[1.7] text-text-secondary mb-3">
                    {day.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {day.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                        style={{ color: day.color, background: `${day.color}08` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* After timeline — continuation hint */}
          <div className="flex items-center gap-4 mt-6 ml-4">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-navy/[0.04] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 3v8M3 7h8" stroke="#8A8A9A" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <p className="text-[13px] text-text-muted">
              Day 15부터는 AI가 아이의 패턴에 맞춰 미션과 딥다이브를 생성합니다
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
