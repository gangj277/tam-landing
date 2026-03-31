"use client";

import { useInView } from "@/lib/useInView";

export function ElemCTA() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 px-6 bg-gradient-to-b from-[#FAFAF8] via-[#FDF5F3] to-[#FAF0ED]"
    >
      <div className="mx-auto max-w-[600px] text-center">
        <div
          className={`transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Label */}
          <p className="text-[13px] font-medium text-coral mb-4 tracking-[0.02em]">
            탐 TAM
          </p>

          <h2 className="text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.35] mb-4">
            탐색의 시작은 경험입니다
          </h2>

          <p className="text-[15px] md:text-[16px] text-text-secondary leading-[1.7] mb-8 max-w-[440px] mx-auto">
            매일 10분, AI가 만든 새로운 세계에서
            <br />
            아이의 가능성을 넓히세요
          </p>

          {/* Primary CTA */}
          <a
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-coral text-white text-[15px] font-semibold hover:bg-coral-hover transition-all shadow-[0_2px_16px_rgba(232,97,77,0.3)] hover:shadow-[0_4px_24px_rgba(232,97,77,0.4)] hover:scale-[1.02] mb-4"
          >
            무료로 시작하기
          </a>

          {/* Secondary CTA */}
          <div className="mb-6">
            <a
              href="/quiz"
              className="text-[14px] font-medium text-indigo hover:text-indigo/80 transition-colors underline underline-offset-4 decoration-indigo/30"
            >
              1분 무료 진단 먼저 해보기
            </a>
          </div>

          {/* Trust badges */}
          <p className="text-[13px] text-text-muted">
            30초 가입 · 무료 체험 · 언제든 취소
          </p>
        </div>

        {/* Cross-link */}
        <div
          className={`mt-12 pt-8 border-t border-border-light/60 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <p className="text-[13px] text-text-muted mb-2">더 읽어보기</p>
          <a
            href="/guide/ai-era-career"
            className="text-[15px] font-medium text-navy hover:text-coral transition-colors"
          >
            AI 시대, 우리 아이 진로 준비 가이드 &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
