"use client";

import { useState } from "react";
import { useInView } from "@/lib/useInView";

type ToolKey = "expand" | "perspective" | "weird" | null;

const tools: { key: ToolKey & string; label: string; color: string; suggestions: string[] }[] = [
  {
    key: "expand",
    label: "더 넓혀보기",
    color: "#4A5FC1",
    suggestions: [
      "강아지뿐 아니라, 구조된 동물들의 '입양 전/후' 사진을 나란히 놓는 건 어때?",
      "포스터 대신, 사람들이 직접 이름을 지어주는 참여형 캠페인은?",
      "동물이 직접 말하는 것처럼 1인칭 시점의 포스터는?",
    ],
  },
  {
    key: "perspective",
    label: "다른 시각으로 보기",
    color: "#E8614D",
    suggestions: [
      "만약 동물의 입장에서 본다면?",
      "만약 5살 아이에게 보여줄 포스터라면?",
      "만약 동물을 싫어하는 사람도 멈추게 하려면?",
    ],
  },
  {
    key: "weird",
    label: "이상하게 바꾸기",
    color: "#D4A853",
    suggestions: [
      "동물이 사람을 구조하는 반전 포스터?",
      "100년 뒤, 동물이 멸종 위기인 세상의 포스터?",
      "동물구조센터가 아니라 '인간구조센터'라면?",
    ],
  },
];

export default function AILiteracy() {
  const { ref, isInView } = useInView(0.1);
  const [activeTool, setActiveTool] = useState<ToolKey>(null);

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6">
      <div className="mx-auto max-w-[1120px]">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`flex items-center justify-center gap-3 mb-6 transition-all duration-600 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="w-8 h-[1px] bg-gold" />
            <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-gold">
              AI 리터러시
            </span>
            <div className="w-8 h-[1px] bg-gold" />
          </div>
          <h2
            className={`text-[28px] md:text-[40px] font-bold tracking-[-0.03em] text-navy mb-4 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            AI를 도구로 다루는 감각
          </h2>
          <p
            className={`text-[15px] md:text-[17px] leading-[1.7] text-text-secondary transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            아이는 AI에게 질문하지 않습니다.
            <br />
            AI를 이용해 결과를 바꿉니다.
          </p>
        </div>

        {/* Demo card */}
        <div
          className={`max-w-[600px] mx-auto mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="bg-card-bg rounded-2xl border border-border-light shadow-[0_4px_24px_rgba(26,26,46,0.06)] p-6 md:p-8">
            {/* Original idea */}
            <div className="mb-6">
              <span className="text-[11px] font-semibold tracking-[0.06em] uppercase text-text-muted mb-2 block">
                아이의 첫 번째 아이디어
              </span>
              <div className="p-4 rounded-xl bg-bg-warm border border-border-light/60">
                <p className="text-[14px] font-medium text-navy">
                  &ldquo;귀여운 강아지 사진이 있는 동물구조센터 포스터&rdquo;
                </p>
              </div>
            </div>

            {/* AI tool buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tools.map((tool) => (
                <button
                  key={tool.key}
                  onClick={() =>
                    setActiveTool(activeTool === tool.key ? null : tool.key)
                  }
                  className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                    activeTool === tool.key
                      ? "text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                      : "border-2 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                  }`}
                  style={
                    activeTool === tool.key
                      ? { background: tool.color }
                      : { borderColor: tool.color + "40", color: tool.color }
                  }
                >
                  {tool.label}
                </button>
              ))}
            </div>

            {/* Suggestions */}
            {activeTool && (
              <div className="animate-fade-in space-y-2">
                {tools
                  .find((t) => t.key === activeTool)
                  ?.suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="flex gap-3 items-start p-3 rounded-xl bg-bg-warm/70"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="flex-shrink-0 mt-0.5"
                      >
                        <circle
                          cx="8"
                          cy="8"
                          r="3"
                          fill={
                            tools.find((t) => t.key === activeTool)?.color
                          }
                          fillOpacity="0.2"
                        />
                        <circle
                          cx="8"
                          cy="8"
                          r="1.5"
                          fill={
                            tools.find((t) => t.key === activeTool)?.color
                          }
                        />
                      </svg>
                      <p className="text-[13px] leading-[1.6] text-text-secondary">
                        {s}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Key message */}
        <div
          className={`text-center max-w-[520px] mx-auto transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <p className="text-[17px] md:text-[19px] leading-[1.8] text-navy/90">
            AI가 만들어준 것을 그대로 쓰는 게 아닙니다.
            <br />
            여러 가능성을 보고, 비교하고, 고르고, 수정합니다.
          </p>
          <div className="w-10 h-[1px] bg-border-light mx-auto my-6" />
          <p className="text-[17px] md:text-[19px] leading-[1.8] text-navy/90">
            이것이 AI 시대에 진짜 필요한 리터러시입니다.
            <br />
            <span className="text-text-muted line-through decoration-1">
              프롬프트 문법
            </span>
            이 아니라,{" "}
            <span className="font-semibold text-coral">도구를 다루는 감각</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
