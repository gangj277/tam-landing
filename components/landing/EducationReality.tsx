"use client";

import { useInView } from "@/lib/useInView";
import CountUpNumber from "@/components/interactive/CountUpNumber";
import Link from "next/link";

/* ── Card icon components ── */

function CourseGridIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 3x3 grid representing course selection */}
      <rect x="4" y="4" width="8" height="8" rx="2" fill="currentColor" opacity="0.9" />
      <rect x="14" y="4" width="8" height="8" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="24" y="4" width="8" height="8" rx="2" fill="currentColor" opacity="0.3" />
      <rect x="4" y="14" width="8" height="8" rx="2" fill="currentColor" opacity="0.3" />
      <rect x="14" y="14" width="8" height="8" rx="2" fill="currentColor" opacity="0.7" />
      <rect x="24" y="14" width="8" height="8" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="4" y="24" width="8" height="8" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="14" y="24" width="8" height="8" rx="2" fill="currentColor" opacity="0.3" />
      <rect x="24" y="24" width="8" height="8" rx="2" fill="currentColor" opacity="0.9" />
      {/* Checkmark on the selected one */}
      <path
        d="M6.5 8.5L8 10L11.5 6"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CoinStackIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stacked coins */}
      <ellipse cx="18" cy="26" rx="11" ry="4" fill="currentColor" opacity="0.25" />
      <ellipse cx="18" cy="22" rx="11" ry="4" fill="currentColor" opacity="0.4" />
      <ellipse cx="18" cy="18" rx="11" ry="4" fill="currentColor" opacity="0.55" />
      <ellipse cx="18" cy="14" rx="11" ry="4" fill="currentColor" opacity="0.75" />
      <ellipse cx="18" cy="10" rx="11" ry="4" fill="currentColor" opacity="0.95" />
      {/* Won symbol */}
      <text
        x="18"
        y="13"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="white"
        fontFamily="system-ui"
      >
        ₩
      </text>
    </svg>
  );
}

function ExitDoorIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Door frame */}
      <rect
        x="8"
        y="4"
        width="16"
        height="28"
        rx="2"
        fill="currentColor"
        opacity="0.2"
      />
      {/* Open door (perspective) */}
      <path
        d="M24 4L30 8V28L24 32V4Z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Door handle */}
      <circle cx="27" cy="18" r="1.2" fill="white" opacity="0.8" />
      {/* Person walking out — arrow */}
      <path
        d="M5 18H13M13 18L10 15M13 18L10 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
}

/* ── Card data ── */

const cards = [
  {
    icon: CourseGridIcon,
    accentColor: "coral" as const,
    number: 138,
    suffix: "개",
    subtitle: "선택과목",
    body: (
      <>
        2025년, 모든 고등학생이 직접 과목을 골라야 합니다.
        <br />
        하지만 <strong className="font-semibold text-navy">68.1%</strong>가
        적성이 아닌 입시 기준으로 선택합니다.
      </>
    ),
    linkText: "자세히 알아보기",
    linkHref: "/guide/gogyohakjeomje",
    source: "종로학원, 2025",
    title: "고교학점제",
  },
  {
    icon: CoinStackIcon,
    accentColor: "indigo" as const,
    number: 44,
    suffix: "만원",
    subtitle: "월 사교육비",
    body: (
      <>
        10년 새 90% 올랐습니다.
        <br />
        하지만 <strong className="font-semibold text-navy">63%</strong>는
        국영수입니다. 아이가 자기를 발견하는 데 쓰이는 건?
      </>
    ),
    linkText: "더 읽기",
    linkHref: "/guide/elementary-career-exploration",
    source: "통계청, 2024",
    title: "사교육의 방향",
  },
  {
    icon: ExitDoorIcon,
    accentColor: "gold" as const,
    number: 10,
    suffix: "만 명",
    subtitle: "매년 대학 중도탈락",
    body: (
      <>
        매년 10만 명이 대학을 떠납니다.
        <br />
        <span className="text-text-secondary italic">
          &ldquo;이 길이 내 길이 아니었다&rdquo;
        </span>
        고요.
      </>
    ),
    linkText: "더 읽기",
    linkHref: "/guide/ai-era-career",
    source: "교육부, 2024",
    title: "그 끝에서",
  },
];

/* ── Accent color map ── */

