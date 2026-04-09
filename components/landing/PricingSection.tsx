"use client";

import Link from "next/link";
import { useInView } from "@/lib/useInView";

const plans = [
  {
    name: "탐 페어런트",
    price: "3만원",
    period: "/월",
    desc: "부모-자녀 대화 멘토링",
    features: [
      "매일 AI 맞춤 대화 미션",
      "기록 기반 개인화",
      "주간 인사이트 리포트",
    ],
    cta: "시작하기",
    href: "/consultation",
    accent: "coral" as const,
  },
  {
    name: "탐 패밀리",
    price: "10만원",
    period: "/월",
    desc: "AI 탐험 + 리포트 + 부모 멘토링",
    features: [
      "매일 AI 경험 미션",
      "매주 부모님 인사이트 리포트",
      "매달 성장 업데이트 리포트",
      "생활기록부 시즌 맞춤 가이드",
      "부모 멘토링 무료 포함",
    ],
    cta: "상담 신청하기",
    href: "/consultation",
    accent: "indigo" as const,
    recommended: true,
  },
];

const accentMap = {
  coral: {
    border: "border-border-light",
    text: "text-coral",
    btn: "bg-coral hover:bg-coral-hover",
    check: "text-coral",
  },
  indigo: {
    border: "border-indigo/20",
    text: "text-indigo",
    btn: "bg-indigo hover:bg-[#3D4EA5]",
    check: "text-indigo",
  },
};

export default function PricingSection() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6">
      <div className="mx-auto max-w-[880px]">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className={`text-[28px] md:text-[40px] font-bold tracking-[-0.03em] text-navy transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            우리 아이에게 맞는 여정
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {plans.map((plan, i) => {
            const a = accentMap[plan.accent];
            return (
              <div
                key={plan.name}
                className={`relative bg-card-bg rounded-2xl border ${a.border} p-7 md:p-8 transition-all duration-700 ${
                  plan.recommended
                    ? "shadow-[0_8px_32px_rgba(74,95,193,0.1)]"
                    : "shadow-[0_2px_12px_rgba(26,26,46,0.03)]"
                } ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${200 + i * 150}ms` }}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-indigo text-white text-[11px] font-semibold px-4 py-1 rounded-full">
                      추천
                    </span>
                  </div>
                )}

                <h3 className={`text-[14px] font-semibold ${a.text} mb-2`}>
                  {plan.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[36px] md:text-[42px] font-black text-navy tracking-[-0.04em]">
                    {plan.price}
                  </span>
                  <span className="text-[15px] text-text-muted">{plan.period}</span>
                </div>

                <p className="text-[13px] text-text-secondary mb-6">{plan.desc}</p>

                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <svg className={`w-[16px] h-[16px] shrink-0 mt-0.5 ${a.check}`} viewBox="0 0 16 16" fill="none">
                        <path d="M3.5 8.5l3 3L12.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-[14px] text-navy leading-[1.5]">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block w-full text-center ${a.btn} text-white font-semibold text-[15px] py-3.5 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
