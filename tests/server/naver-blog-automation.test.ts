import { describe, expect, it } from "vitest";

import {
  buildNaverBlogCheckCommand,
  buildNaverBlogKeychainSetCommand,
  buildNaverBlogLoginCommand,
  buildNaverBlogWriteUrl,
  DEFAULT_NAVER_AUTH_STATE_PATH_SUFFIX,
  NAVER_BLOG_KEYCHAIN_SERVICE_ID,
  NAVER_BLOG_KEYCHAIN_SERVICE_PASSWORD,
  normalizeNaverBlogBody,
  parseNaverBlogTags,
  readNaverBlogLoginCredentials,
} from "@/lib/naver-blog-automation";

describe("naver blog automation helpers", () => {
  it("builds the direct editor url from a blog id", () => {
    expect(buildNaverBlogWriteUrl("gangj277")).toBe(
      "https://blog.naver.com/PostWriteForm.naver?blogId=gangj277",
    );
  });

  it("splits body text into editor-friendly paragraphs", () => {
    expect(
      normalizeNaverBlogBody(`
        첫 문단입니다.

        둘째 문단입니다.
        줄바꿈은 유지합니다.


        셋째 문단입니다.
      `),
    ).toEqual([
      "첫 문단입니다.",
      "둘째 문단입니다.\n줄바꿈은 유지합니다.",
      "셋째 문단입니다.",
    ]);
  });

  it("normalizes tag input by trimming, removing #, and deduplicating", () => {
    expect(
      parseNaverBlogTags(" #첫글, 네이버자동화, #첫글,  playwright  , "),
    ).toEqual(["첫글", "네이버자동화", "playwright"]);
  });

  it("returns the short login command for the default auth state path", () => {
    expect(
      buildNaverBlogLoginCommand(
        `/tmp/project/${DEFAULT_NAVER_AUTH_STATE_PATH_SUFFIX}`,
      ),
    ).toBe("npm run naver:blog:login");
  });

  it("returns an explicit login command for a custom auth state path", () => {
    expect(buildNaverBlogLoginCommand("/tmp/custom/naver.json")).toBe(
      "npm run naver:blog -- capture-state --state-path '/tmp/custom/naver.json'",
    );
  });

  it("builds a quick auth-check command", () => {
    expect(
      buildNaverBlogCheckCommand(
        "gangj277",
        `/tmp/project/${DEFAULT_NAVER_AUTH_STATE_PATH_SUFFIX}`,
      ),
    ).toBe("npm run naver:blog:check -- --blog-id gangj277");
  });

  it("prefers explicit login env vars for automatic login", () => {
    expect(
      readNaverBlogLoginCredentials(
        {
          NAVER_BLOG_LOGIN_ID: "blog-login",
          NAVER_BLOG_LOGIN_PASSWORD: "secret",
          NAVER_ID: "fallback-id",
          NAVER_PASSWORD: "fallback-password",
        },
        "gangj277",
      ),
    ).toEqual({
      id: "blog-login",
      password: "secret",
    });
  });

  it("falls back to NAVER_ID and NAVER_PASSWORD", () => {
    expect(
      readNaverBlogLoginCredentials(
        {
          NAVER_ID: "fallback-id",
          NAVER_PASSWORD: "fallback-password",
        },
        "gangj277",
      ),
    ).toEqual({
      id: "fallback-id",
      password: "fallback-password",
    });
  });

  it("uses the blog id as login id when only the password is configured", () => {
    expect(
      readNaverBlogLoginCredentials(
        {
          NAVER_BLOG_LOGIN_PASSWORD: "secret",
        },
        "gangj277",
      ),
    ).toEqual({
      id: "gangj277",
      password: "secret",
    });
  });

  it("returns null when no password is configured", () => {
    expect(readNaverBlogLoginCredentials({}, "gangj277")).toBeNull();
  });

  it("exposes stable macOS keychain service names", () => {
    expect(NAVER_BLOG_KEYCHAIN_SERVICE_ID).toBe("codex.naver-blog.login-id");
    expect(NAVER_BLOG_KEYCHAIN_SERVICE_PASSWORD).toBe(
      "codex.naver-blog.login-password",
    );
  });

  it("builds a short keychain setup command", () => {
    expect(buildNaverBlogKeychainSetCommand("gangj277")).toBe(
      "npm run naver:blog:keychain:set -- --id gangj277",
    );
  });
});
