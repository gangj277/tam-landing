"use client";

import { useInView } from "@/lib/useInView";

const interests = [
  { label: "창작 & 표현", value: 82, color: "#E8614D" },
  { label: "리더십 & 의사결정", value: 70, color: "#4A5FC1" },
  { label: "모험 & 상상", value: 68, color: "#E09145" },
  { label: "공감 & 관계", value: 58, color: "#D4A853" },
  { label: "윤리 & 사회", value: 52, color: "#6B8F71" },
  { label: "탐구 & 분석", value: 45, color: "#7C6FAF" },
  { label: "환경 & 지속가능성", value: 35, color: "#5B9EA6" },
];

const patterns = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 2l2 4.5H16l-3.5 3 1.5 5L9 11.5 4 14.5l1.5-5L2 6.5h5L9 2z"
          stroke="#E8614D"
          strokeWidth="1.2"
          fill="#E8614D"
          fillOpacity="0.1"
        />
      </svg>
    ),
    text: "완성도보다 독특함을 자주 선택했어요",
    detail: "5번의 경험 중 4번, 정돈된 결과보다 새로운 시도를 골랐습니다.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle
          cx="9"
          cy="9"
          r="6"
          stroke="#4A5FC1"
          strokeWidth="1.2"
          fill="#4A5FC1"
          fillOpacity="0.1"
        />
        <path
          d="M6.5 9.5L8 11l3.5-4"
          stroke="#4A5FC1"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    text: "다른 사람을 돕는 역할에서 몰입도가 높았어요",
    detail: "시장, 중재자, 디자이너 역할에서 특히 오래 머물렀습니다.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M3 12l4-4 3 3 5-6"
          stroke="#D4A853"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    text: "이번 주엔 여러 안을 비교하기 시작했어요",
    detail:
      "처음엔 바로 골랐는데, 후반부터 AI로 다른 버전을 만들어보기 시작했어요.",
  },
];

const worlds = [
  "화성 도시",
  "동물구조센터",
  "미래학교",
  "해양연구선",
  "마을 중재",
];

const subjectTags = ["사회문제탐구", "법과정치", "윤리와사상", "창업과경영"];

