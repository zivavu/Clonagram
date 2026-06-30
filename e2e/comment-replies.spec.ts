import { expect, test } from '@playwright/test';
import { createPostViaUI, deleteTestPostsByCaption } from './helpers';

const TEST_CAPTION = `e2e-reply-post-${Date.now()}`;
const TEST_COMMENT = `e2e reply parent ${Date.now()}`;
const TEST_REPLY = `e2e reply child ${Date.now()}`;

test.afterAll(async () => {
   await deleteTestPostsByCaption('e2e-reply-post-');
});

test('reply to a comment on a post', async ({ page }) => {
   await createPostViaUI(page, TEST_CAPTION);

   await page.goto('/');
   await expect(page.getByText(TEST_CAPTION)).toBeVisible({ timeout: 15000 });

   // Open PostViewModal via the Comment button on this specific post card
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

   // Add the parent comment
   await commentInput.click();
   await page.keyboard.type(TEST_COMMENT);
   await postDialog.getByRole('button', { name: 'Post', exact: true }).click();
   await expect(postDialog.getByText(TEST_COMMENT, { exact: true })).toBeVisible({
      timeout: 10000,
   });

   // Click Reply on the parent comment
   const parentArticle = postDialog.locator('article').filter({ hasText: TEST_COMMENT });
   await parentArticle.getByRole('button', { name: 'Reply' }).click();

   // Input is pre-filled with @e2euser1 — type the reply text and submit
   await page.keyboard.type(TEST_REPLY);
   await postDialog.getByRole('button', { name: 'Post', exact: true }).click();

   // Expand replies and verify the reply appears
   await parentArticle.getByRole('button', { name: /view.*repl/i }).click();
   await expect(postDialog.getByText(TEST_REPLY)).toBeVisible({ timeout: 10000 });
});
