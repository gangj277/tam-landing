import type { BlogPostMeta } from "@/lib/blog";
import { ShareButtons } from "./ShareButtons";

export function BlogHeader({ post }: { post: BlogPostMeta }) {
  return (
    <header className="mb-10">
      {/* Category pill */}
      <span className="inline-block text-[12px] font-semibold text-coral bg-coral-light px-3 py-1 rounded-full mb-5">
        {post.category}
      </span>

      {/* Title */}
      <h1 className="text-[28px] md:text-[40px] font-bold tracking-[-0.03em] text-navy leading-[1.25] mb-4">
        {post.title}
      </h1>

      {/* Description */}
      <p className="text-[16px] md:text-[18px] leading-[1.6] text-text-secondary mb-6">
        {post.description}
      </p>

      {/* Meta row: author, date, reading time, share */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3 text-[13px] text-text-muted">
          <span className="font-medium text-text-secondary">
            {post.author.name}
          </span>
          <span className="w-[3px] h-[3px] rounded-full bg-text-muted/40" />
          <span>{post.publishedAt.replace(/-/g, ".")}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-text-muted/40" />
          <span>{post.readingTime}분 읽기</span>
        </div>

        <ShareButtons title={post.title} slug={post.slug} />
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[12px] text-text-muted bg-navy/[0.04] px-3 py-1.5 rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
