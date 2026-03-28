"use client";

import { useInView } from "@/lib/useInView";

const discoveries = [
  {
    label: "어떤 세계에 끌리는지",
    example: "우주보다 사람들이 사는 마을 이야기에 더 오래 머물러요.",
    color: "#4A5FC1",
  },
  {
    label: "무엇을 중요하게 여기는지",
    example: "효율보다 공정함을 고르는 경우가 많아요.",
    color: "#E8614D",
  },
  {
    label: "어떤 역할에 에너지가 생기는지",
    example: "만드는 역할보다 조율하는 역할에서 몰입도가 높아요.",
    color: "#D4A853",
  },
  {
    label: "어떤 방식으로 결정하는지",
    example: "여러 안을 보고 비교한 뒤에 고르는 걸 선호해요.",
    color: "#4A5FC1",
  },
  {
    label: "어떤 분위기를 선호하는지",
    example: "진지한 톤보다 위트 있는 표현을 자주 택해요.",
    color: "#E8614D",
  },
];

export default function FirstSevenDays() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="relative py-24 md:py-36 px-6 bg-bg-warm">
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
              아이를 이해하는 방식
            </span>
            <div className="w-8 h-[1px] bg-coral" />
          </div>
          <h2
            className={`text-[28px] md:text-[40px] font-bold tracking-[-0.03em] text-navy mb-5 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            직접 묻지 않아도,
            <br />
            아이가 보이기 시작합니다
          </h2>
          <p
            className={`text-[15px] md:text-[17px] leading-[1.8] text-text-secondary max-w-[520px] mx-auto transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            성격 테스트도, 설문지도 필요 없습니다.
            <br />
            아이가 매일 고르고, 반응하고, 만들어낸 것들 속에서
            <br />
            자연스럽게 이런 것들이 드러납니다.
          </p>
        </div>

        {/* Central illustration + discovery cards */}
        <div className="max-w-[860px] mx-auto">
          {/* Organic layout — staggered cards around a central visual */}
          <div
            className={`relative transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            {/* Central "child silhouette" SVG */}
            <div className="hidden md:flex justify-center mb-12">
              <svg width="320" height="180" viewBox="0 0 320 180" fill="none" className="select-none">
                {/* Radiating soft rings */}
                <circle cx="160" cy="90" r="85" stroke="#E8614D" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.15"/>
                <circle cx="160" cy="90" r="65" stroke="#4A5FC1" strokeWidth="0.5" strokeDasharray="3 5" opacity="0.12"/>
                <circle cx="160" cy="90" r="45" stroke="#D4A853" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.18"/>

                {/* Child figure — abstract, warm */}
                <circle cx="160" cy="62" r="16" fill="#1A1A2E" fillOpacity="0.06" stroke="#1A1A2E" strokeWidth="1.2" strokeOpacity="0.15"/>
                <path d="M144 100c0-9 7-16 16-16s16 7 16 16" stroke="#1A1A2E" strokeWidth="1.2" strokeOpacity="0.15" strokeLinecap="round"/>

                {/* Floating discovery dots */}
                <circle cx="80" cy="50" r="4" fill="#4A5FC1" fillOpacity="0.2">
                  <animate attributeName="r" values="4;5;4" dur="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="240" cy="45" r="3.5" fill="#E8614D" fillOpacity="0.2">
                  <animate attributeName="r" values="3.5;4.5;3.5" dur="3.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="70" cy="120" r="3" fill="#D4A853" fillOpacity="0.25">
                  <animate attributeName="r" values="3;4;3" dur="2.8s" repeatCount="indefinite"/>
                </circle>
                <circle cx="252" cy="125" r="3.5" fill="#4A5FC1" fillOpacity="0.18">
                  <animate attributeName="r" values="3.5;4.5;3.5" dur="3.2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="120" cy="150" r="3" fill="#E8614D" fillOpacity="0.15">
                  <animate attributeName="r" values="3;3.8;3" dur="2.5s" repeatCount="indefinite"/>
                </circle>

                {/* Connection lines from child to dots */}
                <line x1="145" y1="72" x2="84" y2="50" stroke="#4A5FC1" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.12"/>
                <line x1="175" y1="68" x2="237" y2="45" stroke="#E8614D" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.12"/>
                <line x1="148" y1="95" x2="73" y2="118" stroke="#D4A853" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.12"/>
                <line x1="172" y1="95" x2="249" y2="123" stroke="#4A5FC1" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.12"/>
                <line x1="155" y1="100" x2="122" y2="148" stroke="#E8614D" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.12"/>

                {/* Center label */}
                <text x="160" y="140" textAnchor="middle" fill="#1A1A2E" fillOpacity="0.2" fontSize="10" fontWeight="500" fontFamily="Pretendard Variable, sans-serif">
                  선택의 패턴이 모여 아이가 됩니다
                </text>
              </svg>
            </div>

            {/* Discovery cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {discoveries.map((d, i) => (
                <div
                  key={i}
                  className={`bg-card-bg rounded-2xl p-6 border border-border-light/60 transition-all duration-700 hover:shadow-[0_4px_20px_rgba(26,26,46,0.05)] ${
                    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: `${500 + i * 100}ms` }}
                >
                  {/* Colored dot + label */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: d.color, opacity: 0.6 }}
                    />
                    <span className="text-[14px] font-semibold text-navy tracking-[-0.01em]">
                      {d.label}
                    </span>
                  </div>
                  {/* Example — in a subtle quote style */}
                  <div className="pl-5 border-l-2 border-border-light">
                    <p className="text-[13px] leading-[1.7] text-text-secondary italic">
                      &ldquo;{d.example}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom message */}
          <div
            className={`text-center mt-14 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <p className="text-[16px] md:text-[18px] leading-[1.8] text-navy/80">
              이 모든 것은 아이에게{" "}
              <span className="font-semibold text-navy">한 번도 직접 물어보지 않고</span>
              <br />
              경험 속 선택 패턴만으로 알게 됩니다.
            </p>
            <p className="text-[14px] text-text-muted mt-3">
              &ldquo;넌 이런 아이야&rdquo;가 아니라
              &ldquo;요즘은 이런 쪽을 많이 고르고 있어요&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
