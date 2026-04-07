# TAM Naver Blog Launch Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up the `tam-e` Naver Blog as a parent-facing TAM editorial surface, then publish three polished launch posts grounded in the app's parent guide and blog content.

**Architecture:** Use the existing Playwright-based Naver uploader and authenticated session to perform all admin and publishing work headlessly. Pair that operational flow with a lightweight editorial system doc so future posts keep the same tone, structure, and visual rules.

**Tech Stack:** Next.js content source, local Markdown docs, Playwright, Naver Blog web editor, macOS Keychain, fal Nano Banana image generation.

---

### Task 1: Source Review And Topic Selection

**Files:**
- Read: `app/(blog)/guide/page.tsx`
- Read: `app/(blog)/guide/ai-era-career/page.tsx`
- Read: `app/(blog)/guide/elementary-career-exploration/page.tsx`
- Read: `app/(blog)/guide/gogyohakjeomje/page.tsx`
- Read: `app/(blog)/guide/jayuhakgije/page.tsx`
- Read: `content/blog/ai-era-child-self-understanding.mdx`
- Read: `content/blog/experience-based-self-discovery.mdx`
- Read: `content/blog/gogyohakjeomje-self-understanding.mdx`

**Step 1: Re-read the parent-facing source material**

Run: `sed -n '1,220p' <file>`
Expected: the recurring TAM message is clear enough to define three launch topics.

**Step 2: Lock the launch topics**

- `AI 시대, 우리 아이에게 진짜 남는 역량은 무엇인가`
- `초등 고학년 진로탐색, 결정보다 탐색이 먼저인 이유`
- `고교학점제 시대, 과목 선택 전에 부모가 먼저 준비해야 할 기준`

**Step 3: Define per-post proof points**

- WEF future skills and self-awareness
- 초등 고학년 탐색 통계와 경험 기반 자기이해
- 고교학점제, 자유학기제 축소, 과목 선택의 기준 부재

### Task 2: Blog Brand Setup

**Files:**
- Create: `docs/NAVER_BLOG_EDITORIAL_SYSTEM.md`

**Step 1: Define the blog brand system**

Include:
- blog name
- nickname
- intro copy
- category structure
- visual direction
- home layout rules

**Step 2: Apply the brand system in Naver admin**

Use Playwright headlessly to:
- switch skin
- update blog name, nickname, intro
- choose main subject
- prune top menu
- refine layout widgets
- create categories

**Step 3: Verify public desktop and mobile**

Capture screenshots and confirm the home now reads like an editorial education blog rather than a default empty template.

### Task 3: Visual Asset Generation

**Files:**
- Output: `output/imagegen/tam-naver-blog/`

**Step 1: Generate a cover image**

Target: calm, editorial, parent-facing mobile header image with restrained typography-free composition.

**Step 2: Generate a profile image**

Target: simple branded mark or warm abstract symbol that works at small size.

**Step 3: Generate three post hero images**

One image per post, each aligned to its theme and with realistic, premium tone.

### Task 4: Editorial Templates

**Files:**
- Modify: `docs/NAVER_BLOG_EDITORIAL_SYSTEM.md`

**Step 1: Define the reusable post skeleton**

Include:
- search-first title formula
- opening hook
- 3 to 5 section flow
- quote/divider/image placement rules
- closing CTA block
- tag patterns

**Step 2: Define formatting rules**

Include:
- when to use subtitle paragraphs
- when to use bold emphasis
- when to enlarge text
- when to insert quotes, links, and dividers

### Task 5: Post Drafting

**Files:**
- Output: `output/naver-blog/drafts/`

**Step 1: Draft each article in full**

Write rich, parent-facing articles grounded in TAM source content and tailored to Naver blog reading habits.

**Step 2: Add post-specific assets and metadata**

For each draft, prepare:
- title
- body
- tags
- internal TAM links
- selected images

### Task 6: Rich Publish Flow

**Files:**
- Use: existing Playwright/Naver tooling

**Step 1: Validate editor selectors**

Run the probe if selectors look stale or a toolbar path fails.

**Step 2: Publish each post with rich formatting**

For each post:
- title
- intro
- subtitles
- bold emphasis
- enlarged key phrases
- images
- quote or divider where it improves rhythm
- link back to TAM guide or TAM blog page

**Step 3: Capture proof**

Store:
- before-publish screenshots
- after-publish screenshots
- final URLs

### Task 7: Final Verification

**Files:**
- Output: `output/playwright/naver-blog/launch-*`

**Step 1: Open each live URL**

Expected: post renders with images, spacing, and formatting intact.

**Step 2: Review home page composition**

Expected: the blog home shows a coherent first set of three posts and a usable category structure.

**Step 3: Record the operating notes**

Update `docs/NAVER_BLOG_EDITORIAL_SYSTEM.md` with anything learned from the live publish run.
