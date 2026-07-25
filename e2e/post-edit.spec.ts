import { expect, type Page, test } from '@playwright/test';
import { createPostViaUI, deleteTestPostsByCaption } from './helpers';

const ORIGINAL_CAPTION = `e2e-edit-${Date.now()}-orig`;
const UPDATED_CAPTION = `e2e-edit-${Date.now()}-upd`;
const SECOND_ORIGINAL_CAPTION = `e2e-edit-${Date.now()}-orig2`;
const SECOND_UPDATED_CAPTION = `e2e-edit-${Date.now()}-upd2`;

test.afterAll(async () => {
   await deleteTestPostsByCaption('e2e-edit-');
});

async function openEditModal(page: Page, caption: string | RegExp) {
   const postCard = page
      .locator('div')
      .filter({ has: page.getByLabel('Open Actions Modal') })
      .filter({ hasText: caption })
      .last();

   await expect(postCard.getByLabel('Open Actions Modal')).toBeVisible({ timeout: 15000 });
   await postCard.getByLabel('Open Actions Modal').click();

   await expect(page.getByRole('button', { name: 'Edit', exact: true })).toBeVisible({
      timeout: 5000,
   });
   await page.getByRole('button', { name: 'Edit', exact: true }).click();

   const editDialog = page.getByRole('dialog').filter({ hasText: 'Edit info' });
   await expect(editDialog).toBeVisible({ timeout: 5000 });
   return editDialog;
}

test('edit post caption from the home feed', async ({ page }) => {
   await createPostViaUI(page, ORIGINAL_CAPTION);

   await page.goto('/');
   await expect(page.getByText(ORIGINAL_CAPTION)).toBeVisible({ timeout: 15000 });

   const editDialog = await openEditModal(page, ORIGINAL_CAPTION);

   const captionTextarea = editDialog.locator('textarea');
   await expect(captionTextarea).toBeVisible({ timeout: 10000 });
   await captionTextarea.fill(UPDATED_CAPTION);

   await editDialog.getByRole('button', { name: 'Done', exact: true }).click();

   // Navigate to home to force a fresh server render and confirm the update persisted
   await page.goto('/');
   await expect(page.getByText(UPDATED_CAPTION)).toBeVisible({ timeout: 15000 });
   await expect(page.getByText(ORIGINAL_CAPTION)).not.toBeVisible();
});

test('reopening the edit modal shows the freshly saved caption', async ({ page }) => {
   await createPostViaUI(page, SECOND_ORIGINAL_CAPTION);

   await page.goto('/');
   await expect(page.getByText(SECOND_ORIGINAL_CAPTION)).toBeVisible({ timeout: 15000 });

   const editDialog = await openEditModal(page, SECOND_ORIGINAL_CAPTION);
   const captionTextarea = editDialog.locator('textarea');
   await expect(captionTextarea).toBeVisible({ timeout: 10000 });
   await captionTextarea.fill(SECOND_UPDATED_CAPTION);
   await editDialog.getByRole('button', { name: 'Done', exact: true }).click();
   await expect(editDialog).toBeHidden({ timeout: 10000 });

   const reopenedDialog = await openEditModal(
      page,
      new RegExp(`${SECOND_ORIGINAL_CAPTION}|${SECOND_UPDATED_CAPTION}`),
   );
   const reopenedTextarea = reopenedDialog.locator('textarea');
   await expect(reopenedTextarea).toBeVisible({ timeout: 10000 });
   await expect(reopenedTextarea).toHaveValue(SECOND_UPDATED_CAPTION);
});
