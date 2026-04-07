import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { NewsletterCTA } from "@/components/blog/NewsletterCTA";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "블로그 | 탐 TAM",
  description:
    "AI 시대 자녀교육, 고교학점제, 자기이해에 관한 부모를 위한 가이드. 아이의 경험을 넓히는 탐 TAM 블로그.",
  openGraph: {
    title: "블로그 | 탐 TAM",
    description:
      "AI 시대 자녀교육, 고교학점제, 자기이해에 관한 부모를 위한 가이드.",
    locale: "ko_KR",
    type: "website",
  },
  alternates: {
    canonical: absoluteUrl("/blog"),
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  // Split pillar (featured) post from regular posts
  const pillarPost = posts.find((p) => p.pillar);
  const regularPosts = posts.filter((p) => p !== pillarPost);

  return (
    <div className="relative">
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden">
        {/* Warm gradient background matching landing */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4F2EE] via-[#FAFAF8] to-[#FAFAF8]" />

        {/* Subtle decorative elements */}
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
          <svg
            className="absolute bottom-[20%] left-[5%] opacity-[0.025]"
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
          >
            <rect
              x="10"
              y="10"
              width="80"
              height="80"
              rx="4"
              stroke="#E8614D"
              strokeWidth="1.5"
              fill="none"
            />
            <rect
              x="30"
              y="30"
              width="40"
              height="40"
              rx="2"
              stroke="#E8614D"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-[1120px] px-6 pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="max-w-[640px] mx-auto text-center">
            {/* Section label */}
            <div
              className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full bg-navy/[0.04] border border-navy/[0.06] opacity-0 animate-fade-in-up"
              style={{ animationFillMode: "forwards" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-coral" />
              <span className="text-[12px] font-medium text-text-secondary tracking-[0.02em]">
                TAM 블로그
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-[28px] md:text-[40px] lg:text-[44px] font-bold tracking-[-0.035em] text-navy leading-[1.25] mb-5 opacity-0 animate-fade-in-up delay-100"
              style={{ animationFillMode: "forwards" }}
            >
              AI 시대, 우리 아이의
              <br className="hidden md:block" />
              성장을 함께 고민합니다
            </h1>

            {/* Subtext */}
            <p
              className="text-[16px] md:text-[18px] leading-[1.65] text-text-secondary opacity-0 animate-fade-in-up delay-200"
              style={{ animationFillMode: "forwards" }}
            >
              고교학점제, 자기이해, AI 리터러시.
              <br className="hidden sm:block" />
              부모가 알아야 할 이야기를 담습니다.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Decorative divider ═══ */}
      <div className="relative mx-auto max-w-[1120px] px-6">
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border-light to-transparent" />
          {/* TAM blob mark */}
          <div className="w-8 h-8 rounded-full bg-coral/[0.08] flex items-center justify-center shrink-0">
            <div className="w-3 h-3 rounded-full bg-coral/30" />
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border-light to-transparent" />
        </div>
      </div>

      {/* ═══ Posts Section ═══ */}
      <section className="mx-auto max-w-[1120px] px-6 pt-10 pb-16 md:pt-14 md:pb-24">
        {posts.length === 0 ? (
          <p className="text-center text-text-muted text-[15px] py-20">
            아직 글이 없습니다. 곧 첫 번째 글이 올라옵니다.
          </p>
        ) : (
          <>
            {/* Featured / Pillar Post */}
            {pillarPost && (
              <div
                className="mb-10 md:mb-14 opacity-0 animate-fade-in-up delay-300"
                style={{ animationFillMode: "forwards" }}
              >
                {/* "PILLAR" label */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-[1.5px] w-6 bg-coral/50" />
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">
                    심층 가이드
                  </span>
                </div>
                <BlogCard post={pillarPost} variant="featured" />
              </div>
            )}

            {/* Regular Posts Grid */}
            {regularPosts.length > 0 && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[1.5px] w-6 bg-border-light" />
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.08em]">
                    최신 글
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  {regularPosts.map((post, i) => (
                    <div
                      key={post.slug}
                      className="opacity-0 animate-fade-in-up"
                      style={{
                        animationDelay: `${400 + i * 120}ms`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <BlogCard post={post} variant="regular" />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ═══ Newsletter CTA ═══ */}
        <div
          className="mt-16 md:mt-24 opacity-0 animate-fade-in-up delay-600"
          style={{ animationFillMode: "forwards" }}
        >
          <NewsletterCTA />
        </div>
      </section>
    </div>
  );
}
