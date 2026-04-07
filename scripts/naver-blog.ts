import fs from "fs/promises";
import { readFileSync } from "node:fs";
import { execFile } from "node:child_process";
import path from "path";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { Writable } from "node:stream";
import { promisify } from "node:util";

import { config as loadDotenv } from "dotenv";
import { chromium, type Locator, type Page } from "playwright-core";

import {
  buildNaverBlogCheckCommand,
  buildNaverBlogKeychainSetCommand,
  buildNaverBlogLoginCommand,
  buildNaverBlogWriteUrl,
  NAVER_BLOG_KEYCHAIN_SERVICE_ID,
  NAVER_BLOG_KEYCHAIN_SERVICE_PASSWORD,
  parseNaverBlogBodyBlocks,
  parseNaverBlogTags,
  type NaverBlogBodyBlock,
  readNaverBlogLoginCredentials,
  type NaverBlogLoginCredentials,
  type NaverBlogVisibility,
} from "../lib/naver-blog-automation";

loadDotenv({ path: ".env.local", quiet: true });
loadDotenv({ quiet: true });

const execFileAsync = promisify(execFile);

type Command =
  | "capture-state"
  | "check-auth"
  | "keychain-clear"
  | "keychain-set"
  | "publish";

type CaptureStateOptions = {
  statePath: string;
  headed: boolean;
};

type PublishOptions = {
  blogId: string;
  statePath: string;
  title: string;
  body: string;
  tags: string[];
  visibility: NaverBlogVisibility;
  publish: boolean;
  headed: boolean;
  keepOpen: boolean;
  restoreDraft: "discard" | "continue";
  screenshotPath?: string;
};

type CheckAuthOptions = {
  blogId: string;
  statePath: string;
  headed: boolean;
};

type KeychainSetOptions = {
  id?: string;
  password?: string;
};

type ResolvedLoginCredentials = {
  credentials: NaverBlogLoginCredentials;
  source: "env" | "keychain";
};

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    printUsage();
    return;
  }

  const command = (args[0] ?? "") as Command;

  if (command === "capture-state") {
    await captureState(parseCaptureStateOptions(args.slice(1)));
    return;
  }

  if (command === "publish") {
    await publishPost(parsePublishOptions(args.slice(1)));
    return;
  }

  if (command === "check-auth") {
    await checkAuth(parseCheckAuthOptions(args.slice(1)));
    return;
  }

  if (command === "keychain-set") {
    await setKeychainCredentials(parseKeychainSetOptions(args.slice(1)));
    return;
  }

  if (command === "keychain-clear") {
    await clearKeychainCredentials();
    return;
  }

  printUsage();
  process.exitCode = 1;
}

function parseCaptureStateOptions(args: string[]): CaptureStateOptions {
  const values = parseFlags(args);
  return {
    statePath: resolvePath(
      values["state-path"] ?? "../output/playwright/naver-blog/naver-auth-state.json",
    ),
    headed: values.headless !== "true",
  };
}

function parsePublishOptions(args: string[]): PublishOptions {
  const values = parseFlags(args);
  const bodyText = readBodyValue(values);
  const tags = parseNaverBlogTags(values.tags);

  return {
    blogId: requiredFlag(values, "blog-id"),
    statePath: resolvePath(
      values["state-path"] ?? "../output/playwright/naver-blog/naver-auth-state.json",
    ),
    title: requiredFlag(values, "title"),
    body: bodyText,
    tags,
    visibility: parseVisibility(values.visibility),
    publish: values.publish === "true",
    headed: values.headed === "true",
    keepOpen: values["keep-open"] === "true",
    restoreDraft: values["restore-draft"] === "continue" ? "continue" : "discard",
    screenshotPath: values["screenshot-path"]
      ? resolvePath(values["screenshot-path"])
      : undefined,
  };
}

function parseCheckAuthOptions(args: string[]): CheckAuthOptions {
  const values = parseFlags(args);
  return {
    blogId: requiredFlag(values, "blog-id"),
    statePath: resolvePath(
      values["state-path"] ?? "../output/playwright/naver-blog/naver-auth-state.json",
    ),
    headed: values.headed === "true",
  };
}

