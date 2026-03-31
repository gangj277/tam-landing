"use client";

import { useState } from "react";
import { useInView } from "@/lib/useInView";

const tabs = [
  {
    id: "topic",
    label: "주제선택",
    title: "관심 분야를 골라 심화 탐구",
    desc: "학생이 자신의 관심 분야를 선택하여 심화 탐구하는 활동입니다. 학교마다 개설되는 과목이 다르며, 학생은 여러 주제 중 원하는 것을 골라 한 학기 동안 깊이 있게 경험합니다.",
    examples: [
      { area: "기술·코딩", items: "파이썬 기초, 앱 만들기, 아두이노" },
      { area: "생활·문화", items: "요리, 제과제빵, 바리스타 체험" },
      { area: "미디어", items: "영상제작, 유튜브 콘텐츠, 팟캐스트" },
      { area: "메이커", items: "드론 조종, 3D프린팅, 목공" },
      { area: "인문·사회", items: "모의재판, 역사탐구, 토론" },
    ],
  },
  {
    id: "career",
    label: "진로탐색",
    title: "직업 세계를 직접 만나는 경험",
    desc: "다양한 직업 현장을 방문하고, 진로 상담과 검사를 통해 자신의 진로 방향을 탐색하는 활동입니다. 커리어넷과 꿈길 플랫폼을 활용한 체험이 주를 이룹니다.",
    examples: [
      { area: "현장 방문", items: "기업 탐방, 대학 캠퍼스 투어, 공공기관 견학" },
      { area: "직업 체험", items: "일일 직업체험, 직업인 멘토링, 직업 시뮬레이션" },
      { area: "진로 상담", items: "1:1 진로상담, 진로 심리검사, 적성검사" },
      { area: "플랫폼", items: "커리어넷 진로검사, 꿈길 체험처 매칭" },
    ],
  },
];

export function JayuActivities() {
  const [activeTab, setActiveTab] = useState(0);
  const { ref, isInView } = useInView(0.1);
  const active = tabs[activeTab];

  return (
    <section id="activities" ref={ref} className="relative py-20 md:py-28 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-indigo" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
            실제 활동
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          자유학기에 하는 활동
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-10 max-w-[600px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          2025년부터 자유학기 활동은 2개 영역으로 축소되었습니다. 각 영역을 눌러
          살펴보세요.
        </p>

        {/* Tab buttons */}
        <div
          className={`flex flex-wrap gap-2 md:gap-3 mb-8 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {tabs.map((tab, i) => {
            const isActive = i === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-300 border ${
                  isActive
                    ? "bg-indigo text-white border-transparent shadow-sm"
                    : "bg-card-bg text-indigo border-indigo/20 hover:bg-indigo/[0.06]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="bg-card-bg rounded-2xl p-6 md:p-8 border border-border-light/60">
          <div className="mb-6">
            <h3 className="text-[20px] md:text-[24px] font-bold tracking-[-0.02em] mb-2 text-indigo">
              {active.title}
            </h3>
            <p className="text-[15px] leading-[1.7] text-text-secondary">
              {active.desc}
            </p>
          </div>

          {/* Examples list */}
          <div className="space-y-3">
            {active.examples.map((ex, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-3.5 rounded-xl bg-indigo/[0.06]"
              >
                <span className="text-[13px] font-semibold text-indigo shrink-0 sm:w-[100px]">
                  {ex.area}
                </span>
                <span className="text-[14px] leading-[1.6] text-text-secondary">
                  {ex.items}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div
          className={`mt-6 bg-card-bg border-l-[3px] border-gold/40 rounded-r-2xl px-6 md:px-8 py-5 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <p className="text-[14px] md:text-[15px] leading-[1.7] text-text-secondary">
            <span className="font-semibold text-gold">참고:</span> 기존
            예술·체육 활동과 동아리 활동은 2025년부터 자유학기 활동에서
            제외되었습니다. 이 활동들은 일반 교육과정 내에서 별도로 운영됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}
