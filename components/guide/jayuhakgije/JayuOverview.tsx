"use client";

import { useInView } from "@/lib/useInView";

const timeline = [
  {
    year: "2013",
    title: "시범 도입",
    desc: "일부 중학교에서 자유학기제 시범 운영 시작",
  },
  {
    year: "2016",
    title: "전면 시행",
    desc: "전국 모든 중학교에서 자유학기제 의무 시행",
  },
  {
    year: "2018",
    title: "자유학년제 확대",
    desc: "1학기 → 1년 전체로 자유학기 확대 운영",
  },
  {
    year: "2025",
    title: "축소 전환",
    desc: "자유학년제 폐지, 자유학기제로 축소 (1학기만, 102시간)",
    accent: true,
  },
];

export function JayuOverview() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section id="overview" ref={ref} className="relative py-20 md:py-28 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-indigo" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-indigo">
            자유학기제란
          </span>
        </div>

        {/* Definition */}
        <div
          className={`max-w-[680px] mb-14 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <h2 className="text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4">
            시험 없이 탐색하는 한 학기
          </h2>
          <p className="text-[16px] md:text-[17px] leading-[1.75] text-text-secondary">
            자유학기제는 중학교 1학년 1학기 동안 중간·기말 시험 부담 없이,
            진로탐색과 다양한 체험 활동에 집중하는 제도입니다. 교과 수업은
            유지하되, 일부 시간을 주제선택·진로탐색 활동으로 편성하여 학생이
            자신의 관심사와 적성을 탐색할 수 있도록 설계되었습니다.
          </p>
        </div>

        {/* History timeline */}
        <div className="relative">
          {/* Horizontal line (desktop) */}
          <div className="hidden md:block absolute top-[23px] left-0 right-0 h-[2px] bg-border-light" />
          {/* Vertical line (mobile) */}
          <div className="md:hidden absolute left-[19px] top-0 bottom-0 w-[2px] bg-border-light" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
            {timeline.map((step, i) => (
              <div
                key={i}
                className={`relative flex md:flex-col items-start gap-4 md:gap-0 transition-all duration-700 ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${200 + i * 150}ms` }}
              >
                {/* Dot */}
                <div className="relative z-10 shrink-0">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 md:mb-4 ${
                      step.accent
                        ? "bg-coral border-coral text-white"
                        : "bg-card-bg border-border-light text-indigo"
                    }`}
                  >
                    <span className="text-[12px] md:text-[13px] font-bold">
                      {step.year}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 md:pr-4">
                  <h3
                    className={`text-[16px] md:text-[17px] font-bold tracking-[-0.02em] mb-1 ${
                      step.accent ? "text-coral" : "text-navy"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-[13px] md:text-[14px] leading-[1.6] text-text-secondary">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