function parseKeychainSetOptions(args: string[]): KeychainSetOptions {
  const values = parseFlags(args);
  return {
    id: values.id?.trim(),
    password: values.password,
  };
}

function parseFlags(args: string[]): Record<string, string> {
  const values: Record<string, string> = {};

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (!token.startsWith("--")) {
      throw new Error(`Unexpected argument: ${token}`);
    }

    const [rawKey, inlineValue] = token.slice(2).split("=", 2);
    if (inlineValue !== undefined) {
      values[rawKey] = inlineValue;
      continue;
    }

    const nextValue = args[index + 1];
    if (!nextValue || nextValue.startsWith("--")) {
      values[rawKey] = "true";
      continue;
    }

    values[rawKey] = nextValue;
    index += 1;
  }

  return values;
}

function requiredFlag(values: Record<string, string>, key: string): string {
  const value = values[key]?.trim();
  if (!value) {
    throw new Error(`--${key} is required`);
  }

  return value;
}

function readBodyValue(values: Record<string, string>): string {
  if (values.body) {
    return values.body;
  }

  if (values["body-file"]) {
    return readFileSync(resolvePath(values["body-file"]), "utf8");
  }

  throw new Error("Either --body or --body-file is required");
}

function parseVisibility(value?: string): NaverBlogVisibility {
  switch (value) {
    case undefined:
    case "public":
      return "public";
    case "neighbors":
    case "mutual-neighbors":
    case "private":
      return value;
    default:
      throw new Error(
        `Unsupported visibility "${value}". Use public, neighbors, mutual-neighbors, or private.`,
      );
  }
}

function resolvePath(filePath: string): string {
  return path.resolve(process.cwd(), filePath);
}

async function captureState(options: CaptureStateOptions) {
  logStep("launch headed browser");
  const browser = await chromium.launch({
    channel: "chrome",
    headless: !options.headed,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
  });

  const page = await context.newPage();
  logStep("open naver login");
  await page.goto(
    "https://nid.naver.com/nidlogin.login?mode=form&url=https://blog.naver.com",
    { waitUntil: "domcontentloaded" },
  );

  console.log("Log in to Naver in the opened browser, then press Enter here to save state.");
  const rl = readline.createInterface({ input, output });
  await rl.question("");
  rl.close();

  await fs.mkdir(path.dirname(options.statePath), { recursive: true });
  logStep("save storage state");
  await context.storageState({ path: options.statePath });
  console.log(`Saved storage state to ${options.statePath}`);

  await context.close();
  await browser.close();
}

async function setKeychainCredentials(options: KeychainSetOptions) {
  const id = options.id || (await promptVisible("Naver login ID: ")).trim();
  if (!id) {
    throw new Error("Login ID is required");
  }

  const password = options.password ?? (await promptHidden("Naver login password: "));
  if (!password.trim()) {
    throw new Error("Login password is required");
  }

  await writeKeychainSecret(NAVER_BLOG_KEYCHAIN_SERVICE_ID, "naver-blog", id);
  await writeKeychainSecret(
    NAVER_BLOG_KEYCHAIN_SERVICE_PASSWORD,
    id,
    password,
  );

  console.log("Saved Naver Blog credentials to macOS Keychain.");
}

async function clearKeychainCredentials() {
  await deleteKeychainSecret(NAVER_BLOG_KEYCHAIN_SERVICE_ID);
  await deleteKeychainSecret(NAVER_BLOG_KEYCHAIN_SERVICE_PASSWORD);
  console.log("Removed Naver Blog credentials from macOS Keychain.");
}

