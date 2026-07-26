import { expect, test } from '@playwright/test';
import { createTestImageBuffer, getUserId, makeServiceClient, USER_2_EMAIL } from './helpers';

test.describe.configure({ mode: 'serial' });

let createdStoryId: string | null = null;
let sideStoryId: string | null = null;

test.afterAll(async () => {
   const supabase = makeServiceClient();
   if (createdStoryId) {
      await supabase.from('stories').delete().eq('id', createdStoryId);
   }
   if (sideStoryId) {
      await supabase.from('stories').delete().eq('id', sideStoryId);
   }
});

test('create a story', async ({ page }) => {
   await page.goto('/');

   await page.getByRole('button', { name: 'Create' }).click();
   await page.getByRole('button', { name: 'Story', exact: true }).click();

   await expect(page.getByText('Upload a photo or video for your story')).toBeVisible();

   const imageBuffer = await createTestImageBuffer(page);
   await page.locator('input[type="file"]').setInputFiles({
      name: 'test-story.png',
      mimeType: 'image/png',
      buffer: imageBuffer,
   });

   const modal = page.getByRole('dialog');
   await expect(modal.getByRole('button', { name: 'Share' })).toBeVisible({ timeout: 10000 });
   await modal.getByRole('button', { name: 'Share' }).click();

   await expect(modal.getByText('Your story has been shared.')).toBeVisible({ timeout: 30000 });

   await modal.getByRole('button', { name: 'Done' }).click();
   await expect(modal).not.toBeVisible();

   const supabase = makeServiceClient();
   const { data: users } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
   const user = users.users.find(u => u.email === 'e2e-user-1@example.com');
   if (user) {
      const { data } = await supabase
         .from('stories')
         .select('id')
         .eq('user_id', user.id)
         .order('created_at', { ascending: false })
         .limit(1)
         .single();
      createdStoryId = data?.id ?? null;
   }
});

test('view own story in the story viewer', async ({ page }) => {
   await page.goto('/stories/e2euser1');

   await expect(page.getByText('e2euser1')).toBeVisible({ timeout: 10000 });
   await expect(page.locator('input[placeholder="Reply to e2euser1..."]')).toBeVisible();
});

test('like and unlike a story as another user', async ({ browser }) => {
   const ctx = await browser.newContext({ storageState: 'playwright/.auth/user2.json' });
   const page = await ctx.newPage();

   await page.goto('/stories/e2euser1');

   const replyInput = page.locator('input[placeholder="Reply to e2euser1..."]');
   await expect(replyInput).toBeVisible({ timeout: 10000 });

   const likeButton = page.getByRole('button', { name: 'Like story' });
   const unlikeButton = page.getByRole('button', { name: 'Unlike story' });

   await expect(likeButton).toBeVisible();
   await likeButton.click();
   await expect(unlikeButton).toBeVisible({ timeout: 5000 });

   await unlikeButton.click();
   await expect(likeButton).toBeVisible({ timeout: 5000 });

   await ctx.close();
});

test('avatarless authors never render an empty image src', async ({ page }) => {
   const supabase = makeServiceClient();
   const userId = await getUserId(supabase, USER_2_EMAIL);
   if (!userId) throw new Error(`Missing e2e user ${USER_2_EMAIL}`);

   await supabase.from('profiles').update({ avatar_url: null }).eq('id', userId);

   const { data: story, error } = await supabase
      .from('stories')
      .insert({ user_id: userId })
      .select('id')
      .single();
   if (error) throw error;
   sideStoryId = story.id;

   const { error: imageError } = await supabase.from('story_images').insert({
      story_id: story.id,
      position: 0,
      url: 'https://picsum.photos/seed/e2e-side-story/400/700',
   });
   if (imageError) throw imageError;

   await expect(async () => {
      await page.goto('/stories/e2euser1');
      await expect(page.locator('input[placeholder="Reply to e2euser1..."]')).toBeVisible({
         timeout: 5000,
      });
      await expect(page.getByText('e2euser2').first()).toBeAttached({ timeout: 2000 });
   }).toPass({ timeout: 30000 });

   await expect
      .poll(() =>
         page.locator('img').evaluateAll(nodes => nodes.filter(n => !n.getAttribute('src')).length),
      )
      .toBe(0);
});
