import { expect, test } from '@playwright/test';
import {
   createPostViaUI,
   deleteTestPostsByCaption,
   getPostIdByCaption,
   makeServiceClient,
} from './helpers';

const TEST_CAPTION = `e2e-authz-${Date.now()}`;
let postId: string | null = null;

test.beforeAll(async ({ browser }) => {
   const ctx = await browser.newContext({ storageState: 'playwright/.auth/user1.json' });
   const page = await ctx.newPage();
   await createPostViaUI(page, TEST_CAPTION);
   await ctx.close();

   const supabase = makeServiceClient();
   postId = await getPostIdByCaption(supabase, TEST_CAPTION);
});

test.afterAll(async () => {
   await deleteTestPostsByCaption('e2e-authz-');
});

test('a user cannot delete another user post', async ({ browser }) => {
   expect(postId).not.toBeNull();

   const ctx = await browser.newContext({ storageState: 'playwright/.auth/user2.json' });
   const page = await ctx.newPage();

   await page.goto(`/profile/e2euser1/${postId}`);

   const dialog = page.getByRole('dialog').first();
   await expect(dialog.getByText(TEST_CAPTION)).toBeVisible({ timeout: 15000 });

   await dialog.getByRole('button', { name: 'Post owner actions' }).click();
   await page.getByRole('button', { name: 'Delete', exact: true }).click();

   const confirm = page.getByRole('dialog').filter({ hasText: 'Delete post?' });
   await expect(confirm).toBeVisible({ timeout: 5000 });
   await confirm.getByRole('button', { name: 'Delete', exact: true }).click();

   // Wait for the delete attempt to settle, then confirm RLS preserved the post.
   await expect(confirm).not.toBeVisible({ timeout: 10000 });

   const supabase = makeServiceClient();
   const stillExists = await getPostIdByCaption(supabase, TEST_CAPTION);
   expect(stillExists).toBe(postId);

   await ctx.close();
});
