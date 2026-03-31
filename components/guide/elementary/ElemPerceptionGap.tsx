"use client";

import { useInView } from "@/lib/useInView";
import CountUpNumber from "@/components/interactive/CountUpNumber";

export function ElemPerceptionGap() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section ref={ref} className="relative py-20 md:py-28 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-coral" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
            인식 차이
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-12 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          부모와 아이, 서로 다른 세계
        </h2>

        {/* Two comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
          {/* Parent perception */}
          <div
            className={`bg-card-bg rounded-2xl p-8 md:p-10 border border-border-light/60 transition-all duration-700 ${
              isInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <span className="text-[12px] font-semibold tracking-[0.02em] text-text-muted mb-4 block">
              부모가 생각하는 아이 관심사 1위
            </span>
            <div className="text-[48px] md:text-[56px] font-extrabold tracking-[-0.04em] leading-none text-coral mb-2">
              <CountUpNumber end={36} suffix=".5%" trigger={isInView} />
            </div>
            <h3 className="text-[22px] md:text-[26px] font-bold text-navy tracking-[-0.02em] mb-3">
              &ldquo;게임&rdquo;
            </h3>
            <div className="w-full h-3 bg-bg-warm rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-coral transition-all duration-1000 ease-out"
                style={{
                  width: isInView ? "36.5%" : "0%",
                  transitionDelay: "400ms",
                }}
              />
            </div>
          </div>

          {/* Child reality */}
          <div
            className={`bg-card-bg rounded-2xl p-8 md:p-10 border border-border-light/60 transition-all duration-700 ${
              isInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "350ms" }}
          >
            <span className="text-[12px] font-semibold tracking-[0.02em] text-text-muted mb-4 block">
              아이의 실제 관심사 1위
            </span>
            <div className="text-[48px] md:text-[56px] font-extrabold tracking-[-0.04em] leading-none text-indigo mb-2">
              <CountUpNumber end={27} suffix=".3%" trigger={isInView} />
            </div>
            <h3 className="text-[22px] md:text-[26px] font-bold text-navy tracking-[-0.02em] mb-3">
              &ldquo;미래 직업&rdquo;
            </h3>
            <div className="w-full h-3 bg-bg-warm rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo transition-all duration-1000 ease-out"
                style={{
                  width: isInView ? "27.3%" : "0%",
                  transitionDelay: "500ms",
                }}
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div
          className={`max-w-[600px] mx-auto text-center transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="w-10 h-[1px] bg-border-light mx-auto mb-6" />
          <p className="text-[17px] md:text-[19px] leading-[1.7] text-navy/80">
            부모가 모르는 사이,
            <br />
            <span className="font-semibold text-navy">
              아이는 자기 미래를 고민하고 있습니다.
            </span>
            <br />
            <span className="text-coral font-medium">대화의 문을 여세요.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
