import { expect, test } from '@playwright/test';
import { createTestImageBuffer, makeServiceClient } from './helpers';

const TEST_CAPTION = `e2e-like-test-${Date.now()}`;

test.afterAll(async () => {
   const supabase = makeServiceClient();
   const { data: users } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
   const user = users.users.find(u => u.email === 'e2e-user-1@example.com');
   if (!user) return;
   await supabase.from('posts').delete().eq('user_id', user.id).like('caption', 'e2e-like-test-%');
});

test('like and unlike a post in the home feed', async ({ page }) => {
   await page.goto('/');

   await page.getByRole('button', { name: 'Create' }).click();
   await page.getByRole('button', { name: 'Post', exact: true }).click();

   const imageBuffer = await createTestImageBuffer(page);
   await page.locator('input[type="file"]').setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: imageBuffer,
   });

   const modal = page.getByRole('dialog');
   await expect(modal.getByRole('button', { name: 'Next', exact: true })).toBeVisible({
      timeout: 10000,
   });
   await modal.getByRole('button', { name: 'Next', exact: true }).click();
   await expect(modal.getByRole('button', { name: 'Next', exact: true })).toBeVisible({
      timeout: 10000,
   });
   await modal.getByRole('button', { name: 'Next', exact: true }).click();
   await expect(modal.getByRole('button', { name: 'Share', exact: true })).toBeVisible({
      timeout: 10000,
   });
   await modal.locator('textarea').fill(TEST_CAPTION);
   await modal.getByRole('button', { name: 'Share', exact: true }).click();
   await expect(modal.getByText('Your post has been shared.')).toBeVisible({ timeout: 30000 });
   await modal.getByRole('button', { name: 'Done' }).click();

   await page.goto('/');
   await expect(page.getByText(TEST_CAPTION)).toBeVisible({ timeout: 15000 });

   const captionEl = page.getByText(TEST_CAPTION, { exact: true });
   const postCard = captionEl.locator('xpath=ancestor::div[.//button[@aria-label="Like"]][1]');
   const likeButton = postCard.getByRole('button', { name: 'Like' });

   await likeButton.click();
   await expect(postCard.getByRole('button', { name: 'Like' }).getByText('1')).toBeVisible({
      timeout: 5000,
   });

   await likeButton.click();
   await expect(postCard.getByRole('button', { name: 'Like' }).getByText('1')).not.toBeVisible({
      timeout: 5000,
   });
});
