import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { AidtStats } from "@/components/guide/ai-digital-textbook/AidtStats";
import { AidtOverview } from "@/components/guide/ai-digital-textbook/AidtOverview";
import { AidtTimeline } from "@/components/guide/ai-digital-textbook/AidtTimeline";
import { AidtConcerns } from "@/components/guide/ai-digital-textbook/AidtConcerns";
import { AidtGlobal } from "@/components/guide/ai-digital-textbook/AidtGlobal";
import { AidtParentGuide } from "@/components/guide/ai-digital-textbook/AidtParentGuide";
import { GuideFAQ } from "@/components/guide/GuideFAQ";
import { SITE_URL, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title:
    "2026 AI 디지털교과서 학부모 가이드 | 알아야 할 모든 것 — 탐 TAM",
  description:
    "활용률 8.1%, 학부모 68.3%가 과의존 우려. 1조 4천억원이 투입된 AI 디지털교과서의 실체, 해외 실패 사례, 학부모가 지금 해야 할 것을 정리했습니다.",
  keywords:
    "AI 디지털교과서, AI교과서 찬반, 디지털교과서 학부모, AI교과서 2026, 디지털교과서 우려, AI교과서 문제점",
  openGraph: {
    title: "2026 AI 디지털교과서, 학부모가 알아야 할 모든 것",
    description:
      "활용률 8.1%, 학부모 68.3%가 과의존 우려. AI 디지털교과서의 실체와 학부모 대응법.",
    type: "article",
    publishedTime: "2026-04-07",
    modifiedTime: "2026-04-07",
    locale: "ko_KR",
    tags: [
      "AI 디지털교과서",
      "디지털교과서",
      "자녀교육",
      "AI교육",
      "학부모가이드",
    ],
    siteName: "탐 TAM",
  },
  alternates: {
    canonical: absoluteUrl("/guide/ai-digital-textbook"),
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
  },
};

/* ── FAQ Data ── */

const faqData = [
  {
    q: "AI 디지털교과서는 종이 교과서를 대체하나요?",
    a: "아닙니다. 병행 사용이 원칙입니다. 2025년 법 개정으로 AI 디지털교과서는 의무 채택 대상에서 제외되었고, '교육자료'로 재분류되었습니다. 종이 교과서는 계속 사용됩니다.",
  },
  {
    q: "우리 아이 학교가 사용하는지 어떻게 확인하나요?",
    a: "학교 운영위원회나 담임교사에게 직접 문의하세요. 2025년 법 개정 이후 학교별 자율 채택이므로, 학교마다 다릅니다. 2025년 2학기 기준 약 1,686개교가 사용 중입니다.",
  },
  {
    q: "아이의 학습 데이터가 어디에 저장되나요?",
    a: "클라우드 서버에 저장되며 CASP 중등급 이상 보안인증을 받았습니다. 다만 수집 항목(학습시간, 성취도, 질의응답, 학습정서 등)이 광범위하므로, 개인정보 수집 동의서를 꼼꼼히 확인하세요.",
  },
  {
    q: "해외에서는 어떻게 하고 있나요?",
    a: "스웨덴은 2017년 디지털교과서 전면 도입 후 읽기 점수가 하락해 2023년 종이교과서로 복귀했습니다. 핀란드도 학부모 70%, 교사 80%가 종이교과서를 선호합니다. OECD는 '속도보다 신중함'을 권고합니다.",
  },
  {
    q: "AI 디지털교과서를 사용하면 성적이 오르나요?",
    a: "OECD 2026 보고서에 따르면, AI 접근 시 단기 성적은 48~127% 향상되지만, AI를 제거하면 성적이 17% 하락합니다. OECD는 이를 '거짓 숙달의 신기루'라고 경고합니다. AI는 보조 도구이지, 학습의 주체가 되어서는 안 됩니다.",
  },
];

