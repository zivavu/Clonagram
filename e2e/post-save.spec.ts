import { expect, test } from '@playwright/test';
import { createTestImageBuffer, makeServiceClient } from './helpers';

const TEST_CAPTION = `e2e-save-${Date.now()}`;

test.afterAll(async () => {
   const supabase = makeServiceClient();
   const { data: users } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
   const user = users.users.find(u => u.email === 'e2e-user-1@example.com');
   if (!user) return;
   await supabase.from('posts').delete().eq('user_id', user.id).like('caption', 'e2e-save-%');
});

test('save and unsave a post', async ({ page }) => {
   await page.goto('/');
   await page.getByRole('button', { name: 'Create' }).click();
   await page.getByRole('button', { name: 'Post', exact: true }).click();

   const imageBuffer = await createTestImageBuffer(page);
   await page.locator('input[type="file"]').setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer: imageBuffer,
   });

   const createModal = page.getByRole('dialog');
   await expect(createModal.getByRole('button', { name: 'Next', exact: true })).toBeVisible({
      timeout: 10000,
   });
   await createModal.getByRole('button', { name: 'Next', exact: true }).click();
   await expect(createModal.getByRole('button', { name: 'Next', exact: true })).toBeVisible({
      timeout: 10000,
   });
   await createModal.getByRole('button', { name: 'Next', exact: true }).click();
   await expect(createModal.getByRole('button', { name: 'Share', exact: true })).toBeVisible({
      timeout: 10000,
   });
   await createModal.locator('textarea').fill(TEST_CAPTION);
   await createModal.getByRole('button', { name: 'Share', exact: true }).click();
   await expect(createModal.getByText('Your post has been shared.')).toBeVisible({
      timeout: 30000,
   });
   await createModal.getByRole('button', { name: 'Done' }).click();

   await page.goto('/');
   await expect(page.getByText(TEST_CAPTION)).toBeVisible({ timeout: 15000 });

   const postCard = page
      .locator('div')
      .filter({ has: page.getByLabel('Bookmark') })
      .filter({ hasText: TEST_CAPTION })
      .last();

   await expect(postCard.getByLabel('Bookmark')).toBeVisible({ timeout: 15000 });
   await postCard.getByLabel('Bookmark').click();
   await page.waitForLoadState('networkidle');

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
   await page.waitForLoadState('networkidle');

   await page.goto('/profile/e2euser1');
   await page.getByRole('button', { name: 'Saved' }).click();
   await expect(page.getByText('No saved posts yet')).toBeVisible({ timeout: 15000 });
});
