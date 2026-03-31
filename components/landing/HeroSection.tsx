"use client";

import { useEffect, useState } from "react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F4F2EE] via-[#FAFAF8] to-[#FAFAF8]" />

      {/* Decorative floating elements — subtle world hints */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute top-[12%] left-[8%] opacity-[0.04]"
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
        >
          <circle cx="60" cy="60" r="58" stroke="#1A1A2E" strokeWidth="1.5" />
          <ellipse
            cx="60"
            cy="60"
            rx="58"
            ry="24"
            stroke="#1A1A2E"
            strokeWidth="1"
          />
          <line
            x1="60"
            y1="2"
            x2="60"
            y2="118"
            stroke="#1A1A2E"
            strokeWidth="1"
          />
        </svg>
        <svg
          className="absolute top-[18%] right-[10%] opacity-[0.035]"
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
        >
          <polygon
            points="40,4 76,60 4,60"
            stroke="#4A5FC1"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="40" cy="42" r="12" stroke="#4A5FC1" strokeWidth="1" />
        </svg>
        <svg
          className="absolute bottom-[22%] left-[12%] opacity-[0.03]"
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
        >
          <rect
            x="10"
            y="10"
            width="80"
            height="80"
            rx="4"
            stroke="#E8614D"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="25"
            y="25"
            width="50"
            height="50"
            rx="2"
            stroke="#E8614D"
            strokeWidth="1"
            fill="none"
          />
        </svg>
        <svg
          className="absolute bottom-[28%] right-[8%] opacity-[0.03]"
          width="90"
          height="90"
          viewBox="0 0 90 90"
          fill="none"
        >
          <path
            d="M45 5 L85 45 L45 85 L5 45 Z"
            stroke="#D4A853"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-[680px] text-center">
        {/* Tagline label */}
        <div
          className={`inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-navy/[0.04] border border-navy/[0.06] transition-all duration-700 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
          <span className="text-[12px] font-medium text-text-secondary tracking-[0.02em]">
            AI 시대의 새로운 경험 플랫폼
          </span>
        </div>

        {/* Main headline */}
        <h1
          className={`text-[32px] md:text-[52px] lg:text-[56px] font-bold leading-[1.25] tracking-[-0.035em] text-navy mb-6 transition-all duration-700 delay-200 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          세상은 <span className="text-coral">AI</span>로
          <br className="hidden md:block" /> 빠르게 바뀌고 있습니다.
          <br />
          <span className="mt-1 block">
            우리 아이는{" "}
            <span className="relative inline-block">
              그 세상을
              <svg
                className="absolute -bottom-1 left-0 w-full"
                height="6"
                viewBox="0 0 200 6"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,5 Q50,0 100,4 T200,3"
                  fill="none"
                  stroke="#E8614D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </svg>
            </span>{" "}
            경험하고 있나요?
          </span>
        </h1>

        {/* Sub-copy */}
        <p
          className={`text-[16px] md:text-[18px] leading-[1.7] text-text-secondary font-normal max-w-[520px] mx-auto mb-10 transition-all duration-700 delay-400 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          매일 10분, AI와 함께 새로운 세계를 탐험하고
          <br className="hidden sm:block" />
          현실과 연결하며 자기만의 진로를 발견하는 경험 플랫폼
        </p>

        {/* CTA */}
        <div
          className={`transition-all duration-700 delay-500 ${
            mounted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <a
            href="/signup"
            className="inline-flex items-center gap-2 bg-coral text-white text-[15px] font-semibold px-8 py-3.5 rounded-full hover:bg-coral-hover transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_4px_20px_rgba(232,97,77,0.3)] active:scale-[0.98]"
          >
            무료로 시작하기
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href="/quiz"
            className={`block mt-4 text-[13px] font-medium text-text-secondary hover:text-coral transition-colors duration-300 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            먼저 1분 무료 진단 해보기 →
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 delay-700 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-[11px] font-medium text-text-muted tracking-[0.06em] uppercase">
          Scroll
        </span>
        <svg
          width="16"
          height="24"
          viewBox="0 0 16 24"
          fill="none"
          className="animate-bounce-down"
        >
          <path
            d="M8 4v12M4 12l4 4 4-4"
            stroke="#8A8A9A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
