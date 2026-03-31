"use client";

import { useState } from "react";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // UI-only: in production, wire up to your newsletter backend
    setSubmitted(true);
  }

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-navy-light px-6 py-14 md:px-12 md:py-16 text-center">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-[280px] h-[280px] rounded-full bg-coral/[0.06] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-indigo/[0.06] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="relative z-10">
        <p className="text-[12px] font-medium text-coral tracking-[0.04em] uppercase mb-3">
          뉴스레터
        </p>
        <h3 className="text-[22px] md:text-[28px] font-bold text-white leading-[1.3] tracking-[-0.02em] mb-3">
          AI 시대 자녀교육 이야기,
          <br className="hidden md:block" />
          매주 받아보세요
        </h3>
        <p className="text-[15px] text-white/50 leading-[1.6] mb-8 max-w-md mx-auto">
          부모가 알아야 할 교육 트렌드와 자녀 성장 인사이트를 보내드립니다.
        </p>

        {submitted ? (
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 text-white text-[15px] font-medium">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="text-coral"
              >
                <path
                  d="M4 9.5L7.5 13L14 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              구독 신청이 완료되었습니다
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소"
              required
              className="w-full sm:flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/10 text-white placeholder:text-white/30 text-[15px] outline-none focus:border-coral/50 focus:bg-white/[0.12] transition-colors"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-coral text-white text-[15px] font-medium hover:bg-coral-hover transition-colors shadow-[0_2px_12px_rgba(232,97,77,0.3)] shrink-0"
            >
              구독하기
            </button>
          </form>
        )}

        <p className="text-[12px] text-white/25 mt-5">
          스팸 없이, 의미 있는 글만 보내드립니다.
        </p>
      </div>
    </section>
  );
}
