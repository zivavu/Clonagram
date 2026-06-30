import { expect, test } from '@playwright/test';
import {
   createPostViaUI,
   deleteTestPostsByCaption,
   getPostIdByCaption,
   makeServiceClient,
   makeUserClient,
   USER_2_EMAIL,
   USER_PASSWORD,
} from './helpers';

const TEST_CAPTION = `e2e-authz-${Date.now()}`;
let postId: string | null = null;

test.beforeAll(async ({ browser }) => {
   const ctx = await browser.newContext({ storageState: 'playwright/.auth/user1.json' });
   const page = await ctx.newPage();
   await createPostViaUI(page, TEST_CAPTION);
   await ctx.close();

   postId = await getPostIdByCaption(makeServiceClient(), TEST_CAPTION);
});

test.afterAll(async () => {
   await deleteTestPostsByCaption('e2e-authz-');
});

test('a user cannot delete another user post', async () => {
   expect(postId).not.toBeNull();

   const user2 = await makeUserClient(USER_2_EMAIL, USER_PASSWORD);

   // posts_delete_own RLS must make this affect zero rows for a non-owner.
   await user2
      .from('posts')
      .delete()
      .eq('id', postId as string);

   const stillExists = await getPostIdByCaption(makeServiceClient(), TEST_CAPTION);
   expect(stillExists).toBe(postId);
});
