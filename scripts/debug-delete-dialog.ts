import { chromium } from 'playwright-core';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    storageState: '/Users/gangjimin/Documents/main_dev/startup-ideas/ai-native-app-for-student/output/playwright/naver-blog/naver-auth-state.json',
    viewport: { width: 1440, height: 1400 },
  });
  const page = await context.newPage();
  await page.goto('https://blog.naver.com/PostView.naver?blogId=tam-e&logNo=224241129907', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.locator('a.btn_overflow_menu').click();
  await page.waitForTimeout(500);
  const target = page.locator('a.btn_del._deletePost');
  const box = await target.boundingBox();
  console.log(JSON.stringify(box));
  if (box) {
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  }
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/Users/gangjimin/Documents/main_dev/startup-ideas/ai-native-app-for-student/output/playwright/naver-blog/editorial-relaunch/delete-dialog-visible-3.png', fullPage: true });
  const boxes = {
    confirm: await page.locator('a#sendPostLayerBtn').boundingBox(),
    layer: await page.locator('#sendPostLayer').boundingBox(),
  };
  console.log(JSON.stringify(boxes, null, 2));
  await context.close();
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
