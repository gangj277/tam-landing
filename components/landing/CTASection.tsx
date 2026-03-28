"use client";

import { useState } from "react";
import { useInView } from "@/lib/useInView";

export default function CTASection() {
  const { ref, isInView } = useInView(0.15);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section
      ref={ref}
      id="waitlist"
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
          먼저 경험해보실 분들을 모집하고 있습니다.
          <br />
          얼리 액세스에 등록하시면, 출시 즉시 무료로 초대해 드립니다.
        </p>

        {/* Email form */}
        <div
          className={`transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소를 입력하세요"
                  required
                  className="flex-1 px-5 py-3.5 rounded-full bg-card-bg border border-border-light text-[15px] text-navy placeholder:text-text-muted/60 focus:outline-none focus:border-coral/40 focus:shadow-[0_0_0_3px_rgba(232,97,77,0.08)] transition-all duration-200"
                />
                <button
                  type="submit"
                  className="px-7 py-3.5 rounded-full bg-coral text-white text-[15px] font-semibold hover:bg-coral-hover transition-all duration-300 hover:shadow-[0_4px_20px_rgba(232,97,77,0.3)] active:scale-[0.97] flex-shrink-0"
                >
                  얼리 액세스 신청
                </button>
              </div>
            </form>
          ) : (
            <div className="animate-fade-in mb-6 p-5 rounded-2xl bg-card-bg border border-coral/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" fill="#E8614D" fillOpacity="0.1" stroke="#E8614D" strokeWidth="1.5" />
                  <path d="M7 10l2 2 4-4" stroke="#E8614D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[15px] font-semibold text-navy">
                  신청이 완료되었습니다!
                </span>
              </div>
              <p className="text-[13px] text-text-secondary">
                출시 소식을 가장 먼저 알려드릴게요.
              </p>
            </div>
          )}

          {/* Social proof */}
          <p className="text-[13px] text-text-muted mb-4">
            현재{" "}
            <span className="font-semibold text-coral">1,247</span>명의
            부모님이 대기 중입니다
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 text-[12px] text-text-muted/80">
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
            <span className="w-[1px] h-3 bg-border-light" />
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1" />
                <path d="M4 6l1.5 1.5L8 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              스팸 없음
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
