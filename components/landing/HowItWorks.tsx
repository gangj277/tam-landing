"use client";

import { useState } from "react";
import { useInView } from "@/lib/useInView";

const steps = [
  {
    num: "01",
    title: "세계에 들어간다",
    subtitle: "Encounter",
    desc: "오늘은 어떤 세계일까?\n화성 도시의 시장, 해양 연구선의 선장,\n미래 박물관의 큐레이터...\n매일 전혀 다른 세계와 역할이 열립니다.",
    color: "#4A5FC1",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="14" stroke="#4A5FC1" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d="M18 8l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6l2-6z" fill="#4A5FC1" fillOpacity="0.15" stroke="#4A5FC1" strokeWidth="1" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "선택한다",
    subtitle: "Choice",
    desc: "정답은 없습니다. 가치의 선택만 있습니다.\n효율과 공정 사이에서, 안전과 모험 사이에서,\n아이는 자기만의 기준으로 고릅니다.",
    color: "#E8614D",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M10 18h16" stroke="#E8614D" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 10v16" stroke="#E8614D" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="18" r="3" fill="#E8614D" fillOpacity="0.15" stroke="#E8614D" strokeWidth="1" />
        <circle cx="26" cy="18" r="3" fill="#E8614D" fillOpacity="0.15" stroke="#E8614D" strokeWidth="1" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "행동한다",
    subtitle: "Act",
    desc: "선택만 하고 끝나지 않습니다.\nAI와 함께 아이디어를 넓히고,\n다른 시각으로 바꿔보고,\n직접 결과물을 만들어봅니다.",
    color: "#D4A853",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="8" y="12" width="20" height="14" rx="2" stroke="#D4A853" strokeWidth="1.5" fill="#D4A853" fillOpacity="0.08" />
        <path d="M14 19h8M14 23h5" stroke="#D4A853" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M24 8l-4 4h3v2" stroke="#D4A853" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "발견한다",
    subtitle: "Mirror",
    desc: '"오늘은 완성도보다 독특함을 택했네요."\n"다른 사람의 반응을 많이 생각하면서 골랐어요."\n\n평가가 아니라 거울입니다.',
    color: "#4A5FC1",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="12" stroke="#4A5FC1" strokeWidth="1.5" fill="#4A5FC1" fillOpacity="0.06" />
        <circle cx="18" cy="18" r="6" stroke="#4A5FC1" strokeWidth="1" strokeDasharray="3 2" />
        <circle cx="18" cy="18" r="2" fill="#4A5FC1" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const { ref, isInView } = useInView(0.1);
  const [active, setActive] = useState(0);

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
            className={`text-[28px] md:text-[40px] font-bold tracking-[-0.03em] text-navy mb-4 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            하루 한 번, 네 단계의 경험
          </h2>
          <p
            className={`text-[15px] md:text-[17px] leading-[1.7] text-text-secondary transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            매일의 경험은 같은 구조로 반복됩니다.
            <br />
            아이는 익숙한 리듬 속에서 매일 다른 세계를 경험합니다.
          </p>
        </div>

        {/* Steps — horizontal stepper on desktop, vertical on mobile */}
        <div
          className={`transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          {/* Desktop horizontal step indicators */}
          <div className="hidden md:flex items-center justify-center gap-0 mb-12">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center">
                <button
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300 ${
                    active === i
                      ? "bg-card-bg shadow-[0_2px_12px_rgba(26,26,46,0.08)] border border-border-light"
                      : "hover:bg-navy/[0.03]"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-300 ${
                      active === i
                        ? "text-white"
                        : "bg-navy/[0.05] text-text-muted"
                    }`}
                    style={active === i ? { background: s.color } : {}}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`text-[14px] font-medium transition-colors duration-300 ${
                      active === i ? "text-navy" : "text-text-muted"
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
                {i < steps.length - 1 && (
                  <div className="w-8 h-[1px] bg-border-light mx-1" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile vertical list */}
          <div className="md:hidden space-y-3 mb-8">
            {steps.map((s, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                  active === i
                    ? "bg-card-bg shadow-[0_2px_12px_rgba(26,26,46,0.06)] border border-border-light"
                    : "hover:bg-navy/[0.02]"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 ${
                    active === i ? "text-white" : "bg-navy/[0.05] text-text-muted"
                  }`}
                  style={active === i ? { background: s.color } : {}}
                >
                  {i + 1}
                </span>
                <span
                  className={`text-[14px] font-medium ${
                    active === i ? "text-navy" : "text-text-muted"
                  }`}
                >
                  {s.title}
                </span>
                <span className="text-[11px] text-text-muted ml-auto">
                  {s.subtitle}
                </span>
              </button>
            ))}
          </div>

          {/* Active step detail */}
          <div
            key={active}
            className="animate-fade-in max-w-[560px] mx-auto bg-card-bg rounded-2xl border border-border-light p-8 md:p-10"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="flex-shrink-0 mt-1">{steps[active].icon}</div>
              <div>
                <span
                  className="text-[11px] font-semibold tracking-[0.06em] uppercase mb-1 block"
                  style={{ color: steps[active].color }}
                >
                  Step {steps[active].num} — {steps[active].subtitle}
                </span>
                <h3 className="text-[20px] font-bold text-navy tracking-[-0.02em]">
                  {steps[active].title}
                </h3>
              </div>
            </div>
            <p className="text-[15px] leading-[1.8] text-text-secondary whitespace-pre-line">
              {steps[active].desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
