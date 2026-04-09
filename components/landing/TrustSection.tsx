"use client";

import { useInView } from "@/lib/useInView";

const trustItems = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3L5 7.5v6.5c0 6.3 3.8 12.1 9 14 5.2-1.9 9-7.7 9-14V7.5L14 3z" stroke="#4A5FC1" strokeWidth="1.5" fill="#4A5FC1" fillOpacity="0.06" />
        <path d="M10.5 14l2.5 2.5L17.5 12" stroke="#4A5FC1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "안전한 AI",
    desc: "다층 안전 필터. AI는 답을 주지 않고, 가능성만 열어줍니다.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#E8614D" strokeWidth="1.5" fill="#E8614D" fillOpacity="0.06" />
        <path d="M14 8v6l3.5 2" stroke="#E8614D" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "하루 10분",
    desc: "짧고 강하게. 끝없이 빠져드는 설계가 아닙니다.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="11" r="4.5" stroke="#D4A853" strokeWidth="1.5" fill="#D4A853" fillOpacity="0.06" />
        <path d="M7 24c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#D4A853" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "평가하지 않습니다",
    desc: "점수, 등급, 순위 없이. 선택의 패턴만 비춰줍니다.",
  },
];

export default function TrustSection() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="relative py-20 md:py-24 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[960px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustItems.map((item, i) => (
            <div
              key={i}
              className={`text-center transition-all duration-700 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-[15px] font-bold text-navy mb-2">{item.title}</h3>
              <p className="text-[13px] leading-[1.65] text-text-secondary max-w-[240px] mx-auto">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