async function publishPost(options: PublishOptions) {
  logStep("launch browser");
  const browser = await chromium.launch({
    channel: "chrome",
    headless: !options.headed,
  });

  const storageStatePath = await getUsableStorageStatePath(options.statePath);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    ...(storageStatePath ? { storageState: storageStatePath } : {}),
  });

  const page = await context.newPage();
  logStep("open editor");
  await page.goto(buildNaverBlogWriteUrl(options.blogId), {
    waitUntil: "domcontentloaded",
  });

  await ensureAuthenticatedPage(
    page,
    options.blogId,
    options.statePath,
    await resolveLoginCredentials(options.blogId),
  );

  logStep("dismiss entry overlays");
  await waitForEditorReady(page, options.restoreDraft, options.blogId, options.statePath);

  logStep("fill title");
  await fillTitle(page, options.title);
  logStep("fill body");
  await fillBody(page, parseNaverBlogBodyBlocks(options.body));

  if (options.publish || options.tags.length > 0 || options.visibility !== "public") {
    logStep("open publish panel");
    await openPublishPanel(page);
    logStep("apply publish settings");
    await applyPublishSettings(page, options.visibility, options.tags);
  }

  if (options.publish) {
    logStep("confirm publish");
    await page.getByRole("button", { name: "발행", exact: true }).nth(1).click();
    await page.waitForTimeout(1500);
  }

  if (options.screenshotPath) {
    await fs.mkdir(path.dirname(options.screenshotPath), { recursive: true });
    logStep("capture screenshot");
    await page.screenshot({
      path: options.screenshotPath,
      fullPage: true,
    });
  }

  if (options.keepOpen) {
    console.log("Leaving browser open. Press Ctrl+C when finished.");
    await new Promise(() => undefined);
  }

  logStep("close browser");
  await context.close();
  await browser.close();
}

async function checkAuth(options: CheckAuthOptions) {
  logStep("launch browser");
  const browser = await chromium.launch({
    channel: "chrome",
    headless: !options.headed,
  });

  const storageStatePath = await getUsableStorageStatePath(options.statePath);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    ...(storageStatePath ? { storageState: storageStatePath } : {}),
  });

  const page = await context.newPage();
  logStep("open editor");
  await page.goto(buildNaverBlogWriteUrl(options.blogId), {
    waitUntil: "domcontentloaded",
  });

  await ensureAuthenticatedPage(
    page,
    options.blogId,
    options.statePath,
    await resolveLoginCredentials(options.blogId),
  );
  await waitForEditorReady(page, "discard", options.blogId, options.statePath);

  console.log(
    `[naver-blog] authentication is valid for ${options.blogId} using ${options.statePath}`,
  );

  await context.close();
  await browser.close();
}

async function dismissHelpOverlay(page: Page) {
  const closeButton = page.getByRole("button", { name: "닫기", exact: true });
  await clickIfVisible(closeButton);
}

async function handleRestoreDraft(
  page: Page,
  restoreDraft: "discard" | "continue",
) {
  const dialogHeading = page.getByText("작성 중인 글이 있습니다.");
  if (!(await isVisible(dialogHeading))) {
    return;
  }

  if (restoreDraft === "continue") {
    await page.getByRole("button", { name: "확인", exact: true }).click();
    return;
  }

  await page.getByRole("button", { name: "취소", exact: true }).click();
}

async function fillTitle(page: Page, title: string) {
  const titleParagraph = page.locator("article p").first();
  await titleParagraph.waitFor({ state: "visible", timeout: 5000 });
  await titleParagraph.click({ timeout: 5000 });
  await page.keyboard.type(title);
}

async function fillBody(page: Page, blocks: NaverBlogBodyBlock[]) {
  if (blocks.length === 0) {
    throw new Error("Body must contain at least one paragraph");
  }

  for (const block of blocks) {
    switch (block.kind) {
      case "paragraph":
        await typeParagraph(page, block.text);
        break;
      case "subtitle":
        await typeSubtitle(page, block.text);
        break;
      case "emphasis":
        await typeEmphasisLine(page, block.text);
        break;
      case "divider":
        await insertDivider(page);
        break;
      case "link":
        await insertLinkedLine(page, block.text, block.url);
        break;
      default:
        throw new Error(`Unsupported body block ${(block as { kind: string }).kind}`);
    }
  }
}

async function openPublishPanel(page: Page) {
  await page.getByRole("button", { name: "발행", exact: true }).first().click();
}

async function focusLastParagraph(page: Page) {
  const paragraph = page.locator("article p").last();
  await paragraph.waitFor({ state: "visible", timeout: 5000 });
  await paragraph.click({ force: true });
  await page.waitForTimeout(120);
}

async function typeParagraph(page: Page, text: string) {
  await focusLastParagraph(page);
  await page.keyboard.type(text);
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(220);
}

