"use client";

import { useInView } from "@/lib/useInView";

const portfolioItems = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="#4A5FC1" strokeWidth="1.3" strokeDasharray="3 2" />
        <path d="M10 6l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3L10 6z" fill="#4A5FC1" fillOpacity="0.2" stroke="#4A5FC1" strokeWidth="0.8" />
      </svg>
    ),
    label: "미션 경험 기록",
    desc: "어떤 세계를 탐험했고, 어떤 선택을 했는지",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="14" height="14" rx="2" stroke="#E8614D" strokeWidth="1.3" />
        <path d="M6 8h8M6 11h5M6 14h3" stroke="#E8614D" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
    label: "딥다이브 탐구 기록",
    desc: "현실 사례 분석과 자기 의견 정리",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="#D4A853" strokeWidth="1.3" />
        <circle cx="10" cy="10" r="3" stroke="#D4A853" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="10" cy="10" r="1" fill="#D4A853" />
      </svg>
    ),
    label: "관심 패턴 분석",
    desc: "7개 관심 영역에서의 반응 패턴과 변화 추이",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 3l7 5v7l-7 2-7-2V8l7-5z" stroke="#6B8F71" strokeWidth="1.3" strokeLinejoin="round" fill="#6B8F71" fillOpacity="0.06" />
        <path d="M10 8v4M8 10h4" stroke="#6B8F71" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    label: "진로 연결 추천",
    desc: "패턴 기반 고교학점제 과목 · 자유학기제 활동 추천",
  },
];

export default function TamPortfolio() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[1120px]">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className={`flex items-center justify-center gap-3 mb-6 transition-all duration-600 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="w-8 h-[1px] bg-indigo" />
            <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
              탐 포트폴리오
            </span>
            <div className="w-8 h-[1px] bg-indigo" />
          </div>
          <h2
            className={`text-[28px] md:text-[40px] font-bold tracking-[-0.03em] text-navy mb-5 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            매일의 경험이
            <br />
            진로 탐색 포트폴리오가 됩니다
          </h2>
          <p
            className={`text-[15px] md:text-[17px] leading-[1.8] text-text-secondary max-w-[520px] mx-auto transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            미션에서 발견한 관심, 딥다이브에서 정리한 생각 —
            <br />
            자유학기제와 고교학점제에서 바로 활용할 수 있는
            <br />
            <span className="font-medium text-navy">아이만의 진로 탐색 기록</span>이 자동으로 쌓입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 max-w-[960px] mx-auto">
          {/* Left — portfolio items */}
          <div className="space-y-4">
            {portfolioItems.map((item, i) => (
              <div
                key={i}
                className={`bg-card-bg rounded-2xl p-5 md:p-6 border border-border-light/60 flex gap-4 transition-all duration-700 hover:shadow-[0_4px_20px_rgba(26,26,46,0.05)] ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${300 + i * 100}ms` }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-bg-warm flex items-center justify-center mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-navy mb-1 tracking-[-0.01em]">
                    {item.label}
                  </h3>
                  <p className="text-[13px] leading-[1.6] text-text-secondary">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — portfolio mockup */}
          <div
            className={`transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="bg-card-bg rounded-2xl border border-border-light shadow-[0_8px_40px_rgba(26,26,46,0.06)] overflow-hidden h-full">
              {/* Header */}
              <div className="px-6 py-4 border-b border-border-light/60 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-coral/20" />
                <span className="text-[13px] font-semibold text-navy">
                  서연이의 탐 포트폴리오
                </span>
                <span className="text-[11px] text-text-muted ml-auto">
                  2개월 차
                </span>
              </div>

              <div className="p-6 space-y-5">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-bg-warm">
                    <p className="text-[20px] font-bold text-indigo">24</p>
                    <p className="text-[11px] text-text-muted">미션 완료</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-bg-warm">
                    <p className="text-[20px] font-bold text-coral">24</p>
                    <p className="text-[11px] text-text-muted">딥다이브</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-bg-warm">
                    <p className="text-[20px] font-bold text-gold">7</p>
                    <p className="text-[11px] text-text-muted">관심 영역</p>
                  </div>
                </div>

                {/* Top interests */}
                <div>
                  <p className="text-[12px] font-semibold text-text-muted tracking-[0.02em] mb-3">
                    주요 관심 영역
                  </p>
                  <div className="space-y-2">
                    {[
                      { label: "윤리 & 사회", score: 82, color: "#6B8F71" },
                      { label: "리더십 & 의사결정", score: 75, color: "#4A5FC1" },
                      { label: "공감 & 관계", score: 68, color: "#D4A853" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="text-[11px] text-text-secondary w-28 flex-shrink-0 text-right">
                          {item.label}
                        </span>
                        <div className="flex-1 h-5 bg-navy/[0.03] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: isInView ? `${item.score}%` : "0%",
                              background: item.color,
                              opacity: 0.25,
                              transitionDelay: "800ms",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course recommendation */}
                <div className="p-4 rounded-xl bg-indigo-light/40 border border-indigo/[0.06]">
                  <p className="text-[12px] font-semibold text-indigo mb-2">
                    고교학점제 추천 과목
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["사회문제탐구", "법과정치", "윤리와사상", "창업과경영"].map((c) => (
                      <span key={c} className="text-[11px] px-2.5 py-1 rounded-full bg-card-bg text-text-secondary border border-border-light/60">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Activity note */}
                <div className="p-4 rounded-xl bg-coral-light/30 border border-coral/[0.06]">
                  <p className="text-[12px] font-semibold text-coral mb-2">
                    자유학기제 활동 소재
                  </p>
                  <p className="text-[12px] leading-[1.6] text-text-secondary">
                    &ldquo;자원 배분 딜레마를 경험하며 효율보다 공정을 선택한 이유를 논리적으로 설명함. 이후 실제 케냐 물 부족 사례를 탐구하며 자기 입장을 현실에 적용해봄.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom message */}
        <div
          className={`text-center mt-14 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          <p className="text-[15px] md:text-[17px] leading-[1.8] text-navy/70">
            진로 상담사 1회 = 30~50만원.
            <br />
            <span className="font-semibold text-navy">
              탐은 매일 데이터를 쌓고, 매월 리포트를 만듭니다.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
