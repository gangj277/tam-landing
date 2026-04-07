export type NaverBlogVisibility =
  | "public"
  | "neighbors"
  | "mutual-neighbors"
  | "private";

export type NaverBlogLoginCredentials = {
  id: string;
  password: string;
};

export type NaverBlogBodyBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "subtitle"; text: string }
  | { kind: "emphasis"; text: string }
  | { kind: "divider" }
  | { kind: "link"; text: string; url: string };

export const DEFAULT_NAVER_AUTH_STATE_PATH_SUFFIX =
  "output/playwright/naver-blog/naver-auth-state.json";
export const NAVER_BLOG_KEYCHAIN_SERVICE_ID =
  "codex.naver-blog.login-id";
export const NAVER_BLOG_KEYCHAIN_SERVICE_PASSWORD =
  "codex.naver-blog.login-password";

export function buildNaverBlogWriteUrl(blogId: string): string {
  const normalizedBlogId = blogId.trim();
  if (!normalizedBlogId) {
    throw new Error("blogId is required");
  }

  return `https://blog.naver.com/PostWriteForm.naver?blogId=${encodeURIComponent(normalizedBlogId)}`;
}

export function normalizeNaverBlogBody(body: string): string[] {
  return body
    .trim()
    .split(/\n\s*\n/g)
    .map((paragraph) =>
      paragraph
        .split("\n")
        .map((line) => line.trim())
        .join("\n")
        .trim(),
    )
    .filter(Boolean);
}

export function parseNaverBlogBodyBlocks(body: string): NaverBlogBodyBlock[] {
  return normalizeNaverBlogBody(body).map((paragraph) => {
    const subtitleMatch = paragraph.match(/^\[\[SUBTITLE:([\s\S]+)\]\]$/);
    if (subtitleMatch) {
      return {
        kind: "subtitle",
        text: subtitleMatch[1].trim(),
      };
    }

    const emphasisMatch = paragraph.match(/^\[\[EMPHASIS:([\s\S]+)\]\]$/);
    if (emphasisMatch) {
      return {
        kind: "emphasis",
        text: emphasisMatch[1].trim(),
      };
    }

    if (paragraph.trim() === "[[DIVIDER]]") {
      return {
        kind: "divider",
      };
    }

    const linkMatch = paragraph.match(/^\[\[LINK:([^|\]]+)\|([\s\S]+)\]\]$/);
    if (linkMatch) {
      return {
        kind: "link",
        text: linkMatch[1].trim(),
        url: linkMatch[2].trim(),
      };
    }

    return {
      kind: "paragraph",
      text: paragraph,
    };
  });
}

export function parseNaverBlogTags(input?: string): string[] {
  if (!input) {
    return [];
  }

  const seen = new Set<string>();
  const tags: string[] = [];

  for (const rawTag of input.split(",")) {
    const normalizedTag = rawTag.trim().replace(/^#+/, "");
    if (!normalizedTag || seen.has(normalizedTag)) {
      continue;
    }

    seen.add(normalizedTag);
    tags.push(normalizedTag);
  }

  return tags;
}

export function buildNaverBlogLoginCommand(statePath: string): string {
  if (usesDefaultNaverAuthStatePath(statePath)) {
    return "npm run naver:blog:login";
  }

  return `npm run naver:blog -- capture-state --state-path ${quoteShellValue(statePath)}`;
}

export function buildNaverBlogCheckCommand(
  blogId: string,
  statePath: string,
): string {
  if (usesDefaultNaverAuthStatePath(statePath)) {
    return `npm run naver:blog:check -- --blog-id ${blogId}`;
  }

  return `npm run naver:blog -- check-auth --blog-id ${blogId} --state-path ${quoteShellValue(statePath)}`;
}

export function buildNaverBlogKeychainSetCommand(blogId: string): string {
  return `npm run naver:blog:keychain:set -- --id ${blogId}`;
}

export function readNaverBlogLoginCredentials(
  env: Record<string, string | undefined>,
  blogId: string,
): NaverBlogLoginCredentials | null {
  const password =
    env.NAVER_BLOG_LOGIN_PASSWORD?.trim() || env.NAVER_PASSWORD?.trim();

  if (!password) {
    return null;
  }

  const id =
    env.NAVER_BLOG_LOGIN_ID?.trim() ||
    env.NAVER_ID?.trim() ||
    blogId.trim();

  if (!id) {
    return null;
  }

  return {
    id,
    password,
  };
}

function usesDefaultNaverAuthStatePath(statePath: string): boolean {
  const normalizedPath = statePath.replaceAll("\\", "/");
  return normalizedPath.endsWith(`/${DEFAULT_NAVER_AUTH_STATE_PATH_SUFFIX}`);
}

function quoteShellValue(value: string): string {
  return `'${value.replaceAll("'", `'\"'\"'`)}'`;
}