async function typeSubtitle(page: Page, text: string) {
  await focusLastParagraph(page);
  await page.keyboard.type(text);
  await page.waitForTimeout(120);
  await page.locator("button.se-text-format-toolbar-button").first().click();
  await page.getByRole("button", { name: "소제목", exact: true }).click();
  await page.waitForTimeout(150);
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(260);
}

async function typeEmphasisLine(page: Page, text: string) {
  await focusLastParagraph(page);
  await page.keyboard.type(text);
  await selectTypedText(page, text);
  await page.locator("button.se-bold-toolbar-button").last().click();
  await page.waitForTimeout(150);
  await page.keyboard.press("ArrowRight");
  await page.locator("button.se-text-format-toolbar-button").first().click();
  await page.getByRole("button", { name: "소제목", exact: true }).click();
  await page.waitForTimeout(150);
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(260);
}

async function insertDivider(page: Page) {
  await focusLastParagraph(page);
  await page.locator("button.se-insert-horizontal-line-default-toolbar-button").click();
  await page.waitForTimeout(240);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(220);
}

async function insertLinkedLine(page: Page, text: string, url: string) {
  await focusLastParagraph(page);
  await page.keyboard.type(text);
  await selectTypedText(page, text);

  const linkButton = page.locator("button.se-link-toolbar-button").last();
  await linkButton.click();

  const urlInput = page.locator("input.se-custom-layer-link-input").last();
  await urlInput.waitFor({ state: "visible", timeout: 5000 });
  await urlInput.fill(url);

  await page.locator("button.se-custom-layer-link-apply-button").last().click();
  await page.waitForTimeout(180);
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(260);
}

async function selectTypedText(page: Page, text: string) {
  const characterCount = Array.from(text).length;
  for (let i = 0; i < characterCount; i += 1) {
    await page.keyboard.press("Shift+ArrowLeft");
  }
  await page.waitForTimeout(120);
}

async function waitForEditorReady(
  page: Page,
  restoreDraft: "discard" | "continue",
  blogId: string,
  statePath: string,
) {
  const articleParagraphs = page.locator("article p");

  for (let attempt = 0; attempt < 20; attempt += 1) {
    await assertAuthenticatedPage(page, blogId, statePath);
    await articleParagraphs.first().waitFor({ state: "visible", timeout: 10000 });

    const restoreVisible = await isVisible(
      page.getByText("작성 중인 글이 있습니다."),
    );
    const closeVisible = await isVisible(
      page.getByRole("button", { name: "닫기", exact: true }),
    );
    const paragraphCount = await articleParagraphs.count();

    if (restoreVisible) {
      await handleRestoreDraft(page, restoreDraft);
      await page.waitForTimeout(400);
      continue;
    }

    if (closeVisible) {
      await dismissHelpOverlay(page);
      await page.waitForTimeout(400);
      continue;
    }

    console.log(
      `[naver-blog] editor paragraphs=${paragraphCount} restore=${restoreVisible} close=${closeVisible}`,
    );

    if (paragraphCount <= 2) {
      return;
    }

    await page.waitForTimeout(400);
  }

  await assertAuthenticatedPage(page, blogId, statePath);
  throw new Error("Editor did not become ready before timeout");
}

async function applyPublishSettings(
  page: Page,
  visibility: NaverBlogVisibility,
  tags: string[],
) {
  if (visibility !== "public") {
    const label = visibilityLabelMap[visibility];
    console.log(`[naver-blog] set visibility=${visibility}`);
    await page.getByText(label, { exact: true }).click({ timeout: 5000 });
  }

  if (tags.length > 0) {
    const tagInput = page.getByRole("combobox", {
      name: /태그 입력 \(최대 30개\)/,
    });

    for (const tag of tags) {
      console.log(`[naver-blog] add tag=${tag}`);
      await tagInput.click();
      await page.keyboard.type(tag);
      await page.keyboard.press("Enter");
    }
  }
}

async function clickIfVisible(locator: Locator): Promise<boolean> {
  if (!(await isVisible(locator))) {
    return false;
  }

  await locator.click();
  return true;
}

async function isVisible(locator: Locator): Promise<boolean> {
  return (await locator.count()) > 0 && (await locator.first().isVisible());
}

