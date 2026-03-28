"use client";

import { useInView } from "@/lib/useInView";
import MissionDemo from "@/components/interactive/MissionDemo";

const values = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#4A5FC1" strokeWidth="1.5" fill="#4A5FC1" fillOpacity="0.06" />
        <path d="M16 8v4l3 3" stroke="#4A5FC1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="16" r="2" fill="#4A5FC1" />
        <path d="M8 16h2M22 16h2M16 8V6M16 26v-2" stroke="#4A5FC1" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
    title: "경험의 지평 확장",
    desc: "매일 새로운 세계와 역할을 만납니다.\n우주, 바다, 미래도시, 예술, 과학 —\n아직 만나보지 못한 가능성을 엽니다.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 6C10 6 6 12 6 16s4 10 10 10 10-4 10-10S22 6 16 6z" stroke="#E8614D" strokeWidth="1.5" fill="#E8614D" fillOpacity="0.06" />
        <path d="M12 16c0-2 1.8-4 4-4s4 2 4 4-1.8 4-4 4-4-2-4-4z" stroke="#E8614D" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="1.5" fill="#E8614D" />
      </svg>
    ),
    title: "자기이해의 성장",
    desc: "반복된 선택의 패턴에서\n아이만의 가치관과 성향이 드러납니다.\n평가가 아닌, 발견입니다.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="10" width="20" height="14" rx="3" stroke="#D4A853" strokeWidth="1.5" fill="#D4A853" fillOpacity="0.06" />
        <circle cx="13" cy="17" r="2.5" stroke="#D4A853" strokeWidth="1.2" />
        <circle cx="20" cy="17" r="2.5" stroke="#D4A853" strokeWidth="1.2" />
        <path d="M11 8h10" stroke="#D4A853" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15.5 17h1" stroke="#D4A853" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
    title: "AI 활용 감각",
    desc: "AI를 두려워하지 않고, 맹신하지 않고,\n직접 다루는 감각을 키웁니다.\n결과를 바꾸고, 비교하고, 고르는 습관.",
  },
];

export default function ProductIntro() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[1120px]">
        {/* Section header */}
        <div className="text-center mb-16">
          <div
            className={`flex items-center justify-center gap-3 mb-6 transition-all duration-600 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="w-8 h-[1px] bg-indigo" />
            <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
              직접 경험해보세요
            </span>
            <div className="w-8 h-[1px] bg-indigo" />
          </div>

          <h2
            className={`text-[28px] md:text-[40px] font-bold tracking-[-0.03em] text-navy mb-4 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            매일 10분, 새로운 세계가 열립니다
          </h2>

          <p
            className={`text-[15px] md:text-[17px] leading-[1.7] text-text-secondary max-w-[480px] mx-auto transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            앱을 열면 오늘의 세계가 바로 시작됩니다.
            <br />
            긴 설명도, 복잡한 설정도 없습니다.
          </p>
        </div>

        {/* Interactive demo */}
        <div
          className={`mb-20 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <MissionDemo />
        </div>

        {/* Value cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <div
              key={i}
              className={`bg-card-bg rounded-2xl p-7 md:p-8 border border-border-light/60 transition-all duration-700 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${600 + i * 120}ms` }}
            >
              <div className="mb-4">{v.icon}</div>
              <h3 className="text-[16px] font-bold text-navy mb-3 tracking-[-0.01em]">
                {v.title}
              </h3>
              <p className="text-[14px] leading-[1.7] text-text-secondary whitespace-pre-line">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