/* ── JSON-LD ── */

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
        name: "AI 디지털교과서 학부모 가이드",
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
    headline: "2026 AI 디지털교과서, 학부모가 알아야 할 모든 것",
    description:
      "활용률 8.1%, 학부모 68.3%가 과의존 우려. AI 디지털교과서의 실체와 학부모 대응법.",
    datePublished: "2026-04-07",
    dateModified: "2026-04-07",
    author: { "@type": "Organization", name: "탐 TAM" },
    publisher: {
      "@type": "Organization",
      name: "탐 TAM",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl("/guide/ai-digital-textbook"),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* ── CTA Section (inline — follows guide pattern) ── */

function AidtCTA() {
  return (
    <section className="relative py-24 md:py-32 px-6 bg-gradient-to-b from-[#FAFAF8] via-[#FDF5F3] to-[#FAF0ED]">
      <div className="mx-auto max-w-[600px] text-center">
        {/* Label */}
        <p className="text-[13px] font-medium text-coral mb-4 tracking-[0.02em]">
          탐 TAM
        </p>

        <h2 className="text-[24px] md:text-[32px] font-bold text-navy tracking-[-0.03em] leading-[1.35] mb-4">
          AI가 바꾸는 교실 속에서도
          <br />
          아이의 중심은 자기이해입니다
        </h2>

        <p className="text-[15px] md:text-[16px] text-text-secondary leading-[1.7] mb-8 max-w-[440px] mx-auto">
          매일 10분, AI가 만든 새로운 세계에서 선택하고 반응하며 자기 자신을
          발견하는 경험 플랫폼
        </p>

        {/* Primary CTA */}
        <a
          href="/signup"
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-coral text-white text-[15px] font-semibold hover:bg-coral-hover transition-all shadow-[0_2px_16px_rgba(232,97,77,0.3)] hover:shadow-[0_4px_24px_rgba(232,97,77,0.4)] hover:scale-[1.02] mb-4"
        >
          무료로 시작하기
        </a>

        {/* Secondary CTA */}
        <div className="mb-6">
          <a
            href="/quiz"
            className="text-[14px] font-medium text-indigo hover:text-indigo/80 transition-colors underline underline-offset-4 decoration-indigo/30"
          >
            1분 무료 진단 먼저 해보기
          </a>
        </div>

        {/* Trust badges */}
        <p className="text-[13px] text-text-muted">
          30초 가입 · 무료 체험 · 언제든 취소
        </p>

        {/* Cross-link */}
        <div className="mt-12 pt-8 border-t border-border-light/60">
          <p className="text-[13px] text-text-muted mb-2">더 읽어보기</p>
          <a
            href="/blog/smartphone-digital-habits"
            className="text-[15px] font-medium text-navy hover:text-coral transition-colors"
          >
            수업 중 스마트폰 금지 시대, 집에서는 어떻게 해야 할까 &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Page Component ── */

export default function AiDigitalTextbookGuidePage() {
  return (
    <>
      {/* Structured Data */}
      <FAQPageJsonLd />
      <BreadcrumbJsonLd />
      <ArticleJsonLd />

      {/* ═══ Hero ═══ */}
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
            <circle
              cx="35"
              cy="35"
              r="33"
              stroke="#E8614D"
              strokeWidth="1.5"
            />
            <circle
              cx="35"
              cy="35"
              r="14"
              stroke="#E8614D"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-[1120px] px-6 pt-20 pb-12 md:pt-28 md:pb-16">
          <Breadcrumbs
            items={[
              { label: "홈", href: "/" },
              { label: "가이드" },
              { label: "AI 디지털교과서 가이드" },
            ]}
          />

          <div className="max-w-[720px]">
            {/* Section label */}
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-navy/[0.04] border border-navy/[0.06] opacity-0 animate-fade-in-up"
              style={{ animationFillMode: "forwards" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo" />
              <span className="text-[12px] font-medium text-text-secondary tracking-[0.02em]">
                교육 가이드
              </span>
            </div>

            {/* H1 */}
            <h1
              className="text-[28px] md:text-[40px] lg:text-[48px] font-bold tracking-[-0.035em] text-navy leading-[1.2] mb-5 opacity-0 animate-fade-in-up delay-100"
              style={{ animationFillMode: "forwards" }}
            >
              AI 디지털교과서
              <br className="hidden sm:block" />
              학부모 가이드
            </h1>

            {/* Subtitle */}
            <p
              className="text-[16px] md:text-[19px] leading-[1.65] text-text-secondary mb-6 opacity-0 animate-fade-in-up delay-200"
              style={{ animationFillMode: "forwards" }}
            >
              1조 4천억원이 투입되었지만, 활용률은 8.1%.
              <br className="hidden sm:block" />
              학부모가 알아야 할 모든 것을 정리했습니다.
            </p>

            {/* Meta */}
            <div
              className="flex items-center gap-3 text-[13px] text-text-muted mb-8 opacity-0 animate-fade-in-up delay-300"
              style={{ animationFillMode: "forwards" }}
            >
              <span>2026.04.07 업데이트</span>
              <span className="w-1 h-1 rounded-full bg-text-muted/40" />
              <span>15분 읽기</span>
            </div>

            {/* Quick navigation pills */}
            <div
              className="flex flex-wrap gap-2 opacity-0 animate-fade-in-up delay-400"
              style={{ animationFillMode: "forwards" }}
            >
              {[
                { label: "현실 점검", href: "#survey" },
                { label: "무엇이 다른가", href: "#overview" },
                { label: "적용 현황", href: "#timeline" },
                { label: "주요 우려", href: "#concerns" },
                { label: "해외 사례", href: "#global" },
                { label: "대응법", href: "#parent-guide" },
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
          <div className="w-8 h-8 rounded-full bg-indigo/[0.08] flex items-center justify-center shrink-0">
            <div className="w-3 h-3 rounded-full bg-indigo/30" />
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border-light to-transparent" />
        </div>
      </div>

      {/* ═══ Sections ═══ */}
      <AidtStats />
      <AidtOverview />
      <AidtTimeline />
      <AidtConcerns />
      <AidtGlobal />
      <AidtParentGuide />
      <GuideFAQ faqs={faqData} />
      <AidtCTA />
    </>
  );
}