const visibilityLabelMap: Record<Exclude<NaverBlogVisibility, "public">, string> = {
  neighbors: "이웃공개",
  "mutual-neighbors": "서로이웃공개",
  private: "비공개",
};

function printUsage() {
  console.log(`Usage:

  npm run naver:blog -- capture-state [--state-path <file>] [--headless]
  npm run naver:blog -- check-auth --blog-id <id> [--state-path <file>] [--headed true]
  npm run naver:blog -- keychain-set [--id <id>] [--password <password>]
  npm run naver:blog -- keychain-clear
  npm run naver:blog -- publish --blog-id <id> --title <title> --body <text>
  npm run naver:blog -- publish --blog-id <id> --title <title> --body-file <file>
    [--state-path <file>]
    [--tags "tag1,tag2"]
    [--visibility public|neighbors|mutual-neighbors|private]
    [--publish true]
    [--headed true]
    [--keep-open true]
    [--restore-draft discard|continue]
    [--screenshot-path <file>]
`);
}

function logStep(message: string) {
  console.log(`[naver-blog] ${message}`);
}

async function assertAuthenticatedPage(
  page: Page,
  blogId: string,
  statePath: string,
) {
  if (await looksLoggedOut(page)) {
    throw new NaverBlogAuthError(buildReauthMessage(blogId, statePath));
  }
}

async function ensureAuthenticatedPage(
  page: Page,
  blogId: string,
  statePath: string,
  resolvedCredentials: ResolvedLoginCredentials | null,
) {
  if (!(await looksLoggedOut(page))) {
    return;
  }

  if (!resolvedCredentials) {
    throw new NaverBlogAuthError(buildReauthMessage(blogId, statePath));
  }

  logStep(
    `session missing or expired, trying ${resolvedCredentials.source} login`,
  );
  await loginWithCredentials(page, blogId, resolvedCredentials.credentials);

  if (await looksLoggedOut(page)) {
    throw new NaverBlogAuthError(
      buildAutoLoginFailedMessage(blogId, statePath, resolvedCredentials.source),
    );
  }

  await saveStorageState(page, statePath);
  logStep("saved refreshed auth state");
}

async function looksLoggedOut(page: Page): Promise<boolean> {
  const url = page.url();
  if (url.includes("nid.naver.com")) {
    return true;
  }

  const title = await page.title();
  if (title.includes("Sign in")) {
    return true;
  }

  return isVisible(page.getByRole("button", { name: /Sign in|로그인/ }));
}

function buildReauthMessage(blogId: string, statePath: string): string {
  const keychainCommand = buildNaverBlogKeychainSetCommand(blogId);
  const loginCommand = buildNaverBlogLoginCommand(statePath);
  const checkCommand = buildNaverBlogCheckCommand(blogId, statePath);

  return [
    "Naver login session is missing or expired.",
    "No automatic login credentials were found.",
    "",
    "Store credentials in macOS Keychain for automatic re-login:",
    `  ${keychainCommand}`,
    "",
    "Re-login:",
    `  ${loginCommand}`,
    "",
    "Verify before retrying publish:",
    `  ${checkCommand}`,
    "",
    "Then rerun your original publish command.",
  ].join("\n");
}

function buildAutoLoginFailedMessage(
  blogId: string,
  statePath: string,
  source: ResolvedLoginCredentials["source"],
): string {
  const loginCommand = buildNaverBlogLoginCommand(statePath);
  const checkCommand = buildNaverBlogCheckCommand(blogId, statePath);
  const sourceLabel = source === "keychain" ? "macOS Keychain" : "env";

  return [
    `Automatic Naver login with ${sourceLabel} credentials did not complete.`,
    "This usually means Naver requested extra verification such as captcha, new-device approval, or another security step.",
    "",
    "Finish login manually:",
    `  ${loginCommand}`,
    "",
    "Verify before retrying publish:",
    `  ${checkCommand}`,
    "",
    "Then rerun your original publish command.",
  ].join("\n");
}

