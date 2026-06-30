import { expect, test } from '@playwright/test';
import { createPostViaUI, deleteTestPostsByCaption } from './helpers';

const TEST_CAPTION = `e2e-comment-test-${Date.now()}`;
const TEST_COMMENT = `e2e comment text ${Date.now()}`;

test.afterAll(async () => {
   await deleteTestPostsByCaption('e2e-comment-test-');
});

test('add and delete a comment on a post', async ({ page }) => {
   await createPostViaUI(page, TEST_CAPTION);

   await page.goto('/');
   await expect(page.getByText(TEST_CAPTION)).toBeVisible({ timeout: 15000 });

   // Open PostViewModal for this specific post via its Comment button
   const postCard = page
      .locator('div')
      .filter({ has: page.getByLabel('Comment') })
      .filter({ hasText: TEST_CAPTION })
      .last();

   await expect(postCard.getByLabel('Comment')).toBeVisible({ timeout: 15000 });
   await postCard.getByLabel('Comment').click();

   const postDialog = page.getByRole('dialog').first();
   const commentInput = postDialog.locator('[contenteditable]');
   await expect(commentInput).toBeVisible({ timeout: 10000 });

   await commentInput.click();
   await page.keyboard.type(TEST_COMMENT);
   await postDialog.getByRole('button', { name: 'Post', exact: true }).click();

   await expect(postDialog.getByText(TEST_COMMENT, { exact: true })).toBeVisible({
      timeout: 10000,
   });

   await postDialog.getByText(TEST_COMMENT, { exact: true }).hover();
   await postDialog.getByLabel('Comment options').click();

   const deleteConfirmDialog = page.getByRole('dialog').filter({ hasText: 'Delete comment?' });
   await expect(deleteConfirmDialog).toBeVisible({ timeout: 5000 });
   await deleteConfirmDialog.getByRole('button', { name: 'Delete', exact: true }).click();

   await expect(postDialog.getByText(TEST_COMMENT, { exact: true })).not.toBeVisible({
      timeout: 5000,
   });
});
