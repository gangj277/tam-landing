"use client";

import { useInView } from "@/lib/useInView";

const interests = [
  { label: "창작 & 표현", value: 82, color: "#E8614D" },
  { label: "리더십", value: 70, color: "#4A5FC1" },
  { label: "모험 & 상상", value: 68, color: "#E09145" },
  { label: "공감 & 관계", value: 58, color: "#D4A853" },
  { label: "탐구 & 분석", value: 45, color: "#7C6FAF" },
];

export default function ReportSection() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="relative py-24 md:py-36 px-6 overflow-hidden">
      <div className="mx-auto max-w-[1120px]">
        {/* Section header */}
        <div className="text-center mb-14 md:mb-20">
          <div
            className={`flex items-center justify-center gap-2 mb-4 transition-all duration-600 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="w-8 h-[1.5px] bg-gold" />
            <span className="text-[12px] font-semibold tracking-[0.06em] uppercase text-gold">
              주간 리포트
            </span>
            <div className="w-8 h-[1.5px] bg-gold" />
          </div>
          <h2
            className={`text-[28px] md:text-[40px] lg:text-[44px] font-bold tracking-[-0.03em] text-navy leading-[1.2] transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            시험 점수로는 볼 수 없는
            <br />
            아이의 모습이 보입니다
          </h2>
        </div>

        {/* Two feature cards — MEDVi style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[960px] mx-auto">
          {/* Card 1: 관심 영역 맵 */}
          <div
            className={`bg-card-bg rounded-2xl border border-border-light shadow-[0_8px_40px_rgba(26,26,46,0.06)] overflow-hidden transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "250ms" }}
          >
            {/* Visual: Mini bar chart */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-gold">
                  <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M5 12V8M9 12V6M13 12V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-[13px] font-semibold text-navy">관심 영역 맵</span>
              </div>

              <div className="space-y-3">
                {interests.map((item, i) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-[12px] text-text-muted w-20 shrink-0 text-right">
                      {item.label}
                    </span>
                    <div className="flex-1 h-5 bg-navy/[0.03] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: isInView ? `${item.value}%` : "0%",
                          backgroundColor: item.color,
                          opacity: 0.3,
                          transitionDelay: `${400 + i * 80}ms`,
                        }}
                      />
                    </div>
                    <span
                      className="text-[12px] font-semibold w-6 text-right tabular-nums"
                      style={{ color: item.color }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 md:px-8 pb-6 md:pb-8">
              <h3 className="text-[17px] font-bold text-navy mb-1.5">
                아이만의 관심 지도
              </h3>
              <p className="text-[14px] text-text-secondary leading-[1.65]">
                선택의 패턴이 쌓이면, 성격검사보다 정확한 모습이 드러납니다
              </p>
            </div>
          </div>

          {/* Card 2: 발견된 패턴 */}
          <div
            className={`bg-card-bg rounded-2xl border border-border-light shadow-[0_8px_40px_rgba(26,26,46,0.06)] overflow-hidden transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-coral">
                  <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M6 9.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[13px] font-semibold text-navy">발견된 패턴</span>
              </div>

              <div className="space-y-4">
                {[
                  { text: "완성도보다 독특함을 자주 선택했어요", hex: "#E8614D" },
                  { text: "다른 사람을 돕는 역할에서 몰입도가 높았어요", hex: "#4A5FC1" },
                  { text: "이번 주엔 여러 안을 비교하기 시작했어요", hex: "#D4A853" },
                ].map((p, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3.5 rounded-xl bg-bg-warm/60 transition-all duration-600 ${
                      isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                    style={{ transitionDelay: `${550 + i * 100}ms` }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: p.hex }}
                    />
                    <p className="text-[13px] font-medium text-navy leading-[1.5]">
                      {p.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 md:px-8 pb-6 md:pb-8">
              <h3 className="text-[17px] font-bold text-navy mb-1.5">
                매주 쌓이는 인사이트
              </h3>
              <p className="text-[14px] text-text-secondary leading-[1.65]">
                부모님은 매주 아이의 새로운 면을 발견하게 됩니다
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial line */}
        <div
          className={`max-w-[600px] mx-auto mt-14 text-center transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <blockquote>
            <p className="text-[16px] md:text-[18px] leading-[1.7] text-navy/80 font-medium italic">
              &ldquo;아이가 이런 걸 중요하게 여기는지 처음 알았어요.
              시험 점수로는 절대 볼 수 없는 것들이더라고요.&rdquo;
            </p>
            <footer className="mt-3 text-[13px] text-text-muted">
              &mdash; 12세 자녀를 둔 어머니
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
