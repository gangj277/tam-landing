"use client";

import { useInView } from "@/lib/useInView";

export function MissingPieceBridge() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section ref={ref} className="relative py-20 md:py-28 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[720px]">
        <div
          className={`text-center transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Section label */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-coral/30" />
            <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
              빠진 퍼즐
            </span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-coral/30" />
          </div>

          <h2 className="text-[26px] md:text-[36px] font-bold text-navy tracking-[-0.035em] leading-[1.3] mb-6">
            과목은 138개인데,
            <br />
            아이의 기준은 없습니다
          </h2>
        </div>

        <div
          className={`space-y-6 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <p className="text-[16px] md:text-[17px] leading-[1.8] text-text-secondary text-center">
            종로학원 설문에서{" "}
            <span className="font-semibold text-navy">68.1%</span>의 학생이 과목
            선택의 가장 큰 기준으로 &apos;대입 유불리&apos;를 꼽았습니다.
            자신의 적성과 관심을 기준으로 선택한 학생은{" "}
            <span className="font-semibold text-navy">27.7%</span>에 불과했습니다.
          </p>

          <p className="text-[16px] md:text-[17px] leading-[1.8] text-text-secondary text-center">
            자유학기제는 170시간에서 102시간으로 축소되었고, 활동도 4개에서
            2개로 줄었습니다. 고교학점제가 더 많은 자기이해를 요구하는데,
            정작 그것을 키울 기회는 줄어든 것입니다.
          </p>
        </div>

        {/* Paradox callout */}
        <div
          className={`mt-10 bg-card-bg border-l-[3px] border-coral/40 rounded-r-2xl px-6 md:px-8 py-6 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <p className="text-[17px] md:text-[19px] leading-[1.7] text-navy font-medium text-center">
            &ldquo;제도는 더 많은 자기이해를 요구하는데,
            <br className="hidden sm:block" />
            그것을 키울 기회는 줄어들고 있습니다.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
