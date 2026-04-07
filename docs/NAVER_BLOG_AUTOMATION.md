# Naver Blog Automation

## Recommended auth model

- Store the Naver login ID and password in macOS Keychain.
- `check-auth` and `publish` first reuse the saved browser session.
- If the session is missing or expired, they try Keychain-based login automatically.
- If Naver asks for captcha or extra device verification, the script prints the exact manual login command to run next.
- Runtime env credentials are still supported as a fallback, but Keychain is the preferred path.

## One-time Keychain setup

```bash
npm run naver:blog:keychain:set -- --id gangj277
```

- The command prompts for the password without echoing it in the terminal.
- The credentials are stored in macOS Keychain under the local machine account.

## One-time manual login

```bash
npm run naver:blog:login
```

- A real Naver login window opens.
- Log in yourself.
- Return to the terminal and press `Enter`.
- The session is saved to `output/playwright/naver-blog/naver-auth-state.json`.

## Check whether auth still works

```bash
npm run naver:blog:check -- --blog-id gangj277
```

- If the saved session is valid, the command exits successfully.
- If the session expired, it tries automatic login from Keychain.
- If that is blocked, it prints the manual login and follow-up check commands.

## Dry-run a post

```bash
npm run naver:blog -- publish \
  --blog-id gangj277 \
  --title "테스트 제목" \
  --body $'첫 문단입니다.\n\n둘째 문단입니다.' \
  --tags "네이버블로그,자동화" \
  --screenshot-path ../output/playwright/naver-blog/dry-run.png
```

## Final publish

```bash
npm run naver:blog -- publish \
  --blog-id gangj277 \
  --title "실제 발행 제목" \
  --body-file ./post.txt \
  --tags "네이버블로그,자동화" \
  --publish true
```

## Manual recovery path

1. Run `npm run naver:blog:login`
2. Log in in the opened browser
3. Press `Enter` in the terminal
4. Run `npm run naver:blog:check -- --blog-id gangj277`
5. Retry the original publish command

## Clearing stored credentials

```bash
npm run naver:blog:keychain:clear
```
