import { expect, test } from '@playwright/test';
import { getUserId, makeServiceClient, USER_1_EMAIL, USER_2_EMAIL } from './helpers';

test.describe.configure({ mode: 'serial' });

const createdStoryIds: string[] = [];

async function seedStory(userId: string, seed: string, createdAt: string) {
   const supabase = makeServiceClient();
   const { data: story, error } = await supabase
      .from('stories')
      .insert({ user_id: userId, created_at: createdAt })
      .select('id')
      .single();
   if (error) throw error;
   createdStoryIds.push(story.id);

   const { error: imageError } = await supabase.from('story_images').insert({
      story_id: story.id,
      position: 0,
      url: `https://picsum.photos/seed/${seed}/400/700`,
   });
   if (imageError) throw imageError;
   return story.id;
}

test.beforeAll(async () => {
   const supabase = makeServiceClient();
   const user1 = await getUserId(supabase, USER_1_EMAIL);
   const user2 = await getUserId(supabase, USER_2_EMAIL);
   if (!user1 || !user2) throw new Error('Missing e2e users');

   const now = Date.now();
   await seedStory(user2, 'advance-user2', new Date(now - 60_000).toISOString());
   await seedStory(user1, 'advance-user1-a', new Date(now - 30_000).toISOString());
   await seedStory(user1, 'advance-user1-b', new Date(now - 10_000).toISOString());
});

test.afterAll(async () => {
   const supabase = makeServiceClient();
   if (createdStoryIds.length) {
      await supabase.from('stories').delete().in('id', createdStoryIds);
   }
});

test('tapping past the last story advances to the next user', async ({ page, isMobile }) => {
   test.skip(!isMobile, 'Covers the mobile tap-to-advance path');

   await page.goto('/stories/e2euser1');

   await expect(page.locator('input[placeholder="Reply to e2euser1..."]')).toBeVisible({
      timeout: 15000,
   });

   const viewport = page.viewportSize();
   if (!viewport) throw new Error('Missing viewport');
   const tapX = Math.round(viewport.width * 0.85);
   const tapY = Math.round(viewport.height / 2);

   await page.touchscreen.tap(tapX, tapY);
   await page.waitForTimeout(600);
   await expect(page.locator('input[placeholder="Reply to e2euser1..."]')).toBeVisible();

   await page.touchscreen.tap(tapX, tapY);
   await page.waitForTimeout(900);

   await expect(page.locator('input[placeholder="Reply to e2euser2..."]')).toBeVisible({
      timeout: 5000,
   });
});
