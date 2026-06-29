import { expect, test } from '@playwright/test';
import { createTestImageBuffer, makeServiceClient } from './helpers';

const TEST_CAPTION = `e2e-test-post-${Date.now()}`;

test.afterAll(async () => {
   const supabase = makeServiceClient();

   const { data: users } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
   const user = users.users.find(u => u.email === 'e2e-user-1@example.com');
   if (!user) return;

   await supabase.from('posts').delete().eq('user_id', user.id).like('caption', 'e2e-test-post-%');
});

test('create a post and verify it appears on profile', async ({ page }) => {
   await page.goto('/');

   await page.getByRole('button', { name: 'Create' }).click();
   await page.getByRole('button', { name: 'Post', exact: true }).click();

   await expect(page.getByText('Create new post')).toBeVisible();

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

   await page.goto('/profile/e2euser1');
   await expect(page.getByText(TEST_CAPTION)).not.toBeVisible();
   const postImages = page.locator('img[alt]').first();
   await expect(postImages).toBeVisible({ timeout: 10000 });
});
