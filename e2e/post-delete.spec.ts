import { expect, test } from '@playwright/test';
import { createTestImageBuffer, makeServiceClient } from './helpers';

const TEST_CAPTION = `e2e-delete-test-${Date.now()}`;

test.afterAll(async () => {
   const supabase = makeServiceClient();
   const { data: users } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
   const user = users.users.find(u => u.email === 'e2e-user-1@example.com');
   if (!user) return;
   await supabase
      .from('posts')
      .delete()
      .eq('user_id', user.id)
      .like('caption', 'e2e-delete-test-%');
});

test('delete a post from the home feed', async ({ page }) => {
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
   await expect(page.getByText(TEST_CAPTION)).toBeVisible({ timeout: 20000 });

   const postCard = page
      .locator('div')
      .filter({ has: page.getByLabel('Open Actions Modal') })
      .filter({ hasText: TEST_CAPTION })
      .last();

   await expect(postCard.getByLabel('Open Actions Modal')).toBeVisible({ timeout: 15000 });
   await postCard.getByLabel('Open Actions Modal').click();

   await expect(page.getByRole('button', { name: 'Edit', exact: true })).toBeVisible({
      timeout: 5000,
   });
   await page.getByRole('button', { name: 'Delete', exact: true }).click();

   const deleteConfirmDialog = page.getByRole('dialog').filter({ hasText: 'Delete post?' });
   await expect(deleteConfirmDialog).toBeVisible({ timeout: 5000 });
   await deleteConfirmDialog.getByRole('button', { name: 'Delete', exact: true }).click();

   await expect(page.getByText(TEST_CAPTION)).not.toBeVisible({ timeout: 20000 });
});
