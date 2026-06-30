import { expect, test } from '@playwright/test';
import {
   createPostViaUI,
   deleteTestPostsByCaption,
   getPostIdByCaption,
   getUserId,
   makeServiceClient,
   USER_1_EMAIL,
} from './helpers';

const TEST_CAPTION = `e2e-like-test-${Date.now()}`;

test.afterAll(async () => {
   await deleteTestPostsByCaption('e2e-like-test-');
});

test('like and unlike a post in the home feed', async ({ page }) => {
   await createPostViaUI(page, TEST_CAPTION);

   const supabase = makeServiceClient();
   const userId = await getUserId(supabase, USER_1_EMAIL);
   const postId = await getPostIdByCaption(supabase, TEST_CAPTION);
   expect(postId).not.toBeNull();

   async function likeRowCount() {
      const { count } = await supabase
         .from('likes')
         .select('*', { count: 'exact', head: true })
         .eq('post_id', postId as string)
         .eq('user_id', userId as string);
      return count ?? 0;
   }

   await page.goto('/');
   await expect(page.getByText(TEST_CAPTION)).toBeVisible({ timeout: 15000 });

   const captionEl = page.getByText(TEST_CAPTION, { exact: true });
   const postCard = captionEl.locator('xpath=ancestor::div[.//button[@aria-label="Like"]][1]');
   const likeButton = postCard.getByRole('button', { name: 'Like' });

   await likeButton.click();
   await expect(postCard.getByRole('button', { name: 'Like' }).getByText('1')).toBeVisible({
      timeout: 5000,
   });
   await expect.poll(likeRowCount, { timeout: 5000 }).toBe(1);

   await likeButton.click();
   await expect(postCard.getByRole('button', { name: 'Like' }).getByText('1')).not.toBeVisible({
      timeout: 5000,
   });
   await expect.poll(likeRowCount, { timeout: 5000 }).toBe(0);
});
