"use client";

import { useInView } from "@/lib/useInView";

export default function CTASection() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section
      ref={ref}
      id="cta"
      className="relative py-24 md:py-32 px-6 overflow-hidden"
    >
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAF8] via-[#FDF5F3] to-[#FAF0ED]" />

      {/* Subtle decorative circles */}
      <div className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full bg-coral/[0.03] blur-3xl" />
      <div className="absolute bottom-[20%] right-[10%] w-48 h-48 rounded-full bg-indigo/[0.03] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[600px] text-center">
        <h2
          className={`text-[28px] md:text-[40px] font-bold tracking-[-0.03em] text-navy mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          AI 시대,
          <br />
          아이에게 줄 수 있는
          <br />
          가장 좋은 경험의 시작
        </h2>

        <p
          className={`text-[15px] md:text-[17px] leading-[1.7] text-text-secondary mb-10 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          매일 5분, 새로운 세계에서 생각하는 힘을 키워보세요.
          <br />
          지금 가입하면 무료로 시작할 수 있습니다.
        </p>

        {/* CTA Button */}
        <div
          className={`transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-coral text-white text-[16px] font-semibold hover:bg-coral-hover transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_4px_20px_rgba(232,97,77,0.3)] active:scale-[0.97]"
          >
            무료로 시작하기
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 9h10M10 5l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 text-[12px] text-text-muted/80 mt-6">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1" />
                <path d="M4 6l1.5 1.5L8 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              30초 안에 가입
            </span>
            <span className="w-[1px] h-3 bg-border-light" />
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1" />
                <path d="M4 6l1.5 1.5L8 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              무료 체험
            </span>
            <span className="w-[1px] h-3 bg-border-light" />
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1" />
                <path d="M4 6l1.5 1.5L8 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              언제든 취소 가능
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
