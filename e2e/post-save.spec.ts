import { expect, test } from '@playwright/test';
import {
   createPostViaUI,
   deleteTestPostsByCaption,
   getPostIdByCaption,
   getUserId,
   makeServiceClient,
   USER_1_EMAIL,
} from './helpers';

const TEST_CAPTION = `e2e-save-${Date.now()}`;

test.afterAll(async () => {
   await deleteTestPostsByCaption('e2e-save-');
});

test('save and unsave a post', async ({ page }) => {
   await createPostViaUI(page, TEST_CAPTION);

   const supabase = makeServiceClient();
   const userId = await getUserId(supabase, USER_1_EMAIL);
   const postId = await getPostIdByCaption(supabase, TEST_CAPTION);
   expect(postId).not.toBeNull();

   async function saveRowCount() {
      const { count } = await supabase
         .from('saves')
         .select('*', { count: 'exact', head: true })
         .eq('post_id', postId as string)
         .eq('user_id', userId as string);
      return count ?? 0;
   }

   await page.goto('/');
   await expect(page.getByText(TEST_CAPTION)).toBeVisible({ timeout: 15000 });

   const postCard = page
      .locator('div')
      .filter({ has: page.getByLabel('Bookmark') })
      .filter({ hasText: TEST_CAPTION })
      .last();

   await expect(postCard.getByLabel('Bookmark')).toBeVisible({ timeout: 15000 });
   await postCard.getByLabel('Bookmark').click();
   await expect.poll(saveRowCount, { timeout: 5000 }).toBe(1);

   await page.goto('/profile/e2euser1');
   await page.getByRole('button', { name: 'Saved' }).click();
   await expect(page.locator('button:has(img[alt="Post"])')).not.toHaveCount(0, { timeout: 15000 });

   await page.goto('/');
   await expect(page.getByText(TEST_CAPTION)).toBeVisible({ timeout: 20000 });
   const postCardAgain = page
      .locator('div')
      .filter({ has: page.getByLabel('Bookmark') })
      .filter({ hasText: TEST_CAPTION })
      .last();
   await postCardAgain.getByLabel('Bookmark').click();
   await expect.poll(saveRowCount, { timeout: 5000 }).toBe(0);

   await page.goto('/profile/e2euser1');
   await page.getByRole('button', { name: 'Saved' }).click();
   await expect(page.getByText('No saved posts yet')).toBeVisible({ timeout: 15000 });
});
