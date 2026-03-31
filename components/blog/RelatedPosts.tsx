import type { BlogPostMeta } from "@/lib/blog";
import { BlogCard } from "./BlogCard";

export function RelatedPosts({ posts }: { posts: BlogPostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-14 pt-10 border-t border-border-light">
      {/* Section label in landing page style */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-[1px] w-8 bg-coral/40" />
        <h2 className="text-[13px] font-semibold text-text-muted uppercase tracking-[0.06em]">
          함께 읽으면 좋은 글
        </h2>
        <div className="h-[1px] w-8 bg-coral/40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {posts.map((post, i) => (
          <div
            key={post.slug}
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${i * 120}ms`, animationFillMode: "forwards" }}
          >
            <BlogCard post={post} variant="regular" />
          </div>
        ))}
      </div>
    </section>
  );
}
