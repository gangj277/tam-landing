import type { BlogPostMeta } from "@/lib/blog";

export function BlogCard({ post }: { post: BlogPostMeta }) {
  return (
    <a
      href={`/blog/${post.slug}`}
      className="group block bg-card-bg rounded-2xl border border-border-light/60 overflow-hidden hover:shadow-[0_4px_20px_rgba(26,26,46,0.06)] transition-all duration-300"
    >
      <div className="p-6">
        <span className="inline-block text-[12px] font-medium text-coral bg-coral-light px-2.5 py-1 rounded-full mb-4">
          {post.category}
        </span>
        <h3 className="text-[18px] font-bold text-navy leading-[1.4] tracking-[-0.02em] mb-2.5 group-hover:text-coral transition-colors">
          {post.title}
        </h3>
        <p className="text-[14px] leading-[1.65] text-text-secondary line-clamp-2 mb-4">
          {post.description}
        </p>
        <div className="flex items-center gap-3 text-[13px] text-text-muted">
          <span>{post.publishedAt.replace(/-/g, ".")}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-text-muted/40" />
          <span>{post.readingTime}분 읽기</span>
        </div>
      </div>
    </a>
  );
}
