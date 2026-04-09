"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const categories = [
  {
    label: "AI 탐험 미션",
    desc: "매일 새로운 세계",
    gradient: "from-coral/20 to-coral/5",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#E8614D" strokeWidth="1.5" fill="#E8614D" fillOpacity="0.1" />
        <path d="M16 10v6l4 2" stroke="#E8614D" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 20l3-3 2 2 5-5" stroke="#E8614D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "부모 대화 멘토링",
    desc: "매일 맞춤 미션",
    gradient: "from-indigo/20 to-indigo/5",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="16" height="12" rx="3" stroke="#4A5FC1" strokeWidth="1.5" fill="#4A5FC1" fillOpacity="0.1" />
        <rect x="12" y="12" width="16" height="12" rx="3" stroke="#4A5FC1" strokeWidth="1.5" fill="#4A5FC1" fillOpacity="0.06" />
        <circle cx="10" cy="14" r="1.5" fill="#4A5FC1" fillOpacity="0.5" />
        <circle cx="14" cy="14" r="1.5" fill="#4A5FC1" fillOpacity="0.3" />
      </svg>
    ),
  },
  {
    label: "주간 인사이트 리포트",
    desc: "시험으론 못 보는 것",
    gradient: "from-gold/20 to-gold/5",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="4" width="20" height="24" rx="3" stroke="#D4A853" strokeWidth="1.5" fill="#D4A853" fillOpacity="0.08" />
        <path d="M11 12h10M11 16h7M11 20h4" stroke="#D4A853" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="22" cy="22" r="4" fill="#D4A853" fillOpacity="0.15" stroke="#D4A853" strokeWidth="1" />
        <path d="M20.5 22l1 1 2-2.5" stroke="#D4A853" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-navy">
      {/* Gradient overlays */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-coral/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo/[0.06] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[880px] w-full text-center">
        {/* Social proof badge */}
        <div
          className={`mt-16 md:mt-0 mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 backdrop-blur-sm transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-white/50">
            AI 기반 진로탐색 루틴
          </span>
        </div>

        {/* Main headline */}
        <h1
          className={`text-[36px] md:text-[52px] lg:text-[64px] font-bold leading-[1.15] tracking-[-0.04em] text-white mb-6 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          진로탐색,
          <br />
          <span className="relative inline-block text-coral">
            자기이해
            <svg
              className="absolute -bottom-1 left-0 w-full"
              height="8"
              viewBox="0 0 200 8"
              preserveAspectRatio="none"
            >
              <path
                d="M0,6 Q50,0 100,5 T200,4"
                fill="none"
                stroke="#E8614D"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.4"
              />
            </svg>
          </span>
          에서 시작됩니다.
        </h1>

        {/* Subtitle — 2 lines max */}
        <p
          className={`text-[16px] md:text-[20px] leading-[1.7] text-white/60 font-normal max-w-[520px] mx-auto mb-10 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          매일 10분, 아이는 새로운 세계를 탐험하고
          <br />
          부모님은 아이의 마음을 알아갑니다.
        </p>

        {/* CTA */}
        <div
          className={`mb-16 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 bg-coral text-white text-[15px] md:text-[16px] font-semibold px-10 py-4 rounded-full hover:bg-coral-hover transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_4px_24px_rgba(232,97,77,0.35)] active:scale-[0.98]"
          >
            상담 신청하기
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Category cards — MEDVi style */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "550ms" }}
        >
          {categories.map((cat, i) => (
            <div
              key={cat.label}
              className={`group relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 md:p-6 text-left hover:bg-white/[0.07] transition-all duration-500 cursor-default`}
              style={{ transitionDelay: `${600 + i * 80}ms` }}
            >
              <div className="mb-3">{cat.icon}</div>
              <p className="text-[14px] md:text-[15px] font-semibold text-white mb-1">
                {cat.label}
              </p>
              <p className="text-[13px] text-white/40">{cat.desc}</p>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="absolute top-5 right-5 text-white/20 group-hover:text-white/40 transition-colors"
              >
                <path d="M6 4l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