export default function ResultShowcase() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6 bg-bg-warm-light overflow-hidden">
      {/* Subtle decorative constellation dots */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Top-right cluster */}
        <div
          className="absolute top-20 right-[15%] w-1.5 h-1.5 rounded-full bg-coral/15"
          style={{ animationDelay: "0s" }}
        />
        <div className="absolute top-28 right-[12%] w-1 h-1 rounded-full bg-indigo/10" />
        <div className="absolute top-16 right-[10%] w-1 h-1 rounded-full bg-coral/10" />
        {/* Connecting line hint */}
        <svg
          className="absolute top-16 right-[10%] w-32 h-20 opacity-[0.04]"
          viewBox="0 0 128 80"
          fill="none"
        >
          <path
            d="M8 60 L50 20 L120 45"
            stroke="currentColor"
            strokeWidth="0.8"
            className="text-navy"
          />
        </svg>

        {/* Bottom-left cluster */}
        <div className="absolute bottom-32 left-[8%] w-1.5 h-1.5 rounded-full bg-indigo/10" />
        <div className="absolute bottom-40 left-[12%] w-1 h-1 rounded-full bg-coral/10" />
        <div className="absolute bottom-24 left-[14%] w-1 h-1 rounded-full bg-indigo/8" />
        <svg
          className="absolute bottom-24 left-[8%] w-28 h-24 opacity-[0.03]"
          viewBox="0 0 112 96"
          fill="none"
        >
          <path
            d="M10 70 L60 10 L100 50"
            stroke="currentColor"
            strokeWidth="0.8"
            className="text-navy"
          />
        </svg>

        {/* Orbiting element — top left */}
        <div className="absolute top-[30%] left-[5%] w-2 h-2 rounded-full border border-coral/10" />
        <div className="absolute top-[32%] left-[6%] w-3 h-3 rounded-full border border-dashed border-coral/[0.06]" />

        {/* Soft radial glow behind the mockup area */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-coral/[0.02] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1120px]">
        {/* Section label — centered */}
        <div className="text-center mb-16">
          <div
            className={`flex items-center justify-center gap-3 mb-6 transition-all duration-600 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="w-8 h-[1px] bg-coral" />
            <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
              부모님이 받는 리포트
            </span>
            <div className="w-8 h-[1px] bg-coral" />
          </div>

          {/* Headline */}
          <h2
            className={`text-[28px] md:text-[40px] font-bold tracking-[-0.03em] text-navy mb-4 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            매주, 시험 점수로는 볼 수 없는
            <br className="hidden md:block" />
            아이의 모습이 보이기 시작합니다
          </h2>

          {/* Subtitle */}
          <p
            className={`text-[15px] md:text-[17px] leading-[1.7] text-text-secondary max-w-[540px] mx-auto transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            매일 새로운 세계에서 역할을 맡고, 딜레마 앞에서 고민하고, 자기만의 답을 고릅니다.
            <br />
            그 선택의 패턴이 쌓이면, 성격검사보다 정확한 아이의 모습이 드러납니다.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 max-w-[1040px] mx-auto">
          {/* LEFT COLUMN: Weekly Mirror Mockup */}
          <div
            className={`transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="bg-card-bg rounded-2xl border border-border-light shadow-[0_8px_40px_rgba(26,26,46,0.06)] overflow-hidden">
              {/* Header bar */}
              <div className="px-6 py-4 border-b border-border-light/60 flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-coral" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-coral/40 animate-ping" />
                </div>
                <span className="text-[13px] font-semibold text-navy">
                  이번 주 서연이의 경험 지도
                </span>
              </div>

              <div className="p-6 md:p-8">
                {/* Section A: 탐험한 세계 */}
                <div className="mb-7">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[13px]" aria-hidden="true">
                      🌍
                    </span>
                    <span className="text-[12px] font-semibold text-text-muted tracking-[0.02em]">
                      탐험한 세계
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {worlds.map((w, i) => (
                      <span
                        key={w}
                        className={`text-[12px] px-3 py-1.5 rounded-lg bg-bg-warm border border-border-light/60 text-text-secondary transition-all duration-500 ${
                          isInView
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2"
                        }`}
                        style={{ transitionDelay: `${500 + i * 60}ms` }}
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Section B: 발견된 패턴들 */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[13px]" aria-hidden="true">
                      💡
                    </span>
                    <span className="text-[12px] font-semibold text-text-muted tracking-[0.02em]">
                      발견된 패턴들
                    </span>
                  </div>
                  <div className="space-y-3">
                    {patterns.map((p, i) => (
                      <div
                        key={i}
                        className={`flex gap-3 p-3.5 rounded-xl bg-bg-warm/60 transition-all duration-600 ${
                          isInView
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-4"
                        }`}
                        style={{ transitionDelay: `${550 + i * 120}ms` }}
                      >
                        <div className="flex-shrink-0 mt-0.5">{p.icon}</div>
                        <div>
                          <p className="text-[13px] font-medium text-navy mb-1">
                            {p.text}
                          </p>
                          <p className="text-[12px] text-text-muted leading-[1.6]">
                            → {p.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section C: 관심 영역 맵 */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[13px]" aria-hidden="true">
                      🗺️
                    </span>
                    <span className="text-[12px] font-semibold text-text-muted tracking-[0.02em]">
                      관심 영역 맵
                    </span>
                  </div>
                  <div className="space-y-3">
                    {interests.map((item, i) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-3"
                      >
                        <span className="text-[12px] text-text-secondary w-[7rem] flex-shrink-0 text-right">
                          {item.label}
                        </span>
                        <div className="flex-1 h-6 bg-navy/[0.03] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all ease-out"
                            style={{
                              width: isInView ? `${item.value}%` : "0%",
                              backgroundColor: item.color,
                              opacity: 0.25,
                              transitionDuration: "1000ms",
                              transitionDelay: `${800 + i * 80}ms`,
                            }}
                          />
                        </div>
                        <span
                          className="text-[12px] font-semibold w-8 text-right tabular-nums"
                          style={{ color: item.color }}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Testimonial + 고교학점제 */}
          <div className="flex flex-col justify-center gap-6">
            {/* Testimonial card */}
            <div
              className={`transition-all duration-700 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <div className="relative p-8 rounded-2xl bg-card-bg border border-border-light shadow-[0_4px_24px_rgba(26,26,46,0.04)]">
                {/* Large quotation mark */}
                <svg
                  className="absolute top-6 left-6 w-10 h-10 text-coral/[0.12]"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                  aria-hidden="true"
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
                  <footer className="flex items-center gap-3">
                    {/* Avatar placeholder */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral/20 to-indigo/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="text-coral/50"
                      >
                        <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1" />
                        <path
                          d="M2.5 12.5c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="text-[13px] text-text-muted">
                      — 12세 자녀를 둔 어머니
                    </span>
                  </footer>
                </blockquote>
              </div>
            </div>

            {/* 고교학점제 connection card */}
            <div
              className={`transition-all duration-700 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "800ms" }}
            >
              <div className="relative p-5 rounded-xl bg-indigo-light/50 border border-indigo/[0.08] overflow-hidden">
                {/* Left accent border */}
                <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-indigo/30" />

                <div className="pl-3">
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-indigo/60 flex-shrink-0"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 1L2 4v4c0 3.3 2.6 6.4 6 7 3.4-.6 6-3.7 6-7V4L8 1z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.5 8L7 9.5 10.5 6"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-[13px] font-medium text-indigo/80 leading-[1.6]">
                      이 패턴을 바탕으로 고교학점제 과목도 추천됩니다
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {subjectTags.map((tag, i) => (
                      <span
                        key={tag}
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-md bg-indigo/[0.06] text-indigo/70 border border-indigo/[0.06] transition-all duration-500 ${
                          isInView
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95"
                        }`}
                        style={{ transitionDelay: `${900 + i * 80}ms` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
