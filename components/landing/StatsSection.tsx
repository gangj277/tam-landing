"use client";

import { useInView } from "@/lib/useInView";
import CountUpNumber from "@/components/interactive/CountUpNumber";

const stats = [
  {
    end: 65,
    suffix: "%",
    label: "지금의 초등학생이 성인이 되면,\n현재 존재하지 않는 직업을 갖게 됩니다",
    source: "World Economic Forum",
  },
  {
    end: 2,
    suffix: "배",
    label: "AI를 활용하는 사람과 그렇지 않은 사람의\n업무 생산성 차이",
    source: "McKinsey, 2024",
  },
  {
    end: 10,
    suffix: "분",
    label: "하루 10분의 다양한 경험이\n아이의 사고 유연성을 키웁니다",
    source: "Stanford Education Research",
  },
];

export default function StatsSection() {
  const { ref, isInView } = useInView(0.2);

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 px-6"
    >
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-16 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-coral" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
            AI 시대의 현실
          </span>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`group relative bg-card-bg rounded-2xl p-8 md:p-10 border border-border-light/60 transition-all duration-700 hover:shadow-[0_8px_40px_rgba(26,26,46,0.06)] hover:border-border-light ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              {/* Number */}
              <div className="text-[52px] md:text-[60px] font-extrabold tracking-[-0.04em] leading-none text-coral mb-4">
                <CountUpNumber
                  end={stat.end}
                  suffix={stat.suffix}
                  trigger={isInView}
                />
              </div>

              {/* Description */}
              <p className="text-[14px] md:text-[15px] leading-[1.65] text-text-secondary whitespace-pre-line mb-4">
                {stat.label}
              </p>

              {/* Source */}
              <span className="text-[11px] font-medium text-text-muted tracking-[0.02em]">
                {stat.source}
              </span>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
                <div className="absolute top-0 right-0 w-[1px] h-8 bg-gradient-to-b from-coral/20 to-transparent" />
                <div className="absolute top-0 right-0 h-[1px] w-8 bg-gradient-to-l from-coral/20 to-transparent" />
              </div>
            </div>
          ))}
        </div>

        {/* Body copy */}
        <div
          className={`max-w-[600px] mx-auto text-center transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <p className="text-[17px] md:text-[19px] leading-[1.8] text-navy/90 font-normal">
            AI는 더 이상 먼 미래의 이야기가 아닙니다.
            <br />
            이미 우리의 일상, 일, 교육, 창작의 방식을
            <br className="hidden md:block" />
            근본적으로 바꾸고 있습니다.
          </p>
          <div className="w-10 h-[1px] bg-border-light mx-auto my-8" />
          <p className="text-[17px] md:text-[19px] leading-[1.8] text-navy/90 font-normal">
            그런데 우리 아이들의 일상은 어떤가요?
            <br />
            학원, 숙제, 유튜브, 게임 —
            <br />
            아이들이 경험하는 세계는{" "}
            <span className="font-semibold text-navy">여전히 너무 좁습니다.</span>
          </p>
          <div className="w-10 h-[1px] bg-border-light mx-auto my-8" />
          <p className="text-[17px] md:text-[19px] leading-[1.8] text-navy/90 font-normal">
            AI 시대에 정말 필요한 건{" "}
            <span className="text-text-muted line-through decoration-1">
              코딩 능력
            </span>
            이 아닙니다.
            <br />
            다양한 세계를 만나고, 스스로 생각하고,
            <br className="hidden md:block" />
            <span className="font-semibold text-coral">
              자기만의 기준으로 판단하는 힘
            </span>
            입니다.
          </p>
        </div>
      </div>
    </section>
  );
}
