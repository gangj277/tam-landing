import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { GuideStatsSection } from "@/components/guide/GuideStatsSection";
import { CreditSystemOverview } from "@/components/guide/CreditSystemOverview";
import { CreditSystemComparison } from "@/components/guide/CreditSystemComparison";
import { CourseStructureTabs } from "@/components/guide/CourseStructureTabs";
import { GradingSystemVisual } from "@/components/guide/GradingSystemVisual";
import { CreditSystemTimeline } from "@/components/guide/CreditSystemTimeline";
import { ParentConcernsChart } from "@/components/guide/ParentConcernsChart";
import { MissingPieceBridge } from "@/components/guide/MissingPieceBridge";
import { TamSolutionCards } from "@/components/guide/TamSolutionCards";
import { GuideFAQ } from "@/components/guide/GuideFAQ";
import { GuideCTA } from "@/components/guide/GuideCTA";

export const metadata: Metadata = {
  title: "고교학점제 완벽 가이드 2025 | 학부모를 위한 정리 — 탐 TAM",
  description:
    "2025년 전면 시행된 고교학점제. 192학점 졸업 요건부터 138개 선택과목, 5등급 평가체계까지 학부모가 꼭 알아야 할 모든 것을 시각적으로 정리했습니다.",
  keywords:
    "고교학점제, 고교학점제란, 고교학점제 정리, 고교학점제 과목 선택, 선택과목, 고등학교 학점제, 고교학점제 학부모",
  openGraph: {
    title: "고교학점제 완벽 가이드 2025 | 학부모를 위한 정리",
    description:
      "192학점 졸업 요건, 138개 선택과목, 5등급 평가체계 — 달라진 고등학교의 모든 것을 쉽게 정리했습니다.",
    type: "article",
    publishedTime: "2026-03-31",
    modifiedTime: "2026-03-31",
    locale: "ko_KR",
    tags: [
      "고교학점제",
      "과목선택",
      "자녀교육",
      "진로교육",
      "고등학교",
      "자기이해",
    ],
    siteName: "탐 TAM",
  },
  alternates: {
    canonical: "https://tam.kr/guide/gogyohakjeomje",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
  },
};

/* ── JSON-LD Structured Data ── */

const faqData = [
  {
    q: "고교학점제란 무엇인가요?",
    a: "학생이 진로와 적성에 따라 과목을 선택하고, 이수 기준에 도달하면 학점을 부여받아 192학점 이상 취득 시 졸업하는 제도입니다. 2025년 전체 고등학교에서 전면 시행되었습니다.",
  },
  {
    q: "고교학점제에서 졸업 요건은 어떻게 되나요?",
    a: "총 192학점(교과 174학점 + 창의적 체험활동 18학점)을 이수해야 합니다. 기존 204단위(2,890시간)에서 192학점(2,720시간)으로 변경되었습니다.",
  },
  {
    q: "선택과목은 총 몇 개이고 어떻게 나뉘나요?",
    a: "보통교과 기준 총 138개 과목으로, 일반선택(36개), 진로선택(64개), 융합선택(38개)으로 나뉩니다. 공통과목은 모든 학생이 필수로 이수합니다.",
  },
  {
    q: "성적 평가는 어떻게 바뀌었나요?",
    a: "공통과목과 일반선택은 5등급 상대평가(1등급 10%, 2등급 24%, 3등급 32%, 4등급 24%, 5등급 10%)와 성취도 A~E를 병기합니다. 진로선택과 융합선택은 성취도(A~E) 절대평가만 적용됩니다.",
  },
  {
    q: "고교학점제 준비는 언제부터 해야 하나요?",
    a: "과목 선택은 고1 말부터 시작되지만, 선택의 '기준'을 만드는 건 훨씬 이전부터 가능합니다. 초등 고학년~중학교 시기에 다양한 경험을 하고 자신의 관심과 반응 패턴을 관찰하는 것이 가장 좋은 준비입니다.",
  },
  {
    q: "자유학기제와 고교학점제는 어떤 관계인가요?",
    a: "자유학기제(중1)는 진로 탐색의 기회를, 고교학점제(고등학교)는 탐색 결과를 바탕으로 한 선택의 기회를 제공합니다. 중3 2학기에는 진로연계학기가 신설되어 고교 과목 선택을 미리 연습할 수 있습니다.",
  },
  {
    q: "과목을 잘못 선택하면 바꿀 수 있나요?",
    a: "학기 시작 전 수강 변경 기간에 변경 가능하지만, 학기가 시작된 후에는 변경이 어렵습니다. 따라서 처음부터 자기이해를 바탕으로 신중하게 선택하는 것이 중요합니다.",
  },
  {
    q: "미이수 제도란 무엇인가요?",
    a: "과목별 이수 기준(성취도 E 이상 + 수업 출석률 2/3 이상)에 도달하지 못하면 '미이수'로 처리됩니다. 미이수 과목은 보충 이수를 통해 학점을 취득해야 하며, 졸업에 필요한 192학점에 포함되지 않습니다.",
  },
  {
    q: "아이가 아직 뭘 좋아하는지 모르는데 어떻게 준비하나요?",
    a: "오히려 정상입니다. 10~14세에 진로가 확정된 아이는 거의 없습니다. 중요한 건 다양한 경험에 노출되어 자신의 반응 패턴을 관찰하는 것입니다. 탐(TAM)은 매일 10분, AI가 만든 다양한 세계에서 아이가 선택하고 반응하며 자기이해를 키우는 경험 플랫폼입니다.",
  },
];

function FAQPageJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function BreadcrumbJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: "https://tam.kr",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "가이드",
        item: "https://tam.kr/guide",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "고교학점제 완벽 가이드",
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function ArticleJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "고교학점제 완벽 가이드 2025: 학부모가 알아야 할 모든 것",
    description:
      "2025년 전면 시행된 고교학점제의 모든 것을 학부모 관점에서 시각적으로 정리한 종합 가이드",
    datePublished: "2026-03-31",
    dateModified: "2026-03-31",
    author: { "@type": "Organization", name: "탐 TAM" },
    publisher: {
      "@type": "Organization",
      name: "탐 TAM",
      url: "https://tam.kr",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://tam.kr/guide/gogyohakjeomje",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function HowToJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "고교학점제 준비 방법",
    description:
      "초등학교부터 고등학교까지, 고교학점제를 위한 단계별 준비 가이드",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "초등 5~6학년: 다양한 경험 노출",
        text: "다양한 분야의 활동에 참여하며 아이의 관심사와 반응 패턴을 관찰합니다.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "중학교 1학년: 자유학기제 활용",
        text: "자유학기제의 주제선택과 진로탐색 활동을 통해 관심 분야를 넓힙니다.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "중학교 3학년: 진로연계학기",
        text: "고교 교육과정을 이해하고 과목 선택을 미리 연습합니다.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "고등학교 1학년: 공통과목 이수 + 과목 선택",
        text: "공통과목을 이수하면서 자기이해를 바탕으로 고2 선택과목을 결정합니다.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "고등학교 2~3학년: 선택과목 이수",
        text: "선택한 진로/융합 과목을 이수하며 심화 학습을 진행합니다.",
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ── Page Component ── */

export default function GogyohakjeomjeGuidePage() {
  return (
    <>
      {/* Structured Data */}
      <FAQPageJsonLd />
      <BreadcrumbJsonLd />
      <ArticleJsonLd />
      <HowToJsonLd />

      {/* ═══ Section 1: Hero ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4F2EE] via-[#FAFAF8] to-[#FAFAF8]" />

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg
            className="absolute top-[12%] right-[10%] opacity-[0.03]"
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
          >
            <rect
              x="8"
              y="8"
              width="64"
              height="64"
              rx="4"
              stroke="#4A5FC1"
              strokeWidth="1.5"
            />
            <rect
              x="24"
              y="24"
              width="32"
              height="32"
              rx="2"
              stroke="#4A5FC1"
              strokeWidth="1"
            />
          </svg>
          <svg
            className="absolute bottom-[15%] left-[6%] opacity-[0.025]"
            width="70"
            height="70"
            viewBox="0 0 70 70"
            fill="none"
          >
            <circle cx="35" cy="35" r="33" stroke="#E8614D" strokeWidth="1.5" />
            <circle cx="35" cy="35" r="14" stroke="#E8614D" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-[1120px] px-6 pt-20 pb-12 md:pt-28 md:pb-16">
          <Breadcrumbs
            items={[
              { label: "홈", href: "/" },
              { label: "가이드" },
              { label: "고교학점제 완벽 가이드" },
            ]}
          />

          <div className="max-w-[720px]">
            {/* Section label */}
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-navy/[0.04] border border-navy/[0.06] opacity-0 animate-fade-in-up"
              style={{ animationFillMode: "forwards" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-coral" />
              <span className="text-[12px] font-medium text-text-secondary tracking-[0.02em]">
                교육 가이드
              </span>
            </div>

            {/* H1 */}
            <h1
              className="text-[28px] md:text-[40px] lg:text-[48px] font-bold tracking-[-0.035em] text-navy leading-[1.2] mb-5 opacity-0 animate-fade-in-up delay-100"
              style={{ animationFillMode: "forwards" }}
            >
              고교학점제 완벽 가이드
            </h1>

            {/* Subtitle */}
            <p
              className="text-[16px] md:text-[19px] leading-[1.65] text-text-secondary mb-6 opacity-0 animate-fade-in-up delay-200"
              style={{ animationFillMode: "forwards" }}
            >
              192학점, 5등급제, 선택과목 138개 —
              <br className="hidden sm:block" />
              달라진 고등학교의 모든 것을 쉽게 정리했습니다.
            </p>

            {/* Meta */}
            <div
              className="flex items-center gap-3 text-[13px] text-text-muted mb-8 opacity-0 animate-fade-in-up delay-300"
              style={{ animationFillMode: "forwards" }}
            >
              <span>2026.03.31 업데이트</span>
              <span className="w-1 h-1 rounded-full bg-text-muted/40" />
              <span>15분 읽기</span>
            </div>

            {/* Quick navigation pills */}
            <div
              className="flex flex-wrap gap-2 opacity-0 animate-fade-in-up delay-400"
              style={{ animationFillMode: "forwards" }}
            >
              {[
                { label: "제도 요약", href: "#overview" },
                { label: "달라진 점", href: "#comparison" },
                { label: "선택과목", href: "#courses" },
                { label: "평가 체계", href: "#grading" },
                { label: "준비 타임라인", href: "#timeline" },
                { label: "FAQ", href: "#faq" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-navy/70 bg-navy/[0.04] border border-navy/[0.06] hover:bg-navy/[0.08] hover:text-navy transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Decorative divider */}
      <div className="relative mx-auto max-w-[1120px] px-6">
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border-light to-transparent" />
          <div className="w-8 h-8 rounded-full bg-coral/[0.08] flex items-center justify-center shrink-0">
            <div className="w-3 h-3 rounded-full bg-coral/30" />
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border-light to-transparent" />
        </div>
      </div>

      {/* ═══ Section 2: Stats (Anxiety Hook) ═══ */}
      <GuideStatsSection />

      {/* ═══ Section 3: What is 고교학점제 ═══ */}
      <CreditSystemOverview />

      {/* ═══ Section 4: Before vs After ═══ */}
      <CreditSystemComparison />

      {/* ═══ Section 5: Course Structure ═══ */}
      <CourseStructureTabs />

      {/* ═══ Section 6: Grading System ═══ */}
      <GradingSystemVisual />

      {/* ═══ Section 7: Timeline ═══ */}
      <CreditSystemTimeline />

      {/* ═══ Section 8: Parent Concerns ═══ */}
      <ParentConcernsChart />

      {/* ═══ Section 9: Missing Piece Bridge ═══ */}
      <MissingPieceBridge />

      {/* ═══ Section 10: TAM Solution ═══ */}
      <TamSolutionCards />

      {/* ═══ Section 11: FAQ ═══ */}
      <GuideFAQ faqs={faqData} />

      {/* ═══ Section 12: CTA ═══ */}
      <GuideCTA />
    </>
  );
}
