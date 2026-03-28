"use client";

import { useInView } from "@/lib/useInView";

const interests = [
  { label: "디자인 & 창작", value: 82, color: "#E8614D" },
  { label: "리더십 & 관리", value: 70, color: "#4A5FC1" },
  { label: "과학 & 탐구", value: 45, color: "#D4A853" },
  { label: "감정 & 관계", value: 30, color: "#8A8A9A" },
];

const patterns = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2l2 4.5H16l-3.5 3 1.5 5L9 11.5 4 14.5l1.5-5L2 6.5h5L9 2z" stroke="#E8614D" strokeWidth="1.2" fill="#E8614D" fillOpacity="0.1" />
      </svg>
    ),
    text: "완성도보다 독특함을 자주 선택했어요",
    detail: "5번의 경험 중 4번, 정돈된 결과보다 새로운 시도를 골랐습니다.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="6" stroke="#4A5FC1" strokeWidth="1.2" fill="#4A5FC1" fillOpacity="0.1" />
        <path d="M6.5 9.5L8 11l3.5-4" stroke="#4A5FC1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "다른 사람을 돕는 역할에서 몰입도가 높았어요",
    detail: "시장, 중재자, 디자이너 역할에서 특히 오래 머물렀습니다.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 12l4-4 3 3 5-6" stroke="#D4A853" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "이번 주엔 여러 안을 비교하기 시작했어요",
    detail: "처음엔 바로 골랐는데, 후반부터 AI로 다른 버전을 만들어보기 시작했어요.",
  },
];

export default function SelfDiscovery() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6 bg-bg-warm-light">
      <div className="mx-auto max-w-[1120px]">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`flex items-center justify-center gap-3 mb-6 transition-all duration-600 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="w-8 h-[1px] bg-coral" />
            <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
              자기 발견
            </span>
            <div className="w-8 h-[1px] bg-coral" />
          </div>
          <h2
            className={`text-[28px] md:text-[40px] font-bold tracking-[-0.03em] text-navy mb-4 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            놀고 있을 뿐인데, 아이가 보입니다
          </h2>
          <p
            className={`text-[15px] md:text-[17px] leading-[1.7] text-text-secondary max-w-[520px] mx-auto transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            매일의 선택은 조용히 쌓입니다.
            <br />
            이건 테스트 결과가 아닙니다.
            <br />
            아이의 진짜 반응에서 나온 이야기입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 max-w-[960px] mx-auto">
          {/* Weekly Mirror mockup */}
          <div
            className={`transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="bg-card-bg rounded-2xl border border-border-light shadow-[0_8px_40px_rgba(26,26,46,0.06)] overflow-hidden">
              {/* Header bar */}
              <div className="px-6 py-4 border-b border-border-light/60 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-coral/20" />
                <span className="text-[13px] font-semibold text-navy">
                  이번 주 서연이의 경험 지도
                </span>
              </div>

              <div className="p-6 md:p-8">
                {/* Explored worlds */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[13px]">🌍</span>
                    <span className="text-[12px] font-semibold text-text-muted tracking-[0.02em]">
                      탐험한 세계
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["화성 도시", "동물구조센터", "미래학교", "해양연구선", "마을 중재"].map(
                      (w) => (
                        <span
                          key={w}
                          className="text-[12px] px-3 py-1.5 rounded-lg bg-bg-warm border border-border-light/60 text-text-secondary"
                        >
                          {w}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Discovered patterns */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[13px]">💡</span>
                    <span className="text-[12px] font-semibold text-text-muted tracking-[0.02em]">
                      발견된 패턴들
                    </span>
                  </div>
                  <div className="space-y-3">
                    {patterns.map((p, i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-3 rounded-xl bg-bg-warm/60"
                      >
                        <div className="flex-shrink-0 mt-0.5">{p.icon}</div>
                        <div>
                          <p className="text-[13px] font-medium text-navy mb-0.5">
                            {p.text}
                          </p>
                          <p className="text-[12px] text-text-muted leading-[1.5]">
                            {p.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interest area chart */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[13px]">🗺️</span>
                    <span className="text-[12px] font-semibold text-text-muted tracking-[0.02em]">
                      관심 영역 맵
                    </span>
                  </div>
                  <div className="space-y-3">
                    {interests.map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="text-[12px] text-text-secondary w-24 flex-shrink-0 text-right">
                          {item.label}
                        </span>
                        <div className="flex-1 h-6 bg-navy/[0.03] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: isInView ? `${item.value}%` : "0%",
                              background: item.color,
                              opacity: 0.2,
                              transitionDelay: "800ms",
                            }}
                          />
                        </div>
                        <span className="text-[11px] font-medium w-8 text-right" style={{ color: item.color }}>
                          {item.value > 60 ? "높음" : item.value > 40 ? "보통" : "탐색 중"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Parent testimonial sidebar */}
          <div
            className={`flex flex-col justify-center transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="relative p-8 rounded-2xl bg-card-bg border border-border-light">
              <svg
                className="absolute top-6 left-6 w-8 h-8 text-coral/15"
                viewBox="0 0 32 32"
                fill="currentColor"
              >
                <path d="M14 6H4v10c0 5.5 4.5 10 10 10v-4c-3.3 0-6-2.7-6-6h6V6zm14 0H18v10c0 5.5 4.5 10 10 10v-4c-3.3 0-6-2.7-6-6h6V6z" />
              </svg>
              <blockquote className="relative pt-8">
                <p className="text-[16px] md:text-[17px] leading-[1.75] text-navy font-medium mb-6">
                  아이가 이런 걸 중요하게 여기는지 처음 알았어요.
                  <br />
                  <span className="text-coral">
                    시험 점수로는 절대 볼 수 없는 것들
                  </span>
                  이더라고요.
                </p>
                <footer className="text-[13px] text-text-muted">
                  — 12세 자녀를 둔 어머니
                </footer>
              </blockquote>
            </div>

            <div className="mt-6 p-5 rounded-xl bg-indigo-light/50 border border-indigo/[0.06]">
              <p className="text-[13px] leading-[1.7] text-indigo/80">
                매주 아이의 경험 요약을 받아보실 수 있습니다.
                시험 점수로는 보이지 않는 아이의 관심과 가치관이 보입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
