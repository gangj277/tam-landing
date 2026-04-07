import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { AiEraStats } from "@/components/guide/ai-era-career/AiEraStats";
import { AiEraNumbers } from "@/components/guide/ai-era-career/AiEraNumbers";
import { AiEraCoding } from "@/components/guide/ai-era-career/AiEraCoding";
import { AiEraSkills } from "@/components/guide/ai-era-career/AiEraSkills";
import { AiEraSelfUnderstanding } from "@/components/guide/ai-era-career/AiEraSelfUnderstanding";
import { AiEraGoldenTime } from "@/components/guide/ai-era-career/AiEraGoldenTime";
import { AiEraGlobal } from "@/components/guide/ai-era-career/AiEraGlobal";
import { AiEraParentGuide } from "@/components/guide/ai-era-career/AiEraParentGuide";
import { AiEraFAQ } from "@/components/guide/ai-era-career/AiEraFAQ";
import { AiEraSolution } from "@/components/guide/ai-era-career/AiEraSolution";
import { AiEraCTA } from "@/components/guide/ai-era-career/AiEraCTA";
import { SITE_URL, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI 시대 우리 아이 진로 준비 가이드 | 학부모를 위한 정리 — 탐 TAM",
  description:
    "코딩이 아닙니다. WEF가 꼽은 핵심 역량의 공통점은 '자기 자신을 아는 것'입니다. AI 시대 자녀 진로 준비, 학부모가 꼭 알아야 할 모든 것을 정리했습니다.",
  keywords:
    "AI 시대 진로, AI 시대 교육, AI 진로 준비, 자녀 진로, 자기이해, 미래 역량, AI 리터러시, 코딩 교육",
  openGraph: {
    title: "AI 시대, 우리 아이 진로 준비 가이드",
    description:
      "코딩이 아닙니다. WEF 핵심 역량의 공통점은 '자기 자신을 아는 것'. 학부모를 위한 AI 시대 진로 준비 종합 가이드.",
    type: "article",
    publishedTime: "2026-03-31",
    modifiedTime: "2026-03-31",
    locale: "ko_KR",
    tags: [
      "AI 시대 교육",
      "진로 준비",
      "자녀교육",
      "자기이해",
      "미래 역량",
      "AI 리터러시",
    ],
    siteName: "탐 TAM",
  },
  alternates: {
    canonical: absoluteUrl("/guide/ai-era-career"),
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
    q: "AI가 다 해주는데 공부를 왜 해야 하나요?",
    a: "AI는 정보를 처리하지만, 어떤 정보를 원하는지 결정하는 건 인간입니다. 네비게이션이 길을 찾아주지만 어디로 갈지는 우리가 정하듯, AI를 잘 활용하려면 배경지식과 판단력이 필요합니다. 또한 공부를 통해 기르는 끈기, 자기조절, 문제해결 능력은 AI가 대체할 수 없습니다.",
  },
  {
    q: "어떤 진로를 준비시켜야 하나요?",
    a: "특정 직업명으로 준비시키기보다, 어떤 직업에서든 가치를 발휘할 수 있는 사람을 키우세요. WEF가 꼽은 핵심 역량은 분석적 사고, 적응력, 자기인식 — 모두 특정 직업이 아닌 범용적 역량입니다. 아이의 강점과 흥미를 파악하고, 그 방향으로 깊은 경험을 제공하는 것이 가장 효과적입니다.",
  },
  {
    q: "코딩 학원 보내야 하나요?",
    a: "아이가 만들기와 논리적 사고에 흥미가 있다면 좋은 도구입니다. 하지만 흥미 없는 아이에게 강제하는 것은 비효과적입니다. MIT Media Lab의 미첼 레스닉은 \"코딩의 가치는 코드 작성 자체가 아니라 문제를 구조화하는 사고방식을 배우는 데 있다\"고 말합니다. 코딩보다 우선할 것은 다양한 경험, 자기 탐색, 프로젝트 기반 학습입니다.",
  },
  {
    q: "AI 시대에 안전한 직업이 있나요?",
    a: "AI-proof 직업은 없지만, AI-proof 역량은 있습니다. 복잡한 인간관계(상담, 교육), 창의적 판단(예술, 연구), 윤리적 의사결정(의료, 법) 영역은 AI 대체 위험이 상대적으로 낮습니다. McKinsey에 따르면 100% AI 대체 가능한 직업은 5% 미만이며, 대부분은 직무 내용이 변화하는 것입니다.",
  },
  {
    q: "10-14세에 진로를 정해야 하나요?",
    a: "절대 아닙니다. 이 시기는 진로를 결정하는 때가 아니라 탐색하는 때입니다. 발달심리학적으로 이 시기는 자아정체성이 형성되기 시작하는 때이며, 다양한 경험을 통해 자기 반응 패턴을 발견하는 것이 가장 효과적입니다. 관심사가 자주 바뀌는 것은 정상이자 건강한 신호입니다.",
  },
  {
    q: "자기이해는 구체적으로 어떻게 키우나요?",
    a: "다양한 분야의 경험에 노출시키고, 아이의 반응을 함께 관찰하는 것입니다. \"뭘 할 때 시간 가는 줄 몰랐어?\", \"이건 왜 끌렸어?\" 같은 질문이 도움됩니다. 탐(TAM)은 매일 10분, AI가 만든 다양한 세계에서 아이가 선택하고 반응하며 자기이해를 키우는 경험 플랫폼입니다.",
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
        name: "AI 시대 진로 준비 가이드",
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
    headline: "AI 시대, 우리 아이 진로 준비 가이드",
    description:
      "코딩이 아닙니다. WEF가 꼽은 핵심 역량의 공통점은 '자기 자신을 아는 것'입니다. AI 시대 자녀 진로 준비의 모든 것.",
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
      "@id": absoluteUrl("/guide/ai-era-career"),
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

export default function AiEraCareerGuidePage() {
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
              { label: "AI 시대 진로 준비 가이드" },
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
              AI 시대, 우리 아이
              <br className="hidden sm:block" />
              진로 준비 가이드
            </h1>

            {/* Subtitle */}
            <p
              className="text-[16px] md:text-[19px] leading-[1.65] text-text-secondary mb-6 opacity-0 animate-fade-in-up delay-200"
              style={{ animationFillMode: "forwards" }}
            >
              코딩이 아닙니다. WEF가 꼽은 핵심 역량의 공통점은
              <br className="hidden sm:block" />
              &lsquo;자기 자신을 아는 것&rsquo;입니다.
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
                { label: "부모 불안", href: "#anxiety" },
                { label: "AI 시대 숫자", href: "#numbers" },
                { label: "핵심 역량", href: "#skills" },
                { label: "자기이해", href: "#self-understanding" },
                { label: "골든타임", href: "#golden-time" },
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

      {/* ═══ Section 2: 부모 불안 공감 ═══ */}
      <AiEraStats />

      {/* ═══ Section 3: 숫자로 보는 AI 시대 ═══ */}
      <AiEraNumbers />

      {/* ═══ Section 4: 코딩이 답이 아닙니다 ═══ */}
      <AiEraCoding />

      {/* ═══ Section 5: 진짜 필요한 역량 ═══ */}
      <AiEraSkills />

      {/* ═══ Section 6: 왜 자기이해가 핵심인가 ═══ */}
      <AiEraSelfUnderstanding />

      {/* ═══ Section 7: 10-14세 골든타임 ═══ */}
      <AiEraGoldenTime />

      {/* ═══ Section 8: 해외 사례 ═══ */}
      <AiEraGlobal />

      {/* ═══ Section 9: 부모 실질적 가이드 ═══ */}
      <AiEraParentGuide />

      {/* ═══ Section 10: FAQ ═══ */}
      <AiEraFAQ faqs={faqData} />

      {/* ═══ Section 11: TAM 솔루션 ═══ */}
      <AiEraSolution />

      {/* ═══ Section 12: CTA ═══ */}
      <AiEraCTA />
    </>
  );
}
