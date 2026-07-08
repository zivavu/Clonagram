import { expect, test } from '@playwright/test';
import {
   deleteTestPostsByCaption,
   getUserId,
   makeServiceClient,
   USER_1_EMAIL,
   USER_2_EMAIL,
} from './helpers';

const CAPTION = `e2e-notif-${Date.now()}`;

test.beforeAll(async () => {
   const supabase = makeServiceClient();
   const user1Id = await getUserId(supabase, USER_1_EMAIL);
   const user2Id = await getUserId(supabase, USER_2_EMAIL);
   if (!user1Id || !user2Id) throw new Error('Missing e2e users');

   const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({ user_id: user1Id, type: 'photo', caption: CAPTION })
      .select('id')
      .single();
   if (postError || !post) throw postError ?? new Error('Failed to seed post');

   // The on_like_insert trigger creates a "like" notification for the post owner.
   const { error: likeError } = await supabase
      .from('likes')
      .insert({ post_id: post.id, user_id: user2Id });
   if (likeError) throw likeError;
});

test.afterAll(async () => {
   const supabase = makeServiceClient();
   const user1Id = await getUserId(supabase, USER_1_EMAIL);
   const user2Id = await getUserId(supabase, USER_2_EMAIL);
   if (user1Id && user2Id) {
      await supabase
         .from('notifications')
         .delete()
         .eq('user_id', user1Id)
         .eq('actor_id', user2Id)
         .eq('type', 'like');
   }
   await deleteTestPostsByCaption('e2e-notif-');
});

test('a like from another user shows up in notifications', async ({ page }, testInfo) => {
   test.skip(
      testInfo.project.name === 'mobile-chrome',
      'The Notifications nav button is hidden below 768px',
   );

   await page.goto('/');
   await page.getByRole('button', { name: 'Notifications' }).click();

   const dialog = page.getByRole('dialog');
   await expect(dialog.getByText('e2euser2', { exact: false })).toBeVisible({ timeout: 15000 });
   await expect(dialog.getByText('liked your post.')).toBeVisible();
});