const accentStyles = {
  coral: {
    border: "border-l-coral",
    text: "text-coral",
    bg: "bg-coral",
    hoverBorder: "hover:border-coral/30",
    iconColor: "text-coral",
    barGlow: "bg-coral/8",
  },
  indigo: {
    border: "border-l-indigo",
    text: "text-indigo",
    bg: "bg-indigo",
    hoverBorder: "hover:border-indigo/30",
    iconColor: "text-indigo",
    barGlow: "bg-indigo/8",
  },
  gold: {
    border: "border-l-gold",
    text: "text-gold",
    bg: "bg-gold",
    hoverBorder: "hover:border-gold/30",
    iconColor: "text-gold",
    barGlow: "bg-gold/8",
  },
};

/* ── Animated progress bar (visual data viz for each card) ── */

function AnimatedBar({
  percent,
  color,
  label,
  trigger,
  delay,
}: {
  percent: number;
  color: string;
  label: string;
  trigger: boolean;
  delay: number;
}) {
  return (
    <div className="mt-5 mb-1">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[11px] text-text-muted tracking-[0.01em]">
          {label}
        </span>
        <span className={`text-[11px] font-semibold ${color}`}>
          {percent}%
        </span>
      </div>
      <div className="h-[5px] bg-border-light/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color === "text-coral" ? "bg-coral" : color === "text-indigo" ? "bg-indigo" : "bg-gold"}`}
          style={{
            width: trigger ? `${percent}%` : "0%",
            transitionDelay: `${delay + 400}ms`,
          }}
        />
      </div>
    </div>
  );
}

/* ── Main component ── */

