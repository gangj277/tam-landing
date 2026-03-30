import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/home/", "/mission/", "/profile/", "/parent/", "/login", "/signup"],
      },
      {
        userAgent: "Yeti",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },
    ],
    sitemap: "https://tam.kr/sitemap.xml",
    host: "https://tam.kr",
  };
}
