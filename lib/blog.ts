import fs from "fs";
import path from "path";

export interface BlogPostMeta {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  author: { name: string; role: string };
  category: string;
  tags: string[];
  readingTime: number;
  pillar?: boolean;
  relatedSlugs?: string[];
  faq: Array<{ question: string; answer: string }>;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export async function getPostMeta(slug: string): Promise<BlogPostMeta> {
  const mod = await import(`@/content/blog/${slug}.mdx`);
  return mod.metadata as BlogPostMeta;
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const slugs = getAllSlugs();
  const posts = await Promise.all(slugs.map(getPostMeta));
  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
