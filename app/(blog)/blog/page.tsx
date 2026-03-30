import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";

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
    canonical: "https://tam.kr/blog",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-16 md:py-24">
      {/* Hero */}
      <div className="text-center mb-14">
        <span className="inline-block text-[12px] font-medium text-coral bg-coral-light px-3 py-1 rounded-full mb-5">
          TAM 블로그
        </span>
        <h1 className="text-[28px] md:text-[40px] font-bold tracking-[-0.03em] text-navy leading-[1.25] mb-4">
          AI 시대, 우리 아이의 성장을 함께 고민합니다
        </h1>
        <p className="text-[16px] md:text-[18px] leading-[1.6] text-text-secondary max-w-xl mx-auto">
          고교학점제, 자기이해, AI 리터러시. 부모가 알아야 할 이야기를 담습니다.
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <p className="text-center text-text-muted text-[15px]">
          아직 글이 없습니다. 곧 첫 번째 글이 올라옵니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
