import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { JayuStatsSection } from "@/components/guide/jayuhakgije/JayuStatsSection";
import { JayuOverview } from "@/components/guide/jayuhakgije/JayuOverview";
import { JayuChanges } from "@/components/guide/jayuhakgije/JayuChanges";
import { JayuActivities } from "@/components/guide/jayuhakgije/JayuActivities";
import { JayuPipeline } from "@/components/guide/jayuhakgije/JayuPipeline";
import { JayuLimitations } from "@/components/guide/jayuhakgije/JayuLimitations";
import { JayuParentGuide } from "@/components/guide/jayuhakgije/JayuParentGuide";
import { JayuFAQ } from "@/components/guide/jayuhakgije/JayuFAQ";
import { JayuCTA } from "@/components/guide/jayuhakgije/JayuCTA";
import { SITE_URL, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "자유학기제 완벽 가이드 2025 | 학부모를 위한 정리 — 탐 TAM",
  description:
    "2025년 크게 달라진 자유학기제. 자유학년제 폐지, 102시간 축소, 활동 영역 변경까지 학부모가 꼭 알아야 할 모든 것을 시각적으로 정리했습니다.",
  keywords:
    "자유학기제, 자유학년제, 자유학기제 폐지, 자유학기제 변경, 중학교 자유학기, 자유학기 활동, 진로탐색, 자유학기제 학부모",
  openGraph: {
    title: "자유학기제 완벽 가이드 2025 | 학부모를 위한 정리",
    description:
      "자유학년제 폐지, 102시간 축소, 2개 활동 영역 — 달라진 자유학기제의 모든 것을 쉽게 정리했습니다.",
    type: "article",
    publishedTime: "2026-03-31",
    modifiedTime: "2026-03-31",
    locale: "ko_KR",
    tags: [
      "자유학기제",
      "자유학년제",
      "진로탐색",
      "진로교육",
      "중학교",
      "자기이해",
    ],
    siteName: "탐 TAM",
  },
  alternates: {
    canonical: absoluteUrl("/guide/jayuhakgije"),
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
    q: "자유학기제 기간에 시험이 전혀 없나요?",
    a: "2025년부터 자유학기(중1 1학기)에는 중간·기말 시험이 없지만, 수행평가와 과정 평가는 실시합니다. 중1 2학기부터는 정기 시험이 다시 시작됩니다.",
  },
  {
    q: "자유학기 성적이 고입에 영향을 주나요?",
    a: "자유학기 성적은 고입 내신에 반영되지 않습니다. 다만 중1 2학기부터의 성적은 내신에 포함되며, 비율은 중1 10%, 중2 40%, 중3 50%입니다.",
  },
  {
    q: "자유학년제가 완전히 폐지된 건가요?",
    a: "네, 2025년부터 자유학년제는 폐지되었습니다. 기존에 중학교 1학년 전체(1년)를 자유학기로 운영하던 방식에서, 1학기만 자유학기로 운영하는 방식으로 변경되었습니다.",
  },
  {
    q: "자유학기 활동을 학교가 아닌 외부에서도 할 수 있나요?",
    a: "자유학기 활동 자체는 학교 교육과정 내에서 이루어집니다. 하지만 학교 밖에서도 진로체험(꿈길 플랫폼), 박물관 프로그램, 지역사회 체험 등을 통해 보완할 수 있습니다.",
  },
  {
    q: "자유학기제가 사교육을 줄이는 효과가 있나요?",
    a: "교육부의 의도와 달리, KDI 연구에 따르면 자유학기제 시행이 오히려 사교육 격차를 심화시킨 것으로 나타났습니다. 시험이 없는 기간에 선행학습 사교육이 증가하는 현상이 관찰되었습니다.",
  },
  {
    q: "102시간이면 실제로 어느 정도인가요?",
    a: "주당 약 2-3시간 수준입니다. 한 학기(17주) 동안 주 2-3시간의 자유학기 활동을 하게 됩니다. 기존 자유학년제(221시간)에 비해 절반 이하로 줄었습니다.",
  },
  {
    q: "축소된 자유학기제, 우리 아이 진로탐색은 어떻게 보완하나요?",
    a: "학교 자유학기제만으로는 충분한 진로탐색이 어렵습니다. 가정에서 다양한 분야의 체험 기회를 제공하고, 아이의 반응 패턴을 함께 관찰하는 것이 중요합니다. 탐(TAM)과 같은 일상적 경험 플랫폼을 활용하면, 매일 10분씩 다양한 세계를 만나며 자기이해를 쌓을 수 있습니다.",
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
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "가이드",
        item: absoluteUrl("/guide"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "자유학기제 완벽 가이드",
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
    headline: "자유학기제 완벽 가이드 2025: 학부모가 알아야 할 모든 것",
    description:
      "2025년 크게 달라진 자유학기제의 모든 것을 학부모 관점에서 시각적으로 정리한 종합 가이드",
    datePublished: "2026-03-31",
    dateModified: "2026-03-31",
    author: { "@type": "Organization", name: "탐 TAM" },
    publisher: {
      "@type": "Organization",
      name: "탐 TAM",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl("/guide/jayuhakgije"),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ── Page Component ── */

export default function JayuhakgijeGuidePage() {
  return (
    <>
      {/* Structured Data */}
      <FAQPageJsonLd />
      <BreadcrumbJsonLd />
      <ArticleJsonLd />

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
              { label: "자유학기제 완벽 가이드" },
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
              자유학기제 완벽 가이드
            </h1>

            {/* Subtitle */}
            <p
              className="text-[16px] md:text-[19px] leading-[1.65] text-text-secondary mb-6 opacity-0 animate-fade-in-up delay-200"
              style={{ animationFillMode: "forwards" }}
            >
              2025년 크게 달라진 자유학기제.
              <br className="hidden sm:block" />
              축소된 현실과 학부모가 알아야 할 모든 것.
            </p>

            {/* Meta */}
            <div
              className="flex items-center gap-3 text-[13px] text-text-muted mb-8 opacity-0 animate-fade-in-up delay-300"
              style={{ animationFillMode: "forwards" }}
            >
              <span>2026.03.31 업데이트</span>
              <span className="w-1 h-1 rounded-full bg-text-muted/40" />
              <span>12분 읽기</span>
            </div>

            {/* Quick navigation pills */}
            <div
              className="flex flex-wrap gap-2 opacity-0 animate-fade-in-up delay-400"
              style={{ animationFillMode: "forwards" }}
            >
              {[
                { label: "제도 요약", href: "#overview" },
                { label: "변경사항", href: "#changes" },
                { label: "실제 활동", href: "#activities" },
                { label: "고교학점제 연계", href: "#pipeline" },
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
      <JayuStatsSection />

      {/* ═══ Section 3: What is 자유학기제 ═══ */}
      <JayuOverview />

      {/* ═══ Section 4: 2025 Changes ═══ */}
      <JayuChanges />

      {/* ═══ Section 5: Activities ═══ */}
      <JayuActivities />

      {/* ═══ Section 6: Pipeline to 고교학점제 ═══ */}
      <JayuPipeline />

      {/* ═══ Section 7: Limitations ═══ */}
      <JayuLimitations />

      {/* ═══ Section 8: Parent Guide ═══ */}
      <JayuParentGuide />

      {/* ═══ Section 9: FAQ ═══ */}
      <JayuFAQ faqs={faqData} />

      {/* ═══ Section 10: CTA ═══ */}
      <JayuCTA />
    </>
  );
}
