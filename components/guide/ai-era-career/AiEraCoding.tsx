"use client";

import { useInView } from "@/lib/useInView";

const comparison = {
  left: {
    title: "코딩 교육",
    color: "text-text-muted",
    items: [
      "프로그래밍 언어 학습",
      "좁은 범위 (기술적 스킬)",
      "AI가 점점 자동화 (GitHub Copilot 등)",
    ],
  },
  right: {
    title: "AI 리터러시",
    color: "text-indigo",
    items: [
      "AI 원리 이해 + 비판적 활용 + 윤리",
      "넓은 범위 (사고력 + 태도)",
      "모든 직업에서 필요",
    ],
  },
};

const quotes = [
  {
    text: "AI 시대 가장 중요한 스킬은 코딩이 아니라, 자기 자신을 아는 것입니다.",
    author: "Kai-Fu Lee",
    role: "AI 전문가",
  },
  {
    text: "아이를 코더로 키우지 말고, AI와 함께 일하는 사고자 \u00b7 창작자로 키워라.",
    author: "Fei-Fei Li",
    role: "Stanford HAI",
  },
];

export function AiEraCoding() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section ref={ref} className="relative py-20 md:py-28 px-6">
      <div className="mx-auto max-w-[1120px]">
        {/* Section label */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-coral" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
            관점 전환
          </span>
        </div>

        <h2
          className={`text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.3] mb-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          &ldquo;코딩이 답이 아닙니다&rdquo;
        </h2>
        <p
          className={`text-[16px] md:text-[17px] leading-[1.7] text-text-secondary mb-10 max-w-[600px] transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          코딩이 나쁜 게 아닙니다. 코딩&lsquo;만으로는&rsquo; 충분하지 않다는
          것입니다.
        </p>

        {/* Comparison card */}
        <div
          className={`bg-card-bg rounded-2xl border border-border-light/60 overflow-hidden mb-8 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left - Coding */}
            <div className="p-7 md:p-8 border-b md:border-b-0 md:border-r border-border-light/60">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-text-muted/40" />
                <h3 className="text-[17px] md:text-[18px] font-bold text-text-muted tracking-[-0.02em]">
                  {comparison.left.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {comparison.left.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-[14px] md:text-[15px] leading-[1.65] text-text-muted"
                  >
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-text-muted/30 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right - AI Literacy */}
            <div className="p-7 md:p-8 bg-indigo/[0.02]">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-indigo" />
                <h3 className="text-[17px] md:text-[18px] font-bold text-indigo tracking-[-0.02em]">
                  {comparison.right.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {comparison.right.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-[14px] md:text-[15px] leading-[1.65] text-navy"
                  >
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Expert quotes */}
        <div
          className={`space-y-4 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "450ms" }}
        >
          {quotes.map((quote, i) => (
            <div
              key={i}
              className="bg-card-bg rounded-2xl p-7 border border-border-light/60 relative"
            >
              {/* Quote mark */}
              <div className="absolute top-5 left-6 text-[40px] leading-none text-indigo/10 font-serif">
                &ldquo;
              </div>
              <blockquote className="text-[15px] md:text-[16px] leading-[1.7] text-navy font-medium pl-6 mb-3">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <div className="pl-6 flex items-center gap-2 text-[13px] text-text-muted">
                <span className="font-semibold text-text-secondary">
                  {quote.author}
                </span>
                <span className="w-1 h-1 rounded-full bg-text-muted/40" />
                <span>{quote.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
