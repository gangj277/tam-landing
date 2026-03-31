"use client";

import { useInView } from "@/lib/useInView";

const skills = [
  { rank: 1, name: "분석적 사고", highlight: false },
  { rank: 2, name: "회복탄력성 \u00b7 유연성 \u00b7 민첩성", highlight: false },
  { rank: 3, name: "리더십과 사회적 영향력", highlight: false },
  { rank: 4, name: "창의적 사고", highlight: false },
  { rank: 5, name: "동기부여와 자기인식", highlight: true },
  { rank: 6, name: "호기심과 평생학습", highlight: false },
  { rank: 7, name: "기술 리터러시", highlight: false },
  { rank: 8, name: "공감과 경청", highlight: false },
  { rank: 9, name: "인재 관리", highlight: false },
  { rank: 10, name: "서비스 지향", highlight: false },
];

export function AiEraSkills() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section id="skills" ref={ref} className="relative py-20 md:py-28 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-indigo" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
            핵심 역량
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          진짜 필요한 역량
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-10 max-w-[560px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          세계경제포럼(WEF)이 선정한 2025 미래 핵심 역량 Top 10
        </p>

        {/* Skills list */}
        <div
          className={`bg-card-bg rounded-2xl border border-border-light/60 overflow-hidden mb-8 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {skills.map((skill, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 px-6 md:px-8 py-4 md:py-5 ${
                i < skills.length - 1 ? "border-b border-border-light/60" : ""
              } ${skill.highlight ? "bg-coral/[0.04]" : "hover:bg-bg-warm/30"} transition-colors`}
            >
              {/* Rank number */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[14px] font-bold ${
                  skill.highlight
                    ? "bg-coral text-white"
                    : "bg-navy/[0.06] text-navy/60"
                }`}
              >
                {skill.rank}
              </div>

              {/* Skill name */}
              <span
                className={`text-[15px] md:text-[16px] leading-[1.5] ${
                  skill.highlight
                    ? "font-bold text-coral"
                    : "font-medium text-navy"
                }`}
              >
                {skill.name}
              </span>

              {/* Highlight badge */}
              {skill.highlight && (
                <span className="ml-auto px-3 py-1 rounded-full bg-coral/[0.08] text-[11px] font-semibold text-coral tracking-[0.02em] shrink-0">
                  자기이해
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Callout */}
        <div
          className={`bg-card-bg rounded-2xl p-6 md:p-7 border border-coral/20 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-coral/[0.1] flex items-center justify-center shrink-0 mt-0.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M7 3V7.5M7 10V10.5"
                  stroke="#E8614D"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-[14px] md:text-[15px] leading-[1.7] text-text-secondary">
                <span className="font-semibold text-navy">주목할 점:</span>{" "}
                1위가 &lsquo;코딩&rsquo;이 아니라 &lsquo;분석적 사고&rsquo;.
                5위에 &lsquo;자기인식&rsquo;이 포함. 기술 리터러시(코딩 포함)는
                7위.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
