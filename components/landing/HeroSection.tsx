"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import TamLogo from "@/components/brand/TamLogo";

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

      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute top-[12%] left-[8%] opacity-[0.04]"
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
        >
          <circle cx="60" cy="60" r="58" stroke="#1A1A2E" strokeWidth="1.5" />
          <ellipse cx="60" cy="60" rx="58" ry="24" stroke="#1A1A2E" strokeWidth="1" />
          <line x1="60" y1="2" x2="60" y2="118" stroke="#1A1A2E" strokeWidth="1" />
        </svg>
        <svg
          className="absolute top-[18%] right-[10%] opacity-[0.035]"
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
        >
          <polygon points="40,4 76,60 4,60" stroke="#4A5FC1" strokeWidth="1.5" fill="none" />
          <circle cx="40" cy="42" r="12" stroke="#4A5FC1" strokeWidth="1" />
        </svg>
        <svg
          className="absolute bottom-[22%] left-[12%] opacity-[0.03]"
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
        >
          <rect x="10" y="10" width="80" height="80" rx="4" stroke="#E8614D" strokeWidth="1.5" fill="none" />
          <rect x="25" y="25" width="50" height="50" rx="2" stroke="#E8614D" strokeWidth="1" fill="none" />
        </svg>
        <svg
          className="absolute bottom-[28%] right-[8%] opacity-[0.03]"
          width="90"
          height="90"
          viewBox="0 0 90 90"
          fill="none"
        >
          <path d="M45 5 L85 45 L45 85 L5 45 Z" stroke="#D4A853" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[760px] text-center">
        <div
          className={`mb-8 inline-flex items-center gap-4 rounded-full border border-navy/[0.08] bg-white/80 px-4 py-3 shadow-[0_12px_30px_rgba(26,26,46,0.06)] backdrop-blur-sm transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <TamLogo size="lg" />
          <div className="hidden h-7 w-px bg-border-light sm:block" />
          <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-text-muted hidden sm:block">
            AI 기반 진로탐색 루틴
          </span>
        </div>

        {/* Vision declaration — the question */}
        <p
          className={`text-[15px] md:text-[17px] leading-[1.7] text-text-secondary font-medium mb-6 tracking-[-0.01em] transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "120ms" }}
        >
          아이에게 &lsquo;꿈이 뭐야?&rsquo; 물어보면 뭐라고 하나요?
        </p>

        {/* Main headline — the answer */}
        <h1
          className={`text-[32px] md:text-[48px] lg:text-[56px] font-bold leading-[1.2] tracking-[-0.04em] text-navy mb-7 transition-all duration-700 delay-150 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          매일 10분,{" "}
          <span className="relative inline-block">
            자기 자신
            <svg
              className="absolute -bottom-1.5 left-0 w-full"
              height="8"
              viewBox="0 0 200 8"
              preserveAspectRatio="none"
            >
              <path
                d="M0,6 Q50,0 100,5 T200,4"
                fill="none"
                stroke="#E8614D"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.35"
              />
            </svg>
          </span>
          을
          <br />
          알아가는 진로탐색
        </h1>

        {/* Vision statement */}
        <p
          className={`text-[16px] md:text-[19px] leading-[1.75] text-navy/80 font-normal max-w-[560px] mx-auto mb-5 transition-all duration-700 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          1회성 적성검사 대신, 매일 쌓이는 탐색 루틴.
          <br className="hidden sm:block" />
          아이가 뭘 좋아하고 뭘 잘하는지, 경험을 통해 스스로 알아갑니다.
        </p>

        {/* Data anchor — grounding the vision in reality */}
        <p
          className={`text-[14px] md:text-[15px] leading-[1.7] text-text-muted font-normal max-w-[480px] mx-auto mb-10 transition-all duration-700 delay-400 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          그런데 지금, 중학생 10명 중 4명은 꿈이 없습니다.
          <br />
          이유의 절반은 &lsquo;내가 뭘 좋아하는지 몰라서&rsquo;.
        </p>

        {/* CTA */}
        <div
          className={`transition-all duration-700 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 bg-coral text-white text-[15px] font-semibold px-8 py-3.5 rounded-full hover:bg-coral-hover transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_4px_20px_rgba(232,97,77,0.3)] active:scale-[0.98]"
          >
            상담 신청하기
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <p
            className={`block mt-4 text-[13px] font-medium text-text-muted transition-all duration-700 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            상담 후 체험 계정이 발급됩니다
          </p>
        </div>

        {/* Source citation */}
        <p
          className={`mt-8 text-[11px] text-text-muted/50 transition-all duration-700 delay-700 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          교육부, 2024 초중등 진로교육 현황조사 (38,481명)
        </p>
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