async function loginWithCredentials(
  page: Page,
  blogId: string,
  credentials: NaverBlogLoginCredentials,
) {
  const loginUrl = `https://nid.naver.com/nidlogin.login?mode=form&url=${encodeURIComponent("https://blog.naver.com")}`;
  await page.goto(loginUrl, { waitUntil: "domcontentloaded" });

  const idInput = page
    .locator('input[name="id"], input[autocomplete="username"], input[placeholder*="ID"]')
    .first();
  const passwordInput = page
    .locator('input[name="pw"], input[type="password"]')
    .first();
  const submitButton = page
    .locator('button[type="submit"], button:has-text("Sign in"), button:has-text("로그인")')
    .first();

  await idInput.waitFor({ state: "visible", timeout: 10000 });
  await passwordInput.waitFor({ state: "visible", timeout: 10000 });

  await idInput.fill(credentials.id);
  await passwordInput.fill(credentials.password);
  await submitButton.click({ timeout: 5000 });

  try {
    await page.waitForURL((url) => !url.toString().includes("nid.naver.com"), {
      timeout: 15000,
    });
  } catch {
    return;
  }

  await page.goto(buildNaverBlogWriteUrl(blogId), {
    waitUntil: "domcontentloaded",
  });
}

async function saveStorageState(page: Page, statePath: string) {
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  await page.context().storageState({ path: statePath });
}

async function getUsableStorageStatePath(statePath: string) {
  try {
    await fs.access(statePath);
    return statePath;
  } catch {
    return undefined;
  }
}

async function resolveLoginCredentials(
  blogId: string,
): Promise<ResolvedLoginCredentials | null> {
  const keychainCredentials = await readKeychainCredentials(blogId);
  if (keychainCredentials) {
    return {
      credentials: keychainCredentials,
      source: "keychain",
    };
  }

  const envCredentials = readNaverBlogLoginCredentials(process.env, blogId);
  if (envCredentials) {
    return {
      credentials: envCredentials,
      source: "env",
    };
  }

  return null;
}

async function readKeychainCredentials(
  blogId: string,
): Promise<NaverBlogLoginCredentials | null> {
  const password = await readKeychainSecret(
    NAVER_BLOG_KEYCHAIN_SERVICE_PASSWORD,
  );
  if (!password) {
    return null;
  }

  const id =
    (await readKeychainSecret(NAVER_BLOG_KEYCHAIN_SERVICE_ID))?.trim() ||
    blogId.trim();

  if (!id) {
    return null;
  }

  return {
    id,
    password,
  };
}

async function readKeychainSecret(service: string): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync("security", [
      "find-generic-password",
      "-w",
      "-s",
      service,
    ]);
    const value = stdout.trim();
    return value || null;
  } catch (error) {
    if (isMissingKeychainItem(error)) {
      return null;
    }

    throw error;
  }
}

async function writeKeychainSecret(
  service: string,
  account: string,
  value: string,
) {
  await execFileAsync("security", [
    "add-generic-password",
    "-U",
    "-a",
    account,
    "-s",
    service,
    "-w",
    value,
  ]);
}

async function deleteKeychainSecret(service: string) {
  try {
    await execFileAsync("security", [
      "delete-generic-password",
      "-s",
      service,
    ]);
  } catch (error) {
    if (isMissingKeychainItem(error)) {
      return;
    }

    throw error;
  }
}

function isMissingKeychainItem(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const securityError = error as Error & {
    code?: number;
    stderr?: string;
  };

  return (
    securityError.code === 44 ||
    securityError.stderr?.includes("could not be found") === true
  );
}

async function promptVisible(prompt: string): Promise<string> {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(prompt);
  rl.close();
  return answer.trim();
}

async function promptHidden(prompt: string): Promise<string> {
  let muted = false;
  const mutedOutput = new Writable({
    write(chunk, encoding, callback) {
      if (!muted) {
        output.write(chunk.toString(), encoding as BufferEncoding);
      }
      callback();
    },
  });

  const rl = readline.createInterface({
    input,
    output: mutedOutput,
    terminal: true,
  });

  output.write(prompt);
  muted = true;
  const answer = await rl.question("");
  muted = false;
  rl.close();
  output.write("\n");
  return answer.trim();
}

class NaverBlogAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NaverBlogAuthError";
  }
}

main().catch((error) => {
  if (error instanceof NaverBlogAuthError) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  console.error(error);
  process.exitCode = 1;
});
