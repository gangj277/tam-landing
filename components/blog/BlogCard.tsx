import type { BlogPostMeta } from "@/lib/blog";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "AI와 교육": { bg: "bg-indigo-light", text: "text-indigo" },
  "교육 트렌드": { bg: "bg-coral-light", text: "text-coral" },
  자기이해: { bg: "bg-[#FDF6EC]", text: "text-[#B8872B]" },
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] ?? { bg: "bg-coral-light", text: "text-coral" };
}

/* ─── Featured / Pillar Card ─── */

function FeaturedCard({ post }: { post: BlogPostMeta }) {
  const cat = getCategoryStyle(post.category);
  const firstFaq = post.faq?.[0];

  return (
    <a
      href={`/blog/${post.slug}`}
      className="group block bg-card-bg rounded-2xl border border-border-light/60 overflow-hidden shadow-[0_4px_24px_rgba(26,26,46,0.04)] hover:shadow-[0_8px_32px_rgba(26,26,46,0.08)] transition-all duration-500"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left accent strip */}
        <div className="hidden lg:block w-1.5 bg-gradient-to-b from-coral via-coral/60 to-coral/20 shrink-0 rounded-l-2xl" />

        <div className="flex-1 p-7 md:p-9 lg:p-10">
          {/* Top row: category + reading time */}
          <div className="flex items-center gap-3 mb-5">
            <span
              className={`inline-block text-[12px] font-semibold ${cat.text} ${cat.bg} px-3 py-1 rounded-full`}
            >
              {post.category}
            </span>
            <span className="text-[12px] text-text-muted">
              {post.readingTime}분 읽기
            </span>
          </div>

          {/* Title */}
          <h2 className="text-[24px] md:text-[28px] lg:text-[32px] font-bold text-navy leading-[1.3] tracking-[-0.03em] mb-4 group-hover:text-coral transition-colors duration-300">
            {post.title}
          </h2>

          {/* Description */}
          <p className="text-[15px] md:text-[16px] leading-[1.7] text-text-secondary mb-6 max-w-[600px]">
            {post.description}
          </p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-[12px] text-text-muted bg-navy/[0.03] px-2.5 py-1 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* FAQ teaser */}
          {firstFaq && (
            <div className="border-t border-border-light/60 pt-5 mt-1">
              <p className="text-[12px] text-text-muted font-medium mb-1.5 tracking-[0.01em]">
                자주 묻는 질문
              </p>
              <p className="text-[14px] text-navy/80 leading-[1.6] line-clamp-2">
                Q. {firstFaq.question}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-3 text-[13px] text-text-muted">
              <span className="font-medium text-text-secondary">
                {post.author.name}
              </span>
              <span className="w-[3px] h-[3px] rounded-full bg-text-muted/40" />
              <span>{post.publishedAt.replace(/-/g, ".")}</span>
            </div>

            {/* Read arrow */}
            <span className="flex items-center gap-1.5 text-[13px] font-medium text-coral opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-0 transition-all duration-300">
              읽기
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  d="M3 8H13M13 8L9 4M13 8L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

/* ─── Regular Card ─── */

function RegularCard({ post }: { post: BlogPostMeta }) {
  const cat = getCategoryStyle(post.category);

  return (
    <a
      href={`/blog/${post.slug}`}
      className="group block bg-card-bg rounded-2xl border border-border-light/60 overflow-hidden hover:shadow-[0_8px_28px_rgba(26,26,46,0.07)] hover:-translate-y-1 transition-all duration-400 shadow-[0_2px_12px_rgba(26,26,46,0.03)]"
    >
      <div className="p-6 md:p-7">
        {/* Category */}
        <span
          className={`inline-block text-[12px] font-semibold ${cat.text} ${cat.bg} px-2.5 py-1 rounded-full mb-4`}
        >
          {post.category}
        </span>

        {/* Title */}
        <h3 className="text-[18px] md:text-[20px] font-bold text-navy leading-[1.4] tracking-[-0.02em] mb-3 group-hover:text-coral transition-colors duration-300">
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-[14px] leading-[1.7] text-text-secondary line-clamp-2 mb-5">
          {post.description}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[13px] text-text-muted">
            <span>{post.publishedAt.replace(/-/g, ".")}</span>
            <span className="w-[3px] h-[3px] rounded-full bg-text-muted/40" />
            <span>{post.readingTime}분 읽기</span>
          </div>

          {/* Arrow on hover */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            className="text-coral opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
          >
            <path
              d="M4 9H14M14 9L10 5M14 9L10 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </a>
  );
}

/* ─── Exported BlogCard ─── */

export function BlogCard({
  post,
  variant = "regular",
}: {
  post: BlogPostMeta;
  variant?: "featured" | "regular";
}) {
  if (variant === "featured" || post.pillar) {
    return <FeaturedCard post={post} />;
  }
  return <RegularCard post={post} />;
}
