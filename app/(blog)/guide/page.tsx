import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "학부모 가이드 | 탐 TAM",
  description:
    "고교학점제, 자유학기제, AI 시대 진로, 초등 고학년 진로탐색 — 우리 아이의 미래를 함께 준비하는 학부모를 위한 교육 가이드.",
  openGraph: {
    title: "학부모 가이드 | 탐 TAM",
    description:
      "우리 아이의 미래를 함께 준비하는 학부모를 위한 교육 가이드.",
    locale: "ko_KR",
    type: "website",
  },
  alternates: {
    canonical: "https://tam.kr/guide",
  },
};

const guides = [
  {
    slug: "gogyohakjeomje",
    title: "고교학점제 완벽 가이드",
    description:
      "192학점 졸업 요건부터 138개 선택과목, 5등급 평가체계까지. 2025년 전면 시행된 고교학점제의 모든 것.",
    readingTime: 15,
    category: "교육 제도",
    color: "coral" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L15 8L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L9 8L12 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    slug: "jayuhakgije",
    title: "자유학기제 완벽 가이드",
    description:
      "2025년 크게 축소된 자유학기제. 221시간→102시간, 4개→2개 활동으로 바뀐 현실과 학부모 대응법.",
    readingTime: 12,
    category: "교육 제도",
    color: "indigo" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 10V19" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    slug: "ai-era-career",
    title: "AI 시대, 우리 아이 진로 준비 가이드",
    description:
      "WEF 핵심역량 5위 '자기인식', AI로 100% 대체 가능한 직업은 5% 미만. 코딩보다 중요한 것은 자기이해입니다.",
    readingTime: 15,
    category: "AI와 교육",
    color: "indigo" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 7V12L15.5 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    slug: "elementary-career-exploration",
    title: "초등 고학년 진로탐색 가이드",
    description:
      "초등학생 20.4%가 희망직업 없음, 그 이유 42%는 '뭘 좋아하는지 몰라서'. 진로 결정이 아닌 진로 탐색의 시작.",
    readingTime: 12,
    category: "진로교육",
    color: "gold" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 21H5C4 21 3 20 3 19V5C3 4 4 3 5 3H19C20 3 21 4 21 5V9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="17" cy="17" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M17 15V17L18.5 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const colorClasses = {
  coral: {
    iconBg: "bg-coral/[0.08]",
    iconText: "text-coral",
    categoryText: "text-coral",
    hoverBorder: "hover:border-coral/20",
  },
  indigo: {
    iconBg: "bg-indigo/[0.08]",
    iconText: "text-indigo",
    categoryText: "text-indigo",
    hoverBorder: "hover:border-indigo/20",
  },
  gold: {
    iconBg: "bg-gold/[0.08]",
    iconText: "text-gold",
    categoryText: "text-gold",
    hoverBorder: "hover:border-gold/20",
  },
};

export default function GuidePage() {
  return (
    <div className="relative">
      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4F2EE] via-[#FAFAF8] to-[#FAFAF8]" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg
            className="absolute top-[15%] right-[8%] opacity-[0.03]"
            width="90"
            height="90"
            viewBox="0 0 90 90"
            fill="none"
          >
            <circle cx="45" cy="45" r="43" stroke="#4A5FC1" strokeWidth="1.5" />
            <circle cx="45" cy="45" r="18" stroke="#4A5FC1" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-[1120px] px-6 pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="max-w-[640px] mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full bg-navy/[0.04] border border-navy/[0.06] opacity-0 animate-fade-in-up"
              style={{ animationFillMode: "forwards" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-coral" />
              <span className="text-[12px] font-medium text-text-secondary tracking-[0.02em]">
                TAM 학부모 가이드
              </span>
            </div>

            <h1
              className="text-[28px] md:text-[40px] lg:text-[44px] font-bold tracking-[-0.035em] text-navy leading-[1.25] mb-5 opacity-0 animate-fade-in-up delay-100"
              style={{ animationFillMode: "forwards" }}
            >
              우리 아이의 미래를
              <br className="hidden md:block" />
              함께 준비합니다
            </h1>

            <p
              className="text-[16px] md:text-[18px] leading-[1.65] text-text-secondary opacity-0 animate-fade-in-up delay-200"
              style={{ animationFillMode: "forwards" }}
            >
              교육 제도, 진로탐색, AI 시대 역량.
              <br className="hidden sm:block" />
              학부모가 꼭 알아야 할 이야기를 시각적으로 정리했습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative mx-auto max-w-[1120px] px-6">
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border-light to-transparent" />
          <div className="w-8 h-8 rounded-full bg-coral/[0.08] flex items-center justify-center shrink-0">
            <div className="w-3 h-3 rounded-full bg-coral/30" />
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border-light to-transparent" />
        </div>
      </div>

      {/* ═══ Guide Cards ═══ */}
      <section className="mx-auto max-w-[1120px] px-6 pt-10 pb-16 md:pt-14 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {guides.map((guide, i) => {
            const colors = colorClasses[guide.color];
            return (
              <Link
                key={guide.slug}
                href={`/guide/${guide.slug}`}
                className={`group block bg-card-bg rounded-2xl p-6 md:p-8 border border-border-light/60 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(26,26,46,0.06)] hover:border-border-light ${colors.hoverBorder} opacity-0 animate-fade-in-up`}
                style={{
                  animationDelay: `${300 + i * 120}ms`,
                  animationFillMode: "forwards",
                }}
              >
                {/* Icon + Category */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center`}
                  >
                    {guide.icon}
                  </div>
                  <span
                    className={`text-[12px] font-semibold tracking-[0.02em] ${colors.categoryText}`}
                  >
                    {guide.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-[18px] md:text-[20px] font-bold text-navy tracking-[-0.02em] leading-[1.35] mb-2 group-hover:text-coral transition-colors">
                  {guide.title}
                </h2>

                {/* Description */}
                <p className="text-[14px] leading-[1.65] text-text-secondary mb-4">
                  {guide.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-text-muted">
                    {guide.readingTime}분 읽기
                  </span>
                  <span className="text-[13px] font-medium text-coral opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    읽기
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M3 7h8M8 4l3 3-3 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
