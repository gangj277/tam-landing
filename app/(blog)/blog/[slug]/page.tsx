import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostMeta, getAllPosts } from "@/lib/blog";
import type { BlogPostMeta } from "@/lib/blog";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { BackToTop } from "@/components/blog/BackToTop";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let post: BlogPostMeta;
  try {
    post = await getPostMeta(slug);
  } catch {
    return {};
  }

  return {
    title: `${post.title} | 탐 TAM 블로그`,
    description: post.description,
    keywords: post.tags.join(", "),
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      locale: "ko_KR",
      tags: post.tags,
      siteName: "탐 TAM",
    },
    alternates: {
      canonical: `https://tam.kr/blog/${post.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  };
}

function ArticleJsonLd({ post }: { post: BlogPostMeta }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "탐 TAM",
      url: "https://tam.kr",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://tam.kr/blog/${post.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function FAQJsonLd({ faqs }: { faqs: BlogPostMeta["faq"] }) {
  if (!faqs || faqs.length === 0) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
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

function BreadcrumbJsonLd({ post }: { post: BlogPostMeta }) {
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
        name: "블로그",
        item: "https://tam.kr/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: BlogPostMeta;
  let Post: React.ComponentType;
  try {
    const mod = await import(`@/content/blog/${slug}.mdx`);
    Post = mod.default;
    post = mod.metadata;
  } catch {
    notFound();
  }

  // Fetch related posts
  const allPosts = await getAllPosts();
  const relatedPosts = (post.relatedSlugs ?? [])
    .map((s) => allPosts.find((p) => p.slug === s))
    .filter((p): p is BlogPostMeta => p !== undefined);

  return (
    <>
      <ArticleJsonLd post={post} />
      <FAQJsonLd faqs={post.faq} />
      <BreadcrumbJsonLd post={post} />

      {/* Reading progress bar */}
      <ReadingProgress />

      {/* Article + optional ToC sidebar */}
      <div className="mx-auto max-w-[1120px] px-6 py-12 md:py-20">
        <div className="flex gap-12 lg:gap-16 justify-center">
          {/* Main article column */}
          <article className="w-full max-w-[720px] min-w-0">
            <Breadcrumbs
              items={[
                { label: "홈", href: "/" },
                { label: "블로그", href: "/blog" },
                { label: post.title },
              ]}
            />
            <BlogHeader post={post} />

            {/* Decorative separator */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-coral/20 via-border-light to-transparent" />
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-coral/30 shrink-0"
              >
                <path
                  d="M8 2L10 6L14 6.5L11 9.5L12 14L8 12L4 14L5 9.5L2 6.5L6 6L8 2Z"
                  fill="currentColor"
                />
              </svg>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border-light to-coral/20" />
            </div>

            {/* MDX content */}
            <div>
              <Post />
            </div>
          </article>

          {/* Table of contents sidebar (desktop only) */}
          <TableOfContents />
        </div>
      </div>

      {/* Related posts */}
      <div className="mx-auto max-w-[720px] px-6 pb-16 md:pb-24">
        <RelatedPosts posts={relatedPosts} />
      </div>

      {/* Back to top button */}
      <BackToTop />
    </>
  );
}
