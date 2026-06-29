import { expect, test } from '@playwright/test';
import { createTestImageBuffer, makeServiceClient } from './helpers';

const TEST_CAPTION = `e2e-reply-post-${Date.now()}`;
const TEST_COMMENT = `e2e reply parent ${Date.now()}`;
const TEST_REPLY = `e2e reply child ${Date.now()}`;

test.afterAll(async () => {
   const supabase = makeServiceClient();
   const { data: users } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
   const user = users.users.find(u => u.email === 'e2e-user-1@example.com');
   if (!user) return;
   await supabase.from('posts').delete().eq('user_id', user.id).like('caption', 'e2e-reply-post-%');
});

test('reply to a comment on a post', async ({ page }) => {
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
