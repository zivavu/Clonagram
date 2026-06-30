import { expect, test } from '@playwright/test';
import { createPostViaUI, deleteTestPostsByCaption } from './helpers';

const ORIGINAL_CAPTION = `e2e-edit-${Date.now()}-orig`;
const UPDATED_CAPTION = `e2e-edit-${Date.now()}-upd`;

test.afterAll(async () => {
   await deleteTestPostsByCaption('e2e-edit-');
});

test('edit post caption from the home feed', async ({ page }) => {
   await createPostViaUI(page, ORIGINAL_CAPTION);

   await page.goto('/');
   await expect(page.getByText(ORIGINAL_CAPTION)).toBeVisible({ timeout: 15000 });

   const postCard = page
      .locator('div')
      .filter({ has: page.getByLabel('Open Actions Modal') })
      .filter({ hasText: ORIGINAL_CAPTION })
      .last();

   await expect(postCard.getByLabel('Open Actions Modal')).toBeVisible({ timeout: 15000 });
   await postCard.getByLabel('Open Actions Modal').click();

   await expect(page.getByRole('button', { name: 'Edit', exact: true })).toBeVisible({
      timeout: 5000,
   });
   await page.getByRole('button', { name: 'Edit', exact: true }).click();

   const editDialog = page.getByRole('dialog').filter({ hasText: 'Edit info' });
   await expect(editDialog).toBeVisible({ timeout: 5000 });

   const captionTextarea = editDialog.locator('textarea');
   await expect(captionTextarea).toBeVisible({ timeout: 10000 });
   await captionTextarea.fill(UPDATED_CAPTION);

   await editDialog.getByRole('button', { name: 'Done', exact: true }).click();

   // Navigate to home to force a fresh server render and confirm the update persisted
   await page.goto('/');
   await expect(page.getByText(UPDATED_CAPTION)).toBeVisible({ timeout: 15000 });
   await expect(page.getByText(ORIGINAL_CAPTION)).not.toBeVisible();
});
