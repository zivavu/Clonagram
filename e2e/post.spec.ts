import { expect, test } from '@playwright/test';
import {
   createPostViaUI,
   deleteTestPostsByCaption,
   getPostIdByCaption,
   makeServiceClient,
} from './helpers';

const TEST_CAPTION = `e2e-test-post-${Date.now()}`;

test.afterAll(async () => {
   await deleteTestPostsByCaption('e2e-test-post-');
});

test('create a post and verify it appears on profile', async ({ page }) => {
   await createPostViaUI(page, TEST_CAPTION);

   const supabase = makeServiceClient();
   const postId = await getPostIdByCaption(supabase, TEST_CAPTION);
   expect(postId).not.toBeNull();

   await page.goto('/profile/e2euser1');
   const firstPost = page.locator('button:has(img[alt="Post"])').first();
   await expect(firstPost).toBeVisible({ timeout: 10000 });
   await firstPost.click();

   const dialog = page.getByRole('dialog').first();
   await expect(dialog.locator('span').filter({ hasText: TEST_CAPTION }).first()).toBeVisible({
      timeout: 10000,
   });
});
