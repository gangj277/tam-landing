import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { ElemStats } from "@/components/guide/elementary/ElemStats";
import { ElemReality } from "@/components/guide/elementary/ElemReality";
import { ElemDevelopment } from "@/components/guide/elementary/ElemDevelopment";
import { ElemExploreVsDecide } from "@/components/guide/elementary/ElemExploreVsDecide";
import { ElemSchoolReality } from "@/components/guide/elementary/ElemSchoolReality";
import { ElemMethods } from "@/components/guide/elementary/ElemMethods";
import { ElemPerceptionGap } from "@/components/guide/elementary/ElemPerceptionGap";
import { ElemActionGuide } from "@/components/guide/elementary/ElemActionGuide";
import { ElemFAQ } from "@/components/guide/elementary/ElemFAQ";
import { ElemCTA } from "@/components/guide/elementary/ElemCTA";
import { SITE_URL, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "초등 고학년 진로탐색 시작 가이드 | 학부모를 위한 정리 — 탐 TAM",
  description:
    "초등 5-6학년, 진로를 '결정'할 때가 아닙니다. '탐색'할 때입니다. 발달심리학 기반 진로탐색법부터 부모 실천 가이드까지, 아이의 가능성을 넓히는 방법을 정리했습니다.",
  keywords:
    "초등 진로탐색, 초등 고학년 진로, 초등학생 진로교육, 진로탐색 방법, 아이 진로, 초등학생 꿈, 진로 발달, 자녀 진로교육",
  openGraph: {
    title: "초등 고학년, 진로탐색 시작 가이드",
    description:
      "진로를 '결정'할 때가 아닙니다. '탐색'할 때입니다. 아이의 가능성을 넓히는 방법.",
    type: "article",
    publishedTime: "2026-03-31",
    modifiedTime: "2026-03-31",
    locale: "ko_KR",
    tags: [
      "초등 진로탐색",
      "진로교육",
      "자녀교육",
      "초등 고학년",
      "자기이해",
      "진로 발달",
    ],
    siteName: "탐 TAM",
  },
  alternates: {
    canonical: absoluteUrl("/guide/elementary-career-exploration"),
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
    q: "우리 아이는 아직 꿈이 없는데 괜찮은 건가요?",
    a: "완전히 괜찮습니다. 초등학생의 20.4%가 희망직업이 없고, 이 비율은 중학생이 되면 40%까지 올라갑니다. 이 시기에 꿈이 정해진 아이가 오히려 드뭅니다. 중요한 건 '꿈을 정하는 것'이 아니라 '다양한 경험을 통해 자기를 알아가는 것'입니다.",
  },
  {
    q: "관심사가 자주 바뀌는데 문제가 아닌가요?",
    a: "정상이자 건강한 신호입니다. 발달심리학에서 이 시기는 '흥미 탐색기'로, 다양한 분야를 시도하며 자기에게 맞는 것을 찾아가는 과정입니다. 어른도 여러 음식을 먹어봐야 좋아하는 걸 알듯, 아이도 다양한 경험을 해봐야 합니다.",
  },
  {
    q: "학원을 줄이고 경험을 늘리라는데, 현실적으로 가능한가요?",
    a: "전부 줄일 필요는 없습니다. 학원 한 개를 줄이고 그 시간에 새로운 경험을 해보는 것만으로도 효과가 있습니다. 일상적인 경험(요리, 정원 가꾸기, 동물 돌봄)도 훌륭한 진로탐색입니다. 탐(TAM)처럼 매일 10분 AI 경험을 활용하면 학원 시간을 건드리지 않고도 탐색 기회를 넓힐 수 있습니다.",
  },
  {
    q: "진로검사 결과를 어떻게 활용해야 하나요?",
    a: '참고 자료로만 활용하세요. 10-14세는 흥미와 적성이 빠르게 변하는 시기라 검사 결과가 6개월 후 달라질 수 있습니다. 검사 결과를 "확정"이 아닌 "대화의 출발점"으로 사용하세요. "이 결과가 맞는 것 같아?" 하고 아이와 이야기하는 것이 결과 자체보다 중요합니다.',
  },
  {
    q: "영재원/특목고 준비와 진로탐색을 병행할 수 있나요?",
    a: "물론 가능합니다. 다만 영재원 준비가 '폭넓은 탐색'을 가로막지 않는지 점검해보세요. 수학 영재원만 준비하면 수학 외 분야를 경험할 기회가 줄어듭니다. 진로탐색은 한 분야의 심화가 아닌 '넓은 노출' → '자기이해' → '선택'의 순서입니다.",
  },
  {
    q: "아이가 게임/유튜브만 하려고 하는데 어떻게 하나요?",
    a: '게임과 유튜브 자체가 문제가 아닙니다. "왜 이 게임이 좋아?", "이 유튜버의 어떤 점이 끌려?"라고 물어보세요. 게임 좋아하는 아이가 게임 기획, 스토리텔링, 프로그래밍에 관심을 가질 수 있고, 유튜브를 좋아하는 아이가 영상 편집, 기획, 커뮤니케이션에 강점이 있을 수 있습니다. 소비를 창작으로 전환하는 대화가 핵심입니다.',
  },
  {
    q: "초등 때 AI 경험이 왜 중요한가요?",
    a: '10-14세는 자아개념이 급격히 분화하는 시기입니다. 이때 다양한 세계를 만나면 "나는 이런 걸 좋아하는구나", "이런 상황에서 이렇게 반응하는구나"를 발견합니다. 탐(TAM)은 매일 10분, AI가 만든 다양한 시나리오에서 아이가 선택하고 반응하며, 이 패턴을 부모와 함께 돌아보는 경험 플랫폼입니다.',
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
        name: "초등 고학년 진로탐색 가이드",
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
    headline: "초등 고학년, 진로탐색 시작 가이드",
    description:
      "초등 5-6학년, 진로를 '결정'할 때가 아닙니다. '탐색'할 때입니다. 발달심리학 기반 진로탐색법부터 부모 실천 가이드까지.",
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
      "@id": absoluteUrl("/guide/elementary-career-exploration"),
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

export default function ElementaryCareerExplorationGuidePage() {
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
            <circle cx="40" cy="40" r="36" stroke="#E8614D" strokeWidth="1.5" />
            <circle cx="40" cy="40" r="18" stroke="#E8614D" strokeWidth="1" />
            <circle cx="40" cy="40" r="6" fill="#E8614D" fillOpacity="0.3" />
          </svg>
          <svg
            className="absolute bottom-[15%] left-[6%] opacity-[0.025]"
            width="70"
            height="70"
            viewBox="0 0 70 70"
            fill="none"
          >
            <rect
              x="7"
              y="7"
              width="56"
              height="56"
              rx="8"
              stroke="#4A5FC1"
              strokeWidth="1.5"
            />
            <rect
              x="21"
              y="21"
              width="28"
              height="28"
              rx="4"
              stroke="#4A5FC1"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-[1120px] px-6 pt-20 pb-12 md:pt-28 md:pb-16">
          <Breadcrumbs
            items={[
              { label: "홈", href: "/" },
              { label: "가이드" },
              { label: "초등 고학년 진로탐색 가이드" },
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
              초등 고학년, 진로탐색 시작 가이드
            </h1>

            {/* Subtitle */}
            <p
              className="text-[16px] md:text-[19px] leading-[1.65] text-text-secondary mb-6 opacity-0 animate-fade-in-up delay-200"
              style={{ animationFillMode: "forwards" }}
            >
              진로를 &lsquo;결정&rsquo;할 때가 아닙니다.
              &lsquo;탐색&rsquo;할 때입니다.
              <br className="hidden sm:block" />
              아이의 가능성을 넓히는 방법.
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
                { label: "현실 데이터", href: "#reality" },
                { label: "발달 특성", href: "#development" },
                { label: "탐색 vs 결정", href: "#explore-vs-decide" },
                { label: "진로탐색법", href: "#methods" },
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

      {/* ═══ Section 2: 부모 공감 ═══ */}
      <ElemStats />

      {/* ═══ Section 3: 숫자로 보는 현실 ═══ */}
      <ElemReality />

      {/* ═══ Section 4: 이 시기 아이의 특징 ═══ */}
      <ElemDevelopment />

      {/* ═══ Section 5: 탐색 vs 결정 ═══ */}
      <ElemExploreVsDecide />

      {/* ═══ Section 6: 학교 진로교육의 현실 ═══ */}
      <ElemSchoolReality />

      {/* ═══ Section 7: 효과적인 진로탐색법 ═══ */}
      <ElemMethods />

      {/* ═══ Section 8: 부모-자녀 인식 차이 ═══ */}
      <ElemPerceptionGap />

      {/* ═══ Section 9: 부모 실천 가이드 ═══ */}
      <ElemActionGuide />

      {/* ═══ Section 10: FAQ ═══ */}
      <ElemFAQ />

      {/* ═══ Section 11: CTA ═══ */}
      <ElemCTA />
    </>
  );
}
