import type { BlogPostMeta } from "@/lib/blog";
import { BlogCard } from "./BlogCard";

export function RelatedPosts({ posts }: { posts: BlogPostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-14 pt-10 border-t border-border-light">
      <h2 className="text-[20px] font-bold text-navy mb-6 tracking-[-0.02em]">
        함께 읽으면 좋은 글
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
