import { chromium } from "playwright-core";

const BLOG_ID = "tam-e";
const STATE_PATH =
  "/Users/gangjimin/Documents/main_dev/startup-ideas/ai-native-app-for-student/output/playwright/naver-blog/naver-auth-state.json";

const LOG_NOS = (process.env.LOG_NOS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

async function main() {
  if (LOG_NOS.length === 0) {
    throw new Error(
      "LOG_NOS env is required. Example: LOG_NOS=123,456 npx tsx scripts/delete-tam-posts.ts",
    );
  }

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });

  const context = await browser.newContext({
    storageState: STATE_PATH,
    viewport: { width: 1440, height: 1400 },
  });

  const page = await context.newPage();

  for (const logNo of LOG_NOS) {
    await page.goto(
      `https://blog.naver.com/PostView.naver?blogId=${BLOG_ID}&logNo=${logNo}`,
      { waitUntil: "domcontentloaded" },
    );
    await page.waitForTimeout(1800);
    const deleted = await page.evaluate(() => {
      const baseInfo = (window as typeof window & {
        aPostBaseInfo?: Array<string | null>;
        postView?: {
          realDeletePost: (sourceCode: string, logNo: string, currentPage: string) => void;
        };
      }).aPostBaseInfo?.[1];

      if (!baseInfo || !(window as typeof window & { postView?: unknown }).postView) {
        return false;
      }

      const [postLogNo, sourceCode, , currentPage] = baseInfo.split("|");
      (window as typeof window & {
        postView: {
          realDeletePost: (sourceCode: string, logNo: string, currentPage: string) => void;
        };
      }).postView.realDeletePost(sourceCode, postLogNo, currentPage);
      return true;
    });

    if (!deleted) {
      continue;
    }

    await page.waitForURL(/PostList\.naver/, { timeout: 15000 });
    await page.waitForTimeout(1200);
  }

  await context.close();
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
