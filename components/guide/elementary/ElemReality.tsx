"use client";

import { useInView } from "@/lib/useInView";
import CountUpNumber from "@/components/interactive/CountUpNumber";

const topJobs = [
  { rank: 1, job: "운동선수" },
  { rank: 2, job: "교사" },
  { rank: 3, job: "크리에이터" },
  { rank: 4, job: "의사" },
  { rank: 5, job: "경찰관" },
];

export function ElemReality() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section id="reality" ref={ref} className="relative py-20 md:py-28 px-6 bg-bg-warm">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-coral" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
            숫자로 보는 현실
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-12 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          아이들은 왜 꿈이 없을까?
        </h2>

        {/* Two key data cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
          {/* Card 1: 42% */}
          <div
            className={`bg-card-bg rounded-2xl p-8 md:p-10 border border-border-light/60 transition-all duration-700 ${
              isInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="text-[64px] md:text-[80px] font-extrabold tracking-[-0.04em] leading-none text-coral mb-4">
              <CountUpNumber end={42} suffix="%" trigger={isInView} />
            </div>
            <p className="text-[16px] md:text-[17px] leading-[1.7] text-text-secondary">
              희망직업 없는 이유 1위
            </p>
            <p className="text-[18px] md:text-[20px] font-semibold text-navy mt-2 leading-[1.5]">
              &ldquo;무엇을 좋아하는지 아직 잘 몰라서&rdquo;
            </p>
            <span className="inline-block mt-4 text-[11px] font-medium text-text-muted tracking-[0.02em]">
              교육부, 2024 진로교육 현황조사
            </span>
          </div>

          {/* Card 2: 20.4% → 40.0% */}
          <div
            className={`bg-card-bg rounded-2xl p-8 md:p-10 border border-border-light/60 transition-all duration-700 ${
              isInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "350ms" }}
          >
            <div className="flex items-end gap-3 mb-4">
              <div className="text-[48px] md:text-[56px] font-extrabold tracking-[-0.04em] leading-none text-indigo">
                <CountUpNumber end={20} suffix=".4%" trigger={isInView} />
              </div>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                className="mb-2 text-text-muted/40"
              >
                <path
                  d="M8 16H24M24 16L18 10M24 16L18 22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-[48px] md:text-[56px] font-extrabold tracking-[-0.04em] leading-none text-coral">
                <CountUpNumber end={40} suffix=".0%" trigger={isInView} />
              </div>
            </div>
            <div className="flex items-center gap-3 text-[13px] text-text-muted mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo/[0.06] text-indigo font-medium">
                초등학생
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-coral/[0.06] text-coral font-medium">
                중학생
              </span>
            </div>
            <p className="text-[18px] md:text-[20px] font-semibold text-navy leading-[1.5]">
              시간이 갈수록 &lsquo;모르겠다&rsquo;가 늘어납니다
            </p>
            <span className="inline-block mt-4 text-[11px] font-medium text-text-muted tracking-[0.02em]">
              교육부, 2024
            </span>
          </div>
        </div>

        {/* TOP 5 jobs */}
        <div
          className={`bg-card-bg rounded-2xl p-7 md:p-8 border border-border-light/60 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gold/[0.1] flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M9 2L11.1 6.3L16 7L12.5 10.4L13.3 15.2L9 13L4.7 15.2L5.5 10.4L2 7L6.9 6.3L9 2Z"
                  stroke="#D4A853"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[12px] font-semibold tracking-[0.02em] text-gold">
              희망직업 TOP 5
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {topJobs.map((item) => (
              <span
                key={item.rank}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-bg-warm border border-border-light/60"
              >
                <span className="text-[12px] font-bold text-coral">
                  {item.rank}
                </span>
                <span className="text-[14px] font-medium text-navy">
                  {item.job}
                </span>
              </span>
            ))}
          </div>

          <p className="text-[14px] md:text-[15px] leading-[1.7] text-text-secondary">
            상위 5개 직업이{" "}
            <span className="font-semibold text-navy">10년째 거의 같습니다.</span>{" "}
            아이들이 아는 직업이 제한적이라는 의미입니다.
          </p>
        </div>
      </div>
    </section>
  );
}