export default function EducationReality() {
  const { ref, isInView } = useInView(0.12);

  return (
    <section ref={ref} className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* ── Background decorative elements ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Top-right geometric circle */}
        <svg
          className="absolute -top-20 -right-20 w-[280px] h-[280px] opacity-[0.03]"
          viewBox="0 0 280 280"
        >
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke="#1A1A2E"
            strokeWidth="1"
            fill="none"
          />
          <circle
            cx="140"
            cy="140"
            r="80"
            stroke="#1A1A2E"
            strokeWidth="0.5"
            fill="none"
            strokeDasharray="4 6"
          />
        </svg>

        {/* Bottom-left diamond grid */}
        <svg
          className="absolute -bottom-10 -left-10 w-[200px] h-[200px] opacity-[0.025]"
          viewBox="0 0 200 200"
        >
          <pattern
            id="edu-grid"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <rect
              x="15"
              y="15"
              width="10"
              height="10"
              rx="1"
              transform="rotate(45 20 20)"
              fill="#1A1A2E"
            />
          </pattern>
          <rect width="200" height="200" fill="url(#edu-grid)" />
        </svg>

        {/* Mid-right dots */}
        <svg
          className="absolute top-1/3 right-8 w-[120px] h-[120px] opacity-[0.035]"
          viewBox="0 0 120 120"
        >
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <circle
                key={`${row}-${col}`}
                cx={15 + col * 30}
                cy={15 + row * 30}
                r="2"
                fill="#E8614D"
              />
            ))
          )}
        </svg>
      </div>

      <div className="mx-auto max-w-[1120px] relative z-10">
        {/* ── Section label ── */}
        <div
          className={`flex items-center gap-3 mb-6 transition-all duration-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-8 h-[1px] bg-coral" />
          <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-coral">
            이미 바뀐 교육 현실
          </span>
        </div>

        {/* ── Headline ── */}
        <h2
          className={`text-[24px] md:text-[32px] lg:text-[36px] font-bold tracking-[-0.03em] leading-[1.35] text-navy mb-16 md:mb-20 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          진로탐색과 자기이해, 이제 선택이 아니라{" "}
          <span className="relative inline-block">
            <span className="relative z-10">필수</span>
            <span
              className={`absolute bottom-0 left-0 h-[10px] md:h-[12px] bg-coral/15 rounded-sm transition-all duration-700 ease-out ${
                isInView ? "w-full" : "w-0"
              }`}
              style={{ transitionDelay: "600ms" }}
            />
          </span>
          입니다
        </h2>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 mb-20 md:mb-24">
          {cards.map((card, i) => {
            const accent = accentStyles[card.accentColor];
            const IconComponent = card.icon;
            const delays = [200, 350, 500];

            return (
              <div
                key={i}
                className={`group relative bg-card-bg rounded-2xl border border-border-light/60 overflow-hidden transition-all duration-700 ${accent.hoverBorder} hover:shadow-[0_8px_40px_rgba(26,26,46,0.07)] ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${delays[i]}ms` }}
              >
                {/* Left accent strip */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-[3px] ${accent.bg} transition-all duration-500`}
                  style={{ transitionDelay: `${delays[i] + 200}ms` }}
                />

                {/* Card content */}
                <div className="p-7 md:p-8 pl-8 md:pl-9">
                  {/* Top row: icon + title badge */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent.barGlow} transition-transform duration-300 group-hover:scale-105`}
                    >
                      <IconComponent className={accent.iconColor} />
                    </div>
                    <span className="text-[13px] font-semibold text-text-muted tracking-[0.02em]">
                      {card.title}
                    </span>
                  </div>

                  {/* Big number */}
                  <div
                    className={`text-[48px] md:text-[54px] font-extrabold tracking-[-0.04em] leading-none ${accent.text} mb-1`}
                  >
                    <CountUpNumber
                      end={card.number}
                      suffix={card.suffix}
                      trigger={isInView}
                      duration={2000}
                    />
                  </div>

                  {/* Subtitle */}
                  <p className="text-[13px] font-medium text-text-muted mb-5 tracking-[0.01em]">
                    {card.subtitle}
                  </p>

                  {/* Thin separator */}
                  <div className="w-full h-[1px] bg-border-light/70 mb-5" />

                  {/* Body */}
                  <p className="text-[14px] md:text-[15px] leading-[1.72] text-text-secondary mb-4">
                    {card.body}
                  </p>

                  {/* Animated bar visualization */}
                  {i === 0 && (
                    <AnimatedBar
                      percent={68}
                      color="text-coral"
                      label="입시 기준 선택 비율"
                      trigger={isInView}
                      delay={delays[i]}
                    />
                  )}
                  {i === 1 && (
                    <AnimatedBar
                      percent={63}
                      color="text-indigo"
                      label="국영수 사교육 비중"
                      trigger={isInView}
                      delay={delays[i]}
                    />
                  )}
                  {i === 2 && (
                    <AnimatedBar
                      percent={47}
                      color="text-gold"
                      label="'전공 불일치' 비율"
                      trigger={isInView}
                      delay={delays[i]}
                    />
                  )}

                  {/* Source + Link row */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-border-light/40">
                    <span className="text-[11px] text-text-muted tracking-[0.02em]">
                      {card.source}
                    </span>
                    <Link
                      href={card.linkHref}
                      className={`text-[13px] font-medium ${accent.text} hover:underline underline-offset-2 transition-colors duration-200 flex items-center gap-1`}
                    >
                      {card.linkText}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      >
                        <path
                          d="M5.5 3.5L9 7L5.5 10.5"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl pointer-events-none">
                  <div
                    className={`absolute top-0 right-0 w-[1px] h-10 bg-gradient-to-b ${
                      card.accentColor === "coral"
                        ? "from-coral/15"
                        : card.accentColor === "indigo"
                          ? "from-indigo/15"
                          : "from-gold/15"
                    } to-transparent`}
                  />
                  <div
                    className={`absolute top-0 right-0 h-[1px] w-10 bg-gradient-to-l ${
                      card.accentColor === "coral"
                        ? "from-coral/15"
                        : card.accentColor === "indigo"
                          ? "from-indigo/15"
                          : "from-gold/15"
                    } to-transparent`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom line ── */}
        <div
          className={`transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          {/* Divider */}
          <div
            className={`w-16 h-[1px] bg-border-light mx-auto mb-8 transition-all duration-700 ${
              isInView ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
            style={{ transitionDelay: "750ms" }}
          />

          <p className="text-center text-[17px] md:text-[19px] leading-[1.7] text-navy/90 font-normal max-w-[520px] mx-auto">
            공부는 세계 1등인데,
            <br />
            행복은{" "}
            <span className="font-bold text-coral">OECD 꼴찌</span>
            입니다.
          </p>

          <p className="text-center text-[11px] text-text-muted mt-4 tracking-[0.02em]">
            OECD PISA
          </p>
        </div>
      </div>
    </section>
  );
}
