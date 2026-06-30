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

   // The owner-actions button must not be offered to a non-owner...
   await expect(dialog.getByRole('button', { name: 'Post owner actions' })).toHaveCount(0);

   // ...and RLS must keep the post intact regardless.
   const supabase = makeServiceClient();
   const stillExists = await getPostIdByCaption(supabase, TEST_CAPTION);
   expect(stillExists).toBe(postId);

   await ctx.close();
});
