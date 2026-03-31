import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const blogEntries = posts.map((post) => ({
    url: `https://tam.kr/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://tam.kr",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://tam.kr/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://tam.kr/guide",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://tam.kr/guide/gogyohakjeomje",
      lastModified: new Date("2026-03-31"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://tam.kr/guide/jayuhakgije",
      lastModified: new Date("2026-03-31"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://tam.kr/guide/ai-era-career",
      lastModified: new Date("2026-03-31"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://tam.kr/guide/elementary-career-exploration",
      lastModified: new Date("2026-03-31"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...blogEntries,
  ];
}
