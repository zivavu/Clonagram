import { expect, test } from '@playwright/test';
import { createPostViaUI, deleteTestPostsByCaption, makeServiceClient } from './helpers';

const TEST_CAPTION = `e2e-like-${Date.now()}`;
const TEST_COMMENT = `e2e like comment ${Date.now()}`;

test.afterAll(async () => {
   await deleteTestPostsByCaption('e2e-like-');
});

test('like and unlike a comment on a post', async ({ page }) => {
   await createPostViaUI(page, TEST_CAPTION);

   await page.goto('/');
   await expect(page.getByText(TEST_CAPTION)).toBeVisible({ timeout: 15000 });

   // Open PostViewModal via the Comment button on the specific post card
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

   const supabase = makeServiceClient();
   const { data: comment } = await supabase
      .from('comments')
      .select('id')
      .eq('content', TEST_COMMENT)
      .maybeSingle();
   expect(comment?.id).toBeTruthy();

   async function commentLikeCount() {
      const { count } = await supabase
         .from('comment_likes')
         .select('*', { count: 'exact', head: true })
         .eq('comment_id', comment?.id as string);
      return count ?? 0;
   }

   // Like the comment
   const commentArticle = postDialog.locator('article').filter({ hasText: TEST_COMMENT });
   await commentArticle.getByRole('button', { name: 'Like comment' }).click();

   await expect(postDialog.getByText('1 like')).toBeVisible({ timeout: 5000 });
   await expect.poll(commentLikeCount, { timeout: 5000 }).toBe(1);

   // Unlike the comment
   await commentArticle.getByRole('button', { name: 'Like comment' }).click();

   await expect(postDialog.getByText('1 like')).not.toBeVisible({ timeout: 5000 });
   await expect.poll(commentLikeCount, { timeout: 5000 }).toBe(0);
});
