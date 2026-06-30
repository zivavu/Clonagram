import { expect, test } from '@playwright/test';
import { createPostViaUI, deleteTestPostsByCaption } from './helpers';

const TEST_CAPTION = `e2e-delete-test-${Date.now()}`;

test.afterAll(async () => {
   await deleteTestPostsByCaption('e2e-delete-test-');
});

test('delete a post from the home feed', async ({ page }) => {
   await createPostViaUI(page, TEST_CAPTION);

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
