import { expect, test } from '@playwright/test';
import {
   createPostViaUI,
   deleteTestPostsByCaption,
   getPostIdByCaption,
   getUserId,
   makeServiceClient,
   makeUserClient,
   USER_1_EMAIL,
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

test('a user cannot delete a comment they neither wrote nor own the post for', async () => {
   expect(postId).not.toBeNull();

   const supabase = makeServiceClient();
   const user1Id = await getUserId(supabase, USER_1_EMAIL);
   expect(user1Id).not.toBeNull();

   const { data: comment, error: insertError } = await supabase
      .from('comments')
      .insert({ post_id: postId as string, user_id: user1Id as string, content: 'e2e comment' })
      .select('id')
      .single();
   expect(insertError).toBeNull();

   const user2 = await makeUserClient(USER_2_EMAIL, USER_PASSWORD);

   // comments_delete_own / comments_delete_post_owner must make this affect zero rows.
   await user2
      .from('comments')
      .delete()
      .eq('id', comment?.id as string);

   const { data: stillExists } = await supabase
      .from('comments')
      .select('id')
      .eq('id', comment?.id as string)
      .maybeSingle();
   expect(stillExists?.id).toBe(comment?.id);

   await supabase
      .from('comments')
      .delete()
      .eq('id', comment?.id as string);
});

test('a user cannot update another user profile', async () => {
   const supabase = makeServiceClient();
   const user1Id = await getUserId(supabase, USER_1_EMAIL);
   expect(user1Id).not.toBeNull();

   const { data: before } = await supabase
      .from('profiles')
      .select('bio')
      .eq('id', user1Id as string)
      .single();

   const user2 = await makeUserClient(USER_2_EMAIL, USER_PASSWORD);

   // profiles_update_own RLS must make this affect zero rows for a non-owner.
   await user2
      .from('profiles')
      .update({ bio: 'hijacked by e2e-user-2' })
      .eq('id', user1Id as string);

   const { data: after } = await supabase
      .from('profiles')
      .select('bio')
      .eq('id', user1Id as string)
      .single();
   expect(after?.bio).toBe(before?.bio);
});

test('a user cannot delete another user story', async () => {
   const supabase = makeServiceClient();
   const user1Id = await getUserId(supabase, USER_1_EMAIL);
   expect(user1Id).not.toBeNull();

   const { data: story, error: insertError } = await supabase
      .from('stories')
      .insert({ user_id: user1Id as string })
      .select('id')
      .single();
   expect(insertError).toBeNull();

   const user2 = await makeUserClient(USER_2_EMAIL, USER_PASSWORD);

   // stories_delete_own RLS must make this affect zero rows for a non-owner.
   await user2
      .from('stories')
      .delete()
      .eq('id', story?.id as string);

   const { data: stillExists } = await supabase
      .from('stories')
      .select('id')
      .eq('id', story?.id as string)
      .maybeSingle();
   expect(stillExists?.id).toBe(story?.id);

   await supabase
      .from('stories')
      .delete()
      .eq('id', story?.id as string);
});
