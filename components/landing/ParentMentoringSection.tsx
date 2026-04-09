"use client";

import Link from "next/link";
import { useInView } from "@/lib/useInView";

const benefits = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="#4A5FC1" strokeWidth="1.3" />
        <path d="M5.5 8l2 2 3-3.5" stroke="#4A5FC1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "매일 아침 맞춤 대화 미션 도착",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="#4A5FC1" strokeWidth="1.3" />
        <path d="M5.5 8l2 2 3-3.5" stroke="#4A5FC1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "기록할수록 더 정확해지는 AI 개인화",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="#4A5FC1" strokeWidth="1.3" />
        <path d="M5.5 8l2 2 3-3.5" stroke="#4A5FC1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "아이의 탐험 패턴이 대화에 반영",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="#4A5FC1" strokeWidth="1.3" />
        <path d="M5.5 8l2 2 3-3.5" stroke="#4A5FC1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "주간 인사이트 리포트 제공",
  },
];

export default function ParentMentoringSection() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="relative py-24 md:py-36 px-6 bg-bg-warm overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-indigo/[0.02] blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-[1120px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* LEFT — Copy */}
          <div
            className={`transition-all duration-700 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-[1.5px] bg-indigo" />
              <span className="text-[12px] font-semibold tracking-[0.06em] uppercase text-indigo">
                부모 대화 멘토링
              </span>
            </div>

            <h2 className="text-[28px] md:text-[40px] lg:text-[44px] font-bold tracking-[-0.03em] leading-[1.2] text-navy mb-6">
              아이의 탐험이 끝난 후,
              <br />
              부모님의 대화가
              <br />
              시작됩니다
            </h2>

            <p className="text-[15px] md:text-[17px] leading-[1.75] text-text-secondary mb-8 max-w-[420px]">
              매일 아침 아이에게 맞춤화된 대화 미션을 받습니다.
              밤에 기록을 남기면, 다음날 더 깊은 미션이 도착합니다.
            </p>

            <Link
              href="/consultation"
              className="inline-flex items-center gap-2 bg-indigo text-white text-[15px] font-semibold px-8 py-3.5 rounded-full hover:bg-[#3D4EA5] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(74,95,193,0.3)] active:scale-[0.98]"
            >
              시작하기
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* RIGHT — Visual: conversation card + benefits */}
          <div
            className={`transition-all duration-700 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            {/* Conversation card */}
            <div className="bg-card-bg rounded-2xl border border-border-light shadow-[0_12px_48px_rgba(26,26,46,0.08)] overflow-hidden mb-8">
              <div className="px-6 py-3.5 border-b border-border-light/60 flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo/40" />
                <span className="text-[12px] font-semibold text-text-muted tracking-[0.02em]">
                  오늘의 대화 미션
                </span>
                <span className="ml-auto text-[11px] text-text-muted">5분</span>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-[18px] md:text-[20px] font-bold text-navy leading-[1.5] mb-3">
                  &ldquo;오늘 학교에서 제일 웃겼던 일이 뭐야?&rdquo;
                </p>
                <p className="text-[13px] text-text-secondary leading-[1.65]">
                  아이가 또래 관계에서 어떤 역할을 하는지 자연스럽게 알 수 있는 질문입니다.
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  {b.icon}
                  <span className="text-[14px] text-navy/70">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
