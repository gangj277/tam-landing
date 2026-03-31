"use client";

import { useState } from "react";
import { useInView } from "@/lib/useInView";

const categories = [
  {
    id: "common",
    label: "공통과목",
    color: "indigo",
    count: "필수",
    title: "모든 학생이 이수하는 기초",
    desc: "고등학교 교육의 기본이 되는 과목으로, 모든 학생이 반드시 이수해야 합니다. 교과군별 필수이수 학점이 정해져 있으며, 총 84학점을 공통으로 이수합니다.",
    subjects: [
      { area: "국어", items: "공통국어1, 공통국어2 (8학점)" },
      { area: "수학", items: "공통수학1, 공통수학2 (8학점)" },
      { area: "영어", items: "공통영어1, 공통영어2 (8학점)" },
      { area: "한국사", items: "한국사1, 한국사2 (6학점)" },
      { area: "사회·과학", items: "통합사회, 통합과학 등 (18학점)" },
      { area: "체육·예술", items: "체육, 음악, 미술 등 (20학점)" },
    ],
  },
  {
    id: "general",
    label: "일반선택",
    color: "coral",
    count: "36개",
    title: "학문의 주요 내용 심화",
    desc: "교과의 학문적 기본 내용을 심화 학습하는 과목입니다. 5등급 상대평가가 적용되며, 대학 입시에서 교과 학업 역량을 보여줄 수 있는 과목군입니다.",
    subjects: [
      { area: "국어", items: "화법과 작문, 독서와 작문, 문학" },
      { area: "수학", items: "대수, 미적분I, 확률과 통계" },
      { area: "영어", items: "영어I, 영어II, 영어 독해와 작문" },
      { area: "사회", items: "한국지리, 세계사, 경제, 정치와 법, 윤리와 사상" },
      { area: "과학", items: "물리학, 화학, 생명과학, 지구과학" },
    ],
  },
  {
    id: "career",
    label: "진로선택",
    color: "gold",
    count: "64개",
    title: "진로 맞춤 심화 학습",
    desc: "자신의 진로와 관련된 분야를 깊이 탐구하는 과목입니다. 성취도(A~E) 절대평가만 적용되어 도전적인 과목 선택이 가능합니다. 교과별 가장 다양한 선택지를 제공합니다.",
    subjects: [
      { area: "국어", items: "주제 탐구 독서, 문학과 영상, 직무 의사소통" },
      { area: "수학", items: "미적분II, 기하, 수학과제 탐구" },
      { area: "사회", items: "도시의 미래 탐구, 국제 관계의 이해, 금융과 경제생활" },
      { area: "과학", items: "역학과 에너지, 물질과 에너지, 세포와 물질대사" },
      { area: "예체능", items: "음악 전공 실기, 미술 전공 실기" },
    ],
  },
  {
    id: "convergence",
    label: "융합선택",
    color: "navy",
    count: "38개 (신설)",
    title: "교과 융합 + 실생활 연계",
    desc: "2022 개정 교육과정에서 새로 만들어진 과목군입니다. 여러 교과의 내용을 융합하거나 실생활과 연결하는 과목으로, 절대평가(A~E)가 적용됩니다.",
    subjects: [
      { area: "언어·문화", items: "매체 의사소통, 언어생활 탐구" },
      { area: "수학·과학", items: "수학과 문화, 실용 통계, 과학의 역사와 문화" },
      { area: "사회·시사", items: "세계 문제와 지속가능한 삶, 기후변화와 지속가능한 세계" },
      { area: "기술·정보", items: "소프트웨어와 생활, 데이터 과학" },
      { area: "체육·예술", items: "스포츠 생활, 영상 제작의 이해" },
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; activeBg: string }> = {
  indigo: { bg: "bg-indigo/[0.06]", text: "text-indigo", border: "border-indigo/20", activeBg: "bg-indigo" },
  coral: { bg: "bg-coral/[0.06]", text: "text-coral", border: "border-coral/20", activeBg: "bg-coral" },
  gold: { bg: "bg-gold/[0.08]", text: "text-gold", border: "border-gold/20", activeBg: "bg-gold" },
  navy: { bg: "bg-navy/[0.06]", text: "text-navy", border: "border-navy/20", activeBg: "bg-navy" },
};

export function CourseStructureTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const { ref, isInView } = useInView(0.1);
  const active = categories[activeTab];
  const colors = colorMap[active.color];

  return (
    <section id="courses" ref={ref} className="relative py-20 md:py-28 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-indigo" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
            선택과목 구조
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          4종류의 과목, 총 138개
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-10 max-w-[600px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          고교학점제에서는 과목이 4개 유형으로 나뉩니다. 각 유형을 눌러 자세히 살펴보세요.
        </p>

        {/* Tab buttons */}
        <div
          className={`flex flex-wrap gap-2 md:gap-3 mb-8 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {categories.map((cat, i) => {
            const isActive = i === activeTab;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(i)}
                className={`px-4 md:px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-300 border ${
                  isActive
                    ? `${colorMap[cat.color].activeBg} text-white border-transparent shadow-sm`
                    : `bg-card-bg ${colorMap[cat.color].text} ${colorMap[cat.color].border} hover:${colorMap[cat.color].bg}`
                }`}
              >
                {cat.label}
                <span
                  className={`ml-1.5 text-[12px] font-medium ${
                    isActive ? "text-white/70" : "text-text-muted"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="bg-card-bg rounded-2xl p-6 md:p-8 border border-border-light/60">
          <div className="mb-6">
            <h3 className={`text-[20px] md:text-[24px] font-bold tracking-[-0.02em] mb-2 ${colors.text}`}>
              {active.title}
            </h3>
            <p className="text-[15px] leading-[1.7] text-text-secondary">
              {active.desc}
            </p>
          </div>

          {/* Subject list */}
          <div className="space-y-3">
            {active.subjects.map((subj, i) => (
              <div
                key={i}
                className={`flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-3.5 rounded-xl ${colors.bg}`}
              >
                <span className={`text-[13px] font-semibold ${colors.text} shrink-0 sm:w-[80px]`}>
                  {subj.area}
                </span>
                <span className="text-[14px] leading-[1.6] text-text-secondary">
                  {subj.items}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
