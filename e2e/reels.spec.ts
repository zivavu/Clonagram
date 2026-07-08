import { expect, test } from '@playwright/test';
import { deleteTestPostsByCaption, getUserId, makeServiceClient, USER_1_EMAIL } from './helpers';

const CAPTION_A = `e2e-reel-a-${Date.now()}`;
const CAPTION_B = `e2e-reel-b-${Date.now()}`;

test.beforeAll(async () => {
   const supabase = makeServiceClient();
   const userId = await getUserId(supabase, USER_1_EMAIL);
   if (!userId) throw new Error('Missing e2e user 1');

   const { error } = await supabase.from('posts').insert([
      { user_id: userId, type: 'reel', caption: CAPTION_A },
      { user_id: userId, type: 'reel', caption: CAPTION_B },
   ]);
   if (error) throw error;
});

test.afterAll(async () => {
   await deleteTestPostsByCaption('e2e-reel-');
});

test('the reels feed renders seeded reels', async ({ page }) => {
   await page.goto('/reels');

   await expect(page.getByText(CAPTION_A)).toBeVisible({ timeout: 15000 });
   await expect(page.getByText(CAPTION_B)).toBeAttached();
});

test('the next arrow scrolls to the following reel', async ({ page }, testInfo) => {
   test.skip(
      testInfo.project.name === 'mobile-chrome',
      'Nav arrows are hidden below 768px; mobile scrolls by touch',
   );

   await page.goto('/reels');
   await expect(page.getByText(CAPTION_A)).toBeVisible({ timeout: 15000 });

   const scroller = page.locator('div:has(> section)').first();
   expect(await scroller.evaluate(el => el.scrollTop)).toBe(0);

   await page.getByRole('button', { name: 'Next reel' }).click();

   await expect
      .poll(async () => scroller.evaluate(el => el.scrollTop), { timeout: 5000 })
      .toBeGreaterThan(0);
});
